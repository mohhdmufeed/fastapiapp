from pydantic import BaseModel, field_validator

class UserBase(BaseModel):
    name: str
    email: str
    role: str

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value.encode('utf-8')) > 72:
            raise ValueError('Password must be 72 bytes or fewer for bcrypt hashing')
        return value

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
