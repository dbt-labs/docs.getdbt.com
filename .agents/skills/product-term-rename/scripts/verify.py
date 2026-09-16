#!/usr/bin/env python3
"""
verify.py — post-run gates. Exits non-zero on any red gate.

Gates (Notion §verify.py):
    1. No double-dbt          grep -riE '\\bdbt dbt\\b' -> 0
    2. No orphan articles     'the dbt is', 'a dbt engine', 'dbt engine engine' -> 0
    3. Denylist intact        every never-touch.yml identifier still present
    4. Residue                remaining prose Fusion / Core 2.0, file-by-file
    (Build + Vale run separately from SKILL.md; they are slow and need npm/vale.)

Usage:
    python3 verify.py [--root REPO_ROOT] [--baseline denylist_counts.json]
"""
import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
CONFIG = HERE.parent / "config"


def load_scope():
    with open(CONFIG / "scope.yml") as f:
        return yaml.safe_load(f)


def load_denylist_terms():
    with open(CONFIG / "never-touch.yml") as f:
        dl = yaml.safe_load(f)
    return list(dl.get("literals", [])) + list(dl.get("components", []))


def scoped_paths(root, scope):
    root = Path(root)
    files, excludes = [], scope.get("exclude", [])
    import fnmatch
    for pattern in scope["include"]:
        for p in root.glob(pattern):
            if not p.is_file():
                continue
            rel = p.relative_to(root).as_posix()
            if any(fnmatch.fnmatch(rel, ex) or (ex.endswith("/**") and rel.startswith(ex[:-3] + "/"))
                   for ex in excludes):
                continue
            files.append(p)
    return files


def grep_count(files, pattern, flags=re.IGNORECASE):
    rx = re.compile(pattern, flags)
    hits = []
    for p in files:
        try:
            for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
                if rx.search(line):
                    hits.append((p, i, line.strip()))
        except (UnicodeDecodeError, OSError):
            continue
    return hits


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=None)
    ap.add_argument("--baseline", default=None,
                    help="JSON of {identifier: count} captured BEFORE the run")
    args = ap.parse_args()
    root = args.root or os.popen("git rev-parse --show-toplevel").read().strip() or "."
    root = Path(root)
    scope = load_scope()
    files = scoped_paths(root, scope)

    failed = False

    # Gate 1
    dd = grep_count(files, r"\bdbt dbt\b")
    print(f"[{'FAIL' if dd else 'PASS'}] Gate 1 no double-dbt: {len(dd)} hits")
    for p, i, l in dd[:10]:
        print(f"        {p.name}:{i}  {l}")
    failed |= bool(dd)

    # Gate 2
    orphan = grep_count(files, r"\bthe dbt is\b|\ba dbt engine\b|dbt engine engine")
    print(f"[{'FAIL' if orphan else 'PASS'}] Gate 2 no orphan articles: {len(orphan)} hits")
    for p, i, l in orphan[:10]:
        print(f"        {p.name}:{i}  {l}")
    failed |= bool(orphan)

    # Gate 3 — denylist intact (needs a baseline to be meaningful)
    if args.baseline:
        with open(args.baseline) as f:
            baseline = json.load(f)
        # Read every scoped file ONCE, then count — O(files + files*idents) not O(idents*files*reads).
        blob = "\n".join(
            p.read_text(encoding="utf-8", errors="ignore") for p in files
        )
        for ident, expected in baseline.items():
            got = blob.count(ident)
            if got < expected:
                failed = True
                print(f"[FAIL] Gate 3 denylist '{ident}': {got}/{expected}")
    else:
        print("[SKIP] Gate 3 denylist intact — no --baseline provided "
              "(capture counts before the run to enable)")

    # Gate 4 — residue (informational, not a hard fail)
    residue = grep_count(files, r"\bFusion\b|dbt Core 2\.0|\bCore v2\b", flags=re.IGNORECASE)
    residue = [(p, i, l) for p, i, l in residue
               if "confusion" not in l.lower() and "datafusion" not in l.lower()]
    print(f"[INFO] Gate 4 residual prose mentions: {len(residue)} (review for human sign-off)")
    from collections import Counter
    byfile = Counter(p.name for p, _, _ in residue)
    for name, c in byfile.most_common(15):
        print(f"        {c:4}  {name}")

    print()
    if failed:
        print("RED GATE — fix and re-verify. Do not proceed.")
        sys.exit(1)
    print("All hard gates green. Run `npm run build` and `vale` next (see SKILL.md).")


if __name__ == "__main__":
    main()
