from sqlalchemy import Column,Integer,String,Enum,ForeignKey
from sqlalchemy.orm import relationship
from models.company import Company
from database import Base


class Job(Base):
    __tablename__="jobs"
    id = Column(Integer,primary_key=True,index=True)
    title = Column(String,nullable=False)
    description = Column(String)
    salary = Column(Integer)
    location = Column(String, nullable=True)
    job_type = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    skills = Column(String, nullable=True)
    company_id = Column(Integer,ForeignKey("companies.id"))
    company = relationship("Company",back_populates="jobs")
