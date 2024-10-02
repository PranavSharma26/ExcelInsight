import React, { useState } from 'react';
import ReusableChart from '../ReusableChart';
import Tesseract from 'tesseract.js';

export default function UploadAsImage() {
    const [fileData, setFileData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Extract data from the uploaded image
            extractDataFromImage(file);
        }
    };

    const extractDataFromImage = (file) => {
        Tesseract.recognize(
            file,
            'eng', // Language
            {
                logger: (info) => console.log(info), // Optional: log progress
            }
        ).then(({ data: { text } }) => {
            // Simulated processing of extracted text
            console.log('Extracted text:', text);
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const simulatedData = lines.map(line => line.split(/\s+/)); // Split by whitespace

            // Assuming the first line is the header
            setColumns(simulatedData[0]);
            setFileData(simulatedData);
        }).catch((error) => {
            console.error('Error processing image:', error);
        });
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
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Image File</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
                Please upload your image file and select the column to visualize data.
            </p>

            <input
                type="file"
                accept="image/*"
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
