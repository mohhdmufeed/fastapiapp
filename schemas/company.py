
from pydantic import BaseModel
from typing import Optional
class companyCreate(BaseModel):
    name: str
    location: str


class companyUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None

    