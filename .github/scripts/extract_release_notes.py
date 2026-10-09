#!/usr/bin/env python3
"""Extract weekly single-tenant release notes for multi-tenant release notes."""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
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

# Matches both **New:** and **New**: category prefixes used in MT notes.
MT_CATEGORY_PREFIX_RE = re.compile(
    r"^\*\*(New|Enhancement|Fix|Behavior change|Beta|Alpha|Preview|Private beta):?\*\*:?\s*",
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


FEATURE_TITLE_PREFIX_RE = re.compile(r"^\*\*[^*]+\*\*:\s*")

# Longest phrases first. Maps plain ST text → website/constants.js names.
# Bare "dbt" is intentionally omitted (too many false positives).
CONSTANT_REPLACEMENTS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bdbt Fusion engine\b"), "fusion_engine"),
    (re.compile(r"\bdbt Wizard\b"), "wizard"),
    (re.compile(r"\bdbt platform\b"), "dbt_platform"),
    (re.compile(r"\bdbt Core\b"), "core"),
    (re.compile(r"\bdbt CLI\b"), "platform_cli"),
    (re.compile(r"\bStudio IDE\b"), "studio_ide"),
    (re.compile(r"\bSemantic Layer\b"), "semantic_layer"),
    # Avoid Fusion-version / Fusion-based compound adjectives.
    (re.compile(r"\bFusion\b(?!-)"), "fusion"),
]


def apply_constants(text: str) -> str:
    """Replace known product names with <Constant /> tags for MT notes.

    Skips content already inside backticks or existing Constant tags.
    """
    protected: list[str] = []

    def _stash(match: re.Match[str]) -> str:
        protected.append(match.group(0))
        return f"__CONST_PROTECT_{len(protected) - 1}__"

    # Protect existing constants and inline code so we do not double-wrap.
    working = re.sub(r"<Constant\b[^>]*/>", _stash, text)
    working = re.sub(r"`[^`]+`", _stash, working)

    for pattern, constant_name in CONSTANT_REPLACEMENTS:
        working = pattern.sub(f'<Constant name="{constant_name}" />', working)

    for index, original in enumerate(protected):
        working = working.replace(f"__CONST_PROTECT_{index}__", original)

    return working


def format_mt_bullet(category: str, body: str) -> str:
    """Format an MT bullet to lead with the ST section category.

    Single-tenant bullets usually look like:
      **Feature title**: Description...
    under a category heading (New, Enhancements, Fixes).

    Multi-tenant bullets should lead with the category:
      - **New:** Description...
    """
    description = FEATURE_TITLE_PREFIX_RE.sub("", body.strip(), count=1).strip()
    if not description:
        description = body.strip()
    description = apply_constants(description)
    return f"- **{category}:** {description}"


MARKDOWN_LINK_RE = re.compile(r"\[([^\]]*)\]\(([^)\s]+)[^)]*\)")
CONSTANT_TAG_RE = re.compile(r'<Constant\s+name="([^"]+)"\s*/>')
TOKEN_RE = re.compile(r"[a-z0-9]+")

# Common words that carry no feature meaning when comparing rewrites.
DUPLICATE_STOPWORDS = frozenset(
    """
    a an the and or but for with to of in on at by as is are was were be been
    has have had will can now also when each into your you this that these those
    it its from new use using used via refer more information info details
    available including include includes about after before than then them they
    their there which while where what who how not only just any all per see
    so if no do does our we
    """.split()
)

# Anchors that are too generic to identify a feature on their own.
GENERIC_ANCHORS = frozenset(
    {"overview", "prerequisites", "limitations", "considerations", "faqs", "examples"}
)

# Lifecycle stages. A feature moving from one stage to another (for example,
# beta to GA) is a new release, not a duplicate, even with near-identical text.
LIFECYCLE_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("private beta", re.compile(r"\bprivate beta\b", re.IGNORECASE)),
    ("beta", re.compile(r"\b(?<!private )beta\b", re.IGNORECASE)),
    ("preview", re.compile(r"\bpreview\b", re.IGNORECASE)),
    ("alpha", re.compile(r"\balpha\b", re.IGNORECASE)),
    (
        "ga",
        re.compile(r"\bgenerally available\b|\bgeneral availability\b|\(GA\)|\bGA\b", re.IGNORECASE),
    ),
]

# Jaccard similarity of significant tokens that counts as a reworded duplicate.
TOKEN_OVERLAP_THRESHOLD = 0.6
# Lower bars once two bullets already point at the same docs. Anchored links
# (page#section) are specific to a feature; bare page links are shared widely.
ANCHOR_TOKEN_OVERLAP_THRESHOLD = 0.2
PAGE_TOKEN_OVERLAP_THRESHOLD = 0.35
MIN_TOKENS_FOR_OVERLAP = 6
# A shorter bullet whose tokens are mostly covered by a longer existing note
# (for example ST split a combined MT Preview bullet into two New bullets).
CONTAINMENT_THRESHOLD = 0.8
MIN_TOKENS_FOR_CONTAINMENT = 5


