import google.generativeai as genai
from app.core.config import settings
import json

def generate_suggestions(resume_text: str, jd_text: str) -> dict:
    """
    Call LLM to analyze resume vs JD.
    Returns dictionary with suggested points and cover letter.
    """
    if not settings.GEMINI_API_KEY:
        return {
            "summary_suggestion": "API Key missing. Configure GEMINI_API_KEY to see suggestions.",
            "cover_letter": "API Key missing.",
            "improvements": []
        }

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Using gemini-2.5-flash as validated by diagnostic script
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        prompt = f"""
        Act as an expert technical recruiter and ATS optimization specialist. 
        I have a Resume and a Job Description.
        
        RESUME:
        {resume_text[:4000]} # Truncate to avoid context window issues just in case
        
        JOB DESCRIPTION:
        {jd_text[:2000]}
        
        INSTRUCTIONS:
        1. Analyze the match between the resume and JD.
        2. Identify **Critical Domain-Specific Skills** (e.g., for Tech: "Python", "AWS"; for Sales: "CRM", "Lead Gen"; for Marketing: "SEO", "Copywriting") and **Hard/Soft Skills**.
        3. **CRITICAL FILTERING RULES** (Apply to ALL industries):
           - **Exclude** phrases starting with verbs (e.g., "managing teams", "selling products", "writing reports").
           - **Exclude** generic action phrases (e.g., "good communication skills" -> use "Communication"; "knowledge of X" -> use "X").
           - **Exclude** common fluff: "Collaborate", "Work", "Support", "Environment", "Ensure", "Responsible for".
           - Keep keywords **CONCISE** (1-3 words max, Noun-based).
        4. Determine which of these strict skills are PRESENT vs MISSING.
        5. Calculate a Match Score (0-100) based on these high-value skills.
        6. Suggest improvements using the **EXACT keywords** from the JD.

        OUTPUT JSON format with these exact keys:
        - match_score: Integer (0-100).
        - missing_keywords: List of strings (Critical skills missing from resume).
        - matching_keywords: List of strings (Skills present in resume that match JD).
        - summary_suggestion: A professional summary tailored to the JD (max 3 sentences).
        - cover_letter: A professional cover letter for this role.
        - improvements: A list of 3 specific bullet points to add/modify in the Experience section.

        Do not output markdown code blocks, just raw JSON.
        """
        
        response = model.generate_content(prompt)
        text_resp = response.text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(text_resp)
        
    except Exception as e:
        error_str = str(e)
        print(f"LLM Error: {error_str}")
        
        # Fallback for Quota Exceeded or other API errors to allow Demo usage
        if "429" in error_str or "Quota exceeded" in error_str:
            print("Quota exceeded! Returning DEMO response.")
            return {
                "match_score": 75,
                "missing_keywords": ["Docker", "Kubernetes", "GraphQL"],
                "matching_keywords": ["Python", "FastAPI", "React", "AWS"],
                "summary_suggestion": "[DEMO MODE: API Quota Exceeded] This candidate possesses strong technical foundations matching the job requirements. Key strengths include Python backend development and API design. Recommended to highlight specific project impacts to further stand out.",
                "cover_letter": "Dear Hiring Manager,\n\nI am writing to express my strong interest in the open position. With my background in ... [This is a placeholder cover letter generated because the AI API limit was reached. In a live environment, this would be custom text.]\n\nSincerely,\nCandidate",
                "improvements": [
                    "Add metrics to your project descriptions (e.g., 'Reduced latency by 20%').",
                    "Explicitly mention your experience with the specific frameworks listed in the JD.",
                    "Include a link to your portfolio or GitHub for code review."
                ]
            }

        return {
            "match_score": 0,
            "missing_keywords": ["Error"],
            "matching_keywords": [],
            "summary_suggestion": f"Error generating suggestions: {error_str}",
            "cover_letter": "Error generating cover letter.",
            "improvements": []
        }
