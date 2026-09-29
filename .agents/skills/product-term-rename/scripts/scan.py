#!/usr/bin/env python3
"""
scan.py — classify every rename-term occurrence into inventory.json.

Read-only. Never edits a file. This is the step that makes the rename fast:
it spends the LLM only on prose that needs judgment and reports everything else.

Usage:
    python3 scan.py [--root REPO_ROOT] [--out inventory.json] [--scope-override GLOB ...]

Classes emitted per occurrence:
    constant             inside a <Constant .../> tag — Layer 1 handles it
    constant_grammar_risk a <Constant> whose sentence will break when it renders
    denylisted           matches never-touch.yml — excluded, reported
    false_positive       confusion / DataFusion / generic-English fusion
    structural           URL, code, anchor, slug, frontmatter id — reported, not edited
    prose                everything else; auto_safe true|false
"""
import argparse
import json
import os
import re
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
CONFIG = HERE.parent / "config"

# ---------------------------------------------------------------------------
# Config loading
# ---------------------------------------------------------------------------
def load_yaml(name):
    with open(CONFIG / name) as f:
        return yaml.safe_load(f)


def build_term_patterns(terms):
    """Return an ordered list of (regex, group, target, judgment_only) longest-first."""
    pats = []
    # Order matters across groups: core_v2 ("dbt Core 2.0") before core ("dbt Core")
    # so the versioned form wins. Each rule may set word_boundary and judgment_only.
    for group in ("fusion", "core_v2", "core"):
        for rule in terms.get(group, []):
            src = rule["from"]
            if rule.get("word_boundary"):
                rx = re.compile(r"\b" + re.escape(src) + r"\b", re.IGNORECASE)
            else:
                rx = re.compile(re.escape(src), re.IGNORECASE)
            judgment = bool(rule.get("judgment_only"))
            target = None if judgment else rule.get("to")
            pats.append((rx, group, target, judgment))
    # already longest-first within each group by author convention; keep order.
    return pats


# ---------------------------------------------------------------------------
# Scope
# ---------------------------------------------------------------------------
def gather_files(root, scope, overrides):
    root = Path(root)
    includes = overrides if overrides else scope["include"]
    excludes = scope.get("exclude", [])
    seen = set()
    files = []
    for pattern in includes:
        # patterns are repo-root-relative
        for p in root.glob(pattern):
            if not p.is_file():
                continue
            rel = p.relative_to(root).as_posix()
            full_rel = pattern_root_rel(root, p)
            if any(fnmatch_glob(full_rel, ex) for ex in excludes):
                continue
            if full_rel in seen:
                continue
            seen.add(full_rel)
            files.append(p)
    return files


def pattern_root_rel(root, p):
    # globs in scope.yml are written relative to repo root (e.g. website/docs/**)
    try:
        return p.relative_to(root).as_posix()
    except ValueError:
        return p.as_posix()


def fnmatch_glob(path, pattern):
    import fnmatch
    # support ** by translating to fnmatch-friendly form
    return fnmatch.fnmatch(path, pattern) or fnmatch.fnmatch(path, pattern.replace("/**", "/*")) \
        or (pattern.endswith("/**") and path.startswith(pattern[:-3] + "/"))


# ---------------------------------------------------------------------------
# Classification helpers
# ---------------------------------------------------------------------------
CONSTANT_RE = re.compile(r'<Constant\s+name="([^"]+)"\s*/?>')
CODE_FENCE_RE = re.compile(r"^```")
INLINE_CODE_RE = re.compile(r"`[^`]*`")
URL_RE = re.compile(r"https?://\S+|\]\([^)]+\)|/img/\S+|\S+\.md[)#]?")
IMPORT_RE = re.compile(r"^\s*import\s|from\s+['\"]/?snippets")
FRONTMATTER_KEY_RE = re.compile(r"^\s*(id|slug):", re.IGNORECASE)
# Frontmatter keys whose VALUES are user-facing prose (not identifiers) and so
# must be renamed. Everything else in frontmatter (id, slug, version, …) is structural.
FM_PROSE_RE = re.compile(
    r"^\s*(title|description|sidebar_label|pagination_label|meta_description|tags"
    r"|hoverSnippet|keywords|authors|product_badge|intro_text|displayText):",
    re.IGNORECASE,
)

# grammar-risk sentence signals around a flipped constant
GRAMMAR_RISK_RE = re.compile(
    r"(the\s+<Constant\s+name=\"fusion_engine\")|"
    r"(<Constant\s+name=\"core_v2\"\s*/?>.{0,40}<Constant\s+name=\"fusion\")|"
    r"(the\s+dbt\s+Fusion\s+engine)",
    re.IGNORECASE,
)

FALSE_POSITIVE_RE = re.compile(r"\bconfusion\b|DataFusion", re.IGNORECASE)