@dataclass(frozen=True)
class BulletFingerprint:
    signature: str
    body: str
    link_targets: frozenset[str]
    anchors: frozenset[str]
    tokens: frozenset[str]
    lifecycle: frozenset[str]


def strip_bullet_prefix(text: str) -> str:
    line = text.strip()
    if line.startswith("- "):
        line = line[2:].strip()
    return MT_CATEGORY_PREFIX_RE.sub("", line, count=1)


def bullet_signature(text: str) -> str:
    """Return a normalized title key used to detect duplicate bullets."""
    line = strip_bullet_prefix(text)
    title_match = re.match(r"\*\*([^*]+)\*\*", line)
    if title_match:
        return re.sub(r"\s+", " ", title_match.group(1).strip().lower())
    return re.sub(r"\s+", " ", line[:120].lower())


def normalize_body(text: str) -> str:
    """Return bullet description text with markup, links, and casing removed."""
    line = strip_bullet_prefix(text)
    line = FEATURE_TITLE_PREFIX_RE.sub("", line, count=1)
    line = CONSTANT_TAG_RE.sub(lambda m: m.group(1).replace("_", " "), line)
    line = MARKDOWN_LINK_RE.sub(r"\1", line)
    line = re.sub(r"https?://\S+", " ", line)
    return " ".join(TOKEN_RE.findall(line.lower()))


def extract_link_targets(text: str) -> tuple[frozenset[str], frozenset[str]]:
    """Return (normalized link targets, feature-ish anchors) from a bullet."""
    targets: set[str] = set()
    anchors: set[str] = set()
    for _, target in MARKDOWN_LINK_RE.findall(text):
        cleaned = re.sub(r"^https?://(www\.)?docs\.getdbt\.com", "", target.strip().lower())
        page, _, anchor = cleaned.partition("#")
        page = page.split("?", 1)[0].rstrip("/")
        if page.endswith((".md", ".mdx")):
            page = page.rsplit(".", 1)[0]
        if not page and not anchor:
            continue
        targets.add(f"{page}#{anchor}" if anchor else page)
        if anchor and anchor not in GENERIC_ANCHORS and (
            "-" in anchor or len(anchor) >= 10
        ):
            anchors.add(anchor)
    return frozenset(targets), frozenset(anchors)


def significant_tokens(body: str) -> frozenset[str]:
    return frozenset(
        token
        for token in body.split()
        if len(token) > 2 and token not in DUPLICATE_STOPWORDS
    )


def lifecycle_stages(text: str) -> frozenset[str]:
    return frozenset(
        stage for stage, pattern in LIFECYCLE_PATTERNS if pattern.search(text)
    )


def fingerprint(text: str) -> BulletFingerprint:
    body = normalize_body(text)
    link_targets, anchors = extract_link_targets(text)
    return BulletFingerprint(
        signature=bullet_signature(text),
        body=body,
        link_targets=link_targets,
        anchors=anchors,
        tokens=significant_tokens(body),
        lifecycle=lifecycle_stages(text),
    )


def token_overlap(left: frozenset[str], right: frozenset[str]) -> float:
    """Jaccard similarity of two token sets."""
    if not left or not right:
        return 0.0
    return len(left & right) / len(left | right)


def token_containment(smaller: frozenset[str], larger: frozenset[str]) -> float:
    """Fraction of smaller token set also present in larger."""
    if not smaller:
        return 0.0
    return len(smaller & larger) / len(smaller)


def lifecycle_blocks_fuzzy(
    candidate: BulletFingerprint, existing: BulletFingerprint
) -> bool:
    """True when both notes name different lifecycle stages (for example beta → GA).

    If either side has no lifecycle wording, still allow fuzzy matching so a
    split **New** bullet can match a combined **Preview** note that already
    covers it.
    """
    if not candidate.lifecycle or not existing.lifecycle:
        return False
    return candidate.lifecycle != existing.lifecycle


