import urllib.request
import ssl
import json

url = "https://b.iots.city/"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    url,
    headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
)

try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print("Status code:", resp.status)
        print("Headers:", dict(resp.headers))
        print("HTML snippet (first 1000 chars):")
        print(html[:1000])
        
        with open("D:/aaaStuffsaaa/from_git/gitee/city-light-platform/temp/mock/initial_index.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("Saved to initial_index.html")
except Exception as e:
    print("Error:", e)
