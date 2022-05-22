import DecodeWorker from './decode-worker?worker'

let decodeWorker = new DecodeWorker()

let canvas: OffscreenCanvas | null = null
let context: OffscreenCanvasRenderingContext2D | null = null
let imageConfig: { x: number; y: number; width: number; height: number } | null = null
// let canvasConfig: { width: number; height: number } | null = null
let decodeWorkerReady = true

addEventListener('message', event => {
  if (event.data.offscreen) {
    canvas = event.data.offscreen as OffscreenCanvas
    imageConfig = event.data.imageConfig
    // canvasConfig = event.data.canvasConfig

    context = canvas.getContext('2d')
  } else if (event.data.imageBitmap && context) {
    const { width, height } = canvas as OffscreenCanvas
    context.drawImage(
      event.data.imageBitmap,
      imageConfig!.x,
      imageConfig!.y,
      imageConfig!.width,
      imageConfig!.height,
      0,
      0,
      width,
      height
    )

    const imageData = context.getImageData(0, 0, width, height)

    // wait qrjs finish last work
    if (decodeWorkerReady) {
      decodeWorkerReady = false
      decodeWorker.postMessage({ imageData: imageData }, [imageData.data.buffer])
    }
  }
})

decodeWorker.addEventListener('message', event => {
  if (event.data) {
    console.log('Found code!', event.data)
    self.postMessage(event.data)
    decodeWorker.terminate()
    self.close()
  } else {
    decodeWorkerReady = true
  }
})
