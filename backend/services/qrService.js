const QRCode = require('qrcode');

class QRService {
  async generateQR(text) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text);
      return qrCodeDataURL;
    } catch (error) {
      throw new Error('Error generating QR code: ' + error.message);
    }
  }
}

module.exports = new QRService();