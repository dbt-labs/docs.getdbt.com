"""dbt State SQL normalisation visuals.

Two scenes explaining that dbt State hashes the PARSED query (a syntax tree),
not the file text:

  StateNormalisation (static PNG) — two semantically-equivalent SQL files hash
      to the same model hash via the AST, but to two different file hashes
      without dbt State.
  VolatileSql (animated MP4) — the evaluate_volatile_sql config; with it on,
      getdate()'s emulated value is embedded and the hash ticks each second.

Render:
    uv run manim -s  dbt_state_normalisation.py StateNormalisation -o StateNormalisation_v1
    uv run manim -qm dbt_state_normalisation.py VolatileSql
"""

import hashlib
from datetime import datetime, timedelta

from manim import *
import numpy as np

# Palette (dbt brand — Terminal Black neutrals + semantic colours). Defined
# locally so this file stands alone, matching the values used across the other
# manim animations.
TB_200 = ManimColor.from_hex("#e5e7eb")
TB_400 = ManimColor.from_hex("#99a1af")
TB_500 = ManimColor.from_hex("#6a7282")
TB_900 = ManimColor.from_hex("#101828")
GREEN_500 = ManimColor.from_hex("#7ca035")   # "same" hash / pass
BLUE_500 = ManimColor.from_hex("#067fe0")    # AST nodes (model colour)
RED = ManimColor.from_hex("#c20059")         # volatile node / "diff" hash
PURPLE = ManimColor.from_hex("#632ff5")      # second (distinct) file hash
AMBER = ManimColor.from_hex("#cb9900")       # Jinja config lines
ORANGE = ManimColor.from_hex("#fe6703")
TEAL = ManimColor.from_hex("#0d9488")

# the volatile hash recolours every tick, cycling these distinct hues
HASH_CYCLE = [RED, PURPLE, AMBER, ORANGE, TEAL]

config.frame_width = 13
config.background_color = "#F9FAFB"


def short_hash(text, n=5):
    """Stable short hex digest of `text`: the first `n`-char window of the sha1
    hexdigest that contains at least one alpha hex char (so it always reads as a
    hash, never an all-digit number)."""
    digest = hashlib.sha1(text.encode("utf-8")).hexdigest()
    for i in range(len(digest) - n + 1):
        window = digest[i:i + n]
        if any(c.isalpha() for c in window):
            return window
    return digest[:n]


SQL_FS = 14          # SQL card font size
CARD_PAD = 0.18


def crisp_text(text_str, font_size, **kwargs):
    """Render at 4x then shrink to 0.25x — crisper kerning for proportional
    fonts (e.g. Helvetica) at small sizes."""
    t = Text(text_str, font_size=font_size * 4, **kwargs)
    t.scale(0.25)
    return t


def make_sql_card(sql_text, width=3.6):
    """Dark terminal card rendering `sql_text` with indentation preserved
    (PT Mono); a trailing `-- ...` comment on a line is dimmed."""
    lines = sql_text.split("\n")
    # Pango trims leading whitespace, so strip it and re-apply indentation by
    # shifting each line right by a measured monospace char advance.
    char_w = Text("mm", font="PT Mono", font_size=SQL_FS).width / 2
    mobs, indents = [], []
    for ln in lines:
        stripped = ln.lstrip(" ")
        indents.append(len(ln) - len(stripped))
        # dim the `-- ...` trailing comment so it reads as a SQL comment
        t2c = {stripped[stripped.index("--"):]: TB_400} if "--" in stripped else {}
        t = Text(stripped if stripped else " ", font="PT Mono",
                 font_size=SQL_FS, color=TB_200, t2c=t2c)
        mobs.append(t)
    body = VGroup(*mobs).arrange(DOWN, aligned_edge=LEFT, buff=0.10)
    for t, n_ind in zip(mobs, indents):
        if n_ind:
            t.shift(RIGHT * n_ind * char_w)
    card = RoundedRectangle(
        corner_radius=0.10,
        width=max(width, body.width + 2 * CARD_PAD),
        height=body.height + 2 * CARD_PAD,
        fill_color=TB_900, fill_opacity=1.0, stroke_width=0,
    )
    body.move_to(card.get_center())
    # left-align the text block inside the card
    body.align_to(card.get_left() + RIGHT * CARD_PAD, LEFT)
    grp = VGroup(card, body)
    grp.card = card
    grp.body = body
    return grp


