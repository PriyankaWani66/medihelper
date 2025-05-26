from fastapi import APIRouter, UploadFile, File, HTTPException
import requests
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

@router.post("/api/transcribe-voice")
async def transcribe_audio(audio: UploadFile = File(...)):
    api_key = os.getenv("DEEPGRAM_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Deepgram API key not set.")

    headers = {
        "Authorization": f"Token {api_key}",
        "Content-Type": audio.content_type,
    }

    audio_bytes = await audio.read()

    response = requests.post(
        "https://api.deepgram.com/v1/listen",
        headers=headers,
        data=audio_bytes
    )

    if response.status_code != 200:
        print(response.text)
        raise HTTPException(status_code=500, detail="Transcription failed.")

    transcript = (
        response.json()
        .get("results", {})
        .get("channels", [{}])[0]
        .get("alternatives", [{}])[0]
        .get("transcript", "")
    )

    return {"transcript": transcript}
