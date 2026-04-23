import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadZip = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post('/upload/zip', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.detail || 'Failed to upload and analyze file'
        );
    }
};

export const uploadFolder = async (files, onProgress) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append('files', file, file.webkitRelativePath || file.name);
    });

    try {
        const response = await apiClient.post('/upload/folder', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.detail || 'Failed to upload and analyze folder'
        );
    }
};

export const getAnalysis = async (sessionId) => {
    try {
        const response = await apiClient.get(`/analyze/${sessionId}`);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.detail || 'Failed to fetch analysis results'
        );
    }
};

export const cleanupSession = async (sessionId) => {
    try {
        const response = await apiClient.delete(`/cleanup/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
};

export default apiClient;
