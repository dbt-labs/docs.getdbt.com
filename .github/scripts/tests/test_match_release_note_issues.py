"""Tests for matching docs-internal release note issues against MT release notes.

Run from the repo root:
    python3 -m unittest discover -s .github/scripts/tests
"""

from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from match_release_note_issues import (  # noqa: E402
    DocsCommitInfo,
    extract_source_pr,
    is_release_note_issue,
    parse_mt_bullets,
    parse_st_patch_entries,
    score_issue,
)

MT_SAMPLE = """---
title: "dbt release notes"
---

## November 2026

#### Studio IDE {#studio-ide-november-2026}

- **Fix:** A long error popup, such as a file path from a lint warning, now wraps onto the next line so you can still see the dismiss button.
- **Behavior change:** dbt v2 runs in <Constant name="studio_ide" /> now follow the [`threads`](/docs/running-a-dbt-project/using-threads) value in your [user credentials](/docs/dbt-platform-environments#set-user-credentials) instead of the dbt v2 default (for example, 48 on Snowflake). The same change also applies to Canvas runs. Jobs, dbt v1 runs, and editor features such as autocomplete are unchanged.

#### Catalog {#catalog-november-2026}

- **Fix:** In the [Discovery API](/docs/dbt-apis/discovery-api), a model's parents used to leave out models that live in another project ([Mesh](/docs/mesh/about-mesh)). Those parent models are included now. Lineage already listed these parents.

#### APIs, Identity, and Administration {#apis-identity-and-administration-november-2026}

- **Enhancement:** The [Assign User to Groups API](/dbt-cloud/api-v3?version=2#/operations/Assign%20User%20to%20Groups) (`POST /api/v3/accounts/{account_id}/assign-groups/`) now accepts `add_group_ids` and `remove_group_ids`. Use these fields to add a user to groups, or remove them from groups, without replacing every group they belong to. Sending `desired_group_ids` still replaces the full list.
- **Behavior change:** On [Admin API v2](/dbt-cloud/api-v2#/operations/List%20Repositories) and [Admin API v3](/dbt-cloud/api-v3#/operations/List%20Repositories) of the repositories API, `full_name` and `web_url` are now taken from the repository's web address. `full_name` is deprecated. The API no longer returns a custom `full_name` you set earlier.

#### dbt platform {#dbt-platform-november-2026}

- **Enhancement:** On the environment settings page, the delete button now says **Delete environment**. The old label was **Delete**, which made it easier to remove the wrong thing.

## September 2026

#### APIs, Identity, and Administration {#apis-identity-and-administration-september-2026}

- **Fix:** Cross-account write attempts now return HTTP 403 Forbidden instead of a generic 500 Internal Server Error, so you get a clear rejection when the account doesn't match.
- **Fix:** A request with a bad value now returns a clear error instead of a server error. An unsupported `order_by` value on version 3 list endpoints, and a negative or too-large `limit` or `offset` on version 2 list endpoints, return a 400 error.
- **Behavior change:** Creating accounts using `POST /api/v2/accounts/` is now blocked for service tokens, account-scoped personal access tokens (PATs), and OAuth access tokens.
"""

ST_PATCH_SAMPLE = """@@ -30,0 +31,14 @@
+### Behavior change
+
+#### APIs, Identity, and Administration
+
+- **Repository `full_name` comes from the repository address**: On [Admin API v2](/dbt-cloud/api-v2#/operations/List%20Repositories) and [Admin API v3](/dbt-cloud/api-v3#/operations/List%20Repositories) of the repositories API, `full_name` and `web_url` are now taken from the repository's web address. `full_name` is deprecated. The API no longer returns a custom `full_name` you set earlier.
+  <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pull/19870` ✅ -->
+
+- **User id filters return only people on the account**: When you filter the account users list by user ID (`pk` or `pk__in`), the API now returns only members of that account.
+  <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pull/20149` -->
+
+- **Clearer environment delete button**: On the environment settings page, the delete button now says **Delete environment**. The old label was **Delete**, which made it easier to remove the wrong thing.
+  <!-- PRs: `https://github.com/dbt-labs/dbt-ui/pull/2334` ✅ -->
"""