def load_denylist():
    dl = load_yaml("never-touch.yml")
    literals = set(dl.get("literals", [])) | set(dl.get("components", []))
    regexes = [re.compile(r) for r in dl.get("regex", [])]
    return literals, regexes


def is_denylisted(line, match_start, match_end, literals, regexes):
    for lit in literals:
        for m in re.finditer(re.escape(lit), line):
            if m.start() <= match_start and m.end() >= match_end:
                return True
    for rx in regexes:
        for m in rx.finditer(line):
            if m.start() <= match_start and m.end() >= match_end:
                return True
    return False


def in_span(pos, spans):
    return any(s <= pos < e for s, e in spans)


def structural_spans(line):
    spans = []
    for rx in (INLINE_CODE_RE, URL_RE):
        for m in rx.finditer(line):
            spans.append((m.start(), m.end()))
    return spans


# ---------------------------------------------------------------------------
# Main scan
# ---------------------------------------------------------------------------
def scan_file(path, root, patterns, literals, regexes):
    records = []
    rel = pattern_root_rel(root, path)
    in_fence = False
    in_frontmatter = False
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except (UnicodeDecodeError, OSError):
        return records

    for i, line in enumerate(lines, start=1):
        if i == 1 and line.strip() == "---":
            in_frontmatter = True
            continue
        if in_frontmatter and line.strip() == "---":
            in_frontmatter = False
            continue
        if CODE_FENCE_RE.match(line):
            in_fence = not in_fence
            continue

        constant_spans = [(m.start(), m.end()) for m in CONSTANT_RE.finditer(line)]
        struct_spans = structural_spans(line)
        # Does the line break grammar once constants render to "dbt"/"dbt v1"/…?
        line_grammar_break = bool(GRAMMAR_GATE_RE.search(render_line(line)))

        # Claim spans longest-/highest-priority-first so overlapping patterns
        # (e.g. "dbt Core 2.0" vs "Core 2.0", "dbt Core 2.0" vs bare "dbt Core")
        # never double-count the same occurrence. `patterns` is ordered:
        # fusion (longest-first), core_v2 (longest-first), core_bare (longest-first).
        claimed = []

        def overlaps(s, e):
            return any(not (e <= cs or s >= ce) for cs, ce in claimed)

        # --- Explicit <Constant> detection --------------------------------
        # Detect every rename-relevant constant tag directly (not via its name
        # attribute matching a literal), classify grammar/inline-trim risk, and
        # CLAIM its span so literal term patterns don't double-count inside it.
        for cm in CONSTANT_RE.finditer(line):
            name = cm.group(1)
            if name not in RENAME_CONSTANTS:
                continue
            cs, ce = cm.start(), cm.end()
            claimed.append((cs, ce))
            cls = classify_constant(name, line_grammar_break)
            records.append({
                "path": rel, "line": i, "match": cm.group(0),
                "group": f"constant:{name}",
                "context": line[max(0, cs - 80):min(len(line), ce + 80)].strip(),
                "renders": RENAME_CONSTANTS[name],
                "class": cls, "auto_safe": False,
            })

        for rx, group, target, judgment in patterns:
            for m in rx.finditer(line):
                s, e = m.start(), m.end()
                if overlaps(s, e):
                    continue
                claimed.append((s, e))
                match_text = m.group(0)
                ctx = line[max(0, s - 80):min(len(line), e + 80)]
                base = {
                    "path": rel, "line": i, "match": match_text,
                    "group": group, "context": ctx.strip(),
                }

                # order of precedence
                if in_fence:
                    cls, auto = "structural", False
                elif (in_frontmatter and not FM_PROSE_RE.match(line)) or (
                    not in_frontmatter and FRONTMATTER_KEY_RE.match(line)
                ):
                    # identifier-bearing frontmatter (id/slug/version/…) — structural.
                    # title/description/… fall through to normal prose classification.
                    cls, auto = "structural", False
                elif IMPORT_RE.search(line):
                    cls, auto = "structural", False
                elif FALSE_POSITIVE_RE.search(match_text) or (
                    group == "fusion" and re.search(r"confusion|DataFusion", ctx, re.IGNORECASE)
                    and match_text.lower() == "fusion" and _inside_word(line, s, e)
                ):
                    cls, auto = "false_positive", False
                elif is_denylisted(line, s, e, literals, regexes):
                    cls, auto = "denylisted", False
                elif in_span(s, constant_spans):
                    # inside a <Constant> tag → Layer 1; check grammar risk
                    if GRAMMAR_RISK_RE.search(line):
                        cls, auto = "constant_grammar_risk", False
                    else:
                        cls, auto = "constant", False
                elif in_span(s, struct_spans):
                    cls, auto = "structural", False
                elif judgment:
                    # bare "dbt Core" — always LLM
                    cls, auto = "prose", False
                else:
                    # prose. auto_safe only if the phrase maps cleanly with no
                    # grammar risk and isn't a JSX attribute string.
                    risky = line_grammar_break or _is_jsx_attr(line, s)
                    cls = "prose"
                    auto = (not risky) and target is not None
                    base["target"] = target
                    base["phrase_rule"] = match_text

                base["class"] = cls
                base["auto_safe"] = auto
                records.append(base)
    return records


