import React, { useEffect } from 'react';
import * as d3 from 'd3';

export default function ReusableChart({ data, column }) {
    useEffect(() => {
        // Clear previous charts
        d3.select('#chart').selectAll('*').remove();

        // Check if data and column are defined
        if (!data || data.length === 0 || !column) {
            console.error('No data or column provided for charting.');
            return;
        }

        // Create dimensions and margins
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 600 - margin.left - margin.right; // Adjust width
        const height = 300 - margin.top - margin.bottom; // Adjust height for frequency graph

        // Create SVG for the charts
        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', '100%')
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', `0 0 600 ${height + margin.top + margin.bottom}`) // Enable responsive scaling
            .append('g') // Group to apply margins
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Frequency Graph
        // Group data by the selected column
        const groupedData = d3.rollups(
            data.slice(1), // Skip header row
            (v) => v.length,
            (d) => d[data[0].indexOf(column)]
        );

        const frequencyX = d3
            .scaleBand()
            .domain(groupedData.map((d) => d[0]))
            .range([0, width])
            .padding(0.1);

        const frequencyY = d3.scaleLinear().domain([0, d3.max(groupedData, (d) => d[1])]).range([height, 0]);

        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(frequencyX));

        svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(frequencyY));

        svg
            .selectAll('.bar')
            .data(groupedData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d) => frequencyX(d[0]))
            .attr('y', (d) => frequencyY(d[1]))
            .attr('width', frequencyX.bandwidth())
            .attr('height', (d) => height - frequencyY(d[1]))
            .attr('fill', '#69b3a2');
    }, [data, column]);

    return <div id="chart" className="mt-8"></div>;
}
