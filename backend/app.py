import os
import tempfile
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from extractor import extract_text
from summarizer import summarize_with_snowflake, ask_with_snowflake
from voice_api import router as voice_router



app = FastAPI(title="HealthSnap Summarizer API")

app.include_router(voice_router)

# Allow your React front-end to call these endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/summarize-text")
async def summarize_text(payload: dict):
    text = payload.get("note")
    lang = payload.get("lang", "English")
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    try:
        summary = summarize_with_snowflake(text, lang)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/summarize-file")
async def summarize_file(file: UploadFile = File(...), lang: str = "English"):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        tmp.write(await file.read())

    try:
        text = extract_text(tmp_path)
        summary = summarize_with_snowflake(text, lang)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        try:
            os.remove(tmp_path)
        except OSError:
            pass


@app.post("/api/ask")
async def ask_question(request: Request):
    data = await request.json()
    note = data.get("note", "")
    question = data.get("question", "")

    if not note or not question:
        raise HTTPException(status_code=400, detail="Missing note or question")

    try:
        answer = ask_with_snowflake(note, question)
        return {"answer": answer}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to answer the question")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)