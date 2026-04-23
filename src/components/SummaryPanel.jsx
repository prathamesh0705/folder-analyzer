import React from 'react';
import './SummaryPanel.css';

const SummaryPanel = ({ summary, statistics }) => {
    if (!summary) return null;

    return (
        <div className="summary-panel glass-card fade-in">
            <h2>📊 Project Summary</h2>

            <div className="summary-header">
                <div className="summary-badge-group">
                    <span className="badge badge-primary">{summary.project_type}</span>
                    {summary.framework && summary.framework !== 'None detected' && (
                        <span className="badge badge-success">{summary.framework}</span>
                    )}
                </div>
            </div>

            <div className="summary-description">
                <p>{summary.description}</p>
            </div>

            <div className="summary-stats">
                <div className="stat-card">
                    <div className="stat-icon">📁</div>
                    <div className="stat-content">
                        <div className="stat-value">{statistics.total_files}</div>
                        <div className="stat-label">Files</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <div className="stat-value">{statistics.total_lines.toLocaleString()}</div>
                        <div className="stat-label">Lines of Code</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💻</div>
                    <div className="stat-content">
                        <div className="stat-value">{statistics.languages.length}</div>
                        <div className="stat-label">Languages</div>
                    </div>
                </div>
            </div>

            {statistics.languages && statistics.languages.length > 0 && (
                <div className="languages-section">
                    <h3>Languages Used</h3>
                    <div className="language-tags">
                        {statistics.languages.map((lang, idx) => (
                            <span key={idx} className="language-tag">{lang}</span>
                        ))}
                    </div>
                </div>
            )}

            {summary.key_modules && summary.key_modules.length > 0 && (
                <div className="modules-section">
                    <h3>Key Modules</h3>
                    <div className="modules-grid">
                        {summary.key_modules.map((module, idx) => (
                            <div key={idx} className="module-card">
                                <div className="module-header">
                                    <span className="module-name">📦 {module.name}</span>
                                    <span className="module-count">{module.file_count} files</span>
                                </div>
                                <div className="module-role">{module.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="structure-info">
                <h3>Project Structure</h3>
                <div className="structure-badges">
                    {summary.structure.has_src && (
                        <span className="structure-badge">✓ Source Code</span>
                    )}
                    {summary.structure.has_tests && (
                        <span className="structure-badge">✓ Tests</span>
                    )}
                    {summary.structure.has_docs && (
                        <span className="structure-badge">✓ Documentation</span>
                    )}
                    {summary.structure.has_config && (
                        <span className="structure-badge">✓ Configuration</span>
                    )}
                </div>
            </div>

            {summary.purpose && (
                <div className="how-it-works">
                    <h3>💡 How It Works</h3>
                    <div className="purpose-description">
                        <p>{summary.purpose}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryPanel;
