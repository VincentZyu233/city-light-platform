import os
import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()
    
    page.goto("https://b.iots.city/#/login")
    time.sleep(2)
    
    page.locator("input[placeholder='输入账号']").fill("yewenlai")
    page.locator("input[placeholder='输入密码']").fill("Yewenlai@2026")
    page.locator("button:has-text('登录')").first.click()
    
    time.sleep(5)
    
    # Check localStorage and sessionStorage
    storage = page.evaluate("() => ({ local: {...localStorage}, session: {...sessionStorage} })")
    print("Storage keys:")
    print("  Local:", list(storage["local"].keys()))
    print("  Session:", list(storage["session"].keys()))
    
    # Check current route and body text snippet
    print("Current URL:", page.url)
    print("Body text snippet (300 chars):")
    print(page.inner_text("body")[:300])
    
    # Now try clicking on menu instead of goto hash
    menu_items = page.query_selector_all(".el-menu-item, .el-submenu__title, .menu-item, li")
    print(f"Found {len(menu_items)} menu candidates")
    for m in menu_items[:15]:
        t = m.inner_text().strip()
        if t:
            print("  Menu text:", repr(t))

    browser.close()
