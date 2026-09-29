#!/usr/bin/env python3
"""Match docs-internal Release Note issues against published MT release notes.

Report-only by default. With --auto-close, closes high-confidence matches and
leaves a comment linking the live release notes and the docs PR that added them.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass, field
from pathlib import Path

RELEASE_NOTE_TITLE_RE = re.compile(r"^Release Note:", re.I)
DOTTY_JSON_RE = re.compile(r"```json\s*(\{.*?\})\s*```", re.S)
DECISION_RE = re.compile(r"\*\*Decision:\*\*\s*\[?([^\]\n]+)\]?")
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
        "--json-out",
        default="",
        help="Optional path to write full JSON results",
    )
    return parser.parse_args()


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
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"GitHub API {method} {path} failed: {exc.code} {detail}") from exc


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
            if "pull_request" in item:
                continue
            title = item.get("title") or ""
            if RELEASE_NOTE_TITLE_RE.search(title):
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
        "key_changes": [],
        "is_feature_flagged": None,
        "feature_flag_action": None,
        "feature_flag_keys": [],
        "decision": None,
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
        result["key_changes"] = payload.get("key_changes") or []
        result["is_feature_flagged"] = payload.get("is_feature_flagged")
        result["feature_flag_action"] = payload.get("feature_flag_action")
        result["feature_flag_keys"] = payload.get("feature_flag_keys") or []

    decision = DECISION_RE.search(body or "")
    if decision:
        result["decision"] = decision.group(1).strip().strip("[]")

    if not result["summary"]:
        why = re.search(r"\*\*Why:\*\*\s*(.+?)(?:\n\n|\*\*Key)", body or "", re.S)
        if why:
            result["summary"] = re.sub(r"\s+", " ", why.group(1)).strip()[:400]
    return result


def ngrams(text: str, size: int) -> list[str]:
    words = [
        word
        for word in re.findall(r"[A-Za-z0-9_+$]+", text or "")
        if word.lower() not in STOPWORDS
    ]
    chunks: list[str] = []
    for index in range(0, max(0, len(words) - size + 1)):
        chunk = words[index : index + size]
        if sum(1 for word in chunk if len(word) >= 4) >= 2:
            chunks.append(" ".join(chunk))
    return chunks


def candidate_phrases(summary: str | None, key_changes: list[str]) -> list[str]:
    phrases: list[str] = []
    blob = " ".join([summary or ""] + key_changes)
    blob_lower = blob.lower()
    phrases.extend(re.findall(r"`([^`]+)`", blob))
    for known in KNOWN_PHRASES:
        if known.lower() in blob_lower:
            phrases.append(known)
    for key in key_changes:
        cleaned = re.sub(r"[`*]", "", key).strip()
        if len(cleaned) >= 20:
            phrases.append(cleaned)
    if summary and 20 <= len(summary) <= 180:
        phrases.append(summary)
    phrases.extend(ngrams(summary or "", 5)[:15])
    phrases.extend(ngrams(summary or "", 4)[:15])

    seen: set[str] = set()
    unique: list[str] = []
    for phrase in phrases:
        normalized = phrase.lower().strip()
        if len(normalized) < 8 or normalized in seen:
            continue
        seen.add(normalized)
        unique.append(phrase.strip())
    return unique


def find_line(text: str, text_lower: str, phrase: str) -> str | None:
    needle = phrase.lower().strip()
    if len(needle) < 12:
        return None
    index = text_lower.find(needle)
    if index < 0:
        return None
    start = text.rfind("\n", 0, index) + 1
    end = text.find("\n", index)
    if end < 0:
        end = len(text)
    return text[start:end].strip()[:280]


def find_docs_pr(mt_file: Path, phrase: str) -> str | None:
    if not phrase or len(phrase) < 12:
        return None
    try:
        commit = subprocess.check_output(
            ["git", "log", "-S", phrase, "--format=%H", "-1", "--", str(mt_file)],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except subprocess.CalledProcessError:
        return None
    if not commit:
        return None
    try:
        pulls = subprocess.check_output(
            ["gh", "api", f"repos/dbt-labs/docs.getdbt.com/commits/{commit}/pulls"],
            text=True,
            stderr=subprocess.DEVNULL,
            env={**os.environ},
        )
        data = json.loads(pulls)
        if data:
            number = data[0].get("number")
            if number:
                return f"{DOCS_PR_BASE}{number}"
    except (subprocess.CalledProcessError, json.JSONDecodeError, IndexError, KeyError):
        pass
    return None


def score_issue(issue: dict, mt_text: str, mt_lower: str, mt_file: Path) -> MatchResult:
    parsed = parse_dotty(issue.get("body") or "")
    summary = parsed["summary"]
    notes: list[str] = []

    if parsed["is_feature_flagged"] and parsed["feature_flag_action"] == "added":
        notes.append("feature flag added; may still be off")
    if parsed["decision"] and "NOT" in str(parsed["decision"]).upper():
        notes.append(f"Dotty decision {parsed['decision']}")
    if not parsed["has_json"] and not summary:
        notes.append("no Dotty summary")

    phrases = candidate_phrases(summary, parsed["key_changes"])
    hit_line = None
    hit_phrase = None
    medium_line = None
    medium_phrase = None
    known_lower = {item.lower() for item in KNOWN_PHRASES}
    for phrase in phrases:
        line = find_line(mt_text, mt_lower, phrase)
        if not line:
            continue
        if phrase.lower() in known_lower or len(phrase) >= 40:
            hit_line = line
            hit_phrase = phrase
            break
        if medium_line is None:
            medium_line = line
            medium_phrase = phrase

    docs_pr = None
    search_phrase = hit_phrase or medium_phrase
    search_line = hit_line or medium_line
    if search_phrase:
        docs_pr = find_docs_pr(mt_file, search_phrase)
        if not docs_pr and search_line:
            plain = re.sub(r"<[^>]+>", "", search_line)
            plain = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", plain)
            plain = re.sub(r"[*`]", "", plain).strip()
            for chunk in (plain[20:70], plain[:50]):
                if len(chunk) >= 20:
                    docs_pr = find_docs_pr(mt_file, chunk)
                    if docs_pr:
                        break

    if hit_line and hit_phrase:
        level = "high"
        if parsed["is_feature_flagged"] and parsed["feature_flag_action"] == "added":
            level = "medium"
            notes.append("leave open until flag is live")
        if not parsed["has_json"] and not summary:
            level = "medium"
            notes.append("matched by title/PR only; confirm before close")
        why = f'matched “{hit_phrase}”'
        return MatchResult(
            number=issue["number"],
            title=issue.get("title") or "",
            url=issue.get("html_url") or "",
            summary=summary,
            match=level,
            snippet=hit_line,
            why=why,
            docs_pr=docs_pr,
            notes=notes,
        )

    if medium_line and medium_phrase:
        return MatchResult(
            number=issue["number"],
            title=issue.get("title") or "",
            url=issue.get("html_url") or "",
            summary=summary,
            match="medium",
            snippet=medium_line,
            why=f'partial overlap “{medium_phrase}”',
            docs_pr=docs_pr,
            notes=notes,
        )

    return MatchResult(
        number=issue["number"],
        title=issue.get("title") or "",
        url=issue.get("html_url") or "",
        summary=summary,
        match="none",
        snippet="",
        why="no clear match in MT release notes",
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
        print(f"[dry-run] would close #{result.number}")
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
    mt_lower = mt_text.lower()

    issues = list_open_release_note_issues(args.token, args.issues_repo, args.limit)
    results: list[MatchResult] = []
    for issue in issues:
        result = score_issue(issue, mt_text, mt_lower, mt_file)
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
