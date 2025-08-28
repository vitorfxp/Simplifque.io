import io
import os
from typing import Dict
import fitz # PyMuPDF
from openai import OpenAI


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# Limita tokens aproximando por caracteres; ajuste se necessário
MAX_CHARS = 6000


async def summarize_pdf(file) -> Dict:
    raw = await file.read()
    doc = fitz.open(stream=raw, filetype="pdf")


# Extrai texto (simples). Caso precise, troque por heurísticas por página.
    full_text = []
    for page in doc:
        t = page.get_text("text").strip()
        if t:
            full_text.append(t)
    text = "\n\n".join(full_text)


    if not text:
        return {"resumo": "Não foi possível extrair texto do PDF.", "tokens_aprox": 0}


# Se muito grande, corta em blocos e pede resumo por partes
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + MAX_CHARS, len(text))
        chunks.append(text[start:end])
        start = end


    partial_summaries = []
    for i, chunk in enumerate(chunks):
        prompt = (
        "Resuma o trecho abaixo em linguagem muito simples e direta, com tópicos e exemplos práticos quando possível.\n\n" + chunk
        )
        r = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        partial_summaries.append(r.choices[0].message.content)


# Resumo final dos resumos
    final_prompt = "Junte os resumos abaixo em um resumo final claro e curto, com no máximo 10 tópicos.\n\n" + "\n\n".join(partial_summaries)
    final = client.chat.completions.create(
    model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
    messages=[{"role": "user", "content": final_prompt}],
    temperature=0.2,
    )


    return {
        "resumo": final.choices[0].message.content,
        "paginas": doc.page_count,
        "tokens_aprox": len(text),
    }