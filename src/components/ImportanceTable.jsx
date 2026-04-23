import React, { useState, useMemo } from 'react';
import './ImportanceTable.css';

const ImportanceTable = ({ importance }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('score');
    const [sortOrder, setSortOrder] = useState('desc');

    const filteredAndSorted = useMemo(() => {
        if (!importance) return [];

        let filtered = importance.filter(item =>
            item.file.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'file') {
                aVal = a.file.toLowerCase();
                bVal = b.file.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return filtered;
    }, [importance, searchTerm, sortField, sortOrder]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#3b82f6';
        if (score >= 40) return '#f59e0b';
        return '#6b7280';
    };

    const getScoreGradient = (score) => {
        const color = getScoreColor(score);
        return `linear-gradient(90deg, ${color}22 0%, ${color}44 ${score}%, transparent ${score}%)`;
    };

    if (!importance || importance.length === 0) {
        return null;
    }

    return (
        <div className="importance-table glass-card fade-in">
            <div className="table-header">
                <h2>⭐ File Importance Ranking</h2>
                <div className="search-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-info">
                <p>Showing {filteredAndSorted.length} of {importance.length} files</p>
            </div>

            <div className="table-scroll">
                <table className="table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('file')} className="sortable">
                                File
                                {sortField === 'file' && (
                                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('score')} className="sortable">
                                Score
                                {sortField === 'score' && (
                                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('in_degree')} className="sortable">
                                References
                                {sortField === 'in_degree' && (
                                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th onClick={() => handleSort('out_degree')} className="sortable">
                                Dependencies
                                {sortField === 'out_degree' && (
                                    <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                            </th>
                            <th>Type</th>
                            <th>Entry Point</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSorted.map((item, idx) => (
                            <tr key={idx} style={{ background: getScoreGradient(item.score) }}>
                                <td className="file-cell">
                                    <span className="file-name" title={item.file}>
                                        {item.file.split('/').pop() || item.file.split('\\').pop() || item.file}
                                    </span>
                                    <span className="file-path">{item.file}</span>
                                </td>
                                <td>
                                    <div className="score-cell">
                                        <div className="score-bar">
                                            <div
                                                className="score-bar-fill"
                                                style={{
                                                    width: `${item.score}%`,
                                                    background: getScoreColor(item.score)
                                                }}
                                            ></div>
                                        </div>
                                        <span className="score-value" style={{ color: getScoreColor(item.score) }}>
                                            {item.score.toFixed(1)}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-primary">{item.in_degree}</span>
                                </td>
                                <td>
                                    <span className="badge badge-secondary">{item.out_degree}</span>
                                </td>
                                <td>
                                    <code className="file-type">{item.file_type || 'N/A'}</code>
                                </td>
                                <td>
                                    {item.is_entry_point && (
                                        <span className="badge badge-success">✓ Entry</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-legend">
                <h4>Score Interpretation</h4>
                <div className="legend-items">
                    <div className="legend-item">
                        <div className="legend-bar" style={{ background: '#10b981' }}></div>
                        <span>80-100: Critical files</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-bar" style={{ background: '#3b82f6' }}></div>
                        <span>60-80: Important files</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-bar" style={{ background: '#f59e0b' }}></div>
                        <span>40-60: Moderate importance</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-bar" style={{ background: '#6b7280' }}></div>
                        <span>0-40: Low importance</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportanceTable;
