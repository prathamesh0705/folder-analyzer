import React, { useState } from 'react';
import UploadArea from './components/UploadArea';
import SummaryPanel from './components/SummaryPanel';
import FileTypeChart from './components/FileTypeChart';
import DependencyGraph from './components/DependencyGraph';
import ImportanceTable from './components/ImportanceTable';
import FlowDiagram from './components/FlowDiagram';
import AISummary from './components/AISummary';
import './styles/App.css';

function App() {
    const [analysisData, setAnalysisData] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleAnalysisComplete = (data) => {
        setAnalysisData(data);
        setShowResults(true);
    };

    const handleReset = () => {
        setAnalysisData(null);
        setShowResults(false);
    };

    return (
        <div className="app">
            <header className="header">
                <h1>🔍 Folder Analyzer</h1>
                <p>Analyze folder structure, map dependencies, and visualize file relationships</p>
            </header>

            <div className="container">
                {!showResults ? (
                    <UploadArea onAnalysisComplete={handleAnalysisComplete} />
                ) : (
                    <>
                        <div className="results-header">
                            <button className="btn btn-secondary" onClick={handleReset}>
                                ← Analyze Another Folder
                            </button>
                        </div>

                        <div className="results-grid">
                            {/* Summary Panel */}
                            <div className="results-section full-width">
                                <SummaryPanel
                                    summary={analysisData?.summary}
                                    statistics={analysisData?.statistics}
                                />
                            </div>

                            {/* File Type Chart */}
                            <div className="results-section full-width">
                                <FileTypeChart statistics={analysisData?.statistics} />
                            </div>

                            {/* Dependency Graph */}
                            <div className="results-section full-width">
                                <DependencyGraph
                                    dependencies={analysisData?.dependencies}
                                    importance={analysisData?.importance}
                                />
                            </div>

                            {/* Importance Table */}
                            <div className="results-section full-width">
                                <ImportanceTable importance={analysisData?.importance} />
                            </div>

                            {/* Flow Diagram */}
                            <div className="results-section full-width">
                                <FlowDiagram flow={analysisData?.flow} />
                            </div>

                            {/* AI-Powered Intelligent Summary */}
                            <div className="results-section full-width">
                                <AISummary
                                    aiSummary={analysisData?.ai_summary}
                                    metadata={analysisData?.metadata}
                                />
                            </div>
                        </div>

                        {/* Additional Info */}
                        {analysisData?.metadata && (
                            <div className="metadata-panel glass-card fade-in">
                                <h3>📋 Analysis Metadata</h3>
                                <div className="metadata-grid">
                                    <div className="metadata-item">
                                        <span className="metadata-label">Total Files Analyzed:</span>
                                        <span className="metadata-value">{analysisData.metadata.total_files_analyzed}</span>
                                    </div>
                                    <div className="metadata-item">
                                        <span className="metadata-label">Languages Detected:</span>
                                        <span className="metadata-value">
                                            {analysisData.metadata.languages_detected?.join(', ') || 'None'}
                                        </span>
                                    </div>
                                    <div className="metadata-item">
                                        <span className="metadata-label">Session ID:</span>
                                        <span className="metadata-value">{analysisData.session_id}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <footer className="footer">
                <p>Built with React, D3.js, Mermaid, and FastAPI</p>
                <p>Supports Python, JavaScript, TypeScript, Java, C++, and more</p>
            </footer>
        </div>
    );
}

export default App;