NODE_FS = 16


class AstNode:
    def __init__(self, token, children=None, volatile=False, drop=0):
        self.token = token
        self.children = children or []
        self.volatile = volatile
        self.drop = drop   # extra rows to push this node (+ its subtree) down


def make_ast_node(token, volatile=False):
    """Small rounded token box. Blue (model colour) by default; red if volatile."""
    color = RED if volatile else BLUE_500
    label = Text(token, font="PT Mono", font_size=NODE_FS, color=color)
    box = RoundedRectangle(
        corner_radius=0.06,
        width=label.width + 0.26, height=label.height + 0.20,
        fill_color=color, fill_opacity=0.07,
        stroke_color=color, stroke_width=1.6,
    )
    label.move_to(box.get_center())
    g = VGroup(box, label)
    g.box = box
    g.label = label
    return g


def make_ast(root, x_step=1.9, row_gap=0.95):
    """Lay `root` (AstNode) top-down. Leaves spread by x_step; parents centre
    over their children. A node with `drop > 0` sits that many rows lower AND
    reserves just one column on its parent's row — its subtree is laid out
    locally beneath it, so the upper rows don't spread to accommodate it.
    Returns a VGroup with `.node_mobs` and thin TB_400 connector lines."""
    positions = {}          # id(AstNode) -> np.array
    node_mobs = {}          # id(AstNode) -> mobject
    cursor = [0.0]

    def place_local(node, depth, x):
        """Position a dropped subtree centred on `x` (doesn't touch the cursor)."""
        positions[id(node)] = np.array([x, -depth * row_gap, 0.0])
        kids = node.children
        for i, c in enumerate(kids):
            place_local(c, depth + 1, x + x_step * (i - (len(kids) - 1) / 2))

    def place(node, depth):
        d = depth + node.drop
        if node.drop > 0:
            # reserve ONE column on the parent's row; lay the subtree out locally
            x = cursor[0]
            cursor[0] += x_step
            place_local(node, d, x)
            return x
        if node.children:
            x = float(np.mean([place(c, d + 1) for c in node.children]))
        else:
            x = cursor[0]
            cursor[0] += x_step
        positions[id(node)] = np.array([x, -d * row_gap, 0.0])
        return x

    place(root, 0)

    lines = VGroup()
    nodes = VGroup()

    def build(node):
        mob = make_ast_node(node.token, volatile=node.volatile)
        mob.move_to(positions[id(node)])
        node_mobs[id(node)] = mob
        nodes.add(mob)
        for c in node.children:
            build(c)
            cm = node_mobs[id(c)]
            # tie the connector to the box edges: parent's bottom -> child's top
            ln = Line(mob.get_bottom(), cm.get_top(),
                      color=TB_400, stroke_width=1.6)
            ln.set_z_index(-1)
            lines.add(ln)

    build(root)
    grp = VGroup(lines, nodes)
    grp.node_mobs = node_mobs      # id(AstNode) -> mobject (for volatile targeting)
    grp.lines = lines
    grp.nodes = nodes
    grp.move_to(ORIGIN)
    return grp


def make_hash_chip(hex_text, state, color=None):
    """Pill showing the hash as 3 chars + ellipsis + 2 chars (e.g. "abc…de").
    state='same' -> green, 'diff' -> red; `color` overrides either."""
    fill = color if color is not None else (GREEN_500 if state == "same" else RED)
    display = f"{hex_text[:3]}…{hex_text[3:5]}" if len(hex_text) >= 5 else hex_text
    txt = Text(display, font="PT Mono", font_size=15,
               color=WHITE, weight=BOLD)
    h = txt.height + 0.14
    pill = RoundedRectangle(corner_radius=h / 2, width=txt.width + 0.28, height=h,
                            fill_color=fill, fill_opacity=1.0, stroke_width=0)
    txt.move_to(pill.get_center())
    g = VGroup(pill, txt)
    g.pill = pill
    g.txt = txt
    return g


