from fastapi import FastAPI
from database import engine, Base
from routers import company,job
from models import company as company_model, job as job_model
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)


#Base.metadata.create_all(bind=engine)

app.include_router(company.router)
app.include_router(job.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/about")
def read_about():
    return {"About": "This is about page."}

@app.get("/contact")
def read_contact():
    return {"Contact": "This is contact page."}
