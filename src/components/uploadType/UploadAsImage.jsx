import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import ReusableChart2 from '../ReusableChart2';

export default function UploadAsImage() {
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [fileData, setFileData] = useState(null);
    const [showCharts, setShowCharts] = useState(false);
    const [selectionType, setSelectionType] = useState('single');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                // Create a canvas to draw the image and perform OCR
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Convert the image to a data URL for Tesseract
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                // Use Tesseract to recognize the text in the image
                Tesseract.recognize(
                    imgData,
                    'eng',
                    {
                        logger: (m) => console.log(m) // Log progress
                    }
                ).then(({ data: { text } }) => {
                    // Split the text by lines
                    const rows = text.split('\n').map(row => row.trim()).filter(row => row);

                    // Parse rows to extract column headers and numeric data
                    if (rows.length > 0) {
                        const columnNames = rows[0].split(/\s+/); // Split by whitespace
                        const numericData = rows.slice(1).map(row => row.split(/\s+/).map(value => {
                            const numberValue = parseFloat(value);
                            return isNaN(numberValue) ? value : numberValue; // Convert to number if possible
                        }));

                        // Filter column names and valid data
                        const validColumns = columnNames.filter((_, index) =>
                            numericData.every(row => typeof row[index] === 'number')
                        );

                        setColumns(validColumns);
                        setFileData(numericData); // Save the actual data
                    }
                });
            };
        };

        reader.readAsDataURL(file);
    };

    const handleChartGeneration = () => {
        setShowCharts(true);
    };

    const handleColumnSelection = (e) => {
        const { value } = e.target;
        if (selectionType === 'single') {
            setSelectedColumns([value]); // Single column selection
        } else {
            setSelectedColumns((prev) => {
                if (prev.includes(value)) {
                    return prev.filter(col => col !== value); // Remove if already selected
                } else {
                    return [...prev, value]; // Add to selection
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center mt-8 p-4 text-center w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Image</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
                Please upload an image and select the columns to visualize data.
            </p>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />

            <div className="mb-4">
                <label>
                    <input
                        type="radio"
                        value="single"
                        checked={selectionType === 'single'}
                        onChange={() => setSelectionType('single')}
                    /> Single Column
                </label>
                <label className="ml-4">
                    <input
                        type="radio"
                        value="multiple"
                        checked={selectionType === 'multiple'}
                        onChange={() => setSelectionType('multiple')}
                    /> Two Columns
                </label>
            </div>

            {columns.length > 0 && (
                <div className="flex flex-col w-full gap-4 mb-6">
                    <select
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        value={selectedColumns[0] || ''}
                        onChange={handleColumnSelection}
                    >
                        <option value="">Select Column</option>
                        {columns.map((col, index) => (
                            <option key={index} value={col}>
                                {col}
                            </option>
                        ))}
                    </select>

                    {selectionType === 'multiple' && (
                        <select
                            className="border border-gray-300 rounded-lg p-2 w-full"
                            value={selectedColumns[1] || ''}
                            onChange={handleColumnSelection}
                        >
                            <option value="">Select Second Column</option>
                            {columns.filter(col => col !== selectedColumns[0]).map((col, index) => (
                                <option key={index} value={col}>
                                    {col}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            <button
                onClick={handleChartGeneration}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={selectedColumns.length < (selectionType === 'single' ? 1 : 2)} // Disable if columns not selected
            >
                Generate Charts
            </button>

            {showCharts && fileData && (
                <div className="mt-8 w-full flex flex-col items-center">
                    <ReusableChart2 data={fileData} columns={selectedColumns} />
                </div>
            )}
        </div>
    );
}
