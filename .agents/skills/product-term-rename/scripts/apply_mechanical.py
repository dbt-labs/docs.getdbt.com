#!/usr/bin/env python3
"""
apply_mechanical.py — apply ONLY auto_safe: true prose replacements from
inventory.json. Deterministic, reviewable, no judgment.

Everything position-sensitive (req 4 inline v1/v2), density-sensitive (req 3),
and every bare "dbt Core" (req 1/2) is auto_safe: false and is skipped here —
those are handled by the LLM prose subagents.

Usage:
    python3 apply_mechanical.py [--inventory inventory.json] [--root REPO_ROOT] [--dry-run]
"""
import argparse
import json
import os
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent


def case_aware(src_match, target):
    """Preserve simple casing — EXCEPT 'dbt', which is always lowercase per the
    brand rule (even at the start of a sentence or heading). This prevents the
    "Fusion" -> "Dbt" / "Dbt v2" corruption at capitalized positions."""
    if target.lower().startswith("dbt"):
        return target  # never capitalize dbt
    if src_match.isupper():
        return target.upper()
    if src_match[:1].isupper():
        return target[:1].upper() + target[1:]
    return target


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--inventory", default=str(HERE / "inventory.json"))
    ap.add_argument("--root", default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    root = args.root or os.popen("git rev-parse --show-toplevel").read().strip() or "."
    root = Path(root)

    with open(args.inventory) as f:
        records = json.load(f)

    # group auto_safe records by file, apply from the bottom up so offsets hold
    by_file = defaultdict(list)
    for r in records:
        if r["class"] == "prose" and r.get("auto_safe"):
            by_file[r["path"]].append(r)

    total = 0
    for rel, recs in by_file.items():
        path = root / rel
        lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
        # apply per-line, replacing the exact matched phrase once per record
        recs.sort(key=lambda r: (-r["line"]))
        for r in recs:
            idx = r["line"] - 1
            if idx >= len(lines):
                continue
            src = r["match"]
            tgt = case_aware(src, r["target"])
            if src in lines[idx]:
                lines[idx] = lines[idx].replace(src, tgt, 1)
                total += 1
        if not args.dry_run:
            path.write_text("".join(lines), encoding="utf-8")
        print(f"  {'(dry) ' if args.dry_run else ''}{len(recs):4} edits  {rel}")

    print(f"\n  {'Would apply' if args.dry_run else 'Applied'} {total} mechanical replacements "
          f"across {len(by_file)} files.")
    print("  Remaining prose (auto_safe: false) is for the LLM subagents.\n")


if __name__ == "__main__":
    main()
