#!/usr/bin/env python3
"""Shared helpers for filing dbt platform release notes under product areas.

The multi-tenant release notes file groups notes by month (`## November 2026`)
and then by product area (`#### Catalog {#catalog-november-2026}`). The list of
areas lives in website/release-note-areas.json. This module is used by the
single-tenant sync (extract_release_notes.py) and by the filing check for
hand-written notes (file_release_notes.py).

Area headings are level four on purpose. The RSS feed plugin creates an item
for every level two and level three heading in the file, so a level four
heading never notifies subscribers.
"""

from __future__ import annotations

import difflib
import json
import re
from dataclasses import dataclass
from pathlib import Path

DEFAULT_AREAS_FILE = (
    Path(__file__).resolve().parents[2] / "website" / "release-note-areas.json"
)

AREA_HEADING_RE = re.compile(r"^####\s+(.+?)(?:\s*\{#[^}]*\})?\s*$")
ANCHORED_AREA_HEADING_RE = re.compile(r"^####\s+.+?\s*\{#[^}]+\}\s*$")
BULLET_RE = re.compile(r"^-\s")
DOCS_LINK_RE = re.compile(
    r"\]\((?:https?://(?:www\.)?docs\.getdbt\.com)?(/[^)#?\s]+)"
)
WIZARD_RE = re.compile(r'<Constant name="wizard"|\bWizard\b')
NOTE_TYPE_RE = re.compile(r"^-\s+\*\*([A-Za-z ]+?):?\*\*")

# Order of notes inside an area. Lifecycle labels (Beta, Preview, and so on)
# announce something new, so they sort with New.
TYPE_ORDER = {
    "enhancement": 1,
    "enhancements": 1,
    "enhanced": 1,
    "fix": 2,
    "fixes": 2,
    "behavior change": 3,
    "behavior changes": 3,
}


@dataclass(frozen=True)
class Area:
    name: str
    definition: str
    links: tuple[str, ...]
    names: tuple[str, ...]
    constants: tuple[str, ...]
    st_aliases: tuple[str, ...]
    section: bool


@dataclass(frozen=True)
class Areas:
    areas: tuple[Area, ...]
    fallback: str

    @property
    def heading_names(self) -> list[str]:
        """Areas that are `####` headings, in the order they appear in a month."""
        return [area.name for area in self.areas if not area.section]

    def from_st_heading(self, heading: str | None) -> str | None:
        """Map a single-tenant `###` area heading to an area, ignoring case."""
        if not heading:
            return None
        key = heading.strip().lower()
        for area in self.areas:
            if area.section:
                continue
            if key == area.name.lower() or key in area.st_aliases:
                return area.name
        return None

    def classify(self, text: str) -> tuple[str | None, str]:
        """Pick an area from strong signals only: a docs link or a product name.

        Returns (area, reason). The area is None when nothing clear is found,
        so the caller can ask a person instead of guessing.
        """
        for link in DOCS_LINK_RE.findall(text):
            best: tuple[int, str] | None = None
            for area in self.areas:
                for prefix in area.links:
                    if link.startswith(prefix) and (
                        best is None or len(prefix) > best[0]
                    ):
                        best = (len(prefix), area.name)
            if best:
                return best[1], f"docs link `{link}`"

        earliest: tuple[int, str, str] | None = None
        for area in self.areas:
            patterns = [
                (name, re.compile(r"\b" + re.escape(name) + r"\b"))
                for name in area.names
            ] + [
                (name, re.compile(r'<Constant name="' + re.escape(name) + r'"'))
                for name in area.constants
            ]
            for label, pattern in patterns:
                match = pattern.search(text)
                if match and (earliest is None or match.start() < earliest[0]):
                    earliest = (match.start(), area.name, label)
        if earliest:
            return earliest[1], f"mentions `{earliest[2]}`"
        return None, "no clear signal"

    def closest(self, name: str) -> str | None:
        """Return the area a misspelled heading most likely meant."""
        lowered = {area.lower(): area for area in self.heading_names}
        match = difflib.get_close_matches(name.lower(), list(lowered), n=1, cutoff=0.8)
        return lowered[match[0]] if match else None


