"""Shared jaffle_shop_7 DAG model + mobject builders.

Used by the dbt State clone demos (clone_demos.py). Pure data + mobject
factories — no Scene, no global config side effects beyond colour definitions.
"""

from manim import *
import numpy as np

# ---------------------------------------------------------------- palette
TB_50 = ManimColor.from_hex("#f9fafb")
TB_200 = ManimColor.from_hex("#e5e7eb")
TB_300 = ManimColor.from_hex("#d1d5dc")
TB_400 = ManimColor.from_hex("#99a1af")
TB_500 = ManimColor.from_hex("#6a7282")
TB_700 = ManimColor.from_hex("#364153")
TB_900 = ManimColor.from_hex("#101828")

GREEN_500 = ManimColor.from_hex("#7ca035")   # sources / pass
BLUE_500 = ManimColor.from_hex("#067fe0")    # models
ORANGE = ManimColor.from_hex("#fe6703")      # tests (count)
AMBER = ManimColor.from_hex("#cb9900")       # warn
RED = ManimColor.from_hex("#c20059")         # fail
PURPLE = ManimColor.from_hex("#632ff5")      # snapshots

TYPE_COLOR = {
    "source": GREEN_500,
    "model": BLUE_500,
    "test": ORANGE,
    "snapshot": PURPLE,
}

# test-status -> (pill colour, glyph)
STATUS_STYLE = {
    "pass": (GREEN_500, "✓"),
    "warn": (AMBER, "!"),
    "fail": (RED, "✗"),
    "none": (TB_400, ""),
}

# ---------------------------------------------------------------- graph data
NODES = {
    "raw_customers": {"type": "source", "mat": "seed"},
    "raw_orders": {"type": "source", "mat": "seed"},
    "raw_items": {"type": "source", "mat": "seed"},
    "raw_products": {"type": "source", "mat": "seed"},
    "raw_supplies": {"type": "source", "mat": "seed"},
    "raw_stores": {"type": "source", "mat": "seed"},
    "stg_customers": {"type": "model", "mat": "view"},
    "stg_orders": {"type": "model", "mat": "view"},
    "stg_order_items": {"type": "model", "mat": "view"},
    "stg_products": {"type": "model", "mat": "view"},
    "stg_supplies": {"type": "model", "mat": "view"},
    "stg_locations": {"type": "model", "mat": "view"},
    "order_items": {"type": "model", "mat": "table"},
    "products": {"type": "model", "mat": "table"},
    "supplies": {"type": "model", "mat": "table"},
    "locations": {"type": "model", "mat": "table"},
    "orders": {"type": "model", "mat": "table"},
    "customers": {"type": "model", "mat": "view"},
}

# model/source -> model dependency edges (the data backbone)
BACKBONE_EDGES = [
    ("raw_customers", "stg_customers"),
    ("raw_items", "stg_order_items"),
    ("raw_orders", "stg_orders"),
    ("raw_products", "stg_products"),
    ("raw_stores", "stg_locations"),
    ("raw_supplies", "stg_supplies"),
    ("stg_customers", "customers"),
    ("stg_locations", "locations"),
    ("stg_order_items", "order_items"),
    ("stg_orders", "order_items"),
    ("stg_orders", "orders"),
    ("stg_products", "order_items"),
    ("stg_products", "products"),
    ("stg_supplies", "order_items"),
    ("stg_supplies", "supplies"),
    ("order_items", "orders"),
    ("orders", "customers"),
]

COLUMNS = [
    ["raw_customers", "raw_orders", "raw_items", "raw_products", "raw_supplies", "raw_stores"],
    ["stg_customers", "stg_orders", "stg_order_items", "stg_products", "stg_supplies", "stg_locations"],
    ["order_items", "products", "supplies", "locations"],
    ["orders"],
    ["customers"],
]

