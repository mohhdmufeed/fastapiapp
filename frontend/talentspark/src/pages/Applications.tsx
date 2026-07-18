import { useEffect, useState } from "react";
import { getMyApplications, getAllApplications, updateApplicationStatus } from "../Services/ApplicationService";
import type { JobApplication } from "../types/application";

type Props = {
    userRole: string;
};

function Applications({ userRole }: Props) {
    const isAdminOrRecruiter = userRole === "admin" || userRole === "recruiter";
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

    const fetchApplications = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isAdminOrRecruiter) {
                const data = await getAllApplications();
                setApplications(data);
            } else {
                const data = await getMyApplications();
                setApplications(data);
            }
        } catch {
            setError("Failed to fetch applications. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [userRole]);

    const handleStatusChange = async (appId: number, newStatus: string) => {
        try {
            const updated = await updateApplicationStatus(appId, newStatus);
            setApplications(prev =>
                prev.map(app => (app.id === appId ? { ...app, status: updated.status } : app))
            );
            if (selectedApp && selectedApp.id === appId) {
                setSelectedApp(prev => prev ? { ...prev, status: updated.status } : null);
            }
        } catch {
            alert("Failed to update application status.");
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status.toLowerCase()) {
            case "accepted":
                return "badge badge-success";
            case "rejected":
                return "badge badge-danger";
            case "reviewed":
                return "badge badge-info";
            case "pending":
            default:
                return "badge badge-warning";
        }
    };

    if (loading) {
        return (
            <div className="page-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ opacity: 0.7 }}>Loading Applications...</p>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--accent-bg)', borderRadius: '15px' }}>
                    <svg style={{ width: '32px', height: '32px', color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                </div>
                <div>
                    <h2>{isAdminOrRecruiter ? "Application Portal" : "My Applications"}</h2>
                    <p style={{ margin: 0, opacity: 0.8 }}>
                        {isAdminOrRecruiter 
                            ? "Review job candidate submissions and manage hiring statuses" 
                            : "Track the status of your active career applications"}
                    </p>
                </div>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: 'var(--danger-bg)', border: '1px solid var(--danger)', borderRadius: '12px', color: 'var(--danger)', marginBottom: '2rem' }}>
                    {error}
                </div>
            )}

            {!error && applications.length === 0 && (
                <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📂</span>
                    <h3>No Applications Found</h3>
                    <p style={{ opacity: 0.7, maxWidth: '400px', margin: '0 auto' }}>
                        {isAdminOrRecruiter 
                            ? "No job applications have been submitted by seekers yet." 
                            : "You haven't applied to any job listings yet. Head home to find open positions!"}
                    </p>
                </div>
            )}

            {!error && applications.length > 0 && (
                <div className="split-pane" style={{ gridTemplateColumns: selectedApp ? '1.2fr 1.8fr' : '1fr' }}>
                    {/* Left Pane - List of applications */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {applications.map((app) => (
                            <div 
                                key={app.id} 
                                className={`card ${selectedApp?.id === app.id ? 'active-border' : ''}`}
                                style={{ 
                                    margin: 0, 
                                    padding: '1.25rem', 
                                    cursor: 'pointer',
                                    border: selectedApp?.id === app.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => setSelectedApp(app)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{app.job?.title || `Job Listing #${app.job_id}`}</h4>
                                    <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
                                </div>

                                {isAdminOrRecruiter && (
                                    <p style={{ margin: '0.25rem 0', fontWeight: 600, fontSize: '0.85rem' }}>
                                        👤 {app.user?.name} ({app.user?.email})
                                    </p>
                                )}

                                <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>
                                    Applied: {new Date(app.applied_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Right Pane - Selected Application Details */}
                    {selectedApp && (
                        <div className="card" style={{ margin: 0, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{selectedApp.job?.title}</h3>
                                    {isAdminOrRecruiter && (
                                        <p style={{ margin: '0.25rem 0 0 0', fontWeight: 600 }}>
                                            Candidate: {selectedApp.user?.name} ({selectedApp.user?.email})
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.5rem' }}>
                                    <span className={getStatusBadgeClass(selectedApp.status)} style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>
                                        {selectedApp.status}
                                    </span>
                                    <button 
                                        onClick={() => setSelectedApp(null)}
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: '5px' }}
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>

                            {isAdminOrRecruiter && (
                                <div>
                                    <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Update Decision Status</label>
                                    <select 
                                        value={selectedApp.status} 
                                        onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                                        style={{ width: '100%', maxWidth: '250px' }}
                                    >
                                        <option value="pending">Pending Review</option>
                                        <option value="reviewed">Reviewed</option>
                                        <option value="accepted">Accept / Shortlist</option>
                                        <option value="rejected">Reject</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Cover Letter</h4>
                                <div style={{ 
                                    background: 'var(--bg)', 
                                    padding: '1.25rem', 
                                    borderRadius: 'var(--radius-sm)', 
                                    border: '1px solid var(--border)',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {selectedApp.cover_letter || "No cover letter submitted."}
                                </div>
                            </div>

                            {selectedApp.resume_text && (
                                <div>
                                    <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Submitted Resume Text</h4>
                                    <div style={{ 
                                        background: 'var(--bg)', 
                                        padding: '1.25rem', 
                                        borderRadius: 'var(--radius-sm)', 
                                        border: '1px solid var(--border)',
                                        fontSize: '0.85rem',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        fontFamily: 'var(--font-mono)',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {selectedApp.resume_text}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Applications;
