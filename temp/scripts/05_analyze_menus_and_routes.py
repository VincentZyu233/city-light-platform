import json
import os

mock_dir = "D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock"
resp_file = os.path.join(mock_dir, "intercepted_responses.json")

with open(resp_file, "r", encoding="utf-8") as f:
    responses = json.load(f)

print(f"Total responses intercepted: {len(responses)}")

menus = None
user_info = None

for item in responses:
    url = item.get("url", "")
    body = item.get("body", "")
    
    if "system/api/current/mainMenu" in url:
        try:
            menus = json.loads(body)
            with open(os.path.join(mock_dir, "mainMenu.json"), "w", encoding="utf-8") as mf:
                json.dump(menus, mf, ensure_ascii=False, indent=2)
            print("Successfully extracted mainMenu.json!")
        except Exception as e:
            print(f"Error parsing mainMenu: {e}")
            
    if "system/api/userInfo" in url:
        try:
            user_info = json.loads(body)
            with open(os.path.join(mock_dir, "userInfo.json"), "w", encoding="utf-8") as uf:
                json.dump(user_info, uf, ensure_ascii=False, indent=2)
            print("Successfully extracted userInfo.json!")
        except Exception as e:
            print(f"Error parsing userInfo: {e}")

if menus:
    print("\n=== Top-level and Sub-menus Structure ===")
    data = menus.get("data", [])
    if isinstance(data, list):
        for idx, m in enumerate(data):
            name = m.get("name") or m.get("title") or m.get("menuName") or m.get("label")
            path = m.get("path") or m.get("url") or m.get("route")
            children = m.get("children") or []
            print(f"[{idx+1}] {name} ({path}) - {len(children)} children")
            for cidx, c in enumerate(children):
                cname = c.get("name") or c.get("title") or c.get("menuName") or c.get("label")
                cpath = c.get("path") or c.get("url")
                subchildren = c.get("children") or []
                print(f"    ├── [{idx+1}.{cidx+1}] {cname} ({cpath}) {f'[{len(subchildren)} sub]' if subchildren else ''}")
                for sidx, s in enumerate(subchildren):
                    sname = s.get("name") or s.get("title") or s.get("menuName") or s.get("label")
                    spath = s.get("path") or s.get("url")
                    print(f"        ├── [{idx+1}.{cidx+1}.{sidx+1}] {sname} ({spath})")