def _make_issue(
    number: int,
    title: str,
    repo: str,
    pr_number: int,
    summary: str,
    key_changes: list[str] | None = None,
    customer_visible: str | None = None,
    created_at: str = "2026-11-16T08:32:37Z",
    is_feature_flagged: bool = False,
    feature_flag_action: str | None = None,
) -> dict:
    payload = {
        "schema_version": "1.0",
        "is_user_facing": True,
        "summary": summary,
        "key_changes": key_changes or [],
        "customer_visible": customer_visible or summary,
        "is_feature_flagged": is_feature_flagged,
        "feature_flag_action": feature_flag_action,
        "pr_number": pr_number,
        "repo": repo,
    }
    body = (
        f"Please review the merged PR and create appropriate release notes in the documentation. "
        f"Link to the merged PR: https://github.com/{repo}/pull/{pr_number}\n\n"
        f"**Decision:** [CUSTOMER_FACING]\n\n"
        f"```json\n{json.dumps(payload)}\n```"
    )
    return {
        "number": number,
        "title": title,
        "html_url": f"https://github.com/dbt-labs/docs-internal/issues/{number}",
        "created_at": created_at,
        "body": body,
    }


class IssueFilterTest(unittest.TestCase):
    def test_accepts_release_note_and_docs_changes_issues(self):
        self.assertTrue(
            is_release_note_issue(
                {
                    "title": "Release Note: Changes from dbt-cloud PR #19870",
                    "body": "Please review the merged PR...",
                }
            )
        )
        self.assertTrue(
            is_release_note_issue(
                {
                    "title": "Docs changes from dbt-ui PR #2334",
                    "body": "Please review the merged PR and create appropriate release notes in the documentation.",
                }
            )
        )

    def test_ignores_pull_requests_and_manual_prose_issues(self):
        self.assertFalse(
            is_release_note_issue(
                {
                    "title": "Release Note: Changes from dbt-cloud PR #19870",
                    "pull_request": {},
                }
            )
        )
        self.assertFalse(
            is_release_note_issue(
                {
                    "title": "execute_sql on remote MCP is now read-only; docs still say it isn't",
                    "body": "**Page(s) requiring updates**",
                }
            )
        )


