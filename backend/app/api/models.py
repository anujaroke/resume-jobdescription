from pydantic import BaseModel
from typing import List, Optional

class AnalysisRequestParams(BaseModel):
    job_description: str

class AnalysisResponse(BaseModel):
    match_score: float
    missing_keywords: List[str]
    present_keywords: List[str]
    summary_suggestion: str
    cover_letter: str
