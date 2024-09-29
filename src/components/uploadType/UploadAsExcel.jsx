import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ReusableChart from '../ReusableChart';

export default function UploadAsExcel() {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState({ col1: '', col2: '' });
    const [showCharts, setShowCharts] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                setData(jsonData);
                setHeaders(jsonData[0] || []); // First row becomes headers
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleColumnSelection = (e, colIndex) => {
        setSelectedColumns(prev => ({
            ...prev,
            [colIndex]: e.target.value,
        }));
    };

    const handleSummarize = () => {
        if (selectedColumns.col1 && selectedColumns.col2) {
            setShowCharts(true);
        } else {
            setErrorMessage('Please select two columns for comparison.');
        }
    };

    const formatDataForCharts = (col1, col2) => {
        const labels = data.slice(1).map(row => row[0]); // First column as labels
        const values1 = data.map(row => parseFloat(row[col1]) || 0).slice(1); // Column data excluding header
        const values2 = data.map(row => parseFloat(row[col2]) || 0).slice(1); // Column data excluding header

        return {
            labels: labels,
            col1Name: headers[col1],
            col2Name: headers[col2],
            values1: values1,
            values2: values2
        };
    };

    return (
        <div className='flex flex-col items-center p-4'>
            <input type="file" accept=".xlsx" onChange={handleFileChange} className="mb-4" />
            {headers.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Select Columns for Comparison</h3>
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <label className="flex flex-col mb-4 sm:mr-4">
                            Column 1:
                            <select onChange={(e) => handleColumnSelection(e, 'col1')} className="p-2 border border-gray-300 rounded-md">
                                <option value="">Select column</option>
                                {headers.map((header, index) => (
                                    <option key={index} value={index}>{header}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col">
                            Column 2:
                            <select onChange={(e) => handleColumnSelection(e, 'col2')} className="p-2 border border-gray-300 rounded-md">
                                <option value="">Select column</option>
                                {headers.map((header, index) => (
                                    <option key={index} value={index}>{header}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <button
                        onClick={handleSummarize}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                        Summarize
                    </button>
                    {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                </div>
            )}
            {showCharts && (
                <div>
                    <ReusableChart data={formatDataForCharts(selectedColumns.col1, selectedColumns.col2)} />
                </div>
            )}
        </div>
    );
}
