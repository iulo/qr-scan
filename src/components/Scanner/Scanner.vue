<template>
  <div class="scanner">
    <div class="square">
      <div class="scan-line"></div>
    </div>
    <video v-show="true" class="video" ref="videoElRef" :width="videoWidth" playsinline></video>
    <canvas v-show="true" ref="canvasElRef" :width="canvasSize.width" :height="canvasSize.height" class="canvas">
    </canvas>

  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import VideoWorker from './video-worker?worker'
import DecodeWorker from './decode-worker?worker'

const props = defineProps({
  frontCamera: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['media-error', 'onsuccess'])

let mode = 0 // 0: drawImage video, 1: videoTracks + ImageCapture

// FIXME: use mode 1 seems like more slow
// if (typeof MediaStream.prototype.getVideoTracks === 'function' && (window as any).ImageCapture !== undefined) {
//   mode = 1
// }
let decodeWorker: Worker
let videoWorker: Worker
let decodeWorkerReady = true

let imageCapture: any
let offscreen: OffscreenCanvas | undefined

let mediaStream: MediaStream


const canvasSize = ref({
  width: document.documentElement.clientWidth * 2,
  height: document.documentElement.clientHeight * 2
})
const videoWidth = ref(document.documentElement.clientWidth)
const videoHeight = ref(0)
let videoRealWidth = 0
let videoRealHeight = 0

const videoElRef = ref<HTMLVideoElement>()
const canvasElRef = ref<HTMLCanvasElement>()
let canvasCtx: CanvasRenderingContext2D | null = null


let canvasRatio = 0
let videoRatio = 0
let imgW = 0
let imgH = 0
let imgPosX = 0
let imgPosY = 0


const cost = Math.floor(1000 / 30)
let lastTime = 0
let rafId = -1
const identify = async (delta: number) => {
  // console.log(`fp`, delta - lastTime)
  if (
    // 控制帧率
    delta - lastTime >= cost &&
    // canvasCtx &&
    videoElRef.value &&
    videoElRef.value.readyState === videoElRef.value.HAVE_ENOUGH_DATA
  ) {
    lastTime = delta

    if (mode === 1) {
      const imageBitmap = await imageCapture.grabFrame()
      videoWorker.postMessage({ imageBitmap }, [imageBitmap])
    } else {
      if (canvasCtx && videoElRef.value) {
        canvasCtx.drawImage(videoElRef.value, imgPosX, imgPosY, imgW, imgH, 0, 0, canvasSize.value.width, canvasSize.value.height)
        if (decodeWorkerReady) {
          decodeWorkerReady = false
          const imageData = canvasCtx.getImageData(0, 0, canvasSize.value.width, canvasSize.value.height)
          decodeWorker.postMessage({ imageData: imageData }, [imageData.data.buffer])
        }
      }
    }
  }

  runTick()
}

const runTick = () => {
  rafId = requestAnimationFrame(identify)
}

const openCamera = async function () {
  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {


    // if support offscreencanvas stream.videoTracks ImageCapture
    const useOffscreenCanvas = (stream: MediaStream) => {
      if (videoWorker) {
        videoWorker.terminate()
      }
      const canvasEl = canvasElRef.value as HTMLCanvasElement
      offscreen = canvasEl.transferControlToOffscreen()

      const track = stream.getVideoTracks()[0]
      imageCapture = new (window as any).ImageCapture(track)

      // enable videoWorker
      videoWorker = new VideoWorker()
      videoWorker.addEventListener('message', (event) => {
        emit('onsuccess', event.data.data)
      })
      videoWorker.postMessage({
        offscreen,
        imageConfig: {
          x: imgPosX,
          y: imgPosY,
          width: imgW,
          height: imgH,
        }
      }, [(offscreen as OffscreenCanvas)])
    }

    const useMainTreadCanvas = () => {
      canvasCtx = canvasElRef.value?.getContext('2d') ?? null
      if (decodeWorker) {
        decodeWorker.terminate()
      }
      decodeWorker = new DecodeWorker()
      decodeWorker.addEventListener('message', (event) => {
        if (event.data) {
          emit('onsuccess', event.data.data)
          destroy()
        } else {
          decodeWorkerReady = true
        }
      })
    }

    const handleMetaSuccess = async (stream: MediaStream) => {
      if (!videoElRef.value) {
        return
      }

      mediaStream = stream

      // play video
      if (!videoElRef.value?.srcObject) {
        videoElRef.value.srcObject = stream
      } else {
        videoElRef.value.src = URL.createObjectURL(stream as any)
      }
      await videoElRef.value.play()

      // calc real video size and  image size relative to viewport
      videoRealWidth = videoElRef.value.videoWidth
      videoRealHeight = videoElRef.value.videoHeight
      canvasRatio = canvasSize.value.width / canvasSize.value.height
      videoRatio = videoRealWidth / videoRealHeight
      console.log('videoSize', videoRealWidth, videoRealHeight, canvasSize.value.width, canvasSize.value.height)
      if (videoRatio > canvasRatio) {
        imgH = videoRealHeight
        imgW = Math.floor(imgH * canvasRatio)
        imgPosX = Math.floor((videoRealWidth - imgW) / 2)
      } else {
        imgW = videoRealWidth
        imgH = Math.floor(imgW / canvasRatio)
        imgPosY = Math.floor((videoRealHeight - imgH) / 2)
      }

      if (mode === 1) {
        useOffscreenCanvas(stream)
      } else {
        useMainTreadCanvas()
      }

      runTick()
    }

    const facingMode = props.frontCamera ? 'user' : { exact: 'environment' }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      handleMetaSuccess(stream)
    } catch (e) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        handleMetaSuccess(stream)
      } catch (e) {
        emit('media-error', e)
      }
    }

  }
}

const destroy = () => {
  if (videoWorker) {
    videoWorker.terminate()
  }
  if (decodeWorker) {
    decodeWorker.terminate()
  }
  if (mediaStream) {
    if (typeof (mediaStream as any)?.stop === 'function') {
      (mediaStream as any).stop()
    } else {
      mediaStream.getTracks().forEach(item => item.stop())
    }
  }
  if (rafId > -1) {
    cancelAnimationFrame(rafId)
  }
}

onMounted(async () => {
  videoHeight.value = parseInt(window.getComputedStyle(videoElRef.value as HTMLVideoElement).height)
  await openCamera()
})

onBeforeUnmount(async () => {
  destroy()
})
</script>


<style lang="scss" scoped>
.scanner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
}

.square {
  width: 220px;
  height: 220px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #999999;
  z-index: 10;
}

.scan-line {
  position: absolute;
  /* top: 10px; */
  left: 10px;
  width: 200px;
  height: 1px;
  background: #18a058;
  background: linear-gradient(to right, transparent, #88f570, #37c278, #88f570, transparent);
  animation: scanAni 3s infinite linear;
  animation-fill-mode: both;
  border-radius: 1px;
}

@keyframes scanAni {
  0% {
    top: 10px
  }

  50% {
    top: 200px
  }

  100% {
    top: 10px
  }
}

.video {
  position: absolute;
  top: 0;
  left: 0;
  /* width: 100%;
  height: 100%; */
  /* object-fit: cover; */
  /* transform: rotateY(180deg); */
}

.canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  /* width: calc(375px / 3); */
  /* height: calc(667px / 3); */
  bottom: 0;
  left: 0;
  /* background: rgba(255, 255, 255, 1); */
}
</style>