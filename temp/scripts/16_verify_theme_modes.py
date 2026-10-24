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
    
    # 1. Click Light mode button
    print("Testing Light mode...")
    page.locator("button[title='白天模式']").first.click()
    time.sleep(2)
    p_light = os.path.join(output_dir, "07_theme_light.png")
    page.screenshot(path=p_light)
    print(f"Saved light mode screenshot: {p_light}")

    # Also test Monitor view in Light mode
    page.locator("button:has-text('极夜数字孪生')").first.click()
    time.sleep(2)
    p_light_mon = os.path.join(output_dir, "08_theme_light_monitor.png")
    page.screenshot(path=p_light_mon)
    print(f"Saved light mode monitor screenshot: {p_light_mon}")

    # 2. Click Dark mode button
    print("Testing Dark mode...")
    page.locator("button[title='黑夜模式']").first.click()
    time.sleep(2)
    p_dark = os.path.join(output_dir, "09_theme_dark.png")
    page.screenshot(path=p_dark)
    print(f"Saved dark mode screenshot: {p_dark}")

    # 3. Click System mode button
    print("Testing System mode...")
    page.locator("button[title='跟随系统 (默认)']").first.click()
    time.sleep(1)
    
    # Check localStorage value
    stored_mode = page.evaluate("() => localStorage.getItem('topstar_theme')")
    print(f"Stored theme mode in localStorage: {stored_mode}")

    browser.close()
