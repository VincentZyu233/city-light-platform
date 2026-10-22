import json
import os

with open("D:/aaaStuffsaaa/from_git/gitee/city-light-platform/temp/mock/intercepted_requests.json", "r", encoding="utf-8") as f:
    reqs = json.load(f)

for r in reqs:
    if "userInfo" in r["url"]:
        print("userInfo headers:")
        for k, v in r["headers"].items():
            if any(auth_term in k.lower() for auth_term in ["token", "auth", "cookie"]):
                print(f"  {k}: {v[:50]}...")