def make_box_label(subtitle, width=3.0, height=1.0):
    """Empty dashed-grey box with a small subtitle anchored at its bottom-inner
    edge (the SQL passes straight through, untouched)."""
    base = RoundedRectangle(corner_radius=0.10, width=width, height=height,
                            stroke_color=TB_400, stroke_width=1.8, fill_opacity=0)
    dashed = DashedVMobject(base, num_dashes=int((width + height) * 6),
                            equal_lengths=True)
    sub = crisp_text(subtitle, 13, font="Helvetica", color=TB_500, slant=ITALIC)
    if sub.width > width - 0.3:
        sub.scale((width - 0.3) / sub.width)
    # sits just BELOW the box's bottom line, left-aligned to the box edge
    sub.next_to(base.get_bottom(), DOWN, buff=0.10)
    sub.align_to(base.get_left(), LEFT).shift(RIGHT * 0.2)
    g = VGroup(dashed, sub)
    g.box = dashed
    return g


def make_col_header(text, x, top_y):
    """Sentence-case Helvetica column label, centred at x, sitting at top_y."""
    t = crisp_text(text, 16, font="Helvetica", color=TB_500, weight=BOLD)
    t.move_to([x, top_y, 0])
    return t


def make_ts_chip(time_str, fill=TB_900, min_height=0.0):
    """Chip showing an emulated getdate() value — white mono text on `fill`.
    `min_height` lets the caller force the box taller than the covered chip so
    it fully overlaps it top-and-bottom (no edges poking out behind)."""
    txt = Text(time_str, font="PT Mono", font_size=12, color=WHITE)
    box = RoundedRectangle(corner_radius=0.05, width=txt.width + 0.16,
                           height=max(txt.height + 0.12, min_height),
                           fill_color=fill, fill_opacity=1.0, stroke_width=0)
    txt.move_to(box.get_center())
    return VGroup(box, txt)


# shared AST for both Visual-1 queries (they normalise to the same tree)
V1_AST = AstNode("select", [
    AstNode("order_id"),
    AstNode("total_cost"),
    AstNode("from", [AstNode("orders")]),
])

Q1 = "select order_id, total_cost\nfrom orders"
Q2 = "select\n  order_id,\n  total_cost --subtotal + tax\nfrom orders"


