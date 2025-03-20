// utils/reportGenerator.js
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Define fonts
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '../node_modules/roboto-font/fonts/Roboto/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '../node_modules/roboto-font/fonts/Roboto/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '../node_modules/roboto-font/fonts/Roboto/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '../node_modules/roboto-font/fonts/Roboto/Roboto-MediumItalic.ttf'),
  },
};

// Create a PDF printer instance
const printer = new PdfPrinter(fonts);

// Function to generate a threats report
exports.generateThreatsReport = (threats, filePath) => {
  const docDefinition = {
    content: [
      { text: 'Threats Report', style: 'header' },
      { text: '\n\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*'],
          body: [
            ['Type', 'Severity', 'Source IP', 'Description', 'Timestamp'],
            ...threats.map((threat) => [
              threat.type,
              threat.severity,
              threat.sourceIP,
              threat.description,
              new Date(threat.timestamp).toLocaleString(),
            ]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
    },
  };

  // Create the PDF
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();
};