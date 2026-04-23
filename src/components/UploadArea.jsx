import React, { useState, useRef } from 'react';
import './UploadArea.css';

const UploadArea = ({ onAnalysisComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const folderInputRef = useRef(null);
    const zipInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const items = e.dataTransfer.items;
        if (!items || items.length === 0) return;

        // Check if it's a zip file
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 1 && files[0].name.endsWith('.zip')) {
            await handleZipUpload(files[0]);
        } else {
            setError('Please drop a ZIP file or use the folder upload button');
        }
    };

    const handleZipUpload = async (file) => {
        if (!file || !file.name.endsWith('.zip')) {
            setError('Please upload a .zip file');
            return;
        }

        setError(null);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const { uploadZip } = await import('../api/client');
            const result = await uploadZip(file, (progress) => {
                setUploadProgress(progress);
            });

            onAnalysisComplete(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFolderUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setError(null);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const { uploadFolder } = await import('../api/client');
            const result = await uploadFolder(files, (progress) => {
                setUploadProgress(progress);
            });

            onAnalysisComplete(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleZipInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleZipUpload(file);
        }
    };

    return (
        <div className="upload-container">
            <div
                className={`upload-area ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isUploading ? (
                    <div className="upload-progress">
                        <div className="spinner"></div>
                        <h3>Analyzing your project...</h3>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <p>{uploadProgress}% complete</p>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <h2>Upload Your Project</h2>
                        <p className="upload-subtitle">
                            Drag & drop a ZIP file here, or click the buttons below
                        </p>

                        <div className="upload-buttons">
                            <button
                                className="btn btn-primary"
                                onClick={() => zipInputRef.current?.click()}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="12" y1="18" x2="12" y2="12"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                                Upload ZIP File
                            </button>

                            <button
                                className="btn btn-secondary"
                                onClick={() => folderInputRef.current?.click()}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Upload Folder
                            </button>
                        </div>

                        <input
                            ref={zipInputRef}
                            type="file"
                            accept=".zip"
                            onChange={handleZipInputChange}
                            style={{ display: 'none' }}
                        />

                        <input
                            ref={folderInputRef}
                            type="file"
                            webkitdirectory=""
                            directory=""
                            multiple
                            onChange={handleFolderUpload}
                            style={{ display: 'none' }}
                        />

                        <div className="upload-info">
                            <p>✓ Supports Python, JavaScript, TypeScript, Java, C++, and more</p>
                            <p>✓ Automatically analyzes dependencies and file relationships</p>
                            <p>✓ Generates interactive visualizations</p>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <div className="error-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
};

export default UploadArea;