def load_areas(path: Path | str | None = None) -> Areas:
    data = json.loads(Path(path or DEFAULT_AREAS_FILE).read_text(encoding="utf-8"))
    areas = tuple(
        Area(
            name=item["name"],
            definition=item.get("definition", ""),
            links=tuple(item.get("links", [])),
            names=tuple(item.get("names", [])),
            constants=tuple(item.get("constants", [])),
            st_aliases=tuple(alias.lower() for alias in item.get("st_aliases", [])),
            section=bool(item.get("section", False)),
        )
        for item in data["areas"]
    )
    return Areas(areas=areas, fallback=data["fallback"])


def subgroup_for(area: str, text: str) -> str | None:
    """dbt AI and agents splits Wizard notes into two sub-groups."""
    if area != "dbt AI and agents" or not WIZARD_RE.search(text):
        return None
    return "Wizard Desktop" if "Desktop" in text else "Wizard"


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def area_anchor(area: str, month_heading: str) -> str:
    return f"{slugify(area)}-{slugify(month_heading)}"


def uses_area_layout(lines: list[str]) -> bool:
    """True when the file already has anchored `####` area headings."""
    return any(ANCHORED_AREA_HEADING_RE.match(line) for line in lines)


def month_range(lines: list[str], month_heading: str) -> tuple[int, int]:
    """Return (index of the month heading, index after the month's last line)."""
    target = f"## {month_heading}"
    start = next(
        (index for index, line in enumerate(lines) if line.strip() == target), None
    )
    if start is None:
        raise ValueError(f"Month heading not found: {target!r}")
    end = next(
        (
            index
            for index in range(start + 1, len(lines))
            if lines[index].startswith("## ")
        ),
        len(lines),
    )
    return start, end


def _areas_end(lines: list[str], start: int, end: int) -> int:
    """Areas sit between the month heading and its first `###` section."""
    return next(
        (
            index
            for index in range(start + 1, end)
            if lines[index].startswith("### ")
        ),
        end,
    )


def _area_headings(lines: list[str], start: int, end: int) -> list[tuple[int, str]]:
    found = []
    for index in range(start + 1, end):
        match = AREA_HEADING_RE.match(lines[index])
        if match:
            found.append((index, match.group(1).strip()))
    return found


def _section_end(lines: list[str], heading_index: int, end: int) -> int:
    """Index after the last line that belongs to a `####` area."""
    return next(
        (
            index
            for index in range(heading_index + 1, end)
            if lines[index].startswith(("#### ", "### ", "## "))
        ),
        end,
    )


def _insert_section(lines: list[str], at: int, block: list[str]) -> None:
    """Insert a heading block at `at`, keeping one blank line around it."""
    while at > 0 and not lines[at - 1].strip():
        at -= 1
    following_blank = at < len(lines) and not lines[at].strip()
    lines[at:at] = [""] + block + ([] if following_blank else [""])


def insert_notes(
    lines: list[str],
    month_heading: str,
    area: str,
    notes: list[list[str]],
    areas: Areas,
    subgroup: str | None = None,
) -> None:
    """Insert notes under `#### <area>` in a month, creating headings as needed.

    Each note is a list of lines (a bullet and any lines nested under it). A
    new note goes first among the notes of its type in the area or sub-group
    (see `type_rank`). Mutates `lines`.
    """
    _insert_notes(lines, month_heading, area, notes, areas, subgroup)
    start, end = month_range(lines, month_heading)
    sort_notes(lines, areas, start, end)


