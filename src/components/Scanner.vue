<template>
  <div class="scanner">
    <div class="square">
      <div class="scan-line"></div>
    </div>
    <video v-show="true" class="video" ref="videoElRef" :width="videoWidth" playsinline></video>
    <canvas v-show="true" ref="canvasElRef" :width="pageSize.width" :height="pageSize.height" class="canvas">
    </canvas>

  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import jsQR, { QRCode } from 'jsqr'
import VideoWorker from './video-worker?worker'

let videoWorker: Worker

// https://stackoverflow.com/questions/56747195/is-there-a-way-to-send-video-data-from-a-video-tag-mediastream-to-an-offscreenca

const props = defineProps({
  frontCamera: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['media-error', 'onsuccess'])

const pageSize = ref({
  width: document.documentElement.clientWidth * 2,
  height: document.documentElement.clientHeight * 2
})
const videoWidth = ref(document.documentElement.clientWidth)
const videoHeight = ref(0)
let videoRealWidth = 0
let videoRealHeight = 0


const isShowVideo = ref(true)
const videoElRef = ref<HTMLVideoElement>()
const canvasElRef = ref<HTMLCanvasElement>()
// let canvasCtx: CanvasRenderingContext2D | undefined
let offscreen: OffscreenCanvas | undefined
let imageCapture: any
const cost = Math.floor(1000 / 30)
let lastTime = 0

let canvasRatio = 0
let videoRatio = 0
let imgW = 0
let imgH = 0
let imgPosX = 0
let imgPosY = 0

const identify = async (delta: number) => {
  // console.log(`fp`, delta - lastTime)
  if (
    // 控制帧率
    delta - lastTime >= cost &&
    // canvasCtx &&
    videoElRef.value &&
    videoElRef.value.readyState === videoElRef.value.HAVE_ENOUGH_DATA
  ) {
    // console.log(`do`, delta - lastTime)
    lastTime = delta
    const imageBitmap = await imageCapture.grabFrame()
    // canvas2.getContext('2d')?.drawImage(imageBitmap, 0, 0, pageSize.value.width, pageSize.value.height)


    // console.log(imageBitmap)

    videoWorker.postMessage({ imageBitmap }, [imageBitmap])

    // canvasCtx.clearRect(0, 0, pageSize.value.width, pageSize.value.height);
    // canvasCtx.drawImage(videoElRef.value, imgPosX, imgPosY, imgW, imgH, 0, 0, pageSize.value.width, pageSize.value.height)
    // const imageData = canvasCtx.getImageData(0, 0, pageSize.value.width, pageSize.value.height)
    // let qrcode: QRCode | null = null

    // try {
    //   // qrcode = jsQR(imageData.data, pageSize.value.width, pageSize.value.height)
    // } catch (e) {
    //   console.error(e)
    // }
  }

  runIdentify()
}

const runIdentify = () => {
  requestAnimationFrame(identify)
}

const openCamera = async function () {
  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
    const handleMetaSuccess = async (stream: MediaStream) => {
      if (!videoElRef.value) {
        return
      }

      if (!videoElRef.value?.srcObject) {
        videoElRef.value.srcObject = stream
      } else {
        videoElRef.value.src = URL.createObjectURL(stream as any)
      }
      await videoElRef.value.play()
      const track = stream.getVideoTracks()[0]
      imageCapture = new (window as any).ImageCapture(track)
      videoRealWidth = videoElRef.value.videoWidth
      videoRealHeight = videoElRef.value.videoHeight
      canvasRatio = pageSize.value.width / pageSize.value.height
      videoRatio = videoRealWidth / videoRealHeight
      console.log(videoRealWidth, videoRealHeight, pageSize.value.width, pageSize.value.height)
      if (videoRatio > canvasRatio) {
        imgH = videoRealHeight
        imgW = Math.floor(imgH * canvasRatio)
        imgPosX = Math.floor((videoRealWidth - imgW) / 2)
      } else {
        imgW = videoRealWidth
        imgH = Math.floor(imgW / canvasRatio)
        imgPosY = Math.floor((videoRealHeight - imgH) / 2)
      }

      if (videoWorker) {
        videoWorker.terminate()
      }
      videoWorker = new VideoWorker()

      videoWorker.addEventListener('message', (event) => {
        // alert(event.data.data)
        emit('onsuccess', event.data.data)
      })

      videoWorker.postMessage({
        offscreen,
        imageConfig: {
          x: imgPosX,
          y: imgPosY,
          width: imgW,
          height: imgH,
        },
        canvasConfig: {
          width: pageSize.value.width,
          height: pageSize.value.height,
        }
      }, [(offscreen as OffscreenCanvas)])
      runIdentify()
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

onMounted(async () => {
  videoHeight.value = parseInt(window.getComputedStyle(videoElRef.value as HTMLVideoElement).height)
  const canvasEl = canvasElRef.value as HTMLCanvasElement
  // canvasCtx = canvasEl.getContext('2d') as CanvasRenderingContext2D
  offscreen = canvasEl.transferControlToOffscreen()
  await openCamera()
})

onBeforeUnmount(async () => {
  if (videoWorker) {
    videoWorker.terminate()
  }
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
  background: rgba(255, 255, 255, 1);
}
</style>