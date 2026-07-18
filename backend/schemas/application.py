# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ApplicationCreate(BaseModel):
    job_id: int
    cover_letter: Optional[str] = None
    resume_text: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str

# Minimal representations  for nested objects
class UserMinResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class JobMinResponse(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    user_id: int
    cover_letter: Optional[str]
    resume_text: Optional[str]
    status: str
    applied_at: datetime
    user: Optional[UserMinResponse] = None
    job: Optional[JobMinResponse] = None

    class Config:
        from_attributes = True
