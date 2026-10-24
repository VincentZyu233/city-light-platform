import http.server
import os
import socketserver
import threading
import time

from playwright.sync_api import sync_playwright

MOCK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DIST_DIR = os.path.join(MOCK_DIR, "dist")
SCREENSHOTS_DIR = os.path.join(MOCK_DIR, "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

PORT = 9527
AUTH_SESSION_JS = "JSON.stringify({ username: 'admin', authenticatedAt: Date.now() })"


class SilentHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def log_message(self, format, *args):
        pass


def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SilentHTTPRequestHandler) as httpd:
        httpd.serve_forever()


PAGES_CONFIG = [
    ("01_home", "运营总览", "/"),
    ("02_big_screen", "可视化大屏", "/big-screen"),
    ("03_projects", "项目列表", "/projects/list"),
    ("04_stations", "场站管理", "/projects/stations"),
    ("05_device_types", "设备类型", "/devices/types"),
    ("06_device_models", "设备型号", "/devices/models"),
    ("07_device_list", "设备列表", "/devices/list"),
    ("08_device_deployments", "设备部署", "/devices/deployments"),
    ("09_realtime", "实时监控", "/monitoring/realtime"),
    ("10_strategy", "策略管理", "/monitoring/strategies"),
    ("11_alerts", "告警管理", "/monitoring/alerts"),
    ("12_reports", "数据统计", "/reports"),
    ("13_departments", "部门管理", "/organization/departments"),
    ("14_roles", "角色管理", "/organization/roles"),
    ("15_users", "用户管理", "/organization/users"),
    ("16_brand", "品牌信息", "/brand"),
]


server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1)

TARGET_URL = f"http://localhost:{PORT}/index.html"
print(f"Local static server running at: {TARGET_URL}")
print(f"Output screenshots directory: {SCREENSHOTS_DIR}")

for filename in os.listdir(SCREENSHOTS_DIR):
    if filename.lower().endswith(".png"):
        os.remove(os.path.join(SCREENSHOTS_DIR, filename))

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    context = browser.new_context(viewport={"width": 1920, "height": 1080})
    page = context.new_page()

    def set_theme(theme: str):
        selector = "button[title='浅色模式'], button[title='浅色']" if theme == "white" else "button[title='深色模式'], button[title='深色']"
        page.locator(selector).first.click()
        time.sleep(0.45)

    def save_pair(prefix: str, title: str):
        print(f"\n[Page] {title} ({prefix})")
        set_theme("white")
        white_path = os.path.join(SCREENSHOTS_DIR, f"{prefix}_white.png")
        page.screenshot(path=white_path)
        print(f"  ✓ Saved: {os.path.basename(white_path)}")

        set_theme("dark")
        dark_path = os.path.join(SCREENSHOTS_DIR, f"{prefix}_dark.png")
        page.screenshot(path=dark_path)
        print(f"  ✓ Saved: {os.path.basename(dark_path)}")

    print(f"Loading page: {TARGET_URL}...")
    page.goto(TARGET_URL, wait_until="networkidle")
    page.evaluate("localStorage.removeItem('topstar_auth'); localStorage.removeItem('topstar_auth_session'); localStorage.removeItem('topstar_theme'); location.hash='#/login'; location.reload()")
    page.wait_for_load_state("networkidle")
    time.sleep(1)
    save_pair("00_login", "登录页")

    page.evaluate(f"localStorage.setItem('topstar_auth', {AUTH_SESSION_JS}); localStorage.setItem('topstar_theme', 'dark'); location.hash='#/'; location.reload()")
    page.wait_for_load_state("networkidle")
    page.locator("main h1").first.wait_for()
    time.sleep(0.8)

    for prefix, title, route in PAGES_CONFIG:
        page.evaluate(f"location.hash = '#{route}'")
        page.wait_for_timeout(750)
        save_pair(prefix, title)

    page.evaluate("location.hash = '#/'")
    page.wait_for_timeout(650)
    print("\n[State] 全局搜索 (90_command_palette)")
    set_theme("white")
    page.keyboard.press("Control+k")
    page.wait_for_timeout(450)
    page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "90_command_palette_white.png"))
    page.keyboard.press("Escape")
    set_theme("dark")
    page.keyboard.press("Control+k")
    page.wait_for_timeout(450)
    page.screenshot(path=os.path.join(SCREENSHOTS_DIR, "90_command_palette_dark.png"))
    page.keyboard.press("Escape")

    print("\n[State] 侧边栏折叠 (91_sidebar_collapsed)")
    page.locator('[data-sidebar="trigger"]').first.click()
    page.wait_for_timeout(500)
    save_pair("91_sidebar_collapsed", "侧边栏折叠")

    browser.close()

print("\n🎉 All 19 pairs of screenshots (38 images total) have been captured successfully!")
