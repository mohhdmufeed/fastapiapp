from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from schemas.rag import (
    ResumeRequest, ResumeResponse,
    JobMatchRequest, JobMatchResponse, JobMatchResult,
    RagSearchRequest, RagSearchResponse,
    EmbedResponse,
    JobSearchRequest, SemanticSearchResponse, SemanticSearchResult
)
from services.resume_service import analyse_resume
from services.qdrant_service import embed_all_jobs, search_jobs, match_jobs_for_profile
from services.rag_service import rag_job_search

router = APIRouter(prefix="/rag", tags=["RAG"])


@router.post("/embed-jobs", response_model=EmbedResponse)
async def embed_jobs(db: AsyncSession = Depends(get_db)):
    try:
        count = await embed_all_jobs(db)
        return EmbedResponse(message=f"Embedded {count} jobs into Qdrant", count=count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to embed jobs: {str(e)}")


@router.post("/search", response_model=SemanticSearchResponse)
def semantic_search(request: JobSearchRequest):
    try:
        results = search_jobs(request.query, top_k=5)
        return SemanticSearchResponse(
            results=[SemanticSearchResult(**r) for r in results]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic search failed: {str(e)}")


@router.post("/ask", response_model=RagSearchResponse)
def rag_ask(request: RagSearchRequest):
    try:
        answer = rag_job_search(request.question)
        return RagSearchResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG search query failed: {str(e)}")


@router.post("/analyse-resume", response_model=ResumeResponse)
def resume_analyse(request: ResumeRequest):
    try:
        analysis = analyse_resume(request.resume_text)
        return ResumeResponse(analysis=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")


@router.post("/analyse-resume-file", response_model=ResumeResponse)
async def resume_analyse_file(file: UploadFile = File(...)):
    try:
        content_type = file.content_type
        filename = file.filename or ""
        file_bytes = await file.read()

        if filename.endswith(".docx") or content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            import docx
            import io
            doc = docx.Document(io.BytesIO(file_bytes))
            text = "\n".join([p.text for p in doc.paragraphs])
        elif filename.endswith(".txt") or content_type == "text/plain":
            text = file_bytes.decode("utf-8", errors="ignore")
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Please upload a .docx or .txt file."
            )

        if not text.strip():
            raise HTTPException(status_code=400, detail="The uploaded file contains no text.")

        analysis = analyse_resume(text)
        return ResumeResponse(analysis=analysis)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume file analysis failed: {str(e)}")


@router.post("/job-match", response_model=JobMatchResponse)
def job_match(request: JobMatchRequest):
    try:
        results = match_jobs_for_profile(request.skills, request.experience, top_k=5)
        return JobMatchResponse(
            matches=[JobMatchResult(**r) for r in results]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")
