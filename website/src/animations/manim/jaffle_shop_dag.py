"""Static dbt DAG for the jaffle_shop_7 project.

Renders every node in jaffle_shop_7 — sources (seeds treated as sources),
models, and tests — in a single layered graph. Colour encodes node type;
fill / border style + a tiny label encode materialization.

Data was extracted from target/metadata/parse/nodes/v1_0.parquet and is
embedded below so the scene is self-contained (no parquet/pandas needed
at render time).

Render a single still frame (no animation yet); bump the version each time so
stills can be compared over time:

    uv run manim -s -r 1200,738 -o JaffleShopDag_v3 jaffle_shop_dag.py JaffleShopDag
"""

from manim import *
import numpy as np

# ---------------------------------------------------------------- canvas
config.frame_width = 13.0
config.frame_height = 8.0
config.pixel_width = 1200
config.pixel_height = 738
config.background_color = "#F9FAFB"  # Terminal Black 50

# ---------------------------------------------------------------- palette
TB_50 = ManimColor.from_hex("#f9fafb")
TB_200 = ManimColor.from_hex("#e5e7eb")
TB_300 = ManimColor.from_hex("#d1d5dc")
TB_400 = ManimColor.from_hex("#99a1af")
TB_500 = ManimColor.from_hex("#6a7282")
TB_700 = ManimColor.from_hex("#364153")
TB_900 = ManimColor.from_hex("#101828")

GREEN_500 = ManimColor.from_hex("#7ca035")   # sources
BLUE_500 = ManimColor.from_hex("#067fe0")    # models
ORANGE = ManimColor.from_hex("#fe6703")      # data tests
PINK_700 = ManimColor.from_hex("#c20059")    # unit tests
PURPLE = ManimColor.from_hex("#632ff5")      # snapshots

TYPE_COLOR = {
    "source": GREEN_500,
    "model": BLUE_500,
    "test": ORANGE,
    "snapshot": PURPLE,
}

# ---------------------------------------------------------------- graph data
# name -> {type, mat}
NODES = {
    # sources (seeds, treated as sources)
    "raw_customers": {"type": "source", "mat": "seed"},
    "raw_orders": {"type": "source", "mat": "seed"},
    "raw_items": {"type": "source", "mat": "seed"},
    "raw_products": {"type": "source", "mat": "seed"},
    "raw_supplies": {"type": "source", "mat": "seed"},
    "raw_stores": {"type": "source", "mat": "seed"},
    # staging models (views)
    "stg_customers": {"type": "model", "mat": "view"},
    "stg_orders": {"type": "model", "mat": "view"},
    "stg_order_items": {"type": "model", "mat": "view"},
    "stg_products": {"type": "model", "mat": "view"},
    "stg_supplies": {"type": "model", "mat": "view"},
    "stg_locations": {"type": "model", "mat": "view"},
    # mart models (tables)
    "order_items": {"type": "model", "mat": "table"},
    "products": {"type": "model", "mat": "table"},
    "supplies": {"type": "model", "mat": "table"},
    "locations": {"type": "model", "mat": "table"},
    "orders": {"type": "model", "mat": "table"},
    "customers": {"type": "model", "mat": "table"},
    # tests
    "accepted_values_customers_customer_type__new__returning": {"type": "test", "mat": "data"},
    "dbt_utils_expression_is_true_customers_lifetime_spend_pretax_lifetime_tax_paid_lifetime_spend": {"type": "test", "mat": "data"},
    "dbt_utils_expression_is_true_orders_order_items_subtotal_subtotal": {"type": "test", "mat": "data"},
    "dbt_utils_expression_is_true_orders_order_total_subtotal_tax_paid": {"type": "test", "mat": "data"},
    "dbt_utils_expression_is_true_stg_orders_order_total_tax_paid_subtotal": {"type": "test", "mat": "data"},
    "not_null_customers_customer_id": {"type": "test", "mat": "data"},
    "not_null_order_items_order_item_id": {"type": "test", "mat": "data"},
    "not_null_orders_order_id": {"type": "test", "mat": "data"},
    "not_null_stg_customers_customer_id": {"type": "test", "mat": "data"},
    "not_null_stg_locations_location_id": {"type": "test", "mat": "data"},
    "not_null_stg_order_items_order_id": {"type": "test", "mat": "data"},
    "not_null_stg_order_items_order_item_id": {"type": "test", "mat": "data"},
    "not_null_stg_orders_order_id": {"type": "test", "mat": "data"},
    "not_null_stg_products_product_id": {"type": "test", "mat": "data"},
    "not_null_stg_supplies_supply_uuid": {"type": "test", "mat": "data"},
    "relationships_order_items_order_id__order_id__ref_orders_": {"type": "test", "mat": "data"},
    "relationships_orders_customer_id__customer_id__ref_stg_customers_": {"type": "test", "mat": "data"},
    "relationships_stg_order_items_order_id__order_id__ref_stg_orders_": {"type": "test", "mat": "data"},
    "unique_customers_customer_id": {"type": "test", "mat": "data"},
    "unique_order_items_order_item_id": {"type": "test", "mat": "data"},
    "unique_orders_order_id": {"type": "test", "mat": "data"},
    "unique_stg_customers_customer_id": {"type": "test", "mat": "data"},
    "unique_stg_locations_location_id": {"type": "test", "mat": "data"},
    "unique_stg_order_items_order_item_id": {"type": "test", "mat": "data"},
    "unique_stg_orders_order_id": {"type": "test", "mat": "data"},
    "unique_stg_products_product_id": {"type": "test", "mat": "data"},
    "unique_stg_supplies_supply_uuid": {"type": "test", "mat": "data"},
    "test_supply_costs_sum_correctly": {"type": "test", "mat": "unit"},
    "test_order_items_compute_to_bools_correctly": {"type": "test", "mat": "unit"},
    "test_does_location_opened_at_trunc_to_date": {"type": "test", "mat": "unit"},
}

