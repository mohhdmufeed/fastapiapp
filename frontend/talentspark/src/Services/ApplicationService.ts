import api from "./api";
import type { JobApplication } from "../types/application";

export async function applyToJob(jobId: number, coverLetter?: string, resumeText?: string): Promise<JobApplication> {
    const response = await api.post("/applications/", {
        job_id: jobId,
        cover_letter: coverLetter,
        resume_text: resumeText
    });
    return response.data;
}

export async function getMyApplications(): Promise<JobApplication[]> {
    const response = await api.get("/applications/my");
    return response.data;
}

export async function getAllApplications(): Promise<JobApplication[]> {
    const response = await api.get("/applications/");
    return response.data;
}

export async function getJobApplications(jobId: number): Promise<JobApplication[]> {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
}

export async function updateApplicationStatus(applicationId: number, status: string): Promise<JobApplication> {
    const response = await api.put(`/applications/${applicationId}/status`, { status });
    return response.data;
}
