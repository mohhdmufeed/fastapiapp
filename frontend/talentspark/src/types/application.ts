interface JobApplication {
    id: number;
    job_id: number;
    user_id: number;
    cover_letter?: string;
    resume_text?: string;
    status: string;
    applied_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    job?: {
        id: number;
        title: string;
    };
}

export type { JobApplication };