class ReleaseNoteMatcherTest(unittest.TestCase):
    def setUp(self):
        self.bullets = parse_mt_bullets(MT_SAMPLE)
        self.st_map = parse_st_patch_entries(ST_PATCH_SAMPLE, 2887)
        self.nov_commit = DocsCommitInfo(
            sha="eaeb74e4e7",
            committed_ts=1794946344,  # 2026-11-17
            pr_url="https://github.com/dbt-labs/docs.getdbt.com/pull/10374",
        )

    def test_plain_english_rewrite_matches_with_and_without_st_bridge(self):
        issue = _make_issue(
            number=2881,
            title="Release Note: Changes from dbt-cloud PR #19870",
            repo="dbt-labs/dbt-cloud",
            pr_number=19870,
            summary=(
                "The `full_name` field on repository API responses (v2 and v3) now returns a value "
                "computed from the repository's remote URL instead of the stored database value, "
                "and is marked as deprecated. The `web_url` field is similarly affected."
            ),
            key_changes=[
                "`full_name` in v2/v3 repository API responses is now computed from `remote_url` rather than the stored column value",
                "Customers who supplied a custom `full_name` via the API will see the computed value returned instead of their stored value",
            ],
        )
        with patch("match_release_note_issues.find_docs_commit", return_value=self.nov_commit):
            via_st = score_issue(issue, self.bullets, Path("release-notes.md"), st_pr_map=self.st_map)
            plain_only = score_issue(issue, self.bullets, Path("release-notes.md"), st_pr_map={})

        self.assertEqual(via_st.match, "high")
        self.assertIn("ST release notes PR #2887", via_st.why)
        self.assertEqual(plain_only.match, "high")
        self.assertIn("full_name", plain_only.why)

    def test_removed_security_entry_in_st_patch_stays_unmatched(self):
        issue = _make_issue(
            number=2885,
            title="Release Note: Changes from dbt-cloud PR #20149",
            repo="dbt-labs/dbt-cloud",
            pr_number=20149,
            summary=(
                "The v2 and v3 account users list endpoints now scope `pk` and `pk__in` filters "
                "to account members only; passing foreign user IDs no longer returns those users' profiles."
            ),
        )
        with patch("match_release_note_issues.find_docs_commit", return_value=self.nov_commit):
            res = score_issue(issue, self.bullets, Path("release-notes.md"), st_pr_map=self.st_map)

        self.assertEqual(res.match, "none")

    def test_dbt_ui_plain_english_rewrite_matches(self):
        toast_issue = _make_issue(
            number=2883,
            title="Docs changes from dbt-ui PR #2328",
            repo="dbt-labs/dbt-ui",
            pr_number=2328,
            summary=(
                "Fixed a bug in dbt Studio where error toasts containing long unbroken strings "
                "(such as file paths from SQLFluff warnings) would overflow the toast card and push "
                "the dismiss button off-screen. The toast message now wraps and the dismiss button remains visible."
            ),
        )
        delete_btn_issue = _make_issue(
            number=2877,
            title="Docs changes from dbt-ui PR #2334",
            repo="dbt-labs/dbt-ui",
            pr_number=2334,
            summary=(
                "The delete button on the environment settings page now reads 'Delete environment' "
                "instead of 'Delete', making it clearer what will be deleted."
            ),
        )
        with patch("match_release_note_issues.find_docs_commit", return_value=self.nov_commit):
            res_toast = score_issue(toast_issue, self.bullets, Path("release-notes.md"), st_pr_map={})
            res_delete = score_issue(delete_btn_issue, self.bullets, Path("release-notes.md"), st_pr_map=self.st_map)

        self.assertEqual(res_toast.match, "high")
        self.assertEqual(res_delete.match, "high")
        self.assertEqual(extract_source_pr(delete_btn_issue, {}), "https://github.com/dbt-labs/dbt-ui/pull/2334")

    def test_older_commit_before_issue_creation_is_ignored(self):
        sept_commit = DocsCommitInfo(
            sha="7ffaf7a558",
            committed_ts=1789380000,  # 2026-09-14
            pr_url="https://github.com/dbt-labs/docs.getdbt.com/pull/9900",
        )
        oct_issue = _make_issue(
            number=2740,
            title="Release Note: Changes from dbt-cloud PR #19590",
            repo="dbt-labs/dbt-cloud",
            pr_number=19590,
            summary="Cross-account write attempts now return HTTP 403 Forbidden instead of a generic 500 Internal Server Error.",
            created_at="2026-10-16T16:19:30Z",
        )
        with patch("match_release_note_issues.find_docs_commit", return_value=sept_commit):
            res = score_issue(oct_issue, self.bullets, Path("release-notes.md"), st_pr_map={})

        self.assertEqual(res.match, "none")
        self.assertIn("ignored pre-existing release note", res.why)

    def test_feature_flag_added_downgrades_high_to_medium(self):
        issue = _make_issue(
            number=2999,
            title="Release Note: Changes from dbt-cloud PR #19735",
            repo="dbt-labs/dbt-cloud",
            pr_number=19735,
            summary=(
                "The POST /api/v3/accounts/{id}/assign-groups/ endpoint now accepts `add_group_ids` "
                "and `remove_group_ids` in addition to `desired_group_ids`."
            ),
            is_feature_flagged=True,
            feature_flag_action="added",
        )
        with patch("match_release_note_issues.find_docs_commit", return_value=self.nov_commit):
            res = score_issue(issue, self.bullets, Path("release-notes.md"), st_pr_map={})

        self.assertEqual(res.match, "medium")
        self.assertIn("leave open until flag is live", res.notes)

    def test_november_issue_does_not_match_september_section_or_generic_pagination(self):
        nov_invite_issue = _make_issue(
            number=2914,
            title="Release Note: Changes from dbt-cloud PR #20311",
            repo="dbt-labs/dbt-cloud",
            pr_number=20311,
            summary=(
                "API tokens (service tokens and account-scoped PATs) are now blocked from calling "
                "the invite endpoints on both v2 and v3 REST APIs, returning HTTP 403."
            ),
            created_at="2026-11-19T12:00:00Z",
        )
        pagination_issue = _make_issue(
            number=2533,
            title="Release Note: Changes from dbt-cloud PR #19130",
            repo="dbt-labs/dbt-cloud",
            pr_number=19130,
            summary=(
                "The v3 List Service Tokens API endpoint now accepts `limit` and `offset` query "
                "parameters for pagination, and the default behavior no longer caps results at 100."
            ),
            created_at="2026-09-02T12:00:00Z",
        )
        with patch("match_release_note_issues.find_docs_commit", return_value=self.nov_commit):
            res_invite = score_issue(nov_invite_issue, self.bullets, Path("release-notes.md"), st_pr_map={})
            res_page = score_issue(pagination_issue, self.bullets, Path("release-notes.md"), st_pr_map={})

        self.assertEqual(res_invite.match, "none")
        self.assertNotEqual(res_page.match, "high")


if __name__ == "__main__":
    unittest.main()
