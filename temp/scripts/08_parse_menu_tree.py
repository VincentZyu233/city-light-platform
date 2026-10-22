import json

with open("D:/aaaStuffsaaa/from_git/gitee/city-light-platform/temp/mock/mainMenu_full.json", "r", encoding="utf-8") as f:
    res = json.load(f)

tree = res.get("data", [])

def print_node(node, level=0):
    indent = "  " * level
    caption = node.get("caption") or "(no caption)"
    url = node.get("url") or ""
    icon = node.get("imgCss") or ""
    funcs = [f.get("caption") for f in node.get("subFuncItems", [])]
    func_str = f" [功能按钮: {', '.join(funcs)}]" if funcs else ""
    print(f"{indent}├── {caption} (url: {url}, icon: {icon}){func_str}")
    for sub in node.get("subMenuItems", []):
        print_node(sub, level + 1)

print("=== 完整功能菜单树 ===")
for root in tree:
    print(f"ROOT: {root.get('caption')}")
    for sub in root.get("subMenuItems", []):
        print_node(sub, 1)