EDGES = [
    ("customers", "accepted_values_customers_customer_type__new__returning"),
    ("customers", "dbt_utils_expression_is_true_customers_lifetime_spend_pretax_lifetime_tax_paid_lifetime_spend"),
    ("customers", "not_null_customers_customer_id"),
    ("customers", "unique_customers_customer_id"),
    ("order_items", "not_null_order_items_order_item_id"),
    ("order_items", "orders"),
    ("order_items", "relationships_order_items_order_id__order_id__ref_orders_"),
    ("order_items", "test_supply_costs_sum_correctly"),
    ("order_items", "unique_order_items_order_item_id"),
    ("orders", "customers"),
    ("orders", "dbt_utils_expression_is_true_orders_order_items_subtotal_subtotal"),
    ("orders", "dbt_utils_expression_is_true_orders_order_total_subtotal_tax_paid"),
    ("orders", "not_null_orders_order_id"),
    ("orders", "relationships_order_items_order_id__order_id__ref_orders_"),
    ("orders", "relationships_orders_customer_id__customer_id__ref_stg_customers_"),
    ("orders", "test_order_items_compute_to_bools_correctly"),
    ("orders", "unique_orders_order_id"),
    ("raw_customers", "stg_customers"),
    ("raw_items", "stg_order_items"),
    ("raw_orders", "stg_orders"),
    ("raw_products", "stg_products"),
    ("raw_stores", "stg_locations"),
    ("raw_supplies", "stg_supplies"),
    ("stg_customers", "customers"),
    ("stg_customers", "not_null_stg_customers_customer_id"),
    ("stg_customers", "relationships_orders_customer_id__customer_id__ref_stg_customers_"),
    ("stg_customers", "unique_stg_customers_customer_id"),
    ("stg_locations", "locations"),
    ("stg_locations", "not_null_stg_locations_location_id"),
    ("stg_locations", "test_does_location_opened_at_trunc_to_date"),
    ("stg_locations", "unique_stg_locations_location_id"),
    ("stg_order_items", "not_null_stg_order_items_order_id"),
    ("stg_order_items", "not_null_stg_order_items_order_item_id"),
    ("stg_order_items", "order_items"),
    ("stg_order_items", "relationships_stg_order_items_order_id__order_id__ref_stg_orders_"),
    ("stg_order_items", "unique_stg_order_items_order_item_id"),
    ("stg_orders", "dbt_utils_expression_is_true_stg_orders_order_total_tax_paid_subtotal"),
    ("stg_orders", "not_null_stg_orders_order_id"),
    ("stg_orders", "order_items"),
    ("stg_orders", "orders"),
    ("stg_orders", "relationships_stg_order_items_order_id__order_id__ref_stg_orders_"),
    ("stg_orders", "unique_stg_orders_order_id"),
    ("stg_products", "not_null_stg_products_product_id"),
    ("stg_products", "order_items"),
    ("stg_products", "products"),
    ("stg_products", "unique_stg_products_product_id"),
    ("stg_supplies", "not_null_stg_supplies_supply_uuid"),
    ("stg_supplies", "order_items"),
    ("stg_supplies", "supplies"),
    ("stg_supplies", "unique_stg_supplies_supply_uuid"),
]

