import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './FlowDiagram.css';

const FlowDiagram = ({ flow }) => {
    const diagramRef = useRef(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'dark',
            themeVariables: {
                primaryColor: '#6366f1',
                primaryTextColor: '#fff',
                primaryBorderColor: '#8b5cf6',
                lineColor: '#475569',
                secondaryColor: '#8b5cf6',
                tertiaryColor: '#1a2030',
                background: '#0a0e1a',
                mainBkg: '#1a2030',
                secondBkg: '#131824',
                textColor: '#cbd5e1',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
            },
            flowchart: {
                curve: 'basis',
                padding: 20,
            },
        });
    }, []);

    useEffect(() => {
        if (flow && flow.mermaid_diagram && diagramRef.current) {
            const renderDiagram = async () => {
                try {
                    // Clear previous content
                    diagramRef.current.innerHTML = '';

                    // Generate unique ID for this diagram
                    const id = `mermaid-${Date.now()}`;

                    // Render the diagram
                    const { svg } = await mermaid.render(id, flow.mermaid_diagram);
                    diagramRef.current.innerHTML = svg;
                } catch (error) {
                    console.error('Mermaid rendering error:', error);
                    // Fallback: show the code in a pre tag
                    diagramRef.current.innerHTML = `<pre style="color: #9ca3af; font-size: 12px; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px; overflow-x: auto;">${flow.mermaid_diagram}</pre>`;
                }
            };

            renderDiagram();
        }
    }, [flow]);

    if (!flow || !flow.has_flow) {
        return (
            <div className="flow-diagram glass-card">
                <h2>🔄 Execution Flow</h2>
                <div className="flow-empty">
                    <p>{flow?.flow_description || 'No execution flow detected'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flow-diagram glass-card fade-in">
            <h2>🔄 Execution Flow</h2>

            {flow.entry_points && flow.entry_points.length > 0 && (
                <div className="entry-points">
                    <h3>Entry Points</h3>
                    <div className="entry-point-list">
                        {flow.entry_points.map((ep, idx) => {
                            const fileName = ep.split('/').pop() || ep.split('\\').pop() || ep;
                            return (
                                <span key={idx} className="entry-point-badge">
                                    🚀 {fileName}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {flow.flow_description && (
                <div className="flow-description">
                    <div dangerouslySetInnerHTML={{ __html: flow.flow_description.replace(/\n/g, '<br/>') }} />
                </div>
            )}

            {flow.mermaid_diagram && (
                <div className="mermaid-container">
                    <div ref={diagramRef} className="mermaid">
                        {flow.mermaid_diagram}
                    </div>
                </div>
            )}

            <div className="flow-info">
                <p>💡 The diagram shows how execution flows from entry points through dependencies</p>
            </div>
        </div>
    );
};

export default FlowDiagram;
