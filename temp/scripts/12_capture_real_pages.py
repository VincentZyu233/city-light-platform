import os
import time
from playwright.sync_api import sync_playwright

output_dir = "D:/aaaStuffsaaa/from_git/gitee/topstar-smart-lighting-saas/temp/mock/screenshots_real"
os.makedirs(output_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    print("Logging in...")
    page.goto("https://b.iots.city/#/login")
    time.sleep(2)
    page.locator("input[placeholder='输入账号']").fill("yewenlai")
    page.locator("input[placeholder='输入密码']").fill("Yewenlai@2026")
    page.locator("button:has-text('登录')").first.click()
    time.sleep(5)
    
    user_url = page.url
    print("Logged in, base url:", user_url)
    base_prefix = user_url.split("#")[0]
    
    # Take screenshot of workbench
    page.screenshot(path=os.path.join(output_dir, "01_workbench.png"))
    print("Captured 01_workbench.png")
    
    targets = [
        ("02_display_center_csmb", "#/csmb"),
        ("03_assets_pole", "#/assetsManagement/vehicleManagement/pole"),
        ("04_device_fix_map", "#/assetsManagement/deviceFixMap"),
        ("05_assets_box", "#/assetsManagement/vehicleManagement/box"),
        ("06_assets_iot", "#/assetsManagement/iotDevicesManagement"),
        ("07_lighting_manage", "#/lightingManage"),
        ("08_alarm_device", "#/operation/alarmManageNew/deviceAlarm"),
        ("09_order_todo", "#/operation/orderManage/Todo"),
        ("10_analysis_report", "#/analysis/statisticalReport"),
        ("11_admin_users", "#/admin/users"),
        ("12_admin_region", "#/admin/region"),
    ]
    
    for name, hash_route in targets:
        full_url = f"{base_prefix}{hash_route}"
        print(f"Navigating to {name}: {full_url}")
        try:
            page.goto(full_url, wait_until="networkidle", timeout=12000)
        except Exception as e:
            print("  Timeout or notice:", e)
        time.sleep(4)
        
        path = os.path.join(output_dir, f"{name}.png")
        page.screenshot(path=path)
        print(f"  Saved {name}.png, title: {page.title()}, actual url: {page.url}")

    browser.close()