class StateNormalisation(Scene):
    def __init__(self, **kwargs):
        config.frame_height = 7.0
        config.pixel_width = 1300
        ph = int(round(1300 * config.frame_height / config.frame_width))
        config.pixel_height = ph - (ph % 2)   # even dims for libx264
        super().__init__(**kwargs)

    def construct(self):
        # column x-centres
        X_SQL, X_NORM, X_HASH = -4.6, 0.3, 4.9
        Y_TOP, Y_MID, Y_BOT = 2.1, 0.0, -2.1
        top_y = 3.0

        # column headers
        self.add(
            make_col_header("Input file", X_SQL, top_y),
            make_col_header("Query normalization", X_NORM, top_y),
            make_col_header("Comparison hash", X_HASH, top_y),
        )

        # left: two query cards, left-anchored to a fixed margin so a wide
        # line can't push the card off-screen
        LEFT_X = -6.35
        q1 = make_sql_card(Q1, width=3.4).move_to([X_SQL, Y_TOP, 0])
        q2 = make_sql_card(Q2, width=3.4).move_to([X_SQL, Y_BOT, 0])
        q1.align_to([LEFT_X, 0, 0], LEFT)
        q2.align_to([LEFT_X, 0, 0], LEFT)

        # middle: two empty "without dbt State" boxes (top/bottom) + central AST
        no_norm_top = make_box_label("without dbt State",
                                     width=3.2, height=1.0).move_to([X_NORM, Y_TOP, 0])
        no_norm_bot = make_box_label("without dbt State",
                                     width=3.2, height=1.0).move_to([X_NORM, Y_BOT, 0])
        # AST box: snug around the tree; "with dbt State" subtitle sits just
        # BELOW the box's bottom line, left-aligned
        ast = make_ast(V1_AST).scale(0.7)
        ast_box = SurroundingRectangle(ast, color=BLUE_500, stroke_width=1.8,
                                       corner_radius=0.12, buff=0.22)
        ast_grp = VGroup(ast_box, ast).move_to([X_NORM, Y_MID, 0])
        ast_sub = crisp_text("with dbt State", 13, font="Helvetica",
                             color=BLUE_500, slant=ITALIC)
        ast_sub.next_to(ast_box.get_bottom(), DOWN, buff=0.10)
        ast_sub.align_to(ast_box.get_left(), LEFT).shift(RIGHT * 0.2)

        # right: hashes. The two un-normalised file hashes differ (red + purple);
        # the AST yields ONE hash, identical for both queries -> two matching
        # green chips, one per query.
        fh1 = short_hash(Q1)
        fh2 = short_hash(Q2)
        mh = short_hash("select order_id, total_cost from orders::AST")
        hash_top = make_hash_chip(fh1, "diff").move_to([X_HASH, Y_TOP, 0])
        hash_bot = make_hash_chip(fh2, "diff", color=PURPLE).move_to([X_HASH, Y_BOT, 0])
        hash_mid_a = make_hash_chip(mh, "same").move_to([X_HASH, 0.62, 0])
        hash_mid_b = make_hash_chip(mh, "same").move_to([X_HASH, -0.62, 0])

        self.add(q1, q2, no_norm_top, no_norm_bot, ast_grp, ast_sub,
                 hash_top, hash_mid_a, hash_mid_b, hash_bot)

        # arrows: each query -> its no-norm box (horizontal) + -> AST (diagonal)
        def arr(a, b):
            return Arrow(a, b, buff=0.12, stroke_width=2.2, color=TB_400,
                         tip_length=0.16, max_tip_length_to_length_ratio=0.12)

        # headless line: the query passes straight INTO the no-normalisation box
        # (the arrowhead reappears on the far side, into the hash)
        def line(a, b):
            return Line(a, b, buff=0.12, stroke_width=2.2, color=TB_400)
        self.add(
            line(q1.get_right(), no_norm_top.get_left()),
            line(q2.get_right(), no_norm_bot.get_left()),
            arr(q1.get_corner(DR), ast_grp.get_corner(UL)),   # q1 down into AST
            arr(q2.get_corner(UR), ast_grp.get_corner(DL)),   # q2 up into AST
            arr(no_norm_top.get_right(), hash_top.get_left()),
            # two identical AST outputs — start at the box's right edge at each
            # chip's height so the arrows run horizontally
            arr([ast_grp.get_right()[0], 0.62, 0], hash_mid_a.get_left()),
            arr([ast_grp.get_right()[0], -0.62, 0], hash_mid_b.get_left()),
            arr(no_norm_bot.get_right(), hash_bot.get_left()),
        )


def volatile_ast(volatile_node=True):
    """Automatic layout for the volatile query AST:
        select order_id, total_cost, getdate() as _dbt_built_at from orders
    `as` is marked drop=1 so it sits a row below order_id/total_cost/from (room to
    breathe); everything else reflows automatically. `volatile_node` styles the
    getdate() leaf red (data) vs blue (logic). Returns (group, getdate_mob)."""
    getdate = AstNode("getdate()", volatile=volatile_node)
    root = AstNode("select", [
        AstNode("order_id"),
        AstNode("total_cost"),
        AstNode("as", [getdate, AstNode("_dbt_built_at")], drop=1),
        AstNode("from", [AstNode("orders")]),
    ])
    g = make_ast(root)
    return g, g.node_mobs[id(getdate)]


V2_QUERY = "select order_id, total_cost,\n  getdate() as _dbt_built_at\nfrom orders"


