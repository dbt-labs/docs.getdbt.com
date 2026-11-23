#!/usr/bin/env python3
"""Match docs-internal release note issues against published MT release notes.

Report-only by default. With --auto-close, closes high-confidence matches and
leaves a comment linking the live release notes and the docs PR that added them.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import ssl
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass, field
from pathlib import Path

RELEASE_NOTE_TITLE_RE = re.compile(r"^Release Note:", re.I)
DOCS_CHANGES_PR_TITLE_RE = re.compile(r"^Docs changes from .+ PR #\d+", re.I)
RELEASE_NOTE_PROMPT_RE = re.compile(r"create appropriate release notes", re.I)
TITLE_SOURCE_PR_RE = re.compile(
    r"^(?:Release Note:\s*Changes from|Docs changes from)\s+([A-Za-z0-9_.-]+)\s+PR\s+#(\d+)",
    re.I,
)
BODY_SOURCE_PR_RE = re.compile(
    r"https://github\.com/([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)/pull/(\d+)",
    re.I,
)
ST_PR_COMMENT_RE = re.compile(r"<!--\s*PRs:\s*(.*?)-->", re.S)
DOTTY_JSON_RE = re.compile(r"```json\s*(\{.*?\})\s*```", re.S)
DECISION_RE = re.compile(r"\*\*Decision:\*\*\s*\[?([^\]\n]+)\]?")

CONSTANT_MAP = {
    "dbt": "dbt",
    "core": "dbt v1",
    "fusion": "dbt v2",
    "fusion_engine": "dbt v2",
    "dbt_platform": "dbt platform",
    "cloud": "dbt platform",
    "studio_ide": "studio ide",
    "cloud_ide": "studio ide",
    "wizard": "dbt wizard",
    "dev_agent": "dbt wizard",
    "copilot": "copilot",
    "catalog": "catalog",
    "explorer": "catalog",
    "insights": "insights",
    "canvas": "canvas",
    "mesh": "mesh",
    "semantic_layer": "semantic layer",
    "orchestrator": "orchestrator",
    "platform_cli": "dbt cloud cli",
    "cloud_cli": "dbt cloud cli",
    "git": "git",
}

STOPWORDS = {
    "a",
    "an",
    "the",
    "and",
    "or",
    "of",
    "to",
    "for",
    "in",
    "on",
    "with",
    "from",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "as",
    "at",
    "if",
    "when",
    "then",
    "than",
    "into",
    "over",
    "after",
    "before",
    "about",
    "not",
    "no",
    "nor",
    "so",
    "such",
    "can",
    "may",
    "will",
    "would",
    "should",
    "could",
    "your",
    "you",
    "we",
    "they",
    "them",
    "their",
    "our",
    "now",
    "new",
    "also",
    "only",
    "via",
    "per",
    "using",
    "through",
    "up",
    "out",
    "all",
    "any",
    "each",
    "more",
    "other",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "what",
    "where",
    "which",
    "who",
}

# Boilerplate words common in Dotty summaries and release note intros that should
# not drive fuzzy token overlap on their own.
GENERIC_RELEASE_WORDS = {
    "add",
    "added",
    "adding",
    "adds",
    "allow",
    "allowing",
    "allows",
    "behavior",
    "bug",
    "change",
    "changed",
    "changes",
    "cloud",
    "customer",
    "customers",
    "data",
    "dbt",
    "default",
    "enhancement",
    "feature",
    "fix",
    "fixed",
    "fixes",
    "fixing",
    "include",
    "included",
    "includes",
    "including",
    "instead",
    "issue",
    "let",
    "lets",
    "letting",
    "make",
    "makes",
    "making",
    "option",
    "optional",
    "platform",
    "previously",
    "refer",
    "release",
    "see",
    "set",
    "setting",
    "show",
    "shows",
    "showing",
    "support",
    "supported",
    "supports",
    "update",
    "updated",
    "updates",
    "use",
    "used",
    "user",
    "users",
    "value",
    "values",
    "work",
    "works",
}

GENERIC_CODE_TOKENS = {
    "dbt",
    "sql",
    "json",
    "yaml",
    "yml",
    "csv",
    "xml",
    "api",
    "cli",
    "ide",
    "sso",
    "pat",
    "scim",
    "http",
    "https",
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "true",
    "false",
    "null",
    "none",
    "select",
    "id",
    "ids",
    "v1",
    "v2",
    "v3",
    "limit",
    "offset",
    "page",
    "per_page",
    "cursor",
    "order_by",
    "filter",
    "name",
    "type",
    "status",
    "state",
    "data",
    "error",
    "errors",
    "200",
    "201",
    "400",
    "401",
    "403",
    "404",
    "409",
    "500",
    "503",
}

# Distinctive phrases that map cleanly to published MT notes.
KNOWN_PHRASES = (
    "complexity limit of 200,000",
    "complexity limit",
    "200,000",
    "hybrid jobs",
    "externally triggered",
    "compile sql queries are now rejected",
    "compile sql",
    "scim api errors",
    "include email addresses",
    "warn last-run status",
)

LIVE_RELEASE_NOTES_URL = "https://docs.getdbt.com/docs/dbt-versions/release-notes"
DOCS_PR_BASE = "https://github.com/dbt-labs/docs.getdbt.com/pull/"
COMMIT_DATE_SLACK_DAYS = 5


MONTH_HEADING_RE = re.compile(
    r"^##\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b",
    re.I,
)
MONTH_NUMBERS = {
    "january": 1,
    "february": 2,
    "march": 3,
    "april": 4,
    "may": 5,
    "june": 6,
    "july": 7,
    "august": 8,
    "september": 9,
    "october": 10,
    "november": 11,
    "december": 12,
}


@dataclass
class ReleaseNoteBullet:
    raw: str
    plain: str
    content_words: list[str]
    content_str: str
    stems: set[str]
    code_tokens: set[str]
    year_month: tuple[int, int] | None = None


@dataclass
class DocsCommitInfo:
    sha: str
    committed_ts: int
    pr_url: str | None


@dataclass
class MatchResult:
    number: int
    title: str
    url: str
    summary: str | None
    match: str  # high | medium | none
    snippet: str
    why: str
    docs_pr: str | None = None
    notes: list[str] = field(default_factory=list)
    closed: bool = False
    skipped_reason: str | None = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--issues-repo",
        default="dbt-labs/docs-internal",
        help="Repo that holds Dotty Release Note issues",
    )
    parser.add_argument(
        "--mt-file",
        default="website/docs/docs/dbt-versions/release-notes.md",
        help="Path to multi-tenant release notes markdown",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN"),
        help="GitHub token with access to the issues repo",
    )
    parser.add_argument(
        "--auto-close",
        action="store_true",
        help="Close high-confidence matches (default: report only)",
    )
    parser.add_argument(
        "--dry-run-close",
        action="store_true",
        help="With --auto-close, print close actions without calling the API",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Optional cap on open Release Note issues to process (0 = all)",
    )
    parser.add_argument(
        "--st-pr-limit",
        type=int,
        default=20,
        help="Number of recent st-release-notes-v2 PRs in issues-repo to inspect (0 = skip)",
    )
    parser.add_argument(
        "--json-out",
        default="",
        help="Optional path to write full JSON results",
    )
    return parser.parse_args()


def _ssl_context() -> ssl.SSLContext:
    ctx = ssl.create_default_context()
    if sys.platform == "darwin" and not os.environ.get("SSL_CERT_FILE") and Path("/etc/ssl/cert.pem").exists():
        ctx.load_verify_locations(cafile="/etc/ssl/cert.pem")
    return ctx


def gh_api(token: str, path: str, method: str = "GET", body: dict | None = None) -> object:
    url = f"https://api.github.com{path}"
    data = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "release-note-matcher",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=60, context=_ssl_context()) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GitHub API {method} {path} failed: {exc.code} {detail}") from exc


def is_release_note_issue(item: dict) -> bool:
    if "pull_request" in item:
        return False
    title = item.get("title") or ""
    if RELEASE_NOTE_TITLE_RE.search(title):
        return True
    if DOCS_CHANGES_PR_TITLE_RE.search(title):
        body = item.get("body") or ""
        return bool(RELEASE_NOTE_PROMPT_RE.search(body))
    return False


def list_open_release_note_issues(token: str, repo: str, limit: int) -> list[dict]:
    owner, name = repo.split("/", 1)
    issues: list[dict] = []
    page = 1
    while True:
        query = urllib.parse.urlencode(
            {
                "state": "open",
                "per_page": 100,
                "page": page,
            }
        )
        batch = gh_api(token, f"/repos/{owner}/{name}/issues?{query}")
        assert isinstance(batch, list)
        if not batch:
            break
        for item in batch:
            if is_release_note_issue(item):
                issues.append(item)
                if limit and len(issues) >= limit:
                    return issues
        if len(batch) < 100:
            break
        page += 1
    return issues


def parse_dotty(body: str) -> dict:
    result: dict = {
        "summary": None,
        "customer_visible": None,
        "key_changes": [],
        "is_feature_flagged": None,
        "feature_flag_action": None,
        "feature_flag_keys": [],
        "decision": None,
        "repo": None,
        "pr_number": None,
        "has_json": False,
    }
    match = DOTTY_JSON_RE.search(body or "")
    if match:
        result["has_json"] = True
        try:
            payload = json.loads(match.group(1))
        except json.JSONDecodeError:
            payload = {}
        result["summary"] = payload.get("summary")
        result["customer_visible"] = payload.get("customer_visible")
        result["key_changes"] = payload.get("key_changes") or []
        result["is_feature_flagged"] = payload.get("is_feature_flagged")
        result["feature_flag_action"] = payload.get("feature_flag_action")
        result["feature_flag_keys"] = payload.get("feature_flag_keys") or []
        result["repo"] = payload.get("repo")
        result["pr_number"] = payload.get("pr_number")

    decision = DECISION_RE.search(body or "")
    if decision:
        result["decision"] = decision.group(1).strip().strip("[]")

    if not result["summary"]:
        why = re.search(r"\*\*Why:\*\*\s*(.+?)(?:\n\n|\*\*Key)", body or "", re.S)
        if why:
            result["summary"] = re.sub(r"\s+", " ", why.group(1)).strip()[:400]
    return result


def extract_source_pr(issue: dict, parsed: dict) -> str | None:
    if parsed.get("repo") and parsed.get("pr_number"):
        return f"https://github.com/{parsed['repo']}/pull/{parsed['pr_number']}".lower()
    body = issue.get("body") or ""
    match = BODY_SOURCE_PR_RE.search(body)
    if match:
        return f"https://github.com/{match.group(1)}/pull/{match.group(2)}".lower()
    title = issue.get("title") or ""
    title_match = TITLE_SOURCE_PR_RE.search(title)
    if title_match:
        return f"https://github.com/dbt-labs/{title_match.group(1)}/pull/{title_match.group(2)}".lower()
    return None


def _replace_constant(match: re.Match[str]) -> str:
    name = match.group(1).strip().lower()
    return CONSTANT_MAP.get(name, name.replace("_", " "))


def normalize_plain(text: str) -> str:
    """Convert Markdown/MDX release note prose to normalized lowercase plain text."""
    cleaned = re.sub(r"<Constant\s+name=[\"']([^\"']+)[\"']\s*/>", _replace_constant, text or "")
    cleaned = re.sub(r"<Term\s+id=[\"']([^\"']+)[\"']\s*/>", r"\1", cleaned)
    cleaned = re.sub(r"<Term\s+id=[\"'][^\"']+[\"']\s*>(.*?)</Term>", r"\1", cleaned)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
    cleaned = re.sub(r"^\s*-\s*\*\*(?:New|Enhancement|Fix|Behavior change|Beta|Preview):?\*\*:?\s*", "", cleaned, flags=re.I)
    cleaned = re.sub(r"[`*_\"'“”‘’]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().lower()
    return cleaned


def stem_word(word: str) -> str:
    w = word.lower()
    if len(w) <= 4 or "_" in w or any(ch.isdigit() for ch in w):
        return w
    if w.endswith("ies") and len(w) > 5:
        return w[:-3] + "y"
    if w.endswith("ing") and len(w) > 6:
        base = w[:-3]
        if len(base) >= 4 and base[-1] == base[-2]:
            base = base[:-1]
        return base
    if w.endswith("ed") and len(w) > 5:
        return w[:-2]
    if w.endswith("es") and len(w) > 5 and w[-3] in "sxz":
        return w[:-2]
    if w.endswith("s") and not w.endswith("ss") and len(w) > 4:
        return w[:-1]
    return w


def tokenize_content(plain_text: str) -> list[str]:
    return [
        tok
        for tok in re.findall(r"[a-z0-9_+$]+", plain_text.lower())
        if tok not in STOPWORDS and len(tok) >= 2
    ]


def distinctive_stems(plain_text: str) -> set[str]:
    stems: set[str] = set()
    for tok in tokenize_content(plain_text):
        if tok in GENERIC_RELEASE_WORDS:
            continue
        stemmed = stem_word(tok)
        if stemmed in GENERIC_RELEASE_WORDS or stemmed in STOPWORDS:
            continue
        if len(stemmed) >= 3 or any(ch.isdigit() for ch in stemmed):
            stems.add(stemmed)
    return stems


def extract_code_tokens(raw_text: str) -> set[str]:
    tokens: set[str] = set()
    for span in re.findall(r"`([^`\n]+)`", raw_text or ""):
        cleaned = span.strip()
        # Extract API path tails like assign-groups or oauth/authorize, or bare identifiers
        if "/" in cleaned and " " not in cleaned:
            parts = [
                p.strip("{}")
                for p in cleaned.split("/")
                if p and not p.startswith("{") and p.lower() not in {"api", "v1", "v2", "v3", "accounts", "projects"}
            ]
            for part in parts:
                low = part.lower()
                if len(low) >= 4 and low not in GENERIC_CODE_TOKENS:
                    tokens.add(low)
            continue
        for ident in re.findall(r"[A-Za-z0-9_.-]+", cleaned):
            low = ident.lower().strip(".-")
            if len(low) < 3 or low in GENERIC_CODE_TOKENS or low in STOPWORDS:
                continue
            # Treat snake_case, camelCase, UPPER_CASE, digits, or specific identifiers >= 5 chars as code tokens
            has_shape = (
                "_" in ident
                or "-" in ident
                or any(c.isupper() for c in ident[1:])
                or any(c.isdigit() for c in ident)
            )
            if has_shape or len(low) >= 5:
                tokens.add(low)
    return tokens


def parse_mt_bullets(mt_text: str) -> list[ReleaseNoteBullet]:
    bullets: list[ReleaseNoteBullet] = []
    in_comment = False
    current_lines: list[str] = []
    current_ym: tuple[int, int] | None = None

    def flush() -> None:
        if not current_lines:
            return
        raw = " ".join(line.strip() for line in current_lines).strip()
        current_lines.clear()
        plain = normalize_plain(raw)
        if len(plain) < 15:
            return
        content_words = tokenize_content(plain)
        bullets.append(
            ReleaseNoteBullet(
                raw=raw,
                plain=plain,
                content_words=content_words,
                content_str=" ".join(content_words),
                stems=distinctive_stems(plain),
                code_tokens=extract_code_tokens(raw),
                year_month=current_ym,
            )
        )

    for line in mt_text.splitlines():
        stripped = line.strip()
        if "<!--" in stripped:
            if "-->" not in stripped:
                flush()
                in_comment = True
            continue
        if in_comment:
            if "-->" in stripped:
                in_comment = False
            continue
        if stripped.startswith("#"):
            flush()
            m_match = MONTH_HEADING_RE.match(stripped)
            if m_match:
                current_ym = (int(m_match.group(2)), MONTH_NUMBERS[m_match.group(1).lower()])
            continue
        if stripped.startswith("- "):
            flush()
            current_lines.append(stripped)
        elif current_lines and stripped:
            current_lines.append(stripped)
        elif not stripped:
            flush()

    flush()
    return bullets


def parse_st_patch_entries(patch_text: str, st_pr_number: int) -> dict[str, list[tuple[int, str]]]:
    """Extract {source_pr_url: [(st_pr_number, bullet_text), ...]} from a unified diff or markdown text."""
    mapping: dict[str, list[tuple[int, str]]] = {}
    added_lines: list[str] = []
    for raw_line in patch_text.splitlines():
        if raw_line.startswith("+++") or raw_line.startswith("---") or raw_line.startswith("@@"):
            continue
        if raw_line.startswith("+"):
            added_lines.append(raw_line[1:])
        elif not raw_line.startswith("-"):
            added_lines.append(raw_line)

    text = "\n".join(added_lines)
    current_bullet: list[str] = []
    pos = 0
    lines = text.splitlines()
    while pos < len(lines):
        line = lines[pos]
        stripped = line.strip()
        if stripped.startswith("- **"):
            current_bullet = [stripped]
            pos += 1
            while pos < len(lines):
                nxt = lines[pos].strip()
                if not nxt or nxt.startswith("#") or nxt.startswith("- **"):
                    break
                current_bullet.append(nxt)
                pos += 1
            block = "\n".join(current_bullet)
            comment_match = ST_PR_COMMENT_RE.search(block)
            if comment_match:
                bullet_only = ST_PR_COMMENT_RE.sub("", block).strip()
                # Strip leading `- **ST Title**:` when present so the body matches MT bullets cleanly
                body_only = re.sub(r"^-\s*\*\*[^*]+\*\*:\s*", "", bullet_only).strip()
                for repo_slug, pr_num in BODY_SOURCE_PR_RE.findall(comment_match.group(1)):
                    pr_url = f"https://github.com/{repo_slug}/pull/{pr_num}".lower()
                    mapping.setdefault(pr_url, []).append((st_pr_number, body_only or bullet_only))
            continue
        pos += 1
    return mapping


def load_st_pr_map(token: str, issues_repo: str, st_pr_limit: int) -> dict[str, list[tuple[int, str]]]:
    """Load source PR -> ST release note wording from recent st-release-notes-v2 PRs."""
    if st_pr_limit <= 0:
        return {}
    owner, name = issues_repo.split("/", 1)
    combined: dict[str, list[tuple[int, str]]] = {}
    try:
        pulls = gh_api(
            token,
            f"/repos/{owner}/{name}/pulls?state=all&sort=created&direction=desc&per_page=100",
        )
    except RuntimeError as exc:
        print(f"[warn] Could not list PRs in {issues_repo} for ST matching: {exc}", file=sys.stderr)
        return {}

    if not isinstance(pulls, list):
        return {}

    st_pulls = [
        pr
        for pr in pulls
        if (pr.get("head") or {}).get("ref", "").startswith("st-release-notes-v2-")
    ][:st_pr_limit]

    for pr in st_pulls:
        pr_number = pr.get("number")
        if not pr_number:
            continue
        try:
            files = gh_api(token, f"/repos/{owner}/{name}/pulls/{pr_number}/files?per_page=10")
        except RuntimeError:
            continue
        if not isinstance(files, list):
            continue
        for file_obj in files:
            patch = file_obj.get("patch") or ""
            if not patch:
                continue
            parsed = parse_st_patch_entries(patch, pr_number)
            for pr_url, entries in parsed.items():
                combined.setdefault(pr_url, []).extend(entries)
    return combined


def match_st_entry_to_mt(st_body: str, bullets: list[ReleaseNoteBullet]) -> ReleaseNoteBullet | None:
    st_plain = normalize_plain(st_body)
    st_words = tokenize_content(st_plain)
    if len(st_words) < 4:
        return None
    st_word_set = set(st_words)

    best_bullet: ReleaseNoteBullet | None = None
    best_ratio = 0.0
    for bullet in bullets:
        if len(st_plain) >= 30 and st_plain in bullet.plain:
            return bullet
        # Check tail substring in case only the opening subject changed during ST->MT sync
        if len(st_plain) >= 50 and st_plain[20:] in bullet.plain:
            return bullet
        mt_word_set = set(bullet.content_words)
        shared = st_word_set & mt_word_set
        if len(shared) < min(5, len(st_word_set)):
            continue
        ratio = len(shared) / max(1, len(st_word_set))
        if ratio >= 0.65 and ratio > best_ratio:
            best_ratio = ratio
            best_bullet = bullet
    return best_bullet


def candidate_clauses(summary: str | None, customer_visible: str | None, key_changes: list[str]) -> list[str]:
    clauses: list[str] = []
    for text in [summary, customer_visible, *key_changes]:
        if not text:
            continue
        plain = normalize_plain(text)
        if 25 <= len(plain) <= 220:
            clauses.append(plain)
        for part in re.split(r"[.;]|,\s+(?:allowing|letting|giving|exposing|making|so\s+that|instead\s+of)\b", plain):
            part = part.strip()
            if len(part) >= 30:
                clauses.append(part)
    seen: set[str] = set()
    unique: list[str] = []
    for item in clauses:
        if item not in seen:
            seen.add(item)
            unique.append(item)
    return unique


def content_ngrams(text: str, size: int) -> list[str]:
    words = tokenize_content(normalize_plain(text))
    grams: list[str] = []
    for idx in range(0, max(0, len(words) - size + 1)):
        chunk = words[idx : idx + size]
        if sum(1 for w in chunk if len(w) >= 4 and w not in GENERIC_RELEASE_WORDS) >= 3:
            grams.append(" ".join(chunk))
    return grams


def parse_iso_timestamp(value: str | None) -> int | None:
    if not value:
        return None
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
        return int(parsed.timestamp())
    except ValueError:
        return None


def find_docs_commit(
    mt_file: Path,
    raw_bullet: str,
    token: str | None = None,
    cache: dict[str, DocsCommitInfo | None] | None = None,
) -> DocsCommitInfo | None:
    if cache is not None and raw_bullet in cache:
        return cache[raw_bullet]

    # Check multiple slices of the bullet and pick the earliest introducing commit,
    # so later editorial fixes (such as "via" -> "using") do not mask the original PR.
    body_start = re.sub(r"^\s*-\s*\*\*[^*]+\*\*:?\s*", "", raw_bullet)
    candidates = [
        body_start[:60].strip(),
        body_start[35:95].strip(),
        body_start[70:130].strip(),
    ]
    commit_sha = None
    commit_ts = 0
    for needle in candidates:
        if len(needle) < 25:
            continue
        try:
            out = subprocess.check_output(
                ["git", "log", "-S", needle, "--reverse", "--format=%H %ct", "--", str(mt_file)],
                text=True,
                stderr=subprocess.DEVNULL,
            ).strip()
        except subprocess.CalledProcessError:
            continue
        if out:
            first_line = out.splitlines()[0].strip()
            parts = first_line.split()
            if len(parts) >= 2:
                ts = int(parts[1])
                if commit_sha is None or ts < commit_ts:
                    commit_sha = parts[0]
                    commit_ts = ts

    if not commit_sha:
        if cache is not None:
            cache[raw_bullet] = None
        return None

    pr_url = None
    if token:
        try:
            data = gh_api(token, f"/repos/dbt-labs/docs.getdbt.com/commits/{commit_sha}/pulls")
            if isinstance(data, list) and data:
                number = data[0].get("number")
                if number:
                    pr_url = f"{DOCS_PR_BASE}{number}"
        except RuntimeError:
            pass
    if not pr_url:
        try:
            pulls = subprocess.check_output(
                ["gh", "api", f"repos/dbt-labs/docs.getdbt.com/commits/{commit_sha}/pulls"],
                text=True,
                stderr=subprocess.DEVNULL,
                env={**os.environ},
            )
            data = json.loads(pulls)
            if data and data[0].get("number"):
                pr_url = f"{DOCS_PR_BASE}{data[0]['number']}"
        except (subprocess.CalledProcessError, json.JSONDecodeError, IndexError, KeyError, FileNotFoundError):
            pass

    info = DocsCommitInfo(sha=commit_sha, committed_ts=commit_ts, pr_url=pr_url)
    if cache is not None:
        cache[raw_bullet] = info
    return info


def bullet_predates_issue_month(issue: dict, bullet: ReleaseNoteBullet) -> bool:
    """Return True if the bullet sits under an earlier month section than the issue."""
    if not bullet.year_month:
        return False
    issue_ts = parse_iso_timestamp(issue.get("created_at"))
    if not issue_ts:
        return False
    # Allow a 5-day buffer at the start of a month for PRs merged right before month-end
    effective_dt = dt.datetime.fromtimestamp(issue_ts - COMMIT_DATE_SLACK_DAYS * 86400, tz=dt.timezone.utc)
    return bullet.year_month < (effective_dt.year, effective_dt.month)


def is_older_than_issue(issue: dict, commit_info: DocsCommitInfo | None) -> bool:
    """Return True if the MT release note commit predates the issue by > COMMIT_DATE_SLACK_DAYS."""
    if not commit_info or not commit_info.committed_ts:
        return False
    issue_ts = parse_iso_timestamp(issue.get("created_at"))
    if not issue_ts:
        return False
    return commit_info.committed_ts < (issue_ts - COMMIT_DATE_SLACK_DAYS * 86400)


def score_issue(
    issue: dict,
    bullets: list[ReleaseNoteBullet],
    mt_file: Path,
    st_pr_map: dict[str, list[tuple[int, str]]] | None = None,
    token: str | None = None,
    commit_cache: dict[str, DocsCommitInfo | None] | None = None,
) -> MatchResult:
    body = issue.get("body") or ""
    parsed = parse_dotty(body)
    summary = parsed["summary"]
    customer_visible = parsed["customer_visible"]
    key_changes = parsed["key_changes"]
    notes: list[str] = []

    if parsed["is_feature_flagged"] and parsed["feature_flag_action"] == "added":
        notes.append("feature flag added; may still be off")
    if parsed["decision"] and "NOT" in str(parsed["decision"]).upper():
        notes.append(f"Dotty decision {parsed['decision']}")
    if not parsed["has_json"] and not summary:
        notes.append("no Dotty summary")

    skipped_older_reason: str | None = None

    def finalize(
        level: str,
        bullet: ReleaseNoteBullet,
        why: str,
        allow_date_check: bool = True,
    ) -> MatchResult:
        nonlocal skipped_older_reason
        if allow_date_check and bullet_predates_issue_month(issue, bullet):
            ym = f"{bullet.year_month[0]:04d}-{bullet.year_month[1]:02d}" if bullet.year_month else "earlier month"
            skipped_older_reason = f"ignored pre-existing release note from {ym}"
            notes.append(f"matched older release note section {ym} (before issue created)")
            return MatchResult(
                number=issue["number"],
                title=issue.get("title") or "",
                url=issue.get("html_url") or issue.get("url") or "",
                summary=summary,
                match="none",
                snippet="",
                why=skipped_older_reason,
                docs_pr=None,
                notes=list(notes),
            )

        commit_info = find_docs_commit(mt_file, bullet.raw, token=token, cache=commit_cache)
        docs_pr = commit_info.pr_url if commit_info else None
        local_notes = list(notes)
        final_level = level

        if allow_date_check and is_older_than_issue(issue, commit_info):
            commit_date = dt.datetime.fromtimestamp(commit_info.committed_ts, tz=dt.timezone.utc).strftime("%Y-%m-%d")
            skipped_older_reason = f"ignored pre-existing release note from {commit_date}"
            notes.append(f"matched older release note from {commit_date} (before issue created)")
            return MatchResult(
                number=issue["number"],
                title=issue.get("title") or "",
                url=issue.get("html_url") or issue.get("url") or "",
                summary=summary,
                match="none",
                snippet="",
                why=skipped_older_reason,
                docs_pr=None,
                notes=list(notes),
            )

        if final_level == "high":
            if parsed["is_feature_flagged"] and parsed["feature_flag_action"] == "added":
                final_level = "medium"
                local_notes.append("leave open until flag is live")
            if not parsed["has_json"] and not summary and "ST release notes PR" not in why:
                final_level = "medium"
                local_notes.append("matched without Dotty summary; confirm before close")

        return MatchResult(
            number=issue["number"],
            title=issue.get("title") or "",
            url=issue.get("html_url") or issue.get("url") or "",
            summary=summary,
            match=final_level,
            snippet=bullet.raw[:280],
            why=why,
            docs_pr=docs_pr,
            notes=local_notes,
        )

    # Layer 1: Exact source PR link via st-release-notes-v2-* PRs, verified in MT file.
    source_pr = extract_source_pr(issue, parsed)
    if source_pr and st_pr_map and source_pr in st_pr_map:
        for st_pr_num, st_body in st_pr_map[source_pr]:
            mt_bullet = match_st_entry_to_mt(st_body, bullets)
            if mt_bullet is not None:
                short_pr = source_pr.replace("https://github.com/dbt-labs/", "")
                return finalize(
                    "high",
                    mt_bullet,
                    f"matched {short_pr} via ST release notes PR #{st_pr_num}",
                )

    # Layer 2: Known phrases, normalized clauses (>= 35 chars), and 6-word content n-grams.
    issue_texts = [t for t in [summary, customer_visible, *key_changes] if t]
    issue_blob = " ".join(issue_texts)
    issue_blob_lower = issue_blob.lower()

    for known in KNOWN_PHRASES:
        if known.lower() in issue_blob_lower:
            for bullet in bullets:
                if known.lower() in bullet.raw.lower() or normalize_plain(known) in bullet.plain:
                    res = finalize("high", bullet, f"matched known phrase “{known}”")
                    if res.match != "none":
                        return res

    for clause in candidate_clauses(summary, customer_visible, key_changes):
        if len(clause) < 35:
            continue
        for bullet in bullets:
            if clause in bullet.plain:
                res = finalize("high", bullet, f"matched clause “{clause[:60]}”")
                if res.match != "none":
                    return res

    for size in (6, 5):
        for text in [summary, customer_visible, *key_changes]:
            for gram in content_ngrams(text or "", size)[:20]:
                if size == 5 and len(gram) < 28:
                    continue
                for bullet in bullets:
                    if f" {gram} " in f" {bullet.content_str} ":
                        res = finalize("high", bullet, f"matched phrase “{gram}”")
                        if res.match != "none":
                            return res

    # Layer 3: Plain-English rewrite matching (code identifiers + distinctive stems on same bullet).
    issue_code = extract_code_tokens(issue_blob)
    primary_plain = normalize_plain(" ".join(t for t in [summary, customer_visible] if t))
    all_plain = normalize_plain(issue_blob)
    primary_stems = distinctive_stems(primary_plain)
    all_stems = distinctive_stems(all_plain)

    best_high: tuple[float, ReleaseNoteBullet, str] | None = None
    best_medium: tuple[float, ReleaseNoteBullet, str] | None = None

    for bullet in bullets:
        if bullet_predates_issue_month(issue, bullet):
            continue
        shared_code = issue_code & bullet.code_tokens
        shared_primary = primary_stems & bullet.stems
        shared_all = all_stems & bullet.stems

        if not shared_code and len(shared_all) < 4:
            continue

        min_stems_denom = max(1, min(len(primary_stems) or len(all_stems), len(bullet.stems)))
        overlap_ratio = len(shared_primary or shared_all) / min_stems_denom
        bullet_coverage = len(shared_all) / max(1, len(bullet.stems))

        # High 3a: 2+ shared distinctive code tokens + solid stem overlap on the same bullet
        if len(shared_code) >= 2 and len(shared_all) >= 4 and (overlap_ratio >= 0.40 or bullet_coverage >= 0.40):
            score = len(shared_code) * 3 + len(shared_all)
            code_list = ", ".join(sorted(shared_code)[:3])
            reason = f"matched code identifiers ({code_list}) + {len(shared_all)} shared terms"
            if best_high is None or score > best_high[0]:
                best_high = (score, bullet, reason)
            continue

        # High 3b: 1 shared distinctive code token + strong plain-English context overlap
        if len(shared_code) == 1 and len(shared_all) >= 6 and (overlap_ratio >= 0.45 or bullet_coverage >= 0.45):
            code_tok = next(iter(shared_code))
            score = 4 + len(shared_all) + overlap_ratio
            reason = f"matched `{code_tok}` + {len(shared_all)} shared terms"
            if best_high is None or score > best_high[0]:
                best_high = (score, bullet, reason)
            continue

        # High 3c: Plain-English rewrite without backticked code overlap (for example UI copy fixes).
        # Guard: if the MT bullet centers on different backticked code identifiers not in the issue,
        # do not auto-close on prose words alone.
        conflicting_bullet_code = bullet.code_tokens - issue_code
        if (
            not conflicting_bullet_code
            and len(shared_all) >= 7
            and overlap_ratio >= 0.50
            and bullet_coverage >= 0.45
        ):
            score = len(shared_all) + overlap_ratio
            sample = ", ".join(sorted(shared_all)[:5])
            reason = f"plain-English overlap ({len(shared_all)} terms: {sample})"
            if best_high is None or score > best_high[0]:
                best_high = (score, bullet, reason)
            continue

        # Medium candidates for human review
        if shared_code and len(shared_all) >= 3:
            code_list = ", ".join(sorted(shared_code)[:2])
            score = len(shared_code) * 2 + len(shared_all)
            reason = f"partial overlap `{code_list}` ({len(shared_all)} shared terms)"
            if best_medium is None or score > best_medium[0]:
                best_medium = (score, bullet, reason)
        elif len(shared_all) >= 5 and overlap_ratio >= 0.40:
            sample = ", ".join(sorted(shared_all)[:4])
            score = len(shared_all) + overlap_ratio
            reason = f"partial plain-English overlap ({len(shared_all)} terms: {sample})"
            if best_medium is None or score > best_medium[0]:
                best_medium = (score, bullet, reason)

    if best_high is not None:
        res = finalize("high", best_high[1], best_high[2])
        if res.match != "none":
            return res

    if best_medium is not None:
        res = finalize("medium", best_medium[1], best_medium[2])
        if res.match != "none":
            return res

    return MatchResult(
        number=issue["number"],
        title=issue.get("title") or "",
        url=issue.get("html_url") or issue.get("url") or "",
        summary=summary,
        match="none",
        snippet="",
        why=skipped_older_reason or "no clear match in MT release notes",
        docs_pr=None,
        notes=notes,
    )


def close_comment(result: MatchResult) -> str:
    matched = result.snippet or result.summary or result.why
    docs_pr_line = (
        f"Added via docs PR {result.docs_pr}"
        if result.docs_pr
        else "Docs PR could not be determined automatically."
    )
    return (
        "Already documented in the "
        f"[multi-tenant release notes]({LIVE_RELEASE_NOTES_URL}).\n\n"
        f"Matched entry: {matched}\n\n"
        f"{docs_pr_line}\n\n"
        "Closing as already documented."
    )


def close_issue(token: str, repo: str, result: MatchResult, dry_run: bool) -> None:
    owner, name = repo.split("/", 1)
    body = close_comment(result)
    if dry_run:
        print(f"[dry-run] would close #{result.number} ({result.docs_pr}) — {result.why}")
        return
    gh_api(
        token,
        f"/repos/{owner}/{name}/issues/{result.number}/comments",
        method="POST",
        body={"body": body},
    )
    gh_api(
        token,
        f"/repos/{owner}/{name}/issues/{result.number}",
        method="PATCH",
        body={"state": "closed"},
    )


def write_summary(results: list[MatchResult], auto_close: bool) -> None:
    high = [item for item in results if item.match == "high"]
    medium = [item for item in results if item.match == "medium"]
    none = [item for item in results if item.match == "none"]
    closed = [item for item in results if item.closed]

    lines = [
        "## Release note matcher",
        "",
        f"- Open Release Note issues scanned: **{len(results)}**",
        f"- High: **{len(high)}**",
        f"- Medium: **{len(medium)}**",
        f"- None: **{len(none)}**",
        f"- Auto-close enabled: **{auto_close}**",
        f"- Closed this run: **{len(closed)}**",
        "",
    ]
    if high:
        lines.append("### High matches")
        for item in high:
            status = "closed" if item.closed else item.skipped_reason or "report only"
            pr = item.docs_pr or "docs PR not found"
            lines.append(
                f"- [#{item.number}]({item.url}) — {status} — {pr} — {item.why}"
            )
        lines.append("")
    if medium:
        lines.append("### Medium matches (left open)")
        for item in medium:
            lines.append(f"- [#{item.number}]({item.url}) — {item.why}")
        lines.append("")

    summary = "\n".join(lines)
    print(summary)
    github_step_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if github_step_summary:
        Path(github_step_summary).write_text(summary + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    if not args.token:
        raise SystemExit("A GitHub token is required (--token, GH_TOKEN, or GITHUB_TOKEN)")

    mt_file = Path(args.mt_file)
    if not mt_file.exists():
        raise SystemExit(f"MT release notes file not found: {mt_file}")

    mt_text = mt_file.read_text(encoding="utf-8")
    bullets = parse_mt_bullets(mt_text)
    st_pr_map = load_st_pr_map(args.token, args.issues_repo, args.st_pr_limit)
    commit_cache: dict[str, DocsCommitInfo | None] = {}

    try:
        issues = list_open_release_note_issues(args.token, args.issues_repo, args.limit)
    except RuntimeError as exc:
        raise SystemExit(str(exc)) from exc

    results: list[MatchResult] = []
    for issue in issues:
        result = score_issue(
            issue,
            bullets,
            mt_file,
            st_pr_map=st_pr_map,
            token=args.token,
            commit_cache=commit_cache,
        )
        if args.auto_close and result.match == "high":
            if not result.docs_pr:
                result.skipped_reason = "high match but docs PR not found; left open"
            else:
                close_issue(args.token, args.issues_repo, result, args.dry_run_close)
                result.closed = not args.dry_run_close
                if args.dry_run_close:
                    result.skipped_reason = "dry-run close"
        results.append(result)

    write_summary(results, args.auto_close)

    if args.json_out:
        Path(args.json_out).write_text(
            json.dumps([asdict(item) for item in results], indent=2),
            encoding="utf-8",
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
