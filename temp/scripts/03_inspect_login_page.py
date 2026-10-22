import os
import time
from playwright.sync_api import sync_playwright

output_dir = "D:/aaaStuffsaaa/from_git/gitee/city-light-platform/temp/mock"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    print("Navigating to https://b.iots.city/...")
    page.goto("https://b.iots.city/", wait_until="networkidle")
    
    time.sleep(2)
    screenshot_path = os.path.join(output_dir, "01_login_page.png")
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")
    
    html = page.content()
    with open(os.path.join(output_dir, "login_page.html"), "w", encoding="utf-8") as f:
        f.write(html)
        
    # Check for inputs
    inputs = page.query_selector_all("input")
    print(f"Found {len(inputs)} inputs:")
    for idx, inp in enumerate(inputs):
        inp_type = inp.get_attribute("type")
        inp_ph = inp.get_attribute("placeholder")
        inp_name = inp.get_attribute("name")
        inp_class = inp.get_attribute("class")
        print(f"  [{idx}] type={inp_type}, placeholder={inp_ph}, name={inp_name}, class={inp_class}")
        
    buttons = page.query_selector_all("button")
    print(f"Found {len(buttons)} buttons:")
    for idx, btn in enumerate(buttons):
        print(f"  [{idx}] text={btn.inner_text().strip()}, class={btn.get_attribute('class')}")

    browser.close()