class VolatileSql(Scene):
    def __init__(self, **kwargs):
        config.frame_height = 8.0
        config.pixel_width = 1300
        ph = int(round(1300 * config.frame_height / config.frame_width))
        config.pixel_height = ph - (ph % 2)   # even dims for libx264
        super().__init__(**kwargs)

    def construct(self):
        X_NORM, X_HASH = 0.7, 5.0
        Y_TOP, Y_BOT = 2.15, -2.15
        top_y = 3.6
        LEFT_X = -6.35

        self.add(
            make_col_header("Input file", -4.6, top_y),
            make_col_header("Query normalization", X_NORM, top_y),
            make_col_header("Comparison hash", X_HASH, top_y),
        )

        # single query card (no config block), centred, feeding BOTH ASTs
        query_card = make_sql_card(V2_QUERY, width=3.9).move_to([0, 0, 0])
        query_card.align_to([LEFT_X, 0, 0], LEFT)

        # top AST (false): getdate() hashed by name -> stable; blue leaf
        false_ast, _ = volatile_ast(volatile_node=False)
        false_ast.scale(0.6)
        false_box = SurroundingRectangle(false_ast, color=BLUE_500, stroke_width=1.8,
                                         corner_radius=0.12, buff=0.20)
        false_grp = VGroup(false_box, false_ast).move_to([X_NORM, Y_TOP, 0])

        # bottom AST (true): volatile getdate() leaf (red); value ticks
        true_ast, getdate_mob = volatile_ast()
        true_ast.scale(0.6)
        true_box = SurroundingRectangle(true_ast, color=BLUE_500, stroke_width=1.8,
                                        corner_radius=0.12, buff=0.20)
        true_grp = VGroup(true_box, true_ast).move_to([X_NORM, Y_BOT, 0])

        # captions below each box: the config flag (monospace, not italic)
        def box_sub(text, box):
            s = Text(text, font="PT Mono", font_size=12, color=BLUE_500)
            if s.width > box.width:
                s.scale(box.width / s.width)
            s.next_to(box.get_bottom(), DOWN, buff=0.10)
            s.align_to(box.get_left(), LEFT)
            return s
        false_sub = box_sub("evaluate_volatile_sql: false", false_box)
        true_sub = box_sub("evaluate_volatile_sql: true", true_box)

        def arr(a, b):
            return Arrow(a, b, buff=0.12, stroke_width=2.2, color=TB_400,
                         tip_length=0.16, max_tip_length_to_length_ratio=0.12)

        # static hashes for the first frame (the bottom one then ticks)
        norm_sql = "select order_id, total_cost, getdate() as _dbt_built_at from orders::AST"
        false_hash = make_hash_chip(short_hash(norm_sql), "same").move_to([X_HASH, Y_TOP, 0])
        true_hash = make_hash_chip(short_hash(norm_sql + "14:30:00"), "diff").move_to([X_HASH, Y_BOT, 0])

        self.add(query_card, false_grp, false_sub, true_grp, true_sub,
                 false_hash, true_hash,
                 arr(query_card.get_right(), false_grp.get_left()),  # up to false AST
                 arr(query_card.get_right(), true_grp.get_left()),   # down to true AST
                 arr(false_grp.get_right(), false_hash.get_left()),
                 arr(true_grp.get_right(), true_hash.get_left()))

        # --- animate: the true row's getdate() value + hash tick once per second
        BASE = datetime(2026, 6, 1, 14, 30, 0)

        def ts_str(secs):
            return (BASE + timedelta(seconds=int(secs))).strftime("%Y-%m-%dT%H:%M:%S")

        seconds = ValueTracker(0.0)

        # full ISO timestamp laid OVER the getdate() box: right edge aligned to the
        # node, spilling leftward (it's wider), drawn on top to cover it
        gd_right = getdate_mob.get_right()[0]
        gd_y = getdate_mob.get_center()[1]

        def ts_overlay():
            s = int(seconds.get_value())
            c = make_ts_chip(ts_str(s), fill=HASH_CYCLE[s % len(HASH_CYCLE)],
                             min_height=getdate_mob.height + 0.06)
            c.set_y(gd_y)
            c.align_to([gd_right, 0, 0], RIGHT)
            c.set_z_index(20)
            return c

        ts_chip = always_redraw(ts_overlay)

        # bottom hash recomputed AND recoloured every second
        def live_hash():
            s = int(seconds.get_value())
            chip = make_hash_chip(short_hash(norm_sql + ts_str(s)), "diff",
                                  color=HASH_CYCLE[s % len(HASH_CYCLE)])
            chip.move_to([X_HASH, Y_BOT, 0])
            return chip

        live = always_redraw(live_hash)
        self.remove(true_hash)   # replace the static bottom hash
        self.add(ts_chip, live)

        # clean clock: 0 -> 9 over 9s, so int(seconds) shows :00 .. :08, each
        # held exactly one second (no leading/trailing wait to double up :00)
        self.play(seconds.animate.set_value(9), run_time=9, rate_func=linear)
