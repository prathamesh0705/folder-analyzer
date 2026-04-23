import React from 'react';
import './AISummary.css';

const AISummary = ({ aiSummary, metadata }) => {
    if (!aiSummary) return null;

    const { ai_enabled, summary, insights, recommendations } = aiSummary;

    return (
        <div className="ai-summary glass-card fade-in">
            <div className="ai-header">
                <div className="ai-title">
                    <span className="ai-icon">🤖</span>
                    <h2>AI-Powered Intelligent Summary</h2>
                </div>
                <div className="ai-badge">
                    {ai_enabled ? (
                        <span className="badge badge-ai">✨ Gemini AI</span>
                    ) : (
                        <span className="badge badge-rule">📋 Rule-Based</span>
                    )}
                </div>
            </div>

            <div className="ai-content">
                {/* Main Summary */}
                <div className="summary-section">
                    <div
                        className="summary-text"
                        dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}
                    />
                </div>

                {/* Insights Section */}
                {insights && insights.length > 0 && (
                    <div className="insights-section">
                        <h3>💡 Key Insights</h3>
                        <div className="insights-grid">
                            {insights.map((insight, idx) => (
                                <div key={idx} className="insight-card">
                                    <span className="insight-number">{idx + 1}</span>
                                    <p>{insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations Section */}
                {recommendations && recommendations.length > 0 && (
                    <div className="recommendations-section">
                        <h3>🎯 Recommendations</h3>
                        <div className="recommendations-list">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="recommendation-item">
                                    <div className="rec-icon">✓</div>
                                    <p>{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="ai-footer">
                {ai_enabled ? (
                    <p className="ai-disclaimer">
                        <span className="disclaimer-icon">ℹ️</span>
                        This summary was generated using Google Gemini AI by analyzing your project's code structure, dependencies, and file contents.
                    </p>
                ) : (
                    <p className="ai-disclaimer">
                        <span className="disclaimer-icon">ℹ️</span>
                        This summary was generated using rule-based analysis. For AI-powered insights, configure the GEMINI_API_KEY environment variable.
                    </p>
                )}
            </div>
        </div>
    );
};

// Helper function to format summary text with markdown-like formatting
const formatSummary = (text) => {
    if (!text) return '';

    // Convert markdown-style formatting to HTML
    let formatted = text
        // Bold text (**text**)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Headers (## Header)
        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
        // Headers (### Header)
        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
        // Bullet points (- item or * item)
        .replace(/^[*-] (.+)$/gm, '<li>$1</li>')
        // Numbered lists (1. item)
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        // Line breaks
        .replace(/\n/g, '<br/>');

    // Wrap bullet points in ul tags
    formatted = formatted.replace(/(<li>.+<\/li>)/g, '<ul>$1</ul>');

    // Wrap in paragraph if not starting with a tag
    if (!formatted.startsWith('<')) {
        formatted = `<p>${formatted}</p>`;
    }

    return formatted;
};

export default AISummary;