# Rename-relevant constants and what they render to after the Layer 1 flip.
RENAME_CONSTANTS = {
    "fusion": "dbt v2",
    "fusion_engine": "dbt v2",
    "core": "dbt v1",
    "core_v2": "dbt v2",
    "core_v1": "dbt v1",
}
# Grammar gates — the SAME checks verify.py runs. A constant (or prose) occurrence
# is a grammar risk only when the *rendered* line trips one of these. This avoids
# flagging fine inline forms like "dbt v1.10" while catching real breaks like
# "dbt and dbt", "the dbt is", "dbt engine".
# A break is where a constant WAS the head noun and is now gone, leaving a
# dangling article/verb/conjunction. The negative lookaheads keep valid proper
# nouns ("the dbt platform", "on the dbt Labs docs", "the dbt version") from firing.
_NOUN = r"(?! (platform|Labs|Community|Cloud|version|project|projects|docs|site|binary|extension|package|adapter|CLI|icon|Core))"
GRAMMAR_GATE_RE = re.compile(
    r"\bdbt dbt\b"
    r"|\bdbt (and|or) dbt\b"
    r"|\bthe dbt (is|are|was|were|to)\b"
    r"|\bthe dbt v[12] (is|are|was|were)\b"   # "the dbt v2 is" — fusion_engine article break
    r"|\bdbt v[12] v[12]\b"                    # "dbt v1 v1.12" — constant + explicit version doubled
    r"|\bthe dbt and" + _NOUN +
    r"|\b(on|running|requires) the dbt\b" + _NOUN +
    r"|\bdbt engine engine\b",   # duplicate-noun artifact, not the valid "the dbt engine"
    re.IGNORECASE,
)


def render_line(line):
    """Simulate the Layer 1 flip: replace rename constants with what they render."""
    return CONSTANT_RE.sub(
        lambda m: RENAME_CONSTANTS.get(m.group(1), m.group(0)), line
    )


def classify_constant(name, line_grammar_break):
    """constant | constant_grammar_risk for a rename-relevant <Constant> tag."""
    return "constant_grammar_risk" if line_grammar_break else "constant"


def _inside_word(line, s, e):
    left = line[s - 1] if s > 0 else " "
    right = line[e] if e < len(line) else " "
    return left.isalpha() or right.isalpha()


def _is_jsx_attr(line, pos):
    prefix = line[:pos]
    # crude: an attribute assignment like foo=" ... <here>
    return bool(re.search(r'\b(alt_header|title|label|text|alt)\s*=\s*"[^"]*$', prefix))


def summarize(records):
    from collections import Counter, defaultdict
    by_class = Counter(r["class"] for r in records)
    prose = [r for r in records if r["class"] == "prose"]
    auto = sum(1 for r in prose if r["auto_safe"])
    files_needing_judgment = defaultdict(int)
    for r in prose:
        if not r["auto_safe"]:
            files_needing_judgment[r["path"]] += 1
    return by_class, len(prose), auto, len(prose) - auto, files_needing_judgment


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=None, help="repo root (defaults to git toplevel)")
    ap.add_argument("--out", default=str(HERE / "inventory.json"))
    ap.add_argument("--scope-override", nargs="*", default=None,
                    help="replace scope.include globs (repo-root-relative) for a targeted run")
    args = ap.parse_args()

    root = args.root
    if root is None:
        root = os.popen("git rev-parse --show-toplevel").read().strip() or "."
    root = Path(root)

    terms = load_yaml("terms.yml")
    scope = load_yaml("scope.yml")
    literals, regexes = load_denylist()
    patterns = build_term_patterns(terms)

    files = gather_files(root, scope, args.scope_override)
    records = []
    for f in files:
        records.extend(scan_file(f, root, patterns, literals, regexes))

    with open(args.out, "w") as fh:
        json.dump(records, fh, indent=2)

    by_class, n_prose, auto, needs, files_judgment = summarize(records)
    print(f"\nScanned {len(files)} files → {len(records)} occurrences\n")
    print("  By class:")
    for cls in ("constant", "constant_grammar_risk", "prose", "structural",
                "denylisted", "false_positive"):
        print(f"    {cls:24} {by_class.get(cls, 0)}")
    print(f"\n  Prose total:            {n_prose}")
    print(f"    auto_safe (mechanical): {auto}")
    print(f"    needs LLM judgment:     {needs}")
    print(f"\n  Files needing judgment: {len(files_judgment)}")
    for p, c in sorted(files_judgment.items(), key=lambda x: -x[1])[:15]:
        print(f"    {c:4}  {p}")
    print(f"\n  inventory.json → {args.out}")
    print("\n  HALT: review the above before running Layer 1.\n")


if __name__ == "__main__":
    main()
