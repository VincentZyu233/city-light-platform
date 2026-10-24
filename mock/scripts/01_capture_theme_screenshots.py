import os
import sys
import time
import threading
import http.server
import socketserver
from playwright.sync_api import sync_playwright

MOCK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST_DIR = os.path.join(MOCK_DIR, "dist")
SCREENSHOTS_DIR = os.path.join(MOCK_DIR, "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

PORT = 9527

class SilentHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass # suppress server logs

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SilentHTTPRequestHandler) as httpd:
        httpd.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1)

TARGET_URL = f"http://localhost:{PORT}/index.html"
AUTH_SESSION_JS = "JSON.stringify({ username: 'admin', authenticatedAt: Date.now() })"
print(f"Local static server running at: {TARGET_URL}")
print(f"Output screenshots directory: {SCREENSHOTS_DIR}")

PAGES_CONFIG = [
    {
        "prefix": "01_overview",
        "title": "态势感知看板",
        "action": lambda page: page.locator("button:has-text('态势感知')").first.click(),
    },
    {
        "prefix": "02_monitor",
        "title": "极夜数字孪生大屏",
        "action": lambda page: page.locator("button:has-text('极夜数字孪生')").first.click(),
    },
    {
        "prefix": "03_assets",
        "title": "资产矩阵高密数据表",
        "action": lambda page: page.locator("button:has-text('资产矩阵')").first.click(),
    },
    {
        "prefix": "04_lighting",
        "title": "光网时序调控",
        "action": lambda page: page.locator("button:has-text('光网时序调控')").first.click(),
    },
    {
        "prefix": "05_incidents",
        "title": "告警与运维工单",
        "action": lambda page: page.locator("button:has-text('告警与运维')").first.click(),
    },
]

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()

    print(f"Loading page: {TARGET_URL}...")
    page.goto(TARGET_URL, wait_until="networkidle")
    page.evaluate("localStorage.removeItem('topstar_auth'); localStorage.removeItem('topstar_auth_session'); localStorage.removeItem('topstar_theme'); location.reload()")
    page.wait_for_load_state("networkidle")
    time.sleep(1)

    # Function to set theme
    def set_theme(theme: str):
        if theme == "white":
            page.locator("button[title='浅色模式'], button[title='浅色']").first.click()
        elif theme == "dark":
            page.locator("button[title='深色模式'], button[title='深色']").first.click()
        time.sleep(0.5)

    # 0. Capture the login page in both themes
    print("\n[Page] 登录页 (00_login)")
    login_dark = os.path.join(SCREENSHOTS_DIR, "00_login_dark.png")
    page.screenshot(path=login_dark)
    print(f"  ✓ Saved: {os.path.basename(login_dark)}")

    set_theme("white")
    login_white = os.path.join(SCREENSHOTS_DIR, "00_login_white.png")
    page.screenshot(path=login_white)
    print(f"  ✓ Saved: {os.path.basename(login_white)}")

    # Inject the mock session so the dashboard can be captured.
    page.evaluate(f"localStorage.setItem('topstar_auth', {AUTH_SESSION_JS}); localStorage.setItem('topstar_theme', 'dark'); location.reload()")
    page.wait_for_load_state("networkidle")
    page.locator("button:has-text('态势感知')").first.wait_for()
    time.sleep(0.8)

    # 1. Capture the 5 main pages in both White and Dark
    for cfg in PAGES_CONFIG:
        prefix = cfg["prefix"]
        title = cfg["title"]
        print(f"\n[Page] {title} ({prefix})")
        
        # Navigate to the page
        cfg["action"](page)
        time.sleep(0.8)

        # White mode
        set_theme("white")
        white_path = os.path.join(SCREENSHOTS_DIR, f"{prefix}_white.png")
        page.screenshot(path=white_path)
        print(f"  ✓ Saved: {os.path.basename(white_path)}")

        # Dark mode
        set_theme("dark")
        dark_path = os.path.join(SCREENSHOTS_DIR, f"{prefix}_dark.png")
        page.screenshot(path=dark_path)
        print(f"  ✓ Saved: {os.path.basename(dark_path)}")

    # 2. Capture 06_command_k (⌘K Global Command Palette) in White and Dark
    print(f"\n[State] ⌘K 全局搜索 (06_command_k)")
    set_theme("white")
    page.keyboard.press("Control+k")
    time.sleep(0.5)
    cmd_white = os.path.join(SCREENSHOTS_DIR, "06_command_k_white.png")
    page.screenshot(path=cmd_white)
    print(f"  ✓ Saved: {os.path.basename(cmd_white)}")
    page.keyboard.press("Escape")
    time.sleep(0.3)

    set_theme("dark")
    page.keyboard.press("Control+k")
    time.sleep(0.5)
    cmd_dark = os.path.join(SCREENSHOTS_DIR, "06_command_k_dark.png")
    page.screenshot(path=cmd_dark)
    print(f"  ✓ Saved: {os.path.basename(cmd_dark)}")
    page.keyboard.press("Escape")
    time.sleep(0.3)

    # 3. Capture 07_sidebar_collapsed in White and Dark
    print(f"\n[State] 侧边栏折叠态 (07_sidebar_collapsed)")
    # Collapse sidebar
    page.locator("button[title='收起侧边栏']").first.click()
    time.sleep(0.5)

    # Switch back to overview
    page.locator("button[title='态势感知']").first.click()
    time.sleep(0.5)

    set_theme("white")
    sc_white = os.path.join(SCREENSHOTS_DIR, "07_sidebar_collapsed_white.png")
    page.screenshot(path=sc_white)
    print(f"  ✓ Saved: {os.path.basename(sc_white)}")

    set_theme("dark")
    sc_dark = os.path.join(SCREENSHOTS_DIR, "07_sidebar_collapsed_dark.png")
    page.screenshot(path=sc_dark)
    print(f"  ✓ Saved: {os.path.basename(sc_dark)}")

    browser.close()

print("\n🎉 All 8 pairs of screenshots (16 images total) have been captured successfully!")
