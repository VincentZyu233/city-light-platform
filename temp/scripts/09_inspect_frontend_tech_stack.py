import re
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(
    "https://b.iots.city/js/chunk-vendors.ced8c9b4.js",
    headers={"User-Agent": "Mozilla/5.0"}
)

print("Fetching chunk-vendors...")
with urllib.request.urlopen(req, context=ctx) as resp:
    vendor_js = resp.read().decode("utf-8", errors="ignore")

print(f"Vendor JS length: {len(vendor_js)} bytes")

# Check for libraries
libs = [
    "Vue", "vue-router", "vuex", "pinia", "element-ui", "element-plus",
    "echarts", "axios", "leaflet", "mapbox", "ol", "openlayers", "bmap",
    "amap", "ant-design", "lodash", "moment", "dayjs", "xlsx", "video.js",
    "flv.js", "hls.js", "three", "cesium"
]

found = {}
for lib in libs:
    pattern = re.compile(rf"\b{lib}\b", re.IGNORECASE)
    matches = len(pattern.findall(vendor_js))
    if matches > 0:
        found[lib] = matches

print("\nDetected libraries in vendor bundle:")
for k, v in sorted(found.items(), key=lambda x: -x[1]):
    print(f"  {k}: {v} matches")

# Also check Vue version specifically
vue_ver_match = re.search(r'Vue\.version\s*=\s*[\'"]([0-9\.]+)[\'"]', vendor_js) or re.search(r'version:"([0-9\.]+)"', vendor_js)
if vue_ver_match:
    print("Vue version pattern found:", vue_ver_match.group(0))

# Check index.js for router and maps
req2 = urllib.request.Request(
    "https://b.iots.city/js/index.6ced9e01.js",
    headers={"User-Agent": "Mozilla/5.0"}
)
with urllib.request.urlopen(req2, context=ctx) as resp:
    index_js = resp.read().decode("utf-8", errors="ignore")

print(f"Index JS length: {len(index_js)} bytes")

# Check map SDKs in index or vendor
map_keywords = ["tianditu", "amap", "bmap", "baidu", "gaode", "tencent", "osm", "arcgis", "openlayers", "maptalks"]
for kw in map_keywords:
    m = re.findall(rf"\b{kw}\b", index_js, re.IGNORECASE) + re.findall(rf"\b{kw}\b", vendor_js, re.IGNORECASE)
    if m:
        print(f"Map keyword '{kw}': {len(m)} occurrences")