def _insert_notes(
    lines: list[str],
    month_heading: str,
    area: str,
    notes: list[list[str]],
    areas: Areas,
    subgroup: str | None = None,
) -> None:
    """Insert notes at the top of the area or sub-group."""
    flat = [line for note in notes for line in note]
    start, month_end = month_range(lines, month_heading)
    end = _areas_end(lines, start, month_end)
    headings = _area_headings(lines, start, end)
    order = areas.heading_names
    heading_index = next((index for index, name in headings if name == area), None)

    if heading_index is None:
        rank = order.index(area) if area in order else len(order)
        at = next(
            (
                index
                for index, name in headings
                if name in order and order.index(name) > rank
            ),
            end,
        )
        block = [f"#### {area} {{#{area_anchor(area, month_heading)}}}", ""]
        if subgroup:
            block += [f"##### {subgroup}", ""]
        _insert_section(lines, at, block + flat)
        return

    section_end = _section_end(lines, heading_index, end)
    if subgroup:
        sub_index = next(
            (
                index
                for index in range(heading_index + 1, section_end)
                if lines[index].strip() == f"##### {subgroup}"
            ),
            None,
        )
        if sub_index is None:
            # Keep sub-groups in alphabetical order.
            later = next(
                (
                    index
                    for index in range(heading_index + 1, section_end)
                    if lines[index].startswith("##### ")
                    and lines[index][6:].strip() > subgroup
                ),
                section_end,
            )
            _insert_section(lines, later, [f"##### {subgroup}", ""] + flat)
            return
        heading_index, section_end = sub_index, next(
            (
                index
                for index in range(sub_index + 1, section_end)
                if lines[index].startswith("##### ")
            ),
            section_end,
        )

    at = heading_index + 1
    while at < section_end and not lines[at].strip():
        at += 1
    if at < section_end and BULLET_RE.match(lines[at]):
        lines[at:at] = flat
    else:
        # The area has no loose bullets yet (only sub-groups, or it is empty).
        _insert_section(lines, at, flat)


def split_notes(lines: list[str]) -> tuple[list[str], list[list[str]]]:
    """Split lines into (lines before the first bullet, notes).

    A note is a top-level bullet plus the lines under it, without trailing
    blank lines.
    """
    before: list[str] = []
    notes: list[list[str]] = []
    for line in lines:
        if BULLET_RE.match(line):
            notes.append([line])
        elif notes:
            notes[-1].append(line)
        else:
            before.append(line)
    for note in notes:
        while note and not note[-1].strip():
            note.pop()
    return before, notes


def unfiled_range(lines: list[str], month_heading: str) -> tuple[int, int]:
    """Lines directly under a month heading, before its first area or section."""
    start, month_end = month_range(lines, month_heading)
    end = next(
        (
            index
            for index in range(start + 1, month_end)
            if lines[index].startswith(("#### ", "### "))
        ),
        month_end,
    )
    return start + 1, end


def type_rank(note: list[str]) -> int:
    """New (and lifecycle labels) first, then Enhancement, Fix, Behavior change."""
    match = NOTE_TYPE_RE.match(note[0])
    return TYPE_ORDER.get(match.group(1).strip().lower(), 0) if match else 0


def sort_notes(
    lines: list[str], areas: Areas, start: int = 0, end: int | None = None
) -> bool:
    """Sort the notes under each area heading by type, keeping their order
    within a type. Only touches lists under a known `####` area heading (and
    its `#####` sub-groups). Mutates `lines`; returns True if anything moved.
    """
    end = len(lines) if end is None else end
    known = set(areas.heading_names)
    result: list[str] = []
    segment: list[str] = []
    in_area = False

    def flush() -> None:
        if in_area:
            before, notes = split_notes(segment)
            if notes:
                trailing = 0
                while trailing < len(segment) and not segment[-1 - trailing].strip():
                    trailing += 1
                ordered = sorted(notes, key=type_rank)
                result.extend(before)
                result.extend(line for note in ordered for line in note)
                result.extend([""] * trailing)
                segment.clear()
                return
        result.extend(segment)
        segment.clear()

    for line in lines[start:end]:
        if line.startswith("#"):
            flush()
            if line.startswith(("## ", "### ")):
                in_area = False
            elif line.startswith("#### "):
                match = AREA_HEADING_RE.match(line)
                in_area = bool(match and match.group(1).strip() in known)
            result.append(line)
        else:
            segment.append(line)
    flush()

    changed = result != lines[start:end]
    lines[start:end] = result
    return changed
