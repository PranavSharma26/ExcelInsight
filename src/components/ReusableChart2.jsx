import React from 'react';
import { Bar } from 'react-chartjs-2';

const ReusableChart2 = ({ data, column }) => {
    // Check if the column exists in the data
    const columnIndex = data[0]?.indexOf(column); 
    if (columnIndex === undefined || columnIndex === -1) {
        return <div>No data available for the selected column.</div>;
    }

    const chartData = {
        labels: data.map((_, index) => `Row ${index + 1}`), // Row labels
        datasets: [{
            label: `Values for ${column}`,
            data: data.map(row => row[columnIndex]), // Select the appropriate column data
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <div>
            <h2>Chart for {column}</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default ReusableChart2;
