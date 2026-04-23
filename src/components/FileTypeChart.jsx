import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './FileTypeChart.css';

const FileTypeChart = ({ statistics }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!statistics || !statistics.file_types || !chartRef.current) return;

        // Clear previous chart
        d3.select(chartRef.current).selectAll('*').remove();

        const fileTypeData = Object.entries(statistics.file_types).map(([type, count]) => ({
            type,
            count
        }));

        // Sort by count descending
        fileTypeData.sort((a, b) => b.count - a.count);

        const margin = { top: 20, right: 20, bottom: 60, left: 60 };
        const width = 600 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current)
            .append('svg')
            .attr('width', '100%')
            .attr('height', height + margin.top + margin.bottom)
            .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Define color scale
        const colorScale = d3.scaleOrdinal()
            .domain(fileTypeData.map(d => d.type))
            .range(['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1', '#14b8a6']);

        // X scale
        const x = d3.scaleBand()
            .domain(fileTypeData.map(d => d.type))
            .range([0, width])
            .padding(0.3);

        // Y scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(fileTypeData, d => d.count)])
            .nice()
            .range([height, 0]);

        // Add bars
        svg.selectAll('.bar')
            .data(fileTypeData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.type))
            .attr('y', height)
            .attr('width', x.bandwidth())
            .attr('height', 0)
            .attr('fill', d => colorScale(d.type))
            .attr('rx', 4)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr('y', d => y(d.count))
            .attr('height', d => height - y(d.count));

        // Add value labels on bars
        svg.selectAll('.label')
            .data(fileTypeData)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', d => x(d.type) + x.bandwidth() / 2)
            .attr('y', d => y(d.count) - 5)
            .attr('text-anchor', 'middle')
            .style('fill', '#e5e7eb')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .text(d => d.count)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .style('opacity', 1);

        // Add X axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('fill', '#9ca3af')
            .style('font-size', '11px')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        // Add Y axis
        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).ticks(5))
            .selectAll('text')
            .style('fill', '#9ca3af')
            .style('font-size', '11px');

        // Style axes
        svg.selectAll('.x-axis path, .y-axis path')
            .style('stroke', '#374151');
        svg.selectAll('.x-axis line, .y-axis line')
            .style('stroke', '#374151');

        // Add Y axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -45)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .style('fill', '#9ca3af')
            .style('font-size', '12px')
            .text('Number of Files');

    }, [statistics]);

    if (!statistics || !statistics.file_types) return null;

    const totalFiles = Object.values(statistics.file_types).reduce((sum, count) => sum + count, 0);

    return (
        <div className="file-type-chart glass-card fade-in">
            <div className="chart-header">
                <h2>📂 File Type Distribution</h2>
                <span className="total-files-badge">{totalFiles} total files</span>
            </div>

            <div className="chart-container" ref={chartRef}></div>

            <div className="file-type-legend">
                {Object.entries(statistics.file_types)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, count], idx) => {
                        const percentage = ((count / totalFiles) * 100).toFixed(1);
                        const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];
                        return (
                            <div key={type} className="legend-item">
                                <div
                                    className="legend-color"
                                    style={{ backgroundColor: colors[idx % colors.length] }}
                                ></div>
                                <span className="legend-type">{type}</span>
                                <span className="legend-count">{count} files</span>
                                <span className="legend-percentage">({percentage}%)</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default FileTypeChart;
