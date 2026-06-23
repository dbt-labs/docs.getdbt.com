#!/usr/bin/env python3
"""Extract weekly single-tenant release notes for multi-tenant release notes."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path

WEEK_HEADING_RE = re.compile(r"^##\s+([A-Za-z]+\s+\d{1,2},\s+\d{4})\s*$")
MONTH_HEADING_RE = re.compile(r"^##\s+([A-Za-z]+\s+\d{4})\s*$")

CATEGORY_MAP = {
    "new": "New",
    "enhancements": "Enhancement",
    "enhancement": "Enhancement",
    "fixes": "Fix",
    "fix": "Fix",
    "behavior changes": "Behavior change",
    "behavior change": "Behavior change",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract a week from ST release notes for MT release notes."
    )
    parser.add_argument(
        "--st-file",
        required=True,
        help="Path to dbt-platform-release-notes-gen.md",
    )
    parser.add_argument(
        "--mt-file",
        required=True,
        help="Path to release-notes.md",
    )
    parser.add_argument(
        "--week",
        required=True,
        help='Week heading date, e.g. "June 17, 2026"',
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print preview only; do not write files.",
    )
    return parser.parse_args()


def normalize_category(heading: str) -> str:
    key = heading.strip().lower()
    if key not in CATEGORY_MAP:
        raise ValueError(f"Unknown release note category heading: {heading!r}")
    return CATEGORY_MAP[key]


def week_to_month_heading(week: str) -> str:
    parsed = datetime.strptime(week, "%B %d, %Y")
    return parsed.strftime("%B %Y")


def extract_week_section(lines: list[str], week: str) -> tuple[int, int]:
    target = f"## {week}"
    start = None
    for index, line in enumerate(lines):
        if line.strip() == target:
            start = index
            break
    if start is None:
        raise ValueError(f'Week heading not found: "{week}"')

    end = len(lines)
    for index in range(start + 1, len(lines)):
        match = WEEK_HEADING_RE.match(lines[index].strip())
        if match:
            end = index
            break
    return start, end


def extract_bullets(week_lines: list[str]) -> list[tuple[str, str]]:
    category = None
    bullets: list[tuple[str, str]] = []

    for line in week_lines:
        stripped = line.strip()
        if stripped.startswith("## ") and not WEEK_HEADING_RE.match(stripped):
            category = normalize_category(stripped[3:])
            continue
        if stripped.startswith("### "):
            continue
        if stripped.startswith("- ") and category:
            bullets.append((category, stripped[2:].strip()))

    if not bullets:
        raise ValueError(f'No bullets found under week "{week_lines[0].strip()[3:]}"')
    return bullets


def format_mt_bullet(category: str, body: str) -> str:
    if body.startswith("**") and "**:" in body[:80]:
        return f"- {body}"
    return f"- **{category}:** {body}"


def find_month_insert_line(lines: list[str], month_heading: str) -> int:
    target = f"## {month_heading}"
    for index, line in enumerate(lines):
        if line.strip() == target:
            for next_index in range(index + 1, len(lines)):
                if lines[next_index].startswith("## "):
                    return next_index
                if lines[next_index].startswith("- "):
                    return next_index
            return index + 1
    raise ValueError(f'Month heading not found in MT file: "{month_heading}"')


def main() -> int:
    args = parse_args()
    st_path = Path(args.st_file)
    mt_path = Path(args.mt_file)

    if not st_path.is_file():
        print(f"ERROR: ST file not found: {st_path}", file=sys.stderr)
        return 1
    if not mt_path.is_file():
        print(f"ERROR: MT file not found: {mt_path}", file=sys.stderr)
        return 1

    st_lines = st_path.read_text(encoding="utf-8").splitlines()
    mt_lines = mt_path.read_text(encoding="utf-8").splitlines()

    start, end = extract_week_section(st_lines, args.week)
    week_lines = st_lines[start:end]
    bullets = extract_bullets(week_lines)
    month_heading = week_to_month_heading(args.week)
    insert_at = find_month_insert_line(mt_lines, month_heading)

    formatted = [format_mt_bullet(category, body) for category, body in bullets]

    print(f"Week: {args.week}")
    print(f"Target month section: ## {month_heading}")
    print(f"Bullets found: {len(formatted)}")
    print()
    print("--- Preview (what would be added to the monthly file) ---")
    for bullet in formatted:
        print(bullet)
    print("--- End preview ---")

    if args.dry_run:
        print()
        print("Dry run only — no files were changed.")
        return 0

    new_mt_lines = mt_lines[:insert_at] + formatted + [""] + mt_lines[insert_at:]
    mt_path.write_text("\n".join(new_mt_lines) + "\n", encoding="utf-8")
    print(f"Updated {mt_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1) from error
