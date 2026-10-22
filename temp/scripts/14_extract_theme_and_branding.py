import json
import os

mock_dir = "D:/aaaStuffsaaa/from_git/gitee/city-light-platform/temp/mock"
resp_file = os.path.join(mock_dir, "intercepted_responses.json")

with open(resp_file, "r", encoding="utf-8") as f:
    responses = json.load(f)

print("Searching theme & dictionary responses...")
for item in responses:
    url = item.get("url", "")
    body = item.get("body", "")
    if "themeSettings" in url:
        try:
            data = json.loads(body)
            with open(os.path.join(mock_dir, "themeSettings.json"), "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print("Saved themeSettings.json:", data.get("data", {}))
        except Exception as e:
            print("themeSettings error:", e)

    if "dictionaryType/all" in url:
        try:
            data = json.loads(body)
            with open(os.path.join(mock_dir, "dictionaryTypes.json"), "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print("Saved dictionaryTypes.json (count:", len(data.get("data", [])), ")")
        except Exception as e:
            pass
