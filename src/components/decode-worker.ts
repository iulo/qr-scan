import jsQR, { QRCode } from 'jsqr'

addEventListener('message', event => {
  const { width, height, data } = event.data.imageData

  try {
    const qrcode = jsQR(data, width, height)
    self.postMessage(qrcode)
  } catch (e) {
    console.error(e)
  }
})
