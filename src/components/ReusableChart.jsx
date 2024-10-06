import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function ReusableChart({ data, columns }) {
    const [highestValueInfo, setHighestValueInfo] = useState([]);
    const [lowestValueInfo, setLowestValueInfo] = useState([]);
    const [summaryInfo, setSummaryInfo] = useState([]);

    useEffect(() => {
        // Clear previous charts
        d3.select('#chart').selectAll('*').remove();

        // Reset information when columns change
        setHighestValueInfo([]);
        setLowestValueInfo([]);
        setSummaryInfo([]);

        if (!data || data.length === 0 || columns.length === 0) {
            console.error('No data or columns provided for charting.');
            return;
        }

        const valueInfo = columns.map(column => {
            const values = data.slice(1).map(row => ({
                name: row[0], // Assuming the name is in the first column
                value: row[data[0].indexOf(column)],
            })).filter(item => typeof item.value === 'number');

            const count = values.length;
            const mean = d3.mean(values, d => d.value);
            const median = d3.median(values, d => d.value);
            const stdDev = d3.deviation(values, d => d.value);
            const total = d3.sum(values, d => d.value);
            const min = d3.min(values, d => d.value);
            const max = d3.max(values, d => d.value);
            const uniqueCount = new Set(values.map(d => d.value)).size;
            const missingCount = data.length - 1 - count; // Excluding header
            const percentageMissing = ((missingCount / (data.length - 1)) * 100).toFixed(2);

            const highest = values.find(d => d.value === max) || { name: 'N/A', value: 'N/A' };
            const lowest = values.find(d => d.value === min) || { name: 'N/A', value: 'N/A' };

            return {
                column,
                highest,
                lowest,
                count,
                mean,
                median,
                stdDev,
                total,
                min,
                max,
                uniqueCount,
                percentageMissing,
                values, // Store the filtered values for later use
            };
        });

        setHighestValueInfo(valueInfo.map(info => ({
            column: info.column,
            name: info.highest.name,
            value: info.highest.value,
        })));

        setLowestValueInfo(valueInfo.map(info => ({
            column: info.column,
            name: info.lowest.name,
            value: info.lowest.value,
        })));

        setSummaryInfo(valueInfo);

        // Create D3 bar charts
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
        const overallMax = d3.max(valueInfo.map(info => info.max));
        const roundedMax = Math.ceil(overallMax / 10) * 10;
        const rangeSize = Math.ceil(roundedMax / 5);
        const ranges = Array.from({ length: 6 }, (_, i) => i * rangeSize);

        const groupedData = valueInfo.map(info => {
            const valueCounts = Array(ranges.length - 1).fill(0);
            info.values.forEach(({ value }) => {
                const rangeIndex = Math.floor(value / rangeSize);
                if (rangeIndex >= 0 && rangeIndex < valueCounts.length) {
                    valueCounts[rangeIndex] += 1;
                }
            });
            return valueCounts;
        });

        // Create scales and axes
        const xScale = d3.scaleBand()
            .domain(ranges.slice(0, -1))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(groupedData.flat(1))])
            .range([height, 0]);

        svg.append('g').attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(ranges.length - 1).tickFormat((d, i) => `${ranges[i]}-${ranges[i + 1]}`));

        svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

        // Create tooltip
        const tooltip = d3.select('#chart')
            .append('div')
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('background-color', 'white')
            .style('border', '1px solid black')
            .style('border-radius', '5px')
            .style('padding', '5px')
            .style('opacity', 0.7);  // Set lower opacity for tooltip

        // Create bars for each column's data
        const barWidth = xScale.bandwidth() / groupedData.length - 5;

        groupedData.forEach((group, groupIndex) => {
            svg.selectAll(`.bar-${groupIndex}`)
                .data(group)
                .enter()
                .append('rect')
                .attr('class', `bar bar-${groupIndex}`)
                .attr('x', (d, i) => xScale(ranges[i]) + groupIndex * (barWidth + 5))
                .attr('y', d => yScale(d))
                .attr('width', barWidth)
                .attr('height', d => {
                    const h = height - yScale(d);
                    return h > 0 ? h : 0;
                })
                .attr('fill', d3.schemeCategory10[groupIndex])
                .on('mouseover', function (event, d) {
                    tooltip.style('visibility', 'visible')
                        .text(`Value: ${d}`);
                    d3.select(this).style('opacity', 0.7);
                })
                .on('mousemove', function (event) {
                    // Set tooltip position above the bar
                    tooltip.style('top', (event.target.getBoundingClientRect().top - 30) + 'px') // Position above the bar
                        .style('left', (event.clientX) + 'px'); // Centered above the bar
                })
                .on('mouseout', function () {
                    tooltip.style('visibility', 'hidden');
                    d3.select(this).style('opacity', 1);
                });
        });
    }, [data, columns]); // Reset summary info and charts when data or columns change

    return (
        <div>
            <div id="chart"></div>
            <div>
                {summaryInfo.map((info, index) => (
                    <div key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                        <h4>{info.column}</h4>
                        <p><strong>Highest:</strong> {info.highest.name} ({info.highest.value})</p>
                        <p><strong>Lowest:</strong> {info.lowest.name} ({info.lowest.value})</p>
                        <p><strong>Count:</strong> {info.count}</p>
                        <p><strong>Mean:</strong> {info.mean.toFixed(2)}</p>
                        <p><strong>Median:</strong> {info.median.toFixed(2)}</p>
                        <p><strong>Standard Deviation:</strong> {info.stdDev.toFixed(2)}</p>
                        <p><strong>Total:</strong> {info.total}</p>
                        <p><strong>Minimum:</strong> {info.min}</p>
                        <p><strong>Maximum:</strong> {info.max}</p>
                        <p><strong>Unique Values:</strong> {info.uniqueCount}</p>
                        <p><strong>Percentage Missing:</strong> {info.percentageMissing}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
