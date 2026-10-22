import os
import time
from playwright.sync_api import sync_playwright

output_dir = "D:/aaaStuffsaaa/from_git/gitee/city-light-platform/temp/mock/live_verification"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    url = "https://vincentzyu233.github.io/city-light-platform/"
    print(f"Navigating to live page: {url}")
    page.goto(url, wait_until="networkidle")
    time.sleep(3)
    
    screenshot_path = os.path.join(output_dir, "01_live_overview.png")
    page.screenshot(path=screenshot_path)
    print(f"Saved: {screenshot_path}")
    
    # Click to monitor tab
    page.locator("button:has-text('极夜数字孪生')").click()
    time.sleep(2)
    screenshot_path2 = os.path.join(output_dir, "02_live_monitor.png")
    page.screenshot(path=screenshot_path2)
    print(f"Saved: {screenshot_path2}")

    # Click to assets tab
    page.locator("button:has-text('资产矩阵')").click()
    time.sleep(2)
    screenshot_path3 = os.path.join(output_dir, "03_live_assets.png")
    page.screenshot(path=screenshot_path3)
    print(f"Saved: {screenshot_path3}")

    browser.close()
