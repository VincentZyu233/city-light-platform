#!/usr/bin/env python3
"""Build and package the latest Topstar Smart Lighting SaaS frontend release."""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
import zipfile
from datetime import datetime
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MOCK_DIR = REPO_ROOT / "mock"
DEFAULT_OUTPUT_DIR = REPO_ROOT / "archive"
RELEASE_INFO_NAME = "RELEASE_INFO.txt"

EXCLUDED_DIRS = {
    ".git",
    ".idea",
    ".vscode",
    ".venv",
    ".vite",
    ".cache",
    "__pycache__",
    "node_modules",
}
EXCLUDED_SUFFIXES = {".pyc", ".pyo"}
EXCLUDED_NAMES = {".DS_Store", "Thumbs.db"}


def run(command: list[str], cwd: Path) -> None:
    print(f"[run] {' '.join(command)}")
    subprocess.run(command, cwd=cwd, check=True)


def git_output(*args: str) -> str:
    return subprocess.check_output(
        ["git", *args],
        cwd=REPO_ROOT,
        text=True,
        encoding="utf-8",
    ).strip()


def is_excluded(relative_path: Path) -> bool:
    if any(part in EXCLUDED_DIRS for part in relative_path.parts):
        return True
    if relative_path.suffix.lower() in EXCLUDED_SUFFIXES:
        return True
    return relative_path.name in EXCLUDED_NAMES


def add_tree_to_zip(archive: zipfile.ZipFile, source_dir: Path) -> int:
    file_count = 0
    for path in sorted(source_dir.rglob("*")):
        relative_path = path.relative_to(source_dir)
        if is_excluded(relative_path):
            continue
        if path.is_symlink():
            print(f"[skip] symlink: {relative_path}")
            continue
        if path.is_dir():
            continue
        archive.write(path, relative_path.as_posix())
        file_count += 1
    return file_count


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build and create a versioned source archive.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Archive output directory (default: <repo>/archive).",
    )
    parser.add_argument(
        "--skip-build",
        action="store_true",
        help="Reuse the existing mock/dist build output.",
    )
    parser.add_argument(
        "--allow-dirty",
        action="store_true",
        help="Allow packaging when tracked files have uncommitted changes.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_dir = args.output_dir.resolve()

    dirty_files = git_output("status", "--porcelain", "--untracked-files=no")
    if dirty_files and not args.allow_dirty:
        print("Tracked files have uncommitted changes:", file=sys.stderr)
        print(dirty_files, file=sys.stderr)
        print("Commit them first or pass --allow-dirty.", file=sys.stderr)
        return 2

    if not args.skip_build:
        run(["bun", "run", "build"], MOCK_DIR)

    commit = git_output("rev-parse", "HEAD")
    short_commit = git_output("rev-parse", "--short=8", "HEAD")
    branch = git_output("branch", "--show-current") or "detached"
    remote = git_output("remote", "get-url", "origin")
    generated_at = datetime.now().astimezone()
    timestamp = generated_at.strftime("%Y%m%d-%H%M%S")
    output_dir.mkdir(parents=True, exist_ok=True)

    archive_name = (
        "TOPSTAR_通士达智慧照明SaaS平台_前端源码与截图展示包_"
        f"{short_commit}_{timestamp}.zip"
    )
    archive_path = output_dir / archive_name

    release_info = os.linesep.join(
        [
            "通士达智慧照明SaaS平台",
            f"Generated At: {generated_at.isoformat(timespec='seconds')}",
            f"Commit: {commit}",
            f"Short Commit: {short_commit}",
            f"Branch: {branch}",
            f"Repository: {remote.removesuffix('.git')}",
            "Contents: mock frontend source, dist build, screenshots, and helper scripts",
            "",
        ]
    )

    with zipfile.ZipFile(
        archive_path,
        mode="w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
    ) as archive:
        archive.writestr(RELEASE_INFO_NAME, release_info.encode("utf-8"))
        file_count = add_tree_to_zip(archive, MOCK_DIR)

    size_mb = archive_path.stat().st_size / (1024 * 1024)
    print(f"\nArchive created: {archive_path}")
    print(f"Commit: {commit}")
    print(f"Files: {file_count}, Size: {size_mb:.2f} MiB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
