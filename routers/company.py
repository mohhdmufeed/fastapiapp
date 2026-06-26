from fastapi import APIRouter

router = APIRouter(prefix="/company", tags=["company"])

@router.get("/")
def read_company():
    return {"Company": " company root"}


@router.get("/{company_id}")
def read_company(company_id: int):
    return {"Company_id": company_id}
