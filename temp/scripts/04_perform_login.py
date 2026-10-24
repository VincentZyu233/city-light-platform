import os
import time
import json
from playwright.sync_api import sync_playwright

output_dir = "D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock"
api_log_dir = os.path.join(output_dir, "apis")
os.makedirs(api_log_dir, exist_ok=True)

intercepted_requests = []
intercepted_responses = []

def on_request(request):
    # Log interesting API requests
    url = request.url
    if not any(ext in url for ext in [".js", ".css", ".png", ".jpg", ".woff", ".ttf", ".svg", ".ico"]):
        try:
            intercepted_requests.append({
                "url": url,
                "method": request.method,
                "headers": request.headers,
                "post_data": request.post_data
            })
            print(f"[REQ] {request.method} {url}")
        except Exception as e:
            pass

def on_response(response):
    url = response.url
    if not any(ext in url for ext in [".js", ".css", ".png", ".jpg", ".woff", ".ttf", ".svg", ".ico"]):
        try:
            content_type = response.headers.get("content-type", "")
            body_text = ""
            if "application/json" in content_type or "text" in content_type:
                try:
                    body_text = response.text()
                except:
                    body_text = "<could not read text>"
            
            intercepted_responses.append({
                "url": url,
                "status": response.status,
                "headers": response.headers,
                "body": body_text[:5000] # truncate if huge
            })
            print(f"[RESP] {response.status} {url} (length: {len(body_text)})")
        except Exception as e:
            pass

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    page.on("request", on_request)
    page.on("response", on_response)
    
    print("Navigating to https://b.iots.city/...")
    page.goto("https://b.iots.city/", wait_until="networkidle")
    time.sleep(2)
    
    # Fill username and password
    print("Filling credentials...")
    username_input = page.locator("input[placeholder='输入账号']")
    password_input = page.locator("input[placeholder='输入密码']")
    
    username_input.fill("yewenlai")
    password_input.fill("Yewenlai@2026")
    
    time.sleep(1)
    
    # Click first login button
    print("Clicking login button...")
    login_btn = page.locator("button:has-text('登录')").first
    login_btn.click()
    
    # Wait for navigation or network idle
    print("Waiting after login...")
    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except Exception as e:
        print("Wait networkidle timed out, proceeding...")
        
    time.sleep(5)
    
    current_url = page.url
    print(f"Current URL: {current_url}")
    
    screenshot_path = os.path.join(output_dir, "02_after_login.png")
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")
    
    # Save intercepted traffic
    with open(os.path.join(output_dir, "intercepted_requests.json"), "w", encoding="utf-8") as f:
        json.dump(intercepted_requests, f, ensure_ascii=False, indent=2)
    with open(os.path.join(output_dir, "intercepted_responses.json"), "w", encoding="utf-8") as f:
        json.dump(intercepted_responses, f, ensure_ascii=False, indent=2)
        
    # Check DOM info
    page_title = page.title()
    print(f"Page title: {page_title}")
    
    # Dump full html
    with open(os.path.join(output_dir, "dashboard_page.html"), "w", encoding="utf-8") as f:
        f.write(page.content())
        
    browser.close()
