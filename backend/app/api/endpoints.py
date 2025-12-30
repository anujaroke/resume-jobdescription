from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.parser import extract_text_from_pdf, extract_text_from_docx
from app.services.matcher import calculate_match_score, find_missing_keywords, extract_keywords
from app.api.models import AnalysisResponse
from app.services.llm import generate_suggestions

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    # 1. Parse File
    content = await file.read()
    filename = file.filename.lower()
    
    if filename.endswith(".pdf"):
        resume_text = extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        resume_text = extract_text_from_docx(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Use PDF or DOCX.")
        
    if not resume_text:
        raise HTTPException(status_code=400, detail="Could not extract text from file.")

    # 2. Match Score & Keywords
    # 3. LLM Generation (Now handling matching logic too against strict "Skill" definition)
    llm_result = generate_suggestions(resume_text, job_description)
    
    # Fallback/mix: If LLM fails (returns 0 score or empty), we could use heuristics, 
    # but for now rely on LLM or the Demo fallback.
    
    return AnalysisResponse(
        match_score=llm_result.get("match_score", 0),
        missing_keywords=llm_result.get("missing_keywords", []),
        present_keywords=llm_result.get("matching_keywords", []),
        summary_suggestion=llm_result.get("summary_suggestion", ""),
        cover_letter=llm_result.get("cover_letter", "")
    )
