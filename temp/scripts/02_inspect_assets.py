import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            return resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return f"Error: {e}"

config_js = fetch("https://b.iots.city/static/config.js")
print("=== static/config.js ===")
print(config_js[:2000])

with open("D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock/config.js", "w", encoding="utf-8") as f:
    f.write(config_js)