ROW = {
    "raw_customers": 0, "raw_orders": 1, "raw_items": 2,
    "raw_products": 3, "raw_supplies": 4, "raw_stores": 5,
    "stg_customers": 0, "stg_orders": 1, "stg_order_items": 2,
    "stg_products": 3, "stg_supplies": 4, "stg_locations": 5,
    "order_items": 2, "products": 3, "supplies": 4, "locations": 5,
    "orders": 1,
    "customers": 0,
}
N_ROWS = 6

# base count of tests attached to each node (matches the v4 still)
BASE_TEST_COUNT = {
    "stg_customers": 2, "stg_orders": 3, "stg_order_items": 4,
    "stg_products": 2, "stg_supplies": 2, "stg_locations": 3,
    "order_items": 4, "orders": 6, "customers": 4,
}

# ---------------------------------------------------------------- node sets
SOURCES = COLUMNS[0]                          # raw_* shared sources
MODEL_NODES = {n for c in COLUMNS[1:] for n in c}
ALL_PASS = {n: "pass" for n in NODES}

# ---------------------------------------------------------------- DAG box geometry
BOX_W = 1.62
BOX_H = 0.62
TOP_Y = 2.55
BOT_Y = -2.65
X_LEFT = -5.65
X_RIGHT = 5.65

# ----------------------------------------------- multi-environment scene layout
# Shared geometry + CLI palette for the stacked-schema clone demos (clone_demos.py).
BAND_W = 12.4
SRC_W = 1.8
GAP_SRC = 0.4
SCHEMA_W = BAND_W - SRC_W - GAP_SRC
GAP = 0.4
TITLE_H = 0.75
CLI_H = 2.7
SIZE_H = {"small": 1.7, "medium": 2.75, "big": 3.9}

CONTENT_LEFT = -BAND_W / 2
SRC_CX = CONTENT_LEFT + SRC_W / 2
SCHEMA_LEFT = CONTENT_LEFT + SRC_W + GAP_SRC
SCHEMA_CX = SCHEMA_LEFT + SCHEMA_W / 2

# terminal-panel line colours, keyed by the role of each captured CLI line
CLI_COLOR = {
    "cmd": WHITE,
    "info": TB_400,
    "clone": ManimColor.from_hex("#7aa2d6"),
    "reuse": TB_400,
    "ok": GREEN_500,
    "warn": AMBER,
    "fail": RED,
    "summary": TB_200,
    "dim": TB_500,
}


def make_model_box(name, info, present=True):
    """A source/model node. present=False renders it dotted + dimmed (absent
    in this environment)."""
    ntype = info["type"]
    mat = info["mat"]
    color = TYPE_COLOR[ntype]
    rounded = ntype == "source"
    mat_label = "source" if ntype == "source" else mat

    if present:
        if ntype == "source":
            fill_op, stroke_w = 0.16, 2.2
        elif mat == "view":
            fill_op, stroke_w = 0.07, 1.8
        else:  # table / incremental
            fill_op, stroke_w = 0.20, 2.4
        stroke_c = color
        text_c = TB_900
        mat_c = TB_500
    else:  # absent — dotted + dimmed
        fill_op, stroke_w = 0.0, 1.6
        stroke_c = TB_400
        text_c = TB_400
        mat_c = TB_400

    if rounded:
        rect = RoundedRectangle(corner_radius=0.16, width=BOX_W, height=BOX_H,
                                fill_color=color, fill_opacity=fill_op,
                                stroke_color=stroke_c, stroke_width=stroke_w)
    else:
        rect = Rectangle(width=BOX_W, height=BOX_H,
                         fill_color=color, fill_opacity=fill_op,
                         stroke_color=stroke_c, stroke_width=stroke_w)
    base_rect = rect
    if not present:
        rect = DashedVMobject(rect, num_dashes=26, equal_lengths=False)
        rect.set_stroke(TB_400, width=stroke_w)

    label = Text(name, font="PT Mono", font_size=15, color=text_c, weight=BOLD)
    if label.width > BOX_W - 0.18:
        label.scale((BOX_W - 0.18) / label.width)
    label.move_to(base_rect.get_center() + 0.09 * UP)

    mat_txt = Text(mat_label, font="PT Mono", font_size=11, color=mat_c)
    mat_txt.move_to(base_rect.get_center() + 0.17 * DOWN)

    group = VGroup(rect, label, mat_txt)
    group.rect = base_rect
    return group


