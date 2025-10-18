const BACKEND_ROOT = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const BASE_URL = BACKEND_ROOT.endsWith('/api')
    ? BACKEND_ROOT
    : BACKEND_ROOT.replace(/\/$/, '') + '/api';

const JOBS_ENDPOINT = `${BASE_URL}/jobs`; 

export { JOBS_ENDPOINT }; 

export const updateJobPosting = async (jobId, jobData, token) => {
    const response = await fetch(`${JOBS_ENDPOINT}/${jobId}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
    });

    // Check for 204 No Content response
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return { _id: jobId }; 
    }
    
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update job (Status: ${response.status})`);
        } catch (e) {
            throw new Error(`Failed to update job. Server returned status ${response.status} with unexpected response format.`);
        }
    }

    const data = await response.json();
    
    return data.job; 
};


export const fetchJobs = async (token) => {
    const response = await fetch(JOBS_ENDPOINT, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server did not return JSON.' }));
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