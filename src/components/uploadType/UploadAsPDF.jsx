import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import ReusableChart from '../ReusableChart';

// Use a stable version of PDF.js for both API and Worker
const pdfjsVersion = '2.16.105';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.js`;

export default function UploadAsPDF() {
    const [fileData, setFileData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            extractDataFromPDF(file);
        }
    };

    const extractDataFromPDF = async (file) => {
        // Create a file URL
        const fileURL = URL.createObjectURL(file);

        try {
            const pdfDoc = await pdfjs.getDocument(fileURL).promise; // Provide the file URL
            const numPages = pdfDoc.numPages;
            const textContent = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const text = await page.getTextContent();
                const strings = text.items.map(item => item.str);
                textContent.push(strings);
            }

            // Assuming the first row contains the column names
            setColumns(textContent[0]);
            setFileData(textContent);
        } catch (error) {
            console.error('Error extracting PDF data:', error);
        }
    };

    const handleChartGeneration = () => {
        if (selectedColumn) {
            // Pass the data and selected column to ReusableChart
            return <ReusableChart data={fileData} column={selectedColumn} />;
        }
        return null;
    };

    return (
        <div className="flex flex-col items-center mt-8 p-4 text-center w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload PDF File</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
                Please upload your PDF file and select the column to visualize data.
            </p>

            <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />

            {columns.length > 0 && (
                <div className="flex flex-col w-full gap-4 mb-6">
                    <select
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        value={selectedColumn}
                        onChange={(e) => setSelectedColumn(e.target.value)}
                    >
                        <option value="">Select Column</option>
                        {columns.map((col, index) => (
                            <option key={index} value={col}>
                                {col}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedColumn && (
                <button
                    onClick={handleChartGeneration}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Generate Chart
                </button>
            )}

            {fileData && handleChartGeneration()}
        </div>
    );
}
