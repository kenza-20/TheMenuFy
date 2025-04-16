const PDFDocument = require('pdfkit');

const generatePdfBuffer = ({ date, time, guests, notes }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    doc.on('error', reject);

    doc.fontSize(22).text('Reservation Confirmation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`📅 Date: ${date}`);
    doc.text(`⏰ Time: ${time}`);
    doc.text(`👥 Guests: ${guests}`);
    doc.text(`📝 Notes: ${notes || 'None'}`);
    doc.end();
  });
};

module.exports = generatePdfBuffer;
