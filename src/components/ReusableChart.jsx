import React, { useEffect } from 'react';
import * as d3 from 'd3';

export default function ReusableChart({ data, columns }) {
    useEffect(() => {
        // Clear previous charts
        d3.select('#chart').selectAll('*').remove();

        // Check if data and columns are defined
        if (!data || data.length === 0 || columns.length === 0) {
            console.error('No data or columns provided for charting.');
            return;
        }

        const margin = { top: 20, right: 30, bottom: 100, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', '100%')
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', `0 0 600 ${height + margin.top + margin.bottom}`)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Calculate the maximum value across all selected columns
        const maxValues = columns.map(column => {
            return Math.max(...data.slice(1).map(row => row[data[0].indexOf(column)]).filter(value => typeof value === 'number'));
        });

        const overallMax = Math.max(...maxValues);

        // Round to the next multiple of 10
        const roundedMax = Math.ceil(overallMax / 10) * 10;

        // Create ranges from 0 to roundedMax with integer increments
        const rangeSize = Math.ceil(roundedMax / 5); // Divide into 5 integer ranges
        const ranges = Array.from({ length: 6 }, (_, i) => i * rangeSize); // Create ranges

        const groupedData = columns.map(column => {
            const valueCounts = Array(ranges.length - 1).fill(0); // Initialize counts array
            data.slice(1).forEach(row => { // Skip header row
                const value = row[data[0].indexOf(column)];
                if (typeof value === 'number') {
                    const rangeIndex = Math.floor(value / rangeSize);
                    if (rangeIndex >= 0 && rangeIndex < valueCounts.length) {
                        valueCounts[rangeIndex] += 1; // Increment count for the range
                    }
                }
            });
            return valueCounts;
        });

        // Create scales and axes
        const xScale = d3.scaleBand()
            .domain(ranges.slice(0, -1)) // Only include the start of each range for x-axis
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData.flat(1))]) // Ensure we get the maximum value correctly
            .range([height, 0]);

        svg.append('g').attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(ranges.length - 1).tickFormat((d, i) => `${ranges[i]}-${ranges[i + 1]}`));

        svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

        // Create bars for each column's data
        const barWidth = xScale.bandwidth() / groupedData.length - 5; // Calculate bar width with gap

        groupedData.forEach((group, groupIndex) => {
            svg.selectAll(`.bar-${groupIndex}`)
                .data(group)
                .enter()
                .append('rect')
                .attr('class', `bar bar-${groupIndex}`)
                .attr('x', (d, i) => xScale(ranges[i]) + groupIndex * (barWidth + 5)) // Adjust x position for grouping
                .attr('y', d => yScale(d))
                .attr('width', barWidth)
                .attr('height', d => {
                    const h = height - yScale(d);
                    return h > 0 ? h : 0; // Ensure height is not negative
                })
                .attr('fill', d3.schemeCategory10[groupIndex]); // Use different colors for each column
        });
    }, [data, columns]);

    return <div id="chart" className="mt-8"></div>;
}
