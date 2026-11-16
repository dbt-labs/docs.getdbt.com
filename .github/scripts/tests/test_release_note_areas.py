"""Tests for filing release notes by product area.

Run from the repo root:
    python3 -m unittest discover -s .github/scripts/tests
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from extract_release_notes import extract_bullets  # noqa: E402
from file_release_notes import file_notes, fix_headings  # noqa: E402
from release_note_areas import (  # noqa: E402
    insert_notes,
    sort_notes,
    load_areas,
    subgroup_for,
    uses_area_layout,
)

AREAS = load_areas()

PAGE = """Intro text.

## November 2026

#### dbt AI and agents {#dbt-ai-and-agents-november-2026}

- **New:** Remote MCP note.

##### Wizard Desktop

- **Fix:** Desktop note.

#### Catalog {#catalog-november-2026}

- **Fix:** Existing Catalog note.

### Summit 2026 announcements

- **New:** Announcement note.

## October 2026

#### Catalog {#catalog-october-2026}

- **Fix:** October note.
""".splitlines()


class ClassifyTest(unittest.TestCase):
    def test_docs_link_wins(self):
        area, _ = AREAS.classify("See [costs](/docs/explore/cost-insights#x) in Catalog.")
        self.assertEqual(area, "Cost Insights")

    def test_insights_copilot_and_canvas_file_under_dbt_platform(self):
        self.assertEqual(AREAS.classify("Cost Insights charts load faster.")[0], "Cost Insights")
        self.assertEqual(AREAS.classify("Insights charts keep their sort order.")[0], "dbt platform")
        self.assertEqual(AREAS.classify('<Constant name="copilot" /> shows a clearer message.')[0], "dbt platform")
        self.assertEqual(AREAS.classify("Canvas uploads resume after a failure.")[0], "dbt platform")
        self.assertEqual(AREAS.from_st_heading("Insights"), "dbt platform")
        self.assertEqual(AREAS.from_st_heading("Canvas"), "dbt platform")
        self.assertEqual(AREAS.from_st_heading("dbt v2"), "dbt v2")

    def test_longest_link_prefix_wins(self):
        self.assertEqual(
            AREAS.classify("[x](/docs/deploy/dbt-state-about)")[0], "dbt State"
        )
        self.assertEqual(
            AREAS.classify("[x](/docs/deploy/job-notifications)")[0],
            "Orchestration and run status",
        )

    def test_product_name(self):
        area, _ = AREAS.classify('In <Constant name="studio_ide" />, tabs stay open.')
        self.assertEqual(area, "Studio IDE")

    def test_generic_words_are_not_a_signal(self):
        area, _ = AREAS.classify("API requests and job runs now check permissions.")
        self.assertIsNone(area)

    def test_single_tenant_headings(self):
        self.assertEqual(
            AREAS.from_st_heading("Orchestration and Run Status"),
            "Orchestration and run status",
        )
        self.assertEqual(AREAS.from_st_heading("Copilot"), "dbt platform")
        self.assertEqual(
            AREAS.from_st_heading("dbt Copilot and agents"), "dbt AI and agents"
        )
        self.assertIsNone(AREAS.from_st_heading("Packages"))

    def test_subgroup(self):
        desktop = 'In <Constant name="wizard" /> Desktop, chats sync.'
        self.assertEqual(subgroup_for("dbt AI and agents", desktop), "Wizard Desktop")
        self.assertIsNone(subgroup_for("dbt AI and agents", "Remote MCP note."))
        self.assertIsNone(subgroup_for("Catalog", desktop))


class ExtractTest(unittest.TestCase):
    EXPECTED = [
        ("New", "**Title**: A new thing.", "Catalog"),
        ("Fix", "**Title**: A fix.", "dbt v2"),
    ]

    def test_types_nested_under_the_date(self):
        week = [
            "## November 11, 2026",
            "### New",
            "#### Catalog",
            "- **Title**: A new thing.",
            "### Fixes",
            "#### dbt v2",
            "- **Title**: A fix.",
        ]
        self.assertEqual(extract_bullets(week), self.EXPECTED)

    def test_older_layout_with_types_at_level_two(self):
        week = [
            "## November 4, 2026",
            "## New",
            "### Catalog",
            "- **Title**: A new thing.",
            "## Fixes",
            "### dbt v2",
            "- **Title**: A fix.",
        ]
        self.assertEqual(extract_bullets(week), self.EXPECTED)


class InsertTest(unittest.TestCase):
    def test_existing_area_gets_note_on_top(self):
        lines = list(PAGE)
        insert_notes(lines, "November 2026", "Catalog", [["- **New:** Added."]], AREAS)
        at = lines.index("#### Catalog {#catalog-november-2026}")
        self.assertEqual(lines[at + 2], "- **New:** Added.")
        self.assertEqual(lines[at + 3], "- **Fix:** Existing Catalog note.")

    def test_new_area_goes_in_order_before_the_event_section(self):
        lines = list(PAGE)
        insert_notes(lines, "November 2026", "Cost Insights", [["- **New:** Chart."]], AREAS)
        heading = lines.index("#### Cost Insights {#cost-insights-november-2026}")
        self.assertGreater(heading, lines.index("#### Catalog {#catalog-november-2026}"))
        self.assertLess(heading, lines.index("### Summit 2026 announcements"))
        self.assertEqual(lines[heading - 1], "")
        self.assertEqual(lines[heading + 2], "- **New:** Chart.")

    def test_new_area_goes_before_later_areas(self):
        lines = list(PAGE)
        insert_notes(lines, "November 2026", "Studio IDE", [["- **New:** Tabs."]], AREAS)
        heading = lines.index("#### Studio IDE {#studio-ide-november-2026}")
        self.assertLess(heading, lines.index("#### Catalog {#catalog-november-2026}"))

    def test_new_subgroup_keeps_order(self):
        lines = list(PAGE)
        insert_notes(
            lines,
            "November 2026",
            "dbt AI and agents",
            [["- **New:** Wizard note."]],
            AREAS,
            subgroup="Wizard",
        )
        self.assertLess(
            lines.index("##### Wizard"), lines.index("##### Wizard Desktop")
        )
        self.assertEqual(lines[lines.index("##### Wizard") + 2], "- **New:** Wizard note.")

    def test_note_goes_first_among_its_type(self):
        lines = list(PAGE)
        at = lines.index("- **Fix:** Existing Catalog note.")
        lines[at:at] = ["- **New:** Older new note."]
        insert_notes(lines, "November 2026", "Catalog", [["- **Fix:** Added fix."]], AREAS)
        insert_notes(lines, "November 2026", "Catalog", [["- **Beta:** Added beta."]], AREAS)
        self.assertEqual(
            lines[at : at + 4],
            [
                "- **Beta:** Added beta.",
                "- **New:** Older new note.",
                "- **Fix:** Added fix.",
                "- **Fix:** Existing Catalog note.",
            ],
        )

    def test_sort_keeps_nested_lines_and_skips_event_sections(self):
        lines = [
            "## November 2026",
            "",
            "- **Fix:** Unfiled stays first.",
            "- **New:** Unfiled stays second.",
            "",
            "#### Catalog {#catalog-november-2026}",
            "",
            "- **Behavior change**: Last.",
            "- **Fix:** Third.",
            "  - Nested under third.",
            "- **Enhancement:** Second.",
            "- **Preview:** First.",
            "",
            "### Summit 2026 announcements",
            "",
            "- **Fix:** Event stays first.",
            "- **New:** Event stays second.",
        ]
        expected = lines[:7] + [
            "- **Preview:** First.",
            "- **Enhancement:** Second.",
            "- **Fix:** Third.",
            "  - Nested under third.",
            "- **Behavior change**: Last.",
        ] + lines[12:]
        self.assertTrue(sort_notes(lines, AREAS))
        self.assertEqual(lines, expected)
        self.assertFalse(sort_notes(lines, AREAS))

    def test_other_months_are_untouched(self):
        lines = list(PAGE)
        october = lines[lines.index("## October 2026"):]
        insert_notes(lines, "November 2026", "Catalog", [["- **New:** Added."]], AREAS)
        self.assertEqual(lines[lines.index("## October 2026"):], october)

    def test_no_new_level_two_or_three_headings(self):
        lines = list(PAGE)
        before = [line for line in lines if line.startswith(("## ", "### "))]
        insert_notes(lines, "November 2026", "Cost Insights", [["- **New:** Chart."]], AREAS)
        self.assertEqual(
            [line for line in lines if line.startswith(("## ", "### "))], before
        )


class FileNotesTest(unittest.TestCase):
    def test_files_clear_notes_and_leaves_unclear_ones(self):
        lines = list(PAGE)
        at = lines.index("## November 2026") + 1
        lines[at:at] = [
            "",
            "- **New:** The [lineage](/docs/explore/explore-projects) view zooms.",
            "  - Nested detail.",
            "- **Fix:** Charts keep their legend order.",
        ]
        filed, unclear, _ = file_notes(lines, AREAS)
        self.assertEqual([item[1] for item in filed], ["Catalog"])
        self.assertEqual(len(unclear), 1)
        catalog = lines.index("#### Catalog {#catalog-november-2026}")
        self.assertEqual(lines[catalog + 3], "  - Nested detail.")
        self.assertEqual(
            lines[lines.index("## November 2026") + 2],
            "- **Fix:** Charts keep their legend order.",
        )

    def test_filed_page_is_left_alone(self):
        lines = list(PAGE)
        filed, unclear, _ = file_notes(lines, AREAS)
        self.assertEqual((filed, unclear, lines), ([], [], PAGE))

    def test_missing_anchor_and_typo(self):
        lines = [line.replace(" {#catalog-november-2026}", "") for line in PAGE]
        lines[lines.index("#### Catalog {#catalog-october-2026}")] = "#### Catalogue"
        fixed, typos = fix_headings(lines, {"November 2026", "October 2026"}, AREAS)
        self.assertIn("#### Catalog {#catalog-november-2026}", lines)
        self.assertEqual(len(fixed), 1)
        self.assertEqual(len(typos), 1)

    def test_layout_detection(self):
        self.assertTrue(uses_area_layout(PAGE))
        self.assertFalse(uses_area_layout(["## November 2026", "- **New:** Flat."]))


if __name__ == "__main__":
    unittest.main()
