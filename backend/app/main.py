from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import company
from routers import job
from database import Base,engine
from models import company as company_model,job as job_model,users as user_model
from routers import company,job,auth


app = FastAPI()

# Allow the frontend to call the API from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Engine is : ",engine)
#Base.metadata.create_all(bind=engine)
app.include_router(company.router)
app.include_router(job.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/about")
def read_about():
    return {"About": "This is a FastAPI application."}

@app.get("/contact")
def read_contact():
    return {"contact": "Mob:1234567891,email: example@example.com"}