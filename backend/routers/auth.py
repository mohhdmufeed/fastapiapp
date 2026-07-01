from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.users import User
from schemas.user import UserCreate, UserLogin, UserResponse
from utils.security import hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if the email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    try:
        hashed_password = hash_password(user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Create a new user instance
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )

    # Add the new user to the database
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Check if the user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    
    if not existing_user:
        raise HTTPException(status_code=404, detail="user not found")

    # Check if the password is correct
    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    return existing_user
