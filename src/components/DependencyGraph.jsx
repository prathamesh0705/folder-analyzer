import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './DependencyGraph.css';

const DependencyGraph = ({ dependencies, importance }) => {
    const svgRef = useRef(null);
    const [selectedNode, setSelectedNode] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!dependencies || !dependencies.nodes || dependencies.nodes.length === 0) {
            return;
        }

        // Clear previous graph
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up dimensions
        const container = containerRef.current;
        const width = container.clientWidth;
        const height = 600;

        // Create importance map for quick lookup
        const importanceMap = {};
        if (importance) {
            importance.forEach(item => {
                importanceMap[item.file] = item.score;
            });
        }

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [0, 0, width, height]);

        // Add zoom behavior
        const g = svg.append('g');

        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Process nodes and edges
        const nodes = dependencies.nodes.map(node => ({
            ...node,
            importance: importanceMap[node.id] || 0,
        }));

        const links = dependencies.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
        }));

        // Color scale based on file type
        const colorScale = d3.scaleOrdinal()
            .domain(['.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.cpp', '.html', '.css'])
            .range(['#3b82f6', '#f59e0b', '#f59e0b', '#3b82f6', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899', '#10b981']);

        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links)
                .id(d => d.id)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => Math.max(5, d.importance / 5 + 10)));

        // Add arrow markers
        svg.append('defs').selectAll('marker')
            .data(['arrow'])
            .join('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#475569');

        // Draw links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('class', 'graph-link')
            .attr('stroke', '#475569')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', 1.5)
            .attr('marker-end', 'url(#arrow)');

        // Draw nodes
        const node = g.append('g')
            .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr('class', 'graph-node')
            .attr('r', d => Math.max(5, d.importance / 5 + 8))
            .attr('fill', d => {
                const fileType = d.file_type || '';
                return colorScale(fileType);
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .call(drag(simulation))
            .on('mouseenter', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', Math.max(5, d.importance / 5 + 12))
                    .attr('stroke-width', 3);

                // Highlight connected nodes
                const connectedNodes = new Set();
                links.forEach(l => {
                    if (l.source.id === d.id) connectedNodes.add(l.target.id);
                    if (l.target.id === d.id) connectedNodes.add(l.source.id);
                });

                node.style('opacity', n => connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.3);
                link.style('opacity', l =>
                    (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.1
                );
            })
            .on('mouseleave', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', d => Math.max(5, d.importance / 5 + 8))
                    .attr('stroke-width', 2);

                node.style('opacity', 1);
                link.style('opacity', 0.6);
            })
            .on('click', (event, d) => {
                setSelectedNode(d);
            });

        // Add labels
        const label = g.append('g')
            .selectAll('text')
            .data(nodes)
            .join('text')
            .attr('class', 'graph-label')
            .attr('dy', -15)
            .attr('text-anchor', 'middle')
            .attr('fill', '#cbd5e1')
            .attr('font-size', '11px')
            .attr('pointer-events', 'none')
            .text(d => {
                const fileName = d.id.split('/').pop() || d.id.split('\\').pop() || d.id;
                return fileName.length > 20 ? fileName.substring(0, 20) + '...' : fileName;
            });

        // Update positions on simulation tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            label
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // Drag behavior
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        return () => {
            simulation.stop();
        };
    }, [dependencies, importance]);

    const handleReset = () => {
        const svg = d3.select(svgRef.current);
        svg.transition()
            .duration(750)
            .call(d3.zoom().transform, d3.zoomIdentity);
    };

    if (!dependencies || !dependencies.nodes || dependencies.nodes.length === 0) {
        return (
            <div className="dependency-graph glass-card">
                <h2>🔗 Dependency Graph</h2>
                <div className="graph-empty">
                    <p>No dependencies detected in this project.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dependency-graph glass-card fade-in">
            <div className="graph-header">
                <h2>🔗 Dependency Graph</h2>
                <div className="graph-controls">
                    <button className="btn btn-secondary" onClick={handleReset}>
                        Reset View
                    </button>
                </div>
            </div>

            <div className="graph-legend">
                <div className="legend-item">
                    <div className="legend-circle" style={{ background: '#3b82f6' }}></div>
                    <span>Python/TypeScript</span>
                </div>
                <div className="legend-item">
                    <div className="legend-circle" style={{ background: '#f59e0b' }}></div>
                    <span>JavaScript</span>
                </div>
                <div className="legend-item">
                    <div className="legend-circle" style={{ background: '#ef4444' }}></div>
                    <span>Java</span>
                </div>
                <div className="legend-item">
                    <div className="legend-circle" style={{ background: '#10b981' }}></div>
                    <span>CSS</span>
                </div>
            </div>

            <div className="graph-container" ref={containerRef}>
                <svg ref={svgRef}></svg>
            </div>

            <div className="graph-info">
                <p>💡 <strong>Tip:</strong> Hover over nodes to see connections, drag to reposition, scroll to zoom</p>
                <p>Node size indicates importance • Arrows show dependency direction</p>
            </div>

            {selectedNode && (
                <div className="node-details">
                    <div className="node-details-header">
                        <h4>{selectedNode.id.split('/').pop() || selectedNode.id}</h4>
                        <button onClick={() => setSelectedNode(null)}>×</button>
                    </div>
                    <div className="node-details-body">
                        <p><strong>Path:</strong> {selectedNode.id}</p>
                        <p><strong>Type:</strong> {selectedNode.file_type || 'Unknown'}</p>
                        <p><strong>Imports:</strong> {selectedNode.out_degree}</p>
                        <p><strong>Imported by:</strong> {selectedNode.in_degree}</p>
                        <p><strong>Importance:</strong> {selectedNode.importance.toFixed(1)}/100</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DependencyGraph;
