import os
import time
from playwright.sync_api import sync_playwright

output_dir = "D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock/screenshots"
os.makedirs(output_dir, exist_ok=True)

routes_to_visit = [
    ("01_workbench", "#/workTable"),
    ("02_display_center_csmb", "#/csmb"),
    ("03_pole_management", "#/assetsManagement/vehicleManagement/pole"),
    ("04_device_fix_map", "#/assetsManagement/deviceFixMap"),
    ("05_lighting_manage", "#/lightingManage"),
    ("06_device_alarm", "#/operation/alarmManageNew/deviceAlarm"),
    ("07_order_todo", "#/operation/orderManage/Todo"),
    ("08_statistical_report", "#/analysis/statisticalReport"),
    ("09_admin_users", "#/admin/users"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    print("Navigating to login page...")
    page.goto("https://b.iots.city/#/login", wait_until="networkidle")
    time.sleep(2)
    
    page.locator("input[placeholder='输入账号']").fill("yewenlai")
    page.locator("input[placeholder='输入密码']").fill("Yewenlai@2026")
    page.locator("button:has-text('登录')").first.click()
    
    time.sleep(5)
    print("Logged in, current URL:", page.url)
    
    for name, r in routes_to_visit:
        target_url = f"https://b.iots.city/{r}"
        print(f"\nVisiting: {name} -> {target_url}")
        try:
            page.goto(target_url, wait_until="networkidle", timeout=15000)
        except Exception as e:
            print(f"Goto wait timeout or warning: {e}")
        time.sleep(3) # allow charts/maps to render
        
        path = os.path.join(output_dir, f"{name}.png")
        page.screenshot(path=path)
        print(f"Saved screenshot: {path}")

    browser.close()