def duplicate_reason(
    candidate: BulletFingerprint, existing: BulletFingerprint
) -> str | None:
    """Return why candidate duplicates existing, or None if it does not."""
    # Lifecycle stages must not deduplicate a promotion (for example beta → GA).
    if lifecycle_blocks_fuzzy(candidate, existing):
        return None
    if candidate.signature == existing.signature:
        return "same title/signature"
    if candidate.body and candidate.body == existing.body:
        return "same normalized body"

    overlap = token_overlap(candidate.tokens, existing.tokens)
    if len(candidate.tokens) <= len(existing.tokens):
        smaller, larger = candidate.tokens, existing.tokens
    else:
        smaller, larger = existing.tokens, candidate.tokens
    containment = token_containment(smaller, larger)

    shared_targets = candidate.link_targets & existing.link_targets
    shared_anchors = sorted(candidate.anchors & existing.anchors)
    anchored_targets = sorted(t for t in shared_targets if "#" in t)

    # Split ST bullets vs one combined MT note: most of the shorter wording is
    # already inside the longer note, and they share a docs page or anchor.
    if (
        (shared_targets or shared_anchors)
        and len(smaller) >= MIN_TOKENS_FOR_CONTAINMENT
        and containment >= CONTAINMENT_THRESHOLD
    ):
        detail = (
            anchored_targets[0]
            if anchored_targets
            else (
                sorted(shared_targets)[0]
                if shared_targets
                else f"#{shared_anchors[0]}"
            )
        )
        return f"covered by existing note ({detail})"

    if anchored_targets and overlap >= ANCHOR_TOKEN_OVERLAP_THRESHOLD:
        return f"same docs link ({anchored_targets[0]})"
    if shared_targets and overlap >= PAGE_TOKEN_OVERLAP_THRESHOLD:
        return f"same docs link ({sorted(shared_targets)[0]})"

    # Same section anchor on a different page, for example
    # run-visibility#explain-tab vs dbt-state-interface#explain-tab.
    if shared_anchors and overlap >= ANCHOR_TOKEN_OVERLAP_THRESHOLD:
        return f"same feature anchor (#{shared_anchors[0]})"

    if (
        min(len(candidate.tokens), len(existing.tokens)) >= MIN_TOKENS_FOR_OVERLAP
        and overlap >= TOKEN_OVERLAP_THRESHOLD
    ):
        return f"high wording overlap ({overlap:.0%})"
    return None


def filter_duplicates(
    formatted: list[str], existing_lines: list[str]
) -> tuple[list[str], list[tuple[str, str]]]:
    """Split formatted bullets into (new, skipped-with-reason).

    existing_lines are raw MT file lines; only bullet lines are compared.
    Bullets accepted earlier in the same run are also checked, so one ST week
    cannot add the same feature twice.
    """
    seen = [
        fingerprint(line) for line in existing_lines if line.strip().startswith("- ")
    ]
    new_bullets: list[str] = []
    skipped: list[tuple[str, str]] = []

    for bullet in formatted:
        candidate = fingerprint(bullet)
        reason = next(
            (r for r in (duplicate_reason(candidate, prior) for prior in seen) if r),
            None,
        )
        if reason:
            skipped.append((bullet, reason))
            continue
        new_bullets.append(bullet)
        seen.append(candidate)

    return new_bullets, skipped


def _bullet_insert_after_month(lines: list[str], month_index: int) -> int:
    """Return the index where new bullets should be inserted under a month heading."""
    for next_index in range(month_index + 1, len(lines)):
        if lines[next_index].startswith("## "):
            return next_index
        if lines[next_index].startswith("- "):
            return next_index
    return month_index + 1


def ensure_month_heading(lines: list[str], month_heading: str) -> tuple[int, bool]:
    """Ensure the month heading exists (newest-first). Mutates lines if created.

    Returns (bullet_insert_index, created).
    """
    target = f"## {month_heading}"
    for index, line in enumerate(lines):
        if line.strip() == target:
            return _bullet_insert_after_month(lines, index), False

    new_month = datetime.strptime(month_heading, "%B %Y")
    month_indexes: list[tuple[int, datetime]] = []
    for index, line in enumerate(lines):
        match = MONTH_HEADING_RE.match(line.strip())
        if match:
            month_indexes.append(
                (index, datetime.strptime(match.group(1), "%B %Y"))
            )

    heading_at: int | None = None
    for index, existing in month_indexes:
        if new_month > existing:
            heading_at = index
            break

    if heading_at is None:
        if month_indexes:
            last_start = month_indexes[-1][0]
            heading_at = len(lines)
            for index in range(last_start + 1, len(lines)):
                if lines[index].startswith("## "):
                    heading_at = index
                    break
        else:
            heading_at = len(lines)

    lines[heading_at:heading_at] = [target]
    return heading_at + 1, True


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
    insert_at, created_month = ensure_month_heading(mt_lines, month_heading)

    formatted = [format_mt_bullet(category, body) for category, body in bullets]
    to_insert, skipped = filter_duplicates(formatted, mt_lines)

    print(f"Week: {args.week}")
    print(f"Target month section: ## {month_heading}")
    if created_month:
        action = "Would create" if args.dry_run else "Created"
        print(f"{action} missing month heading: ## {month_heading}")
    print(f"Bullets found: {len(formatted)}")
    print(f"Skipped (already in MT file): {len(skipped)}")
    print(f"Would add: {len(to_insert)}")
    print()

    if skipped:
        print("--- Skipped duplicates ---")
        for bullet, reason in skipped:
            print(f"{bullet}\n    ↳ {reason}")
        print("--- End skipped ---")
        print()

    if not to_insert:
        print("No new bullets to add — all entries already exist in the MT file.")
        if args.dry_run:
            print("Dry run only — no files were changed.")
        return 0

    print("--- Preview (what would be added to the monthly file) ---")
    if created_month:
        print(f"## {month_heading}")
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
