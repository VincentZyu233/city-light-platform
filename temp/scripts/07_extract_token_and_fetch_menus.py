import json
import urllib.request
import ssl

with open("D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock/intercepted_requests.json", "r", encoding="utf-8") as f:
    reqs = json.load(f)

token = None
for r in reqs:
    auth = r.get("headers", {}).get("authorization")
    if auth and auth.startswith("bearer "):
        token = auth
        break

print("Extracted Token:", token[:50] + "..." if token else "Not found")

if token:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(
        "https://b.iots.city/system/api/current/mainMenu",
        headers={
            "User-Agent": "Mozilla/5.0",
            "Authorization": token
        }
    )
    with urllib.request.urlopen(req, context=ctx) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        with open("D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock/mainMenu_full.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Successfully saved full mainMenu_full.json!")
        
        # Print summary of modules
        items = data.get("data", [])
        print(f"Total top-level menus: {len(items)}")
        for idx, item in enumerate(items):
            title = item.get("meta", {}).get("title") or item.get("name")
            path = item.get("path")
            children = item.get("children", [])
            print(f"[{idx+1}] {title} ({path}) - {len(children)} sub-items")
            for cidx, c in enumerate(children):
                ctitle = c.get("meta", {}).get("title") or c.get("name")
                cpath = c.get("path")
                subchildren = c.get("children", [])
                print(f"    ├── [{idx+1}.{cidx+1}] {ctitle} ({cpath}) {f'[{len(subchildren)} items]' if subchildren else ''}")
                for sidx, s in enumerate(subchildren):
                    stitle = s.get("meta", {}).get("title") or s.get("name")
                    spath = s.get("path")
                    print(f"        ├── [{idx+1}.{cidx+1}.{sidx+1}] {stitle} ({spath})")
