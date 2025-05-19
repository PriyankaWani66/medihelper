import os
import fitz      # PyMuPDF
from docx import Document

def extract_text(path: str) -> str:
    """
    Load a PDF, DOCX, or TXT file and return all of its text as one string.
    """
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return _extract_pdf(path)
    elif ext in (".docx", ".doc"):
        return _extract_docx(path)
    elif ext == ".txt":
        return _extract_txt(path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

def _extract_pdf(path: str) -> str:
    doc = fitz.open(path)
    return "\n".join(page.get_text() for page in doc).strip()

def _extract_docx(path: str) -> str:
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs).strip()

def _extract_txt(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read().strip()