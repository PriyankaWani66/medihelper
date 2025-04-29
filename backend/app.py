import os
import tempfile
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from extractor import extract_text
from summarizer import summarize_with_snowflake

app = FastAPI(title="HealthSnap Summarizer API")

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
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    try:
        summary = summarize_with_snowflake(text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize-file")
async def summarize_file(file: UploadFile = File(...)):
    # Write the uploaded file out to a temp file
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        tmp.write(await file.read())

    try:
        # 1) extract text from whatever format
        text = extract_text(tmp_path)
        # 2) send it off to Snowflake
        summary = summarize_with_snowflake(text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temp file
        try:
            os.remove(tmp_path)
        except OSError:
            pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
