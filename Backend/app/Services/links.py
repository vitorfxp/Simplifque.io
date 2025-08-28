import re
import os
from typing import Dict
import httpx


SUSPICIOUS_PATTERNS = [
    r"@", # e-mails em vez de domínios
    r"\d+\.\d+\.\d+\.\d+", # IP numérico
    r"(?i)free|bonus|win|gift|click", # iscas comuns
    r"(?i)login|verify|account|bank",
]


async def check_link_safety(url: str) -> Dict:
    result = {
        "url": url,
        "is_valid_format": True,
        "suspicious_signals": [],
        "virustotal": None,
        "safe_overall": True,
    }


# Validação simples
    if not re.match(r"^https?://", url):
        result["is_valid_format"] = False
        result["safe_overall"] = False
        return result


    for pat in SUSPICIOUS_PATTERNS:
        if re.search(pat, url):
            result["suspicious_signals"].append(pat)


        # VirusTotal opcional
    vt_key = os.getenv("VT_API_KEY")
    if vt_key:
        async with httpx.AsyncClient(timeout=20) as client:
        # 1) enviar URL para análise
        r = await client.post(
            "https://www.virustotal.com/api/v3/urls",
            headers={"x-apikey": vt_key},
             data={"url": url},
        )
        r.raise_for_status()
        analysis_id = r.json()["data"]["id"]


# 2) buscar resultado
        r2 = await client.get(
            f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
            headers={"x-apikey": vt_key},
        )
        r2.raise_for_status()
        vt = r2.json()
        result["virustotal"] = vt
        stats = vt.get("data", {}).get("attributes", {}).get("stats", {})
        malicious = stats.get("malicious", 0)
        result["safe_overall"] = malicious == 0 and len(result["suspicious_signals"]) == 0


    else:
# Sem VT, usa só heurísticas
        result["safe_overall"] = len(result["suspicious_signals"]) == 0


    return result