# columns of the data backbone (left -> right)
COLUMNS = [
    ["raw_customers", "raw_orders", "raw_items", "raw_products", "raw_supplies", "raw_stores"],
    ["stg_customers", "stg_orders", "stg_order_items", "stg_products", "stg_supplies", "stg_locations"],
    ["order_items", "products", "supplies", "locations"],
    ["orders"],
    ["customers"],
]

# Row index per node (0 = top). Marts share their primary staging model's row so
# the main lineage runs as straight horizontal lines; orders/customers sit high
# in line with stg_orders / stg_customers.
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

# ---------------------------------------------------------------- geometry
BOX_W = 1.62
BOX_H = 0.62
DOT_R = 0.125
TOP_Y = 2.55
BOT_Y = -2.65
X_LEFT = -5.65
X_RIGHT = 5.65


def test_kind(name):
    if name.startswith("not_null"):
        return "N"
    if name.startswith("unique"):
        return "U"
    if name.startswith("relationships"):
        return "R"
    if name.startswith("accepted_values"):
        return "A"
    if name.startswith("dbt_utils_expression_is_true"):
        return "E"
    return "u"  # unit test


def make_model_box(name, info):
    """A model / source node: rect coloured by type, styled by materialization."""
    ntype = info["type"]
    mat = info["mat"]
    color = TYPE_COLOR[ntype]

    if ntype == "source":
        rect = RoundedRectangle(
            corner_radius=0.16, width=BOX_W, height=BOX_H,
            fill_color=color, fill_opacity=0.16,
            stroke_color=color, stroke_width=2.2,
        )
        mat_label = "source"
    else:  # model
        if mat == "view":
            fill_op, stroke_w, dashed = 0.07, 1.8, False
        elif mat == "incremental":
            fill_op, stroke_w, dashed = 0.20, 2.4, True
        else:  # table
            fill_op, stroke_w, dashed = 0.20, 2.4, False
        rect = Rectangle(
            width=BOX_W, height=BOX_H,
            fill_color=color, fill_opacity=fill_op,
            stroke_color=color, stroke_width=stroke_w,
        )
        if dashed:
            rect = DashedVMobject(rect, num_dashes=28, equal_lengths=False)
            rect.set_fill(color, opacity=fill_op)
        mat_label = mat

    label = Text(name, font="PT Mono", font_size=15, color=TB_900, weight=BOLD)
    if label.width > BOX_W - 0.18:
        label.scale((BOX_W - 0.18) / label.width)
    label.move_to(rect.get_center() + 0.09 * UP)

    mat_txt = Text(mat_label, font="PT Mono", font_size=11, color=TB_500)
    mat_txt.move_to(rect.get_center() + 0.17 * DOWN)

    group = VGroup(rect, label, mat_txt)
    group.rect = rect
    return group


def make_test_badge(count):
    """A small count capsule (e.g. '3 tests') to hang off a node's corner."""
    txt = Text(f"{count} test" + ("" if count == 1 else "s"),
               font="PT Mono", font_size=11, color=WHITE, weight=BOLD)
    h = txt.height + 0.12
    pill = RoundedRectangle(
        corner_radius=h / 2, width=txt.width + 0.22, height=h,
        fill_color=ORANGE, fill_opacity=1.0, stroke_width=0,
    )
    txt.move_to(pill.get_center())
    return VGroup(pill, txt)


def boundary_point(rect, target):
    """Point on rect's edge toward target world-point."""
    c = rect.get_center()
    d = np.array(target) - c
    if np.allclose(d[:2], 0):
        return c
    w, h = rect.width / 2, rect.height / 2
    if abs(d[0]) * h > abs(d[1]) * w:
        sx = np.sign(d[0])
        x = c[0] + sx * w
        y = c[1] + d[1] * (w / abs(d[0]))
    else:
        sy = np.sign(d[1])
        y = c[1] + sy * h
        x = c[0] + d[0] * (h / abs(d[1]))
    return np.array([x, y, 0])


