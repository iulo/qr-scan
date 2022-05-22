import jsQR, { QRCode } from 'jsqr'

// https://github.com/cozmo/jsQR/issues/151

addEventListener('message', event => {
  const { width, height, data } = event.data.imageData
  // console.log(event.data.imageData)
  try {
    const qrcode = jsQR(data, width, height)
    self.postMessage(qrcode)
    if (qrcode) {
      self.close()
    }
  } catch (e) {
    console.error(e)
  }
})
