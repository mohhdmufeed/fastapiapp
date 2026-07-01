import axios from 'axios';
import type { job } from '../types/job';

const API_BASE_URL = 'http://localhost:8000';

export async function getJobs(): Promise<job[]> {
    const response = await axios.get(`${API_BASE_URL}/job`);
    return response.data;
}   

export async function getJob(id: number): Promise<job> {
    const response = await axios.get(`${API_BASE_URL}/job/${id}`);
    return response.data;
}   

export async function createJob(job: job): Promise<job> {
    const response = await axios.post(`${API_BASE_URL}/job`, job);
    return response.data;
}

export async function updateJob(id: number, job: job): Promise<job> {
    const response = await axios.put(`${API_BASE_URL}/job/${id}`, job);
    return response.data;
}

export async function deleteJob(id: number): Promise<void> {
    const response = await axios.delete(`${API_BASE_URL}/job/${id}`);
    return response.data;
}

