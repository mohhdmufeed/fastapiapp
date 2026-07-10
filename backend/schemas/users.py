from pydantic import BaseModel
from typing import Literal

ALLOWED_ROLES = Literal["job_seeker", "recruiter", "admin"]

class UserBase(BaseModel):
    name: str
    email: str
    password: str
    role: ALLOWED_ROLES

class UserCreate(UserBase):
    pass

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    class Config:
        from_attributes = True
        
class Login_User(BaseModel):
    email: str
    password: str