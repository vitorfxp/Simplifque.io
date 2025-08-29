
import sys
import os

# Adiciona o diretório pai (Backend) ao Python Path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from dotenv import load_dotenv
load_dotenv()  # Carrega variáveis do .env


from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from fastapi.responses import StreamingResponse, JSONResponse 
from typing import Optional, List, Dict, Any 
from app.services.ia import chat_completion, transcribe_audio, synthesize_speech 
from app.services.pdf import summarize_pdf
from app.services.links import check_link_safety 


app = FastAPI(title="Voz amiga API", version="0.1.0")


app.add_middleware (
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"ok": True, "name": "Voz Amiga API"}

#criando chat com a ia 

@app.post("/chat")
async def chat(payload: Dict[str, Any]):
    message: str = payload.get("mensagem", "").strip()
    history: Optional[List[Dict[str, str]]] = payload.get("historico")
    system: Optional[str] = payload.get("sistema")
    if not message:
        raise HTTPException(400, detail="Campo 'mensagem' é orbigatório.")
    reply = await chat_completion(message, history=history, system=system)
    return{"Resposta": reply}

#criando Speech-to-text, funçao para fala em texto

@app.post("/stt")
async def stt(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(400, detail="Envie um arquivo de áudio.")
    text = await transcribe_audio(file)
    return {"texto": text}

#criando a função contraria da de cima

@app.post("/tts")
async def tts(text: str = Form(...)):
    audio_iter = await synthesize_speech(text)
    if audio_iter is None:
        raise HTTPException(503, detail="TTS não configurado (ELEVEN_API_KEY ausente).")
    return StreamingResponse(audio_iter, media_type="audio/mpeg")

# faz um resumo de um pdf 

@app.post("/pdf/summarize")
async def pdf_summarize(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, detail="Envie um arquivo .pdf")
    result = await summarize_pdf(file)
    return result

# Checagem de link
@app.post("/link/check")
async def link_check(payload: Dict[str, Any]):
    url = payload.get("url", "").strip()
    if not url:
        raise HTTPException(400, detail="Campo 'url' é obrigatório.")
    result = await check_link_safety(url)
    return JSONResponse(result)
