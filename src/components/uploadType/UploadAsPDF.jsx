import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import ReusableChart from '../ReusableChart';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function UploadAsPDF() {
  const [pdfFile, setPdfFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedRows, setSelectedRows] = useState({ row1: '', row2: '' });
  const [showCharts, setShowCharts] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      const reader = new FileReader();
      reader.onload = function () {
        const typedarray = new Uint8Array(this.result);

        pdfjs.getDocument(typedarray).promise.then(function (pdf) {
          let maxPages = pdf.numPages;
          let countPromises = [];

          for (let j = 1; j <= maxPages; j++) {
            let page = pdf.getPage(j);

            countPromises.push(
              page.then(function (page) {
                let textContent = page.getTextContent();
                return textContent.then(function (text) {
                  return text.items.map(function (s) {
                    return s.str;
                  }).join(' ');
                });
              })
            );
          }

          Promise.all(countPromises).then(function (texts) {
            setTextContent(texts.join(' '));
            // TODO: Parse textContent into structured data (headers and data)
          });
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Upload PDF File</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} className="mb-4" />
      {textContent && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Extracted Text Content</h3>
          <p>{textContent}</p>
          {/* TODO: Implement data extraction and visualization */}
        </div>
      )}
    </div>
  );
}
