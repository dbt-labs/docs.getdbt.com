#!/usr/bin/env python3
"""File hand-written dbt platform release notes under their product area.

Writers add a bullet directly under the month heading, as they always have.
This script moves each of those bullets under the matching `####` area heading
when the note has a clear signal (a docs link or a product name). Notes with no
clear signal stay where they are and are listed in the report, so a person can
pick the area.

It also adds a missing anchor to an area heading and flags a heading that looks
like a misspelled area name.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from release_note_areas import (
    AREA_HEADING_RE,
    area_anchor,
    insert_notes,
    load_areas,
    split_notes,
    subgroup_for,
    unfiled_range,
    uses_area_layout,
)

MONTH_HEADING_RE = re.compile(r"^##\s+([A-Za-z]+\s+\d{4})\s*$")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="File release notes under their product area heading."
    )
    parser.add_argument("--mt-file", required=True, help="Path to release-notes.md")
    parser.add_argument(
        "--areas-file",
        help="Path to release-note-areas.json (defaults to website/release-note-areas.json).",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Report only; do not write files."
    )
    parser.add_argument("--report-file", help="Write a Markdown report to this path.")
    return parser.parse_args()


def summarize(note: list[str], limit: int = 140) -> str:
    text = re.sub(r"^-\s+", "", note[0]).strip()
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def fix_headings(lines, month_headings, areas):
    """Add missing anchors to area headings. Return (fixed, typo warnings)."""
    fixed: list[str] = []
    typos: list[str] = []
    known = set(areas.heading_names)
    month = None
    in_section = False
    for index, line in enumerate(lines):
        month_match = MONTH_HEADING_RE.match(line.strip())
        if month_match:
            month = month_match.group(1)
            in_section = False
            continue
        if line.startswith("### "):
            # Event sections keep their own headings.
            in_section = True
            continue
        match = AREA_HEADING_RE.match(line)
        if not match or month not in month_headings or in_section:
            continue
        name = match.group(1).strip()
        if name in known:
            if "{#" not in line:
                lines[index] = f"#### {name} {{#{area_anchor(name, month)}}}"
                fixed.append(f"`#### {name}` in {month}")
        else:
            suggestion = areas.closest(name)
            if suggestion:
                typos.append(
                    f"`#### {name}` in {month} isn't an area. Did you mean **{suggestion}**?"
                )
    return fixed, typos


def file_notes(lines, areas):
    """Move unfiled notes under their area. Return (filed, unclear)."""
    filed: list[tuple[str, str, str, str]] = []
    unclear: list[tuple[str, str]] = []
    months = [
        match.group(1)
        for match in (MONTH_HEADING_RE.match(line.strip()) for line in lines)
        if match
    ]
    for month in months:
        start, end = unfiled_range(lines, month)
        before, notes = split_notes(lines[start:end])
        if not notes:
            continue
        keep: list[list[str]] = []
        moves: list[tuple[str, list[str]]] = []
        for note in notes:
            text = "\n".join(note)
            area, reason = areas.classify(text)
            if area:
                moves.append((area, note))
                filed.append((month, area, reason, summarize(note)))
            else:
                keep.append(note)
                unclear.append((month, summarize(note)))
        if not moves:
            continue
        remaining = before + [line for note in keep for line in note]
        if keep:
            remaining.append("")
        lines[start:end] = remaining
        # Insert in reverse so notes keep their original order in each area.
        for area, note in reversed(moves):
            insert_notes(
                lines,
                month,
                area,
                [note],
                areas,
                subgroup=subgroup_for(area, "\n".join(note)),
            )
    return filed, unclear, months


def build_report(filed, unclear, fixed, typos, areas, dry_run) -> str:
    out = ["## Release note areas", ""]
    if not (filed or unclear or fixed or typos):
        out.append("Every release note is already filed under an area. Nothing to do.")
        return "\n".join(out)
    if filed:
        verb = "Would file" if dry_run else "Filed"
        out += [f"### {verb} {len(filed)} note(s)", ""]
        for month, area, reason, summary in filed:
            out.append(f"- **{area}** ({month}, {reason}): {summary}")
        out += [
            "",
            "Wrong area? Move the bullet under the right `####` heading.",
            "",
        ]
    if unclear:
        out += [f"### {len(unclear)} note(s) need an area", ""]
        for month, summary in unclear:
            out.append(f"- {month}: {summary}")
        out += [
            "",
            "Move each bullet under one of these `####` headings in its month:",
            "",
        ]
        for area in areas.areas:
            if not area.section:
                out.append(f"- **{area.name}**: {area.definition}")
        out.append("")
    if fixed:
        out += ["### Added missing anchors", ""] + [f"- {item}" for item in fixed] + [""]
    if typos:
        out += ["### Check these headings", ""] + [f"- {item}" for item in typos] + [""]
    return "\n".join(out)


def main() -> int:
    args = parse_args()
    path = Path(args.mt_file)
    if not path.is_file():
        print(f"ERROR: MT file not found: {path}", file=sys.stderr)
        return 1
    original = path.read_text(encoding="utf-8")
    lines = original.splitlines()
    areas = load_areas(args.areas_file)

    if not uses_area_layout(lines):
        print("The release notes file doesn't use area headings yet. Nothing to do.")
        return 0

    filed, unclear, months = file_notes(lines, areas)
    fixed, typos = fix_headings(lines, set(months), areas)
    report = build_report(filed, unclear, fixed, typos, areas, args.dry_run)
    print(report)
    if args.report_file:
        Path(args.report_file).write_text(report + "\n", encoding="utf-8")

    updated = "\n".join(lines).rstrip("\n") + "\n"
    if updated != original and not args.dry_run:
        path.write_text(updated, encoding="utf-8")
        print(f"\nUpdated {path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1) from error
