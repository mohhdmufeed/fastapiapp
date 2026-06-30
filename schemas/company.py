
from pydantic import BaseModel
from typing import Optional
from .job import JobResponse,JobBase

class companyBase(BaseModel):
    
    
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] =None

    

class companyCreate(companyBase):
    name: str
    email: str
    phone: str
    location: str




class companyUpdate(companyBase):
    pass
class companyResponse(companyBase):
    id: int
    jobs: list[JobResponse]

    class Config:
        from_attributes = True

