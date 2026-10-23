import os
import time
from playwright.sync_api import sync_playwright

output_dir = "D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock/live_verification"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    url = "https://vincentzyu233.github.io/topstar-smart-lighting-saas/"
    print(f"Navigating to live page: {url}")
    page.goto(url, wait_until="networkidle")
    time.sleep(3)
    
    # 1. Expanded sidebar
    p1 = os.path.join(output_dir, "04_sidebar_expanded.png")
    page.screenshot(path=p1)
    print(f"Saved expanded screenshot: {p1}")
    
    # 2. Toggle collapse
    page.locator("button[title='收起侧边栏']").first.click()
    time.sleep(1)
    p2 = os.path.join(output_dir, "05_sidebar_collapsed.png")
    page.screenshot(path=p2)
    print(f"Saved collapsed screenshot: {p2}")

    # 3. Open monitor view while collapsed
    page.locator("button[title='极夜数字孪生']").first.click()
    time.sleep(2)
    p3 = os.path.join(output_dir, "06_sidebar_collapsed_monitor.png")
    page.screenshot(path=p3)
    print(f"Saved collapsed monitor view: {p3}")

    browser.close()
