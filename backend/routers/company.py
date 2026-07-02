from fastapi import APIRouter , Depends, HTTPException ,status

from schemas.company import companyCreate, companyUpdate ,companyResponse
from models.company import Company
from models.job import Job  # Required: ensures Job model is registered for SQLAlchemy relationship resolution
from sqlalchemy.orm import Session,relationship
from database import get_db, SessionLocal

router = APIRouter(prefix="/company", tags=["company"])
companies = []

@router.post("/",status_code=status.HTTP_201_CREATED,
response_model=companyResponse)
def create_company(company: companyCreate,db: Session = Depends(get_db)):
    existing_company = db.query(Company).filter(Company.email == company.email).first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this email already exists"
        )
    db_company = Company(**company.dict())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company


@router.get("/",status_code=status.HTTP_200_OK,
response_model=list[companyResponse])
def get_all_company(db: Session = Depends(get_db)):
    return db.query(Company).all()

@router.get("/{company_id}",status_code=status.HTTP_200_OK,
response_model=companyResponse)
def read_company(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return db_company

@router.put("/{company_id}",status_code=status.HTTP_200_OK,
response_model=companyResponse)
def update_company(company_id: int, company: companyUpdate, db: Session = Depends(get_db)):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    # pyrefly: ignore [deprecated]
    update_data = company.dict(exclude_unset=True)
    if "email" in update_data and update_data["email"] != db_company.email:
        existing_company = db.query(Company).filter(Company.email == update_data["email"]).first()
        if existing_company:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company with this email already exists"
            )
    for key, value in update_data.items():
        setattr(db_company, key, value)
    db.commit()
    db.refresh(db_company)
    return db_company

@router.delete("/{company_id}",status_code=status.HTTP_200_OK)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    db.delete(db_company)
    db.commit()
    return {"detail": "Company deleted successfully"}


