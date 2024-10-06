import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ReusableChart from '../ReusableChart';

export default function UploadAsExcel() {
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]); // Store selected columns
    const [fileData, setFileData] = useState(null);
    const [showCharts, setShowCharts] = useState(false);
    const [selectionType, setSelectionType] = useState('single'); // Track selection type

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Extract column names
            const columnNames = jsonSheet[0];

            // Filter columns for numeric values only
            const validColumns = columnNames.filter((col, index) => {
                return jsonSheet.slice(1).every(row => {
                    const value = row[index];
                    return typeof value === 'number'; // Check if value is numeric
                });
            });

            setColumns(validColumns);
            setFileData(jsonSheet); // Save the entire sheet data for charting
        };

        reader.readAsArrayBuffer(file);
    };

    const handleChartGeneration = () => {
        setShowCharts(true); // Show charts when the button is clicked
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
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Excel File</h2>
            <p className="text-sm sm:text-base text-gray-700 mb-6">
                Please upload your Excel file and select the columns to visualize data.
            </p>

            <input
                type="file"
                accept=".xlsx, .xls"
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
                    {/* ReusableChart will render based on selected columns */}
                    <ReusableChart data={fileData} columns={selectedColumns} />
                </div>
            )}
        </div>
    );
}
