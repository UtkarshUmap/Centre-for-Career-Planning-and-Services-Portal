
const BACKEND_ROOT = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BASE_URL = BACKEND_ROOT.endsWith('/api')
    ? BACKEND_ROOT
    : BACKEND_ROOT.replace(/\/$/, '') + '/api';

const JOBS_ENDPOINT = `${BASE_URL}/jobs`; 

export const fetchJobs = async (token) => {
    // 🔑 Fix: Use the correct, full endpoint: /api/jobs
    const response = await fetch(JOBS_ENDPOINT, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Crucial: Pass the authentication token
            'Authorization': `Bearer ${token}`, 
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server did not return JSON.' }));
        // Throws a more informative error. Your `JobManagementPage.jsx` catches this.
        throw new Error(errorData.message || `Failed to fetch jobs (Status: ${response.status})`);
    }
    return response.json();
};

export const deleteJob = async (jobId, token) => {
    const response = await fetch(`${JOBS_ENDPOINT}/${jobId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server did not return JSON.' }));
        throw new Error(errorData.message || `Failed to delete job (Status: ${response.status})`);
    }

    return response.json();
};

export const createJobPosting = async (jobData, token) => {
    const response = await fetch(JOBS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server did not return JSON.' }));
        throw new Error(errorData.message || `Failed to create job (Status: ${response.status})`);
    }

    return response.json();
};