from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import get_db
from models.application import JobApplication
from models.job import Job
from schemas.application import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate
from utils.oauth2 import role_required, get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ApplicationResponse)
async def apply_to_job(
    application: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        # Check if job exists
        job_result = await db.execute(select(Job).filter(Job.id == application.job_id))
        job = job_result.scalars().first()
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

        # Check if user already applied
        existing_result = await db.execute(
            select(JobApplication).filter(
                JobApplication.job_id == application.job_id,
                JobApplication.user_id == current_user.id
            )
        )
        existing_app = existing_result.scalars().first()
        if existing_app:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You have already applied to this job")

        # Create new application
        db_app = JobApplication(
            job_id=application.job_id,
            user_id=current_user.id,
            cover_letter=application.cover_letter,
            resume_text=application.resume_text
        )
        db.add(db_app)
        await db.commit()
        await db.refresh(db_app)

        # Re-fetch with eager loaded relationships
        result = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.job), selectinload(JobApplication.user))
            .filter(JobApplication.id == db_app.id)
        )
        return result.scalars().first()

    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error during application: {str(e)}")


@router.get("/my", response_model=list[ApplicationResponse])
async def get_my_applications(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        result = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.job), selectinload(JobApplication.user))
            .filter(JobApplication.user_id == current_user.id)
            .order_by(JobApplication.applied_at.desc())
        )
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error fetching applications: {str(e)}")


@router.get("/", response_model=list[ApplicationResponse])
async def get_all_applications(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(role_required(["admin", "recruiter"]))
):
    try:
        result = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.job), selectinload(JobApplication.user))
            .order_by(JobApplication.applied_at.desc())
        )
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving all applications: {str(e)}")


@router.get("/job/{job_id}", response_model=list[ApplicationResponse])
async def get_job_applications(
    job_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(role_required(["admin", "recruiter"]))
):
    try:
        result = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.job), selectinload(JobApplication.user))
            .filter(JobApplication.job_id == job_id)
            .order_by(JobApplication.applied_at.desc())
        )
        return result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error retrieving applications for job: {str(e)}")


@router.put("/{application_id}/status", response_model=ApplicationResponse)
async def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(role_required(["admin", "recruiter"]))
):
    try:
        result = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.job), selectinload(JobApplication.user))
            .filter(JobApplication.id == application_id)
        )
        db_app = result.scalars().first()
        if not db_app:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

        db_app.status = status_update.status
        await db.commit()
        await db.refresh(db_app)
        return db_app
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Database error updating status: {str(e)}")
