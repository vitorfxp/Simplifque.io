import os
import io
from typing import List, Dict, Optional
from openai import OpenAI
import math


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


DEFAULT_SYSTEM = (
"Você é uma assistente que explica tudo de forma simples, com frases curtas,"
" exemplos concretos e linguagem acessível para pessoas idosas, com baixa visão"
" ou com alfabetização em progresso. Evite jargões."
)

async def chat_completion(message: str, history: Optional[List[Dict[str, str]]] = None, system: Optional[str] = None) -> str:
    messages: List[Dict[str, str]] = []
    messages.append({"role": "system", "content": system or DEFAULT_SYSTEM})
    if history:
# history deve ser uma lista de {role: "user"|"assistant", content: "..."}
        messages.extend(history)
    messages.append({"role": "user", "content": message})

    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=messages,
        temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.3")),
    )
    return resp.choices[0].message.content

# Whisper (STT)
async def transcribe_audio(file) -> str:
# FastAPI UploadFile → precisamos enviar um stream para a API
# A API aceita bytes, então lemos o arquivo recebido.
    data = await file.read()
    file_obj = io.BytesIO(data)
    file_obj.name = file.filename


    tr = client.audio.transcriptions.create(
        model=os.getenv("WHISPER_MODEL", "whisper-1"),
        file=(file.filename, file_obj),
        response_format="text",
    )
    return tr


# ElevenLabs (TTS)
async def synthesize_speech(text: str):
    api_key = os.getenv("ELEVEN_API_KEY")
    voice_id = os.getenv("ELEVEN_VOICE_ID", "21m00Tcm4TlvDq8ikWAM") # padrão de exemplo
    if not api_key:
        return None


    import httpx

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "accept": "audio/mpeg",
        "content-type": "application/json",
    }
    payload = {
        "text": text,
        "model_id": os.getenv("ELEVEN_MODEL", "eleven_multilingual_v2"),
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.5},
    }


    client_http = httpx.AsyncClient(timeout=60)
    resp = await client_http.post(url, headers=headers, json=payload)
    resp.raise_for_status()


    async def streamer():
        async for chunk in resp.aiter_bytes():
            yield chunk
        await client_http.aclose()


    return streamer()