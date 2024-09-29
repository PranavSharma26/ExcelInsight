import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import ReusableChart from '../ReusableChart';

export default function UploadAsImage() {
  const [imageFile, setImageFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [selectedRows, setSelectedRows] = useState({ row1: '', row2: '' });
  const [showCharts, setShowCharts] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
      setLoading(true);
      Tesseract.recognize(file, 'eng', { logger: (m) => console.log(m) }).then(
        ({ data: { text } }) => {
          setTextContent(text);
          setLoading(false);
          // TODO: Parse text into structured data (headers and data)
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Upload Image File</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {loading && <p>Processing image...</p>}
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
