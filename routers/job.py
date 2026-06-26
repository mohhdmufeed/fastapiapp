from fastapi import APIRouter

router = APIRouter(prefix="/job", tags=["job"])

@router.get("/")
def read_job():
    return {"Job": " job root"}

@router.get("/{job_id}")
def read_job(job_id: int):
    return {"Job_id": job_id}

