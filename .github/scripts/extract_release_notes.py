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

MT_CATEGORY_PREFIX_RE = re.compile(
    r"^\*\*(New|Enhancement|Fix|Behavior change|Beta|Alpha|Preview|Private beta)\*\*:?\s*",
    re.IGNORECASE,
)


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


def bullet_signature(text: str) -> str:
    """Return a normalized title key used to detect duplicate bullets."""
    line = text.strip()
    if line.startswith("- "):
        line = line[2:].strip()
    line = MT_CATEGORY_PREFIX_RE.sub("", line, count=1)
    title_match = re.match(r"\*\*([^*]+)\*\*", line)
    if title_match:
        return re.sub(r"\s+", " ", title_match.group(1).strip().lower())
    return re.sub(r"\s+", " ", line[:120].lower())


def collect_existing_signatures(mt_lines: list[str]) -> set[str]:
    return {
        bullet_signature(line)
        for line in mt_lines
        if line.strip().startswith("- ")
    }


def filter_duplicates(
    formatted: list[str], existing: set[str]
) -> tuple[list[str], list[str]]:
    new_bullets: list[str] = []
    skipped: list[str] = []
    seen = set(existing)

    for bullet in formatted:
        signature = bullet_signature(bullet)
        if signature in seen:
            skipped.append(bullet)
            continue
        new_bullets.append(bullet)
        seen.add(signature)

    return new_bullets, skipped


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
    existing_signatures = collect_existing_signatures(mt_lines)
    to_insert, skipped = filter_duplicates(formatted, existing_signatures)

    print(f"Week: {args.week}")
    print(f"Target month section: ## {month_heading}")
    print(f"Bullets found: {len(formatted)}")
    print(f"Skipped (already in MT file): {len(skipped)}")
    print(f"Would add: {len(to_insert)}")
    print()

    if skipped:
        print("--- Skipped duplicates ---")
        for bullet in skipped:
            print(bullet)
        print("--- End skipped ---")
        print()

    if not to_insert:
        print("No new bullets to add — all entries already exist in the MT file.")
        if args.dry_run:
            print("Dry run only — no files were changed.")
        return 0

    print("--- Preview (what would be added to the monthly file) ---")
    for bullet in to_insert:
        print(bullet)
    print("--- End preview ---")

    if args.dry_run:
        print()
        print("Dry run only — no files were changed.")
        return 0

    new_mt_lines = mt_lines[:insert_at] + to_insert + [""] + mt_lines[insert_at:]
    mt_path.write_text("\n".join(new_mt_lines) + "\n", encoding="utf-8")
    print(f"Updated {mt_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1) from error
