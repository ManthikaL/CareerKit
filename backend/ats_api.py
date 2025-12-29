import base64
import io
import os
import re
from typing import Optional, List, Literal

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pdf2image
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing GOOGLE_API_KEY. Put it in backend/.env")

genai.configure(api_key=API_KEY)
MODEL_NAME = "gemini-1.5-pro"

# ---- Prompts copied from your ats.py ----
PROMPT_ABOUT = """As an HR expert with experience in one of the following roles: Data Scientist, Web Developer, Big Data Engineer, or Data Analyst,
please evaluate the provided resume against the given job description. Assess how well the candidate’s qualifications match the job requirements,
and provide a detailed evaluation highlighting their strengths and weaknesses relative to the role."""

PROMPT_IMPROVE = """As a technical HR manager with expertise in one of the following roles: Data Scientist, Web Developer, Big Data Engineer, or Data Analyst,
review the provided resume in the context of the given job description. Offer insights on the candidate’s skills and qualifications from an HR perspective,
and provide recommendations for skill enhancement and areas for improvement to better align with the job requirements."""

PROMPT_MATCH = """As an ATS expert with in-depth knowledge of the following roles: Data Scientist, Web Developer, Big Data Engineer, or Data Analyst,
evaluate the provided resume against the job description. Provide a percentage score indicating how well the resume matches the job description,
followed by a list of missing keywords and any final thoughts or observations along with a match percentage of resume to job description."""

PROMPT_TAILOR = """You are a skilled ATS(Appliication Tracking System) comapatable resume writer with deep understanding of devops and generative ai field along with complete ATS functionality,
Your Task is to tailor the resume according to the job description and give me the resume the output should be as given resume format and it must match up to 95 percent of job description.
Also mention below what are the chnages you have made"""

PROMPT_GENERATE = """You are a skillled ATS(Appliication Tracking System) comapatable resume writer with deep understanding of Generative ai field along with complete ATS functionality,
Your task is to generate a job application ready resume according to the job description provided."""

ATSMode = Literal["about", "improve", "match", "tailor", "generate"]

class ATSResponse(BaseModel):
    mode: ATSMode
    resultText: str
    matchPercentage: Optional[float] = None
    missingKeywords: Optional[List[str]] = None

app = FastAPI(title="ATS API", version="1.0.0")

# CORS (optional if you use Next.js proxy in Step 7)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

def validate_jd(job_description: str):
    if not job_description or len(job_description.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description must be at least 20 characters")

async def read_pdf(resume: UploadFile) -> bytes:
    if resume.content_type not in ("application/pdf", "application/x-pdf"):
        raise HTTPException(status_code=400, detail="Only PDF allowed")
    content = await resume.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty PDF")
    return content

def pdf_first_page_part(pdf_bytes: bytes) -> dict:
    try:
        images = pdf2image.convert_from_bytes(pdf_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF convert failed. Poppler needed. {e}")

    first_page = images[0]
    buf = io.BytesIO()
    first_page.save(buf, format="JPEG")
    data = base64.b64encode(buf.getvalue()).decode("utf-8")

    return {"mime_type": "image/jpeg", "data": data}

def extract_match_percentage(text: str) -> Optional[float]:
    m = re.search(r"(\d+(?:\.\d+)?)\s*%", text)
    if m:
        return float(m.group(1))
    return None

def extract_missing_keywords(text: str) -> Optional[List[str]]:
    # best-effort extraction. If your response includes "missing keywords" section, this helps.
    lower = text.lower()
    idx = lower.find("missing keyword")
    if idx == -1:
        return None
    chunk = text[idx: idx + 600]
    # split by commas/new lines
    items = re.split(r"[,;\n•\-]+", chunk)
    cleaned = []
    for it in items:
        it = it.strip()
        if len(it) < 2:
            continue
        if "missing" in it.lower() or "keyword" in it.lower():
            continue
        cleaned.append(it)
    return cleaned[:30] if cleaned else None

def gemini_response(prompt_text: str, pdf_part: dict, job_description: str) -> str:
    model = genai.GenerativeModel(MODEL_NAME)
    # Match your original order: [prompt, resume_image, job_description]
    resp = model.generate_content([prompt_text, pdf_part, job_description])
    return resp.text or ""

def gemini_no_resume(prompt_text: str, job_description: str) -> str:
    model = genai.GenerativeModel(MODEL_NAME)
    resp = model.generate_content([prompt_text, job_description])
    return resp.text or ""

@app.post("/ats/about", response_model=ATSResponse)
async def about(job_description: str = Form(...), resume: UploadFile = File(...)):
    validate_jd(job_description)
    pdf_bytes = await read_pdf(resume)
    part = pdf_first_page_part(pdf_bytes)
    text = gemini_response(PROMPT_ABOUT, part, job_description)
    return ATSResponse(mode="about", resultText=text)

@app.post("/ats/improve", response_model=ATSResponse)
async def improve(job_description: str = Form(...), resume: UploadFile = File(...)):
    validate_jd(job_description)
    pdf_bytes = await read_pdf(resume)
    part = pdf_first_page_part(pdf_bytes)
    text = gemini_response(PROMPT_IMPROVE, part, job_description)
    return ATSResponse(mode="improve", resultText=text)

@app.post("/ats/match", response_model=ATSResponse)
async def match(job_description: str = Form(...), resume: UploadFile = File(...)):
    validate_jd(job_description)
    pdf_bytes = await read_pdf(resume)
    part = pdf_first_page_part(pdf_bytes)
    text = gemini_response(PROMPT_MATCH, part, job_description)
    return ATSResponse(
        mode="match",
        resultText=text,
        matchPercentage=extract_match_percentage(text),
        missingKeywords=extract_missing_keywords(text),
    )

@app.post("/ats/tailor", response_model=ATSResponse)
async def tailor(job_description: str = Form(...), resume: UploadFile = File(...)):
    validate_jd(job_description)
    pdf_bytes = await read_pdf(resume)
    part = pdf_first_page_part(pdf_bytes)
    text = gemini_response(PROMPT_TAILOR, part, job_description)
    return ATSResponse(mode="tailor", resultText=text)

@app.post("/ats/generate", response_model=ATSResponse)
async def generate(job_description: str = Form(...)):
    validate_jd(job_description)
    text = gemini_no_resume(PROMPT_GENERATE, job_description)
    return ATSResponse(mode="generate", resultText=text)