class JaffleShopDag(Scene):
    def construct(self):
        # ---- assign home parent + column index for each test
        col_of = {}
        for ci, col in enumerate(COLUMNS):
            for n in col:
                col_of[n] = ci

        parents = {n: [] for n in NODES}
        for a, b in EDGES:
            parents[b].append(a)

        # tests grouped by home parent (model whose name appears earliest)
        tests_by_home = {}
        test_home = {}
        for n, info in NODES.items():
            if info["type"] != "test":
                continue
            ps = [p for p in parents[n] if NODES[p]["type"] != "test"]
            home = min(ps, key=lambda p: (n.find(p) if n.find(p) >= 0 else 999, len(p)))
            test_home[n] = home
            tests_by_home.setdefault(home, []).append(n)

        # ---- position backbone boxes on a shared row grid
        mobs = {}
        pos = {}
        xs = np.linspace(X_LEFT, X_RIGHT, len(COLUMNS))
        row_y = np.linspace(TOP_Y, BOT_Y, N_ROWS)
        for ci, col in enumerate(COLUMNS):
            x = xs[ci]
            for name in col:
                box = make_model_box(name, NODES[name])
                box.move_to([x, row_y[ROW[name]], 0])
                mobs[name] = box
                pos[name] = box.get_center()

        # ---- test count capsules hung off each tested node's bottom-right
        test_badges = VGroup()
        right_limit = config.frame_width / 2 - 0.12
        for home, tlist in tests_by_home.items():
            badge = make_test_badge(len(tlist))
            badge.move_to(mobs[home].rect.get_corner(DR) + 0.04 * RIGHT + 0.02 * DOWN)
            if badge.get_right()[0] > right_limit:  # would clip — flip to the left
                badge.move_to(mobs[home].rect.get_corner(DL) + 0.04 * LEFT + 0.02 * DOWN)
            test_badges.add(badge)

        # ---- backbone edges (model/source -> model only)
        backbone_edges = VGroup()
        for a, b in EDGES:
            if NODES[b]["type"] == "test":
                continue
            if a not in mobs or b not in mobs:
                continue
            ra, rb = mobs[a].rect, mobs[b].rect
            # leave the right edge (vertically centred), enter the next box's
            # left edge (vertically centred).
            arr = Arrow(
                ra.get_right(), rb.get_left(), buff=0.04,
                stroke_color=TB_400, stroke_width=1.8,
                max_tip_length_to_length_ratio=0.12, tip_length=0.13,
            )
            arr.set_color(TB_400)
            backbone_edges.add(arr)

        # ---- title + legend
        title = Text("jaffle_shop_7 — project DAG", font="PT Mono",
                     font_size=22, color=TB_900, weight=BOLD)
        title.to_edge(UP, buff=0.22)

        legend = self.build_legend()
        legend.to_edge(DOWN, buff=0.16)

        # ---- compose (draw order: edges under nodes, badges on top)
        self.add(backbone_edges)
        self.add(*mobs.values())
        self.add(test_badges)
        self.add(title, legend)

    def build_legend(self):
        def swatch(color, fill_op, label, shape="rect", dashed=False):
            if shape == "round":
                s = RoundedRectangle(corner_radius=0.08, width=0.34, height=0.26,
                                     fill_color=color, fill_opacity=fill_op,
                                     stroke_color=color, stroke_width=2)
            elif shape == "pill":
                s = RoundedRectangle(corner_radius=0.13, width=0.5, height=0.26,
                                     fill_color=color, fill_opacity=1.0, stroke_width=0)
            else:
                s = Rectangle(width=0.34, height=0.26, fill_color=color,
                              fill_opacity=fill_op, stroke_color=color, stroke_width=2)
                if dashed:
                    s = DashedVMobject(s, num_dashes=14)
                    s.set_fill(color, opacity=fill_op)
            txt = Text(label, font="PT Mono", font_size=12, color=TB_700)
            return VGroup(s, txt).arrange(RIGHT, buff=0.12)

        items = [
            swatch(GREEN_500, 0.16, "source (seed)", shape="round"),
            swatch(BLUE_500, 0.07, "model · view"),
            swatch(BLUE_500, 0.20, "model · table"),
            swatch(BLUE_500, 0.20, "model · incremental", dashed=True),
            swatch(ORANGE, 1.0, "N tests (count)", shape="pill"),
        ]
        row = VGroup(*items).arrange(RIGHT, buff=0.5)
        if row.width > config.frame_width - 0.6:
            row.scale((config.frame_width - 0.6) / row.width)
        return row
