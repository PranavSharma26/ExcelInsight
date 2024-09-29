import React, { useEffect } from 'react';
import * as d3 from 'd3';

export default function ReusableChart({ data }) {
    const chartSize = { width: 400, height: 300 }; // Adjusted size for better fit

    // Helper function to create bar chart
    const drawBarChart = () => {
        d3.select('#bar-chart').selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 50, left: 60 };
        const width = chartSize.width - margin.left - margin.right;
        const height = chartSize.height - margin.top - margin.bottom;

        const svg = d3.select('#bar-chart')
            .append('svg')
            .attr('width', chartSize.width)
            .attr('height', chartSize.height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(data.labels || []) // Use default empty array if labels are undefined
            .range([0, width])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max([...data.values1 || [], ...data.values2 || []])]) // Use default empty array if values are undefined
            .nice()
            .range([height, 0]);

        // Drawing bars for values1
        svg.selectAll('.bar1')
            .data(data.values1 || [])
            .enter()
            .append('rect')
            .attr('class', 'bar1')
            .attr('x', (d, i) => xScale(data.labels[i]) || 0)
            .attr('y', (d) => yScale(d))
            .attr('width', xScale.bandwidth() / 2)
            .attr('height', (d) => height - yScale(d))
            .attr('fill', '#4285f4');

        // Drawing bars for values2
        svg.selectAll('.bar2')
            .data(data.values2 || [])
            .enter()
            .append('rect')
            .attr('class', 'bar2')
            .attr('x', (d, i) => xScale(data.labels[i]) + xScale.bandwidth() / 2 || 0)
            .attr('y', (d) => yScale(d))
            .attr('width', xScale.bandwidth() / 2)
            .attr('height', (d) => height - yScale(d))
            .attr('fill', '#ea4335');

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickSize(0));

        svg.append('g')
            .call(d3.axisLeft(yScale));
    };

    // Helper function to create pie chart
    const drawPieChart = () => {
        d3.select('#pie-chart').selectAll('*').remove();

        const radius = Math.min(chartSize.width, chartSize.height) / 2;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = chartSize.width - margin.left - margin.right;
        const height = chartSize.height - margin.top - margin.bottom;

        const svg = d3.select('#pie-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius - 10);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pieData = (data.pieValues || []).map((value, index) => ({
            value: value,
            name: data.pieLabels ? data.pieLabels[index] : `Label ${index + 1}`
        }));

        const arcs = svg.selectAll('.arc')
            .data(pie(pieData))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.name));

        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '0.35em')
            .style('text-anchor', 'middle')
            .text(d => d.data.name);
    };

    useEffect(() => {
        if (data) {
            drawBarChart();
            drawPieChart();
        }
    }, [data]);

    return (
        <div className="flex flex-wrap justify-between p-4 gap-4">
            <div className="w-full md:w-[48%] bg-white border border-gray-200 p-4 rounded-md" id="bar-chart">
                <h2 className="text-lg font-semibold mb-2">Bar Chart</h2>
            </div>
            <div className="w-full md:w-[48%] bg-white border border-gray-200 p-4 rounded-md" id="pie-chart">
                <h2 className="text-lg font-semibold mb-2">Pie Chart</h2>
            </div>
        </div>
    );
}
