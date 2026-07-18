import { useState } from "react";
import { analyseResume } from "../Services/RagService";

const SE_TEMPLATE = `JOHN DOE
john.doe@email.com | +1 (555) 019-2834 | New York, NY

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience building scalable web applications. Expert in React, Node.js, and Cloud Infrastructure (AWS). Proven track record of leading development teams and optimizing database performance.

SKILLS
* Languages: JavaScript, TypeScript, Python, SQL
* Frontend: React, Redux, HTML5, CSS3, Tailwind CSS
* Backend: Node.js, Express, FastAPI, Postgres, MongoDB
* Tools & DevOps: AWS (S3, EC2, RDS), Docker, Git, CI/CD

EXPERIENCE
Senior Software Engineer | Acme Corporation | 2022 - Present
* Led a team of 4 engineers to migrate legacy monolith architecture to microservices, improving deployment speed by 40%.
* Architected interactive React dashboards which improved customer retention rates by 15%.
* Implemented database caching layers using Redis, reducing query latencies by 60%.

Software Engineer | TechCore Systems | 2020 - 2022
* Built REST APIs using Node.js and Express to handle 10,000+ daily active users.
* Automated testing pipelines with Jest, increasing coverage to 85%.

EDUCATION
B.S. Computer Science | New York University | 2016 - 2020`;

function ResumeAnalyser() {
    const [resumeText, setResumeText] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleAnalyse = async () => {
        if (!resumeText.trim()) return;
        setLoading(true);
        setAnalysis("");
        try {
            const result = await analyseResume(resumeText);
            setAnalysis(result.analysis);
        } catch {
            setAnalysis("Failed to analyse resume. Please check if backend is running and Groq API key is valid.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File is too large. Maximum size is 5MB.");
            return;
        }

        setUploading(true);
        setUploadError(null);
        setAnalysis("");
        setLoading(true);
        try {
            const { analyseResumeFile } = await import("../Services/RagService");
            const result = await analyseResumeFile(file);
            setAnalysis(result.analysis);
            // Optionally, if the user wants to see what was read, but since it's processed on the server, we just display report.
        } catch (err: any) {
            setUploadError(err.response?.data?.detail || "Failed to extract and analyse resume file.");
            setAnalysis("Analysis failed because the server could not parse the document or connect to AI.");
        } finally {
            setUploading(false);
            setLoading(false);
        }
    };

    const loadTemplate = () => {
        setResumeText(SE_TEMPLATE.trim());
    };

    return (
        <div className="page-container" style={{ marginTop: '2rem', maxWidth: '1200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--accent-bg)', borderRadius: '15px' }}>
                    <svg style={{ width: '32px', height: '32px', color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div>
                    <h2>Resume AI Analyser</h2>
                    <p style={{ margin: 0, opacity: 0.8 }}>Upload or paste your resume text to receive feedback on skills, gaps, and roles</p>
                </div>
            </div>

            <div className="split-pane">
                {/* Left Pane - Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0 }}>Resume Content</h3>
                            <button onClick={loadTemplate} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                                📋 Load Sample Template
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', padding: '1.25rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', textAlign: 'center', background: 'var(--bg)' }}>
                            <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.25rem' }}>📄</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-h)' }}>Upload Word Document (.docx) or Text File (.txt)</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>File size limit: 5MB</span>
                            <input 
                                type="file" 
                                accept=".docx,.txt" 
                                onChange={handleFileUpload} 
                                style={{ display: 'none' }} 
                                id="resume-file-input"
                                disabled={uploading || loading}
                            />
                            <label 
                                htmlFor="resume-file-input" 
                                className="btn-primary" 
                                style={{ 
                                    display: 'inline-flex', 
                                    padding: '0.5rem 1.25rem', 
                                    fontSize: '0.8rem', 
                                    cursor: 'pointer',
                                    margin: '0.5rem auto 0 auto',
                                    borderRadius: '100px',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                {uploading ? "Extracting & Reviewing..." : "Choose File"}
                            </label>
                            {uploadError && (
                                <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block', fontWeight: 600 }}>
                                    ✖ {uploadError}
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0 1rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                            <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>or paste text below</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        </div>
                        
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your plain text resume here..."
                            style={{ 
                                flex: 1, 
                                resize: "none", 
                                fontFamily: 'var(--font-mono)', 
                                fontSize: '0.85rem', 
                                minHeight: '350px',
                                marginBottom: '1rem'
                            }}
                        />
                        
                        <button
                            className="btn-primary"
                            onClick={handleAnalyse}
                            disabled={loading || !resumeText.trim()}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <>
                                    <div className="typing-indicator" style={{ display: 'inline-flex', padding: 0 }}>
                                        <div className="typing-dot" style={{ backgroundColor: 'white' }}></div>
                                        <div className="typing-dot" style={{ backgroundColor: 'white' }}></div>
                                        <div className="typing-dot" style={{ backgroundColor: 'white' }}></div>
                                    </div>
                                    <span style={{ marginLeft: '0.5rem' }}>Analysing Resume...</span>
                                </>
                            ) : "Run AI Resume Review"}
                        </button>
                    </div>
                </div>

                {/* Right Pane - Results */}
                <div>
                    <div className="card" style={{ height: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', color: 'var(--accent)' }}>
                            📋 AI Feedback Report
                        </h3>
                        
                        {!analysis && !loading && (
                            <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.6, padding: '2rem' }}>
                                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🔍</span>
                                <p>Submit your resume details on the left panel to generate a career feedback report.</p>
                            </div>
                        )}

                        {loading && (
                            <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.8 }}>
                                <div className="typing-indicator" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                                    <div className="typing-dot" style={{ width: '10px', height: '10px', background: 'var(--accent)' }}></div>
                                    <div className="typing-dot" style={{ width: '10px', height: '10px', background: 'var(--accent)' }}></div>
                                    <div className="typing-dot" style={{ width: '10px', height: '10px', background: 'var(--accent)' }}></div>
                                </div>
                                <p style={{ fontWeight: 600, color: 'var(--accent)' }}>Llama-3.3 is reading your resume...</p>
                            </div>
                        )}

                        {analysis && (
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                                    {analysis}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResumeAnalyser;