def make_test_badge(count, status="pass"):
    """Count capsule, coloured by worst test status (pass/warn/fail/none)."""
    color, glyph = STATUS_STYLE.get(status, STATUS_STYLE["pass"])
    text = f"{count} test" + ("" if count == 1 else "s")
    if glyph:
        text = f"{text} {glyph}"
    txt = Text(text, font="PT Mono", font_size=11, color=WHITE, weight=BOLD)
    h = txt.height + 0.12
    pill = RoundedRectangle(corner_radius=h / 2, width=txt.width + 0.22, height=h,
                            fill_color=color, fill_opacity=1.0, stroke_width=0)
    txt.move_to(pill.get_center())
    return VGroup(pill, txt)


def build_env_dag(present, test_status=None, test_count=None, edge_color=TB_400,
                  include_sources=True):
    """Build the jaffle_shop DAG centred on the origin at v4 scale.

    present:     set of node names materialized in this env (others dotted/dim).
    test_status: dict node -> 'pass'|'warn'|'fail' for present nodes with tests.
    test_count:  dict node -> int overrides for BASE_TEST_COUNT (e.g. orders=7).
    include_sources: when False, omit the source column entirely (sources are
                 rendered once, shared, outside the env). Only model nodes shown.

    Edges are drawn only between two present, rendered nodes — no dangling/dim
    arrows to deferred or absent upstreams.
    Returns a VGroup; `.rects` maps node name -> its rect for later anchoring.
    """
    present = set(present)
    test_status = test_status or {}
    counts = dict(BASE_TEST_COUNT)
    if test_count:
        counts.update(test_count)

    cols = COLUMNS if include_sources else COLUMNS[1:]
    xs = np.linspace(X_LEFT, X_RIGHT, len(cols))
    row_y = np.linspace(TOP_Y, BOT_Y, N_ROWS)
    boxes = {}
    rects = {}
    for ci, col in enumerate(cols):
        for name in col:
            box = make_model_box(name, NODES[name], present=name in present)
            box.move_to([xs[ci], row_y[ROW[name]], 0])
            boxes[name] = box
            rects[name] = box.rect

    edges = VGroup()
    edge_by_pair = {}
    for a, b in BACKBONE_EDGES:
        if a not in rects or b not in rects:
            continue  # source edge when sources omitted
        if not (a in present and b in present):
            continue  # only connect real, present nodes
        arr = Arrow(rects[a].get_right(), rects[b].get_left(), buff=0.04,
                    stroke_width=1.8, tip_length=0.13,
                    max_tip_length_to_length_ratio=0.12)
        arr.set_color(edge_color)
        edges.add(arr)
        edge_by_pair[(a, b)] = arr

    badges = VGroup()
    badge_by_name = {}
    for name, cnt in counts.items():
        if name not in present or name not in rects or cnt == 0:
            continue
        status = test_status.get(name, "pass")
        badge = make_test_badge(cnt, status)
        badge.move_to(rects[name].get_corner(DR) + 0.04 * RIGHT + 0.02 * DOWN)
        badges.add(badge)
        badge_by_name[name] = badge

    # explicit z-order: edges < boxes < badges, so pills always sit on top
    for a in edges:
        a.set_z_index(0)
    for b in boxes.values():
        b.set_z_index(1)
    for bd in badges:
        bd.set_z_index(2)

    group = VGroup(edges, *boxes.values(), badges)
    group.rects = rects
    group.boxes = boxes
    group.edges = edges
    group.badges = badges
    group.badge_by_name = badge_by_name
    group.edge_by_pair = edge_by_pair
    return group
