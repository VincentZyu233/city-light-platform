import os
import time
from playwright.sync_api import sync_playwright

output_dir = "D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock/screenshots_real"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    print("Navigating to login page...")
    page.goto("https://b.iots.city/#/login")
    time.sleep(2)
    
    page.locator("input[placeholder='输入账号']").fill("yewenlai")
    page.locator("input[placeholder='输入密码']").fill("Yewenlai@2026")
    page.locator("button:has-text('登录')").first.click()
    time.sleep(5)
    
    print("Logged in, current URL:", page.url)
    page.screenshot(path=os.path.join(output_dir, "01_workbench.png"))
    
    # Test setting hash without reloading
    modules = [
        ("02_csmb", "#/csmb"),
        ("03_pole", "#/assetsManagement/vehicleManagement/pole"),
        ("04_fix_map", "#/assetsManagement/deviceFixMap"),
        ("05_box", "#/assetsManagement/vehicleManagement/box"),
        ("06_lighting", "#/lightingManage"),
        ("07_alarm", "#/operation/alarmManageNew/deviceAlarm"),
        ("08_report", "#/analysis/statisticalReport"),
        ("09_admin_users", "#/admin/users")
    ]
    
    for name, h in modules:
        print(f"\nNavigating via hash change to: {h}")
        page.evaluate(f"window.location.hash = '{h}'")
        time.sleep(4)
        print("Now URL:", page.url)
        page.screenshot(path=os.path.join(output_dir, f"{name}.png"))
        
        # Also check page title and some visible text
        text_snippet = page.inner_text("body")[:150].replace("\n", " ")
        print(f"Content snippet: {text_snippet}")

    browser.close()
