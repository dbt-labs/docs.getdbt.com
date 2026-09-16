"""Animated dbt state demonstrations over the jaffle_shop_7 DAG.

Each scene replays the real captured CLI log (cli_captures/*.txt) line by line
through a scrolling terminal while the DAG fills in:
  - view models (rebuilt) POP into place (no motion from prod)
  - table models (cloned) fly down from analytics_prod
  - an arrow is drawn the moment both of its endpoints exist
  - test/badge results stream in the terminal as they happen

Render (scene -> blog asset mapping is documented in README.md):
    uv run manim -qm clone_demos.py ReuseCloneUnchanged
"""

from pathlib import Path
import re

from manim import *
import numpy as np

from dag_model import (
    build_env_dag, make_model_box, make_test_badge, NODES, BACKBONE_EDGES,
    TB_200, TB_300, TB_400, TB_500, TB_700, TB_900, GREEN_500, BLUE_500, AMBER, RED,
    BAND_W, SRC_W, GAP_SRC, SCHEMA_W, GAP, TITLE_H, CLI_H, SIZE_H,
    SRC_CX, SCHEMA_LEFT, SCHEMA_CX, CLI_COLOR, SOURCES, MODEL_NODES, ALL_PASS,
)

config.frame_width = 13
config.frame_rate = 30
config.background_color = "#F9FAFB"

CAPTURES = Path(__file__).parent / "cli_captures"
LINE_RE = re.compile(
    r"\s*(Succeeded|Reused|Passed|Failed|Warned|Skipped)\s+\[[^\]]*\]\s+"
    r"(model|test|seed|unit_test)\s+(\S+)\s*(.*)"
)


def parse_capture(name):
    events = []
    for line in (CAPTURES / name).read_text().splitlines():
        m = LINE_RE.match(line)
        if m:
            verb, kind, fqn, rest = m.groups()
            events.append((verb, kind, fqn, rest.strip()))
    return events


# build order: views top -> bottom in the DAG, then marts in topo order
VIEW_ORDER = ["stg_customers", "stg_orders", "stg_order_items",
              "stg_products", "stg_supplies", "stg_locations"]
MART_ORDER = ["order_items", "products", "supplies", "locations", "orders", "customers"]

# unit tests whose model isn't a substring of the test name
UNIT_HOME = {
    "test_supply_costs_sum_correctly": "order_items",
    "test_order_items_compute_to_bools_correctly": "orders",
    "test_does_location_opened_at_trunc_to_date": "stg_locations",
}


def home_of(test_name, models):
    """Model a test belongs to: earliest-named model substring (longest wins)."""
    cands = [(test_name.find(m), -len(m), m) for m in models if test_name.find(m) >= 0]
    return min(cands)[2] if cands else None


def group_capture(name, models):
    """Parse a capture into model_lines[node]=(verb,rest) and tests_by_home[node]=[...]."""
    model_lines, tests_by_home = {}, {}
    for verb, kind, fqn, rest in parse_capture(name):
        if kind == "seed":
            continue
        node = fqn.split(".")[-1]
        if kind == "model":
            model_lines[node] = (verb, rest)
        else:
            home = UNIT_HOME.get(node) if kind == "unit_test" else home_of(node, models)
            tests_by_home.setdefault(home, []).append((verb, kind, fqn, rest))
    return model_lines, tests_by_home


def cli_format(verb, kind, fqn, rest):
    node = fqn.split(".")[-1]
    if "Cloned from cached relation" in rest:
        detail = "(cloned from prod)"
    elif "No new changes" in rest:
        detail = "(no new changes)"
    elif rest.startswith("(view"):
        detail = "(view)"
    elif rest.startswith("(table"):
        detail = "(table)"
    else:
        detail = ""
    kindlabel = {"model": "model", "test": "test", "unit_test": "unit", "seed": "seed"}[kind]
    text = f"{verb:9} {kindlabel:5} {node} {detail}".rstrip()
    if verb in ("Succeeded", "Passed"):
        st = "ok"
    elif verb == "Reused":
        st = "clone" if detail == "(cloned from prod)" else "reuse"
    elif verb == "Warned":
        st = "warn"
    elif verb == "Failed":
        st = "fail"
    else:
        st = "dim"
    return text, CLI_COLOR.get(st, WHITE)


class AnimScene(Scene):
    envs = []
    TOP_PAD = 0.35   # small top margin; videos no longer carry a header

    def __init__(self, **kw):
        stack_h = sum(SIZE_H[s] for _, _, s in self.envs) + GAP * (len(self.envs) - 1)
        self._stack_h = stack_h
        h = self.TOP_PAD + stack_h + 0.3 + CLI_H + 0.5
        config.frame_height = h
        config.pixel_width = 1200
        ph = int(round(1200 * h / config.frame_width))
        config.pixel_height = ph - (ph % 2)  # libx264 needs even dimensions
        super().__init__(**kw)

    # ---- layout ----
    def env_geometry(self):
        top = config.frame_height / 2
        content_top = top - self.TOP_PAD
        out, y = {}, content_top
        for key, label, size in self.envs:
            bh = SIZE_H[size]
            out[key] = (y - bh / 2, size, label)
            y -= (bh + GAP)
        out["_content_top"] = content_top
        return out

    def title_mob(self, text):
        t = Text(text, font="PT Mono", font_size=22, color=TB_900, weight=BOLD)
        if t.width > BAND_W:
            t.scale(BAND_W / t.width)
        t.move_to([0, config.frame_height / 2 - 0.45, 0])
        return t

    def sources_mob(self, cy, height):
        c = RoundedRectangle(width=SRC_W, height=height, corner_radius=0.12,
                             stroke_color=TB_300, stroke_width=1.5,
                             fill_color=GREEN_500, fill_opacity=0.05).move_to([SRC_CX, cy, 0])
        lab = Text("raw sources", font="PT Mono", font_size=12, weight=BOLD, color=TB_700)
        lab.next_to(c.get_top(), DOWN, buff=0.12)
        boxes = VGroup(*[make_model_box(n, NODES[n], present=True) for n in SOURCES]).arrange(DOWN, buff=0.18)
        boxes.scale(min((SRC_W - 0.25) / boxes.width, (height - 0.65) / boxes.height))
        boxes.next_to(lab, DOWN, buff=0.14).set_x(SRC_CX)
        return VGroup(c, lab, boxes)

    def container_mob(self, label, size, cy):
        bh = SIZE_H[size]
        c = RoundedRectangle(width=SCHEMA_W, height=bh, corner_radius=0.12,
                             stroke_color=TB_300, stroke_width=1.5,
                             fill_color=WHITE, fill_opacity=0.6).move_to([SCHEMA_CX, cy, 0])
        lab = Text(label, font="PT Mono", font_size=15, weight=BOLD, color=TB_700)
        lab.next_to(c.get_corner(UL), DR, buff=0.0).shift(0.16 * RIGHT + 0.15 * DOWN)
        return c, lab

    def placed_dag(self, present, status, counts, size, cy, ref_scale=None, ref_shift=None):
        dag = build_env_dag(present, status, counts, include_sources=False)
        if ref_scale is None:
            ref_scale = min((SCHEMA_W - 0.45) / dag.width, (SIZE_H[size] - 0.55) / dag.height)
        dag.scale(ref_scale, about_point=ORIGIN)
        if ref_shift is None:
            ref_shift = np.array([SCHEMA_CX, cy - 0.10, 0]) - VGroup(*dag.boxes.values()).get_center()
        dag.shift(ref_shift)
        dag.ref_scale, dag.ref_shift = ref_scale, ref_shift
        return dag

    # ---- free-form (non-stacked) placement, for custom layouts ----
    def container_at(self, label, w, h, cx, cy):
        c = RoundedRectangle(width=w, height=h, corner_radius=0.12,
                             stroke_color=TB_300, stroke_width=1.5,
                             fill_color=WHITE, fill_opacity=0.6).move_to([cx, cy, 0])
        lab = Text(label, font="PT Mono", font_size=15, weight=BOLD, color=TB_700)
        lab.next_to(c.get_corner(UL), DR, buff=0.0).shift(0.16 * RIGHT + 0.15 * DOWN)
        return c, lab

    def placed_dag_at(self, present, status, counts, w, h, cx, cy,
                      ref_scale=None, ref_shift=None):
        dag = build_env_dag(present, status, counts, include_sources=False)
        if ref_scale is None:
            ref_scale = min((w - 0.45) / dag.width, (h - 0.55) / dag.height)
        dag.scale(ref_scale, about_point=ORIGIN)
        if ref_shift is None:
            ref_shift = np.array([cx, cy - 0.10, 0]) - VGroup(*dag.boxes.values()).get_center()
        dag.shift(ref_shift)
        dag.ref_scale, dag.ref_shift = ref_scale, ref_shift
        return dag

    def cli_panel(self):
        panel = RoundedRectangle(width=BAND_W, height=CLI_H, corner_radius=0.1,
                                 fill_color=TB_900, fill_opacity=1.0, stroke_width=0)
        panel.move_to([0, -config.frame_height / 2 + CLI_H / 2 + 0.2, 0])
        dots = VGroup(*[Dot(radius=0.05, color=c) for c in
                        [ManimColor.from_hex("#ff5f56"), ManimColor.from_hex("#ffbd2e"),
                         ManimColor.from_hex("#27c93f")]]).arrange(RIGHT, buff=0.1)
        dots.next_to(panel.get_corner(UL), DR, buff=0.0).shift(0.18 * RIGHT + 0.18 * DOWN)
        return panel, dots

    # ---- scrolling terminal ----
    def setup_terminal(self, panel, dots, n_visible=9, font_size=12.5):
        self.cli_left = panel.get_left()[0] + 0.28
        self.cli_lh = 0.235
        self.cli_n = n_visible
        self.cli_fs = font_size
        self.cli_maxw = BAND_W - 0.6
        top = dots.get_bottom()[1] - 0.16
        self.cli_slots = [top - i * self.cli_lh for i in range(n_visible)]
        self.cli_log = []

    def _mk_line(self, text, color):
        line = Text(text, font="PT Mono", font_size=self.cli_fs, color=color)
        if line.width > self.cli_maxw:
            line.scale(self.cli_maxw / line.width)
        return line

    def term_anims(self, text, color):
        """State-update + return the animations to reveal a single new line."""
        line = self._mk_line(text, color)
        anims = []
        if len(self.cli_log) < self.cli_n:
            slot = self.cli_slots[len(self.cli_log)]
        else:
            old = self.cli_log.pop(0)
            anims.append(FadeOut(old))
            for i, l in enumerate(self.cli_log):
                anims.append(l.animate.set_y(self.cli_slots[i]))
            slot = self.cli_slots[self.cli_n - 1]
        line.set_y(slot)
        line.set_x(self.cli_left + line.width / 2)
        self.cli_log.append(line)
        anims.insert(0, FadeIn(line, shift=0.04 * UP))
        return line, anims

    def term_batch(self, items, run_time, lag_ratio=0.4):
        """Update terminal state and RETURN one continuous-scroll animation for a
        batch of lines (with its own run_time baked in, so it can be played
        alongside an independent, constant-speed chip animation)."""
        new_lines = [self._mk_line(t, c) for t, c in items]
        new_set = set(new_lines)
        combined = self.cli_log + new_lines
        visible = combined[-self.cli_n:]
        removed = combined[:-self.cli_n] if len(combined) > self.cli_n else []
        self.cli_log = visible

        fades = [FadeOut(l) for l in removed if l not in new_set]
        shifts, reveals = [], []
        for i, l in enumerate(visible):
            slot = self.cli_slots[i]
            l.set_x(self.cli_left + l.width / 2)
            if l in new_set:
                l.set_y(slot)
                reveals.append(FadeIn(l, shift=0.18 * UP))
            else:
                shifts.append(l.animate.set_y(slot))
        parts = ([AnimationGroup(*fades, *shifts)] if (fades or shifts) else []) + reveals
        return LaggedStart(*parts, lag_ratio=lag_ratio, run_time=run_time)

    def term_stream(self, items, run_time=0.4, lag_ratio=0.4):
        self.play(self.term_batch(items, run_time, lag_ratio))

    def term_type(self, text, color=WHITE, run_time=1.0):
        """Add one line and type it out letter by letter (scrolling if full)."""
        line = self._mk_line(text, color)
        overflow = max(0, len(self.cli_log) + 1 - self.cli_n)
        to_fade = self.cli_log[:overflow]
        remaining = self.cli_log[overflow:]
        self.cli_log = remaining + [line]
        scroll = [FadeOut(l) for l in to_fade]
        for i, l in enumerate(remaining):
            scroll.append(l.animate.set_y(self.cli_slots[i]))
        line.set_y(self.cli_slots[len(remaining)])
        line.set_x(self.cli_left + line.width / 2)
        if scroll:
            self.play(AnimationGroup(*scroll), run_time=0.25)
        self.play(AddTextLetterByLetter(line, run_time=run_time))

    def vi_edit(self, path, context, new_line):
        """Simulate a quick vi edit inside the terminal: show a buffer, type the
        new (green) line(s), flash -- INSERT -- / :wq, then clear. `new_line` may
        be a single string or a list of strings (a whole inserted block)."""
        if self.cli_log:
            self.play(AnimationGroup(*[FadeOut(l) for l in self.cli_log]), run_time=0.25)
            self.cli_log = []
        fs = self.cli_fs

        # One monospace cell width. Leading spaces carry no glyph, so Pango/SVG
        # drops them from a Text mobject's bounding box and YAML indentation is
        # lost — so we strip the indent and position each line explicitly by its
        # depth instead.
        char_w = Text("0", font="PT Mono", font_size=fs).width

        def lne(t, color):
            n = len(t) - len(t.lstrip(" "))
            m = Text(t[n:], font="PT Mono", font_size=fs, color=color)
            if m.width > self.cli_maxw:
                m.scale(self.cli_maxw / m.width)
            m.indent_n = n
            return m

        def place_x(m):
            m.set_x(self.cli_left + m.indent_n * char_w + m.width / 2)

        new_lines = [new_line] if isinstance(new_line, str) else list(new_line)

        header = lne(f'"{path}"', ManimColor.from_hex("#7aa2d6"))
        ctx = [lne("  " + t, TB_200) for t in context]
        body = VGroup(header, *ctx).arrange(DOWN, aligned_edge=LEFT, buff=0.08)
        body.align_to([0, self.cli_slots[0] + 0.05, 0], UP)
        for m in [header, *ctx]:
            place_x(m)
        self.play(FadeIn(body), run_time=0.35)

        # type each inserted line in green, stacked under the last buffer line
        prev = ctx[-1] if ctx else header
        greens = []
        per_rt = 0.9 if len(new_lines) == 1 else max(0.32, 1.4 / len(new_lines))
        for t in new_lines:
            nl = lne("  " + t, GREEN_500)
            nl.next_to(prev, DOWN, aligned_edge=LEFT, buff=0.08)
            place_x(nl)
            self.play(AddTextLetterByLetter(nl, run_time=per_rt))
            greens.append(nl)
            prev = nl
        status = lne("-- INSERT --   :wq", AMBER)
        status.next_to(prev, DOWN, aligned_edge=LEFT, buff=0.12).set_x(self.cli_left + status.width / 2)
        self.play(FadeIn(status), run_time=0.25)
        self.wait(0.5)
        self.play(FadeOut(VGroup(body, *greens, status)), run_time=0.3)


# ============================================ reuse-clone-unchanged-objects.mp4

class ReuseCloneUnchanged(AnimScene):
    envs = [("prod", "analytics_prod", "small"), ("joel", "dev_joel", "big")]

    def construct(self):
        geo = self.env_geometry()
        cy_prod, cy_joel = geo["prod"][0], geo["joel"][0]

        sources = self.sources_mob(geo["_content_top"] - self._stack_h / 2, self._stack_h)
        prod_c, prod_l = self.container_mob("analytics_prod", "small", cy_prod)
        joel_c, joel_l = self.container_mob("dev_joel", "big", cy_joel)
        prod_dag = self.placed_dag(MODEL_NODES, ALL_PASS, {}, "small", cy_prod)
        panel, dots = self.cli_panel()

        joel_solid = self.placed_dag(MODEL_NODES, ALL_PASS, {}, "big", cy_joel)
        joel_dotted = self.placed_dag(set(), {}, {}, "big", cy_joel,
                                      ref_scale=joel_solid.ref_scale, ref_shift=joel_solid.ref_shift)

        arr_prod = Arrow([SRC_CX + SRC_W / 2, cy_prod, 0], [SCHEMA_LEFT, cy_prod, 0],
                         buff=0.02, stroke_width=2.0, color=TB_400, tip_length=0.12)
        arr_joel = Arrow([SRC_CX + SRC_W / 2, cy_joel, 0], [SCHEMA_LEFT, cy_joel, 0],
                         buff=0.02, stroke_width=2.0, color=TB_400, tip_length=0.12)

        # ---- intro: analytics_prod as the hero (filling the schema content
        # region, sources already present), then shrink to make room ----
        cli_top = -config.frame_height / 2 + CLI_H + 0.2
        hero_top = geo["_content_top"]
        hero_bottom = cli_top + 0.25
        hero_h = hero_top - hero_bottom
        hero_cy = (hero_top + hero_bottom) / 2
        hero_w = SCHEMA_W
        hero_c = RoundedRectangle(width=hero_w, height=hero_h, corner_radius=0.12,
                                  stroke_color=TB_300, stroke_width=1.5,
                                  fill_color=WHITE, fill_opacity=0.6).move_to([SCHEMA_CX, hero_cy, 0])
        hero_l = Text("analytics_prod", font="PT Mono", font_size=18, weight=BOLD, color=TB_700)
        hero_l.next_to(hero_c.get_corner(UL), DR, buff=0.0).shift(0.18 * RIGHT + 0.16 * DOWN)
        hero_dag = build_env_dag(MODEL_NODES, ALL_PASS, {}, include_sources=False)
        hero_dag.scale(min((hero_w - 0.6) / hero_dag.width, (hero_h - 0.8) / hero_dag.height))
        hero_dag.move_to(hero_c.get_center() + 0.18 * DOWN)
        hero = VGroup(hero_c, hero_l, hero_dag)
        small_prod = VGroup(prod_c, prod_l, prod_dag)

        self.add(sources, hero)
        self.wait(0.9)
        # dev_joel pushes up from below, shoving analytics_prod into its top slot
        joel_in = VGroup(joel_c, joel_l, joel_dotted)
        self.play(
            ReplacementTransform(hero, small_prod),
            FadeIn(joel_in, shift=2.8 * UP),
            FadeIn(arr_prod), FadeIn(arr_joel), FadeIn(panel), FadeIn(dots),
            run_time=1.4,
        )
        self.setup_terminal(panel, dots)
        self.wait(0.3)

        # typed command
        cmd = self._mk_line("$ dbt build --manage-state", WHITE)
        cmd.set_y(self.cli_slots[0]).set_x(self.cli_left + cmd.width / 2)
        self.cli_log.append(cmd)
        self.play(AddTextLetterByLetter(cmd, run_time=1.1))
        self.term_stream([("dbt State is enabled (defer_to prod)", CLI_COLOR["info"])], run_time=0.4)

        model_lines, tests_by_home = group_capture("clone_unchanged.txt", MODEL_NODES)
        present, drawn = set(), set()

        NODE_FLY = 0.55      # constant per node, regardless of #tests
        CHIP_FLY = 0.5       # constant per chip, regardless of #tests
        LINE_DT = 0.12       # per test line (fast)

        for node in VIEW_ORDER + MART_ORDER:
            verb, rest = model_lines[node]
            # every provably-unchanged object (views included) is cloned from
            # prod, so it flies down from analytics_prod rather than popping in.
            is_clone = "Cloned from cached relation" in rest
            mtext, mcolor = cli_format(verb, "model", "x." + node, rest)
            present.add(node)

            appear = (TransformFromCopy(prod_dag.boxes[node], joel_solid.boxes[node]) if is_clone
                      else FadeIn(joel_solid.boxes[node]))
            edge_anims = []
            for (a, b), arr in joel_solid.edge_by_pair.items():
                if a in present and b in present and (a, b) not in drawn:
                    drawn.add((a, b))
                    edge_anims.append(Create(arr))
            node_grp = AnimationGroup(appear, FadeOut(joel_dotted.boxes[node]),
                                      *edge_anims, run_time=NODE_FLY)
            self.play(self.term_batch([(mtext, mcolor)], run_time=0.3, lag_ratio=0.0),
                      node_grp)

            # tests cascade fast; the chip flies in at a constant speed alongside
            # (its own run_time, independent of how many tests there are)
            tests = tests_by_home.get(node, [])
            if tests:
                items = [cli_format(tv, tk, tf, tr) for tv, tk, tf, tr in tests]
                cascade = self.term_batch(items, run_time=max(0.3, LINE_DT * len(items)),
                                          lag_ratio=0.5)
                if node in joel_solid.badge_by_name:
                    chip = (TransformFromCopy(prod_dag.badge_by_name[node],
                                              joel_solid.badge_by_name[node], run_time=CHIP_FLY)
                            if is_clone
                            else FadeIn(joel_solid.badge_by_name[node], scale=0.6, run_time=CHIP_FLY))
                    self.play(cascade, chip)
                else:
                    self.play(cascade)

        self.term_stream([("Summary: 48 total · 3 success · 45 reused",
                           CLI_COLOR["summary"])], run_time=0.6)
        self.wait(5)


# ================================================ skip-cosmetic-sql-changes.mp4

class SkipCosmeticChanges(AnimScene):
    envs = [("prod", "analytics_prod", "small"), ("joel", "dev_joel", "big")]

    def construct(self):
        geo = self.env_geometry()
        cy_prod, cy_joel = geo["prod"][0], geo["joel"][0]

        sources = self.sources_mob(geo["_content_top"] - self._stack_h / 2, self._stack_h)
        prod_c, prod_l = self.container_mob("analytics_prod", "small", cy_prod)
        joel_c, joel_l = self.container_mob("dev_joel", "big", cy_joel)
        prod_dag = self.placed_dag(MODEL_NODES, ALL_PASS, {}, "small", cy_prod)
        joel_dag = self.placed_dag(MODEL_NODES, ALL_PASS, {}, "big", cy_joel)
        panel, dots = self.cli_panel()
        arr_prod = Arrow([SRC_CX + SRC_W / 2, cy_prod, 0], [SCHEMA_LEFT, cy_prod, 0],
                         buff=0.02, stroke_width=2.0, color=TB_400, tip_length=0.12)
        arr_joel = Arrow([SRC_CX + SRC_W / 2, cy_joel, 0], [SCHEMA_LEFT, cy_joel, 0],
                         buff=0.02, stroke_width=2.0, color=TB_400, tip_length=0.12)

        self.add(sources, prod_c, prod_l, prod_dag, joel_c, joel_l, joel_dag,
                 arr_prod, arr_joel, panel, dots)
        self.setup_terminal(panel, dots)
        self.wait(0.4)

        views = set(VIEW_ORDER)
        paths = [(n, (f"models/staging/{n}.sql" if n in views else f"models/marts/{n}.sql"))
                 for n in VIEW_ORDER + MART_ORDER]

        # ---- Phase A: lint --fix — shoots through the file list in ~1.3s
        self.term_type("$ dbt lint --fix")
        items = [("Linted    " + p, CLI_COLOR["ok"]) for _, p in paths]
        for chunk in (items[:6], items[6:]):
            self.play(self.term_batch(chunk, run_time=0.5, lag_ratio=0.5))
        self.term_stream([("Finished 'lint' [1.3s] — 12 files reformatted", CLI_COLOR["summary"])],
                         run_time=0.3)
        self.wait(0.6)

        # ---- Phase B: build --manage-state — the format-only change altered no
        # logic, so every object (views included) is reused in place. Nothing is
        # dropped or recreated; the CLI just streams the reuse result.
        self.term_type("$ dbt build --manage-state")
        self.term_stream([("dbt State is enabled (defer_to prod)", CLI_COLOR["info"])], run_time=0.35)
        model_lines, tests_by_home = group_capture("skip_cosmetic.txt", MODEL_NODES)
        for node in VIEW_ORDER + MART_ORDER:
            verb, rest = model_lines[node]
            mtext, mcolor = cli_format(verb, "model", "x." + node, rest)
            self.play(self.term_batch([(mtext, mcolor)], run_time=0.3, lag_ratio=0.0))
            tests = tests_by_home.get(node, [])
            if tests:
                items = [cli_format(tv, tk, tf, tr) for tv, tk, tf, tr in tests]
                self.play(self.term_batch(items, run_time=max(0.3, 0.12 * len(items)),
                                          lag_ratio=0.5))
        self.term_stream([("Summary: 48 total · 3 success · 45 reused",
                           CLI_COLOR["summary"])], run_time=0.5)
        self.wait(5)


# ================================================== targeted-rebuild-orders.mp4

class TargetedRebuild(AnimScene):
    envs = [("prod", "analytics_prod", "small"), ("joel", "dev_joel", "big")]

    def construct(self):
        geo = self.env_geometry()
        cy_prod, cy_joel = geo["prod"][0], geo["joel"][0]
        sources = self.sources_mob(geo["_content_top"] - self._stack_h / 2, self._stack_h)
        prod_c, prod_l = self.container_mob("analytics_prod", "small", cy_prod)
        joel_c, joel_l = self.container_mob("dev_joel", "big", cy_joel)
        prod_dag = self.placed_dag(MODEL_NODES, ALL_PASS, {}, "small", cy_prod)
        joel_dag = self.placed_dag(MODEL_NODES, ALL_PASS, {}, "big", cy_joel)
        joel_dotted = self.placed_dag(set(), {}, {}, "big", cy_joel,
                                      ref_scale=joel_dag.ref_scale, ref_shift=joel_dag.ref_shift)
        panel, dots = self.cli_panel()
        arr_prod = Arrow([SRC_CX + SRC_W / 2, cy_prod, 0], [SCHEMA_LEFT, cy_prod, 0],
                         buff=0.02, stroke_width=2.0, color=TB_400, tip_length=0.12)
        arr_joel = Arrow([SRC_CX + SRC_W / 2, cy_joel, 0], [SCHEMA_LEFT, cy_joel, 0],
                         buff=0.02, stroke_width=2.0, color=TB_400, tip_length=0.12)
        self.add(sources, prod_c, prod_l, prod_dag, joel_c, joel_l, joel_dag,
                 arr_prod, arr_joel, panel, dots)
        self.setup_terminal(panel, dots)
        self.wait(0.3)

        # ---- edit the files (vi)
        self.vi_edit("models/marts/orders.sql",
                     ["compute_booleans as (", "    select", "        orders.*,",
                      "        ... > 0 as is_food_order,", "        ... > 0 as is_drink_order,"],
                     "cast(orders.order_date as date) = current_date() as is_today_order")
        self.vi_edit("models/marts/orders.yml",
                     ["columns:", "  - name: is_today_order"],
                     ["    data_tests:",
                      "      - accepted_values:",
                      "          arguments: {values: [true]}",
                      "          config: {severity: warn}"])

        # the moment the edits are saved, orders is stale: the solid box drops
        # back to a dotted placeholder and its test chip disappears. The
        # placeholder stays until the build rebuilds it.
        solid, dotted = joel_dag.boxes["orders"], joel_dotted.boxes["orders"]
        fresh = solid.copy()
        joel_dag.boxes["orders"] = fresh
        old = joel_dag.badge_by_name["orders"]
        self.play(FadeOut(solid), FadeIn(dotted), FadeOut(old), run_time=0.4)

        # ---- build orders+  (orders rebuilds and its new test warns; customers
        # is a view that doesn't read the new column, so it is REUSED, not rebuilt)
        self.term_type("$ dbt build --select orders+ --manage-state")
        self.term_stream([("dbt State is enabled (defer_to prod)", CLI_COLOR["info"])], run_time=0.35)
        model_lines, tests_by_home = group_capture("rebuild_orders.txt", MODEL_NODES)

        # orders: rebuilt — the dotted placeholder crossfades back to a solid box.
        verb, rest = model_lines["orders"]
        mtext, mcolor = cli_format(verb, "model", "x.orders", rest)
        self.play(self.term_batch([(mtext, mcolor)], run_time=0.3, lag_ratio=0.0),
                  AnimationGroup(FadeOut(dotted), FadeIn(fresh), run_time=0.6))
        # the tests re-run; nothing is attached to orders while they execute
        items = [cli_format(*t) for t in tests_by_home.get("orders", [])]
        self.play(self.term_batch(items, run_time=max(0.3, 0.12 * len(items)), lag_ratio=0.5))
        # tests have finished — the (warn) chip returns
        new = make_test_badge(7, "warn").scale(joel_dag.ref_scale).move_to(old.get_center())
        new.set_z_index(2)
        self.play(FadeIn(new, scale=0.6, run_time=0.5))

        # customers: reused — no rebuild, no pulse.
        verb, rest = model_lines["customers"]
        mtext, mcolor = cli_format(verb, "model", "x.customers", rest)
        self.play(self.term_batch([(mtext, mcolor)], run_time=0.3, lag_ratio=0.0))
        items = [cli_format(*t) for t in tests_by_home.get("customers", [])]
        self.play(self.term_batch(items, run_time=max(0.3, 0.12 * len(items)), lag_ratio=0.5))

        self.term_stream([("Summary: 14 total | 8 success | 5 reused | 1 warn",
                           CLI_COLOR["summary"])], run_time=0.5)
        self.wait(5)


# ================================================ reuse-clone-from-any-schema.mp4

class ReuseFromAnySchema(AnimScene):
    # Custom (non-stacked) layout: a top band that holds analytics_prod + dev_joel
    # side by side, and a tall band below for dev_toby.
    envs = []
    TOP_H = 2.5
    BIG_H = SIZE_H["big"]

    def __init__(self, **kw):
        stack_h = self.TOP_H + GAP + self.BIG_H
        self._stack_h = stack_h
        h = self.TOP_PAD + stack_h + 0.3 + CLI_H + 0.5
        config.frame_height = h
        config.pixel_width = 1200
        ph = int(round(1200 * h / config.frame_width))
        config.pixel_height = ph - (ph % 2)
        Scene.__init__(self, **kw)

    def construct(self):
        content_top = config.frame_height / 2 - self.TOP_PAD
        y_top = content_top - self.TOP_H / 2
        y_big = content_top - self.TOP_H - GAP - self.BIG_H / 2

        half_gap = 0.4
        half_w = (SCHEMA_W - half_gap) / 2
        left_cx = SCHEMA_LEFT + half_w / 2
        right_cx = SCHEMA_LEFT + half_w + half_gap + half_w / 2

        sources = self.sources_mob(content_top - self._stack_h / 2, self._stack_h)
        panel, dots = self.cli_panel()
        # source feed arrows: one to the top-left env, one to the big bottom env
        arrs = VGroup(*[
            Arrow([SRC_CX + SRC_W / 2, cy, 0], [SCHEMA_LEFT, cy, 0],
                  buff=0.02, stroke_width=2.0, color=TB_400, tip_length=0.12)
            for cy in (y_top, y_big)
        ])

        WARN = {**ALL_PASS, "orders": "warn"}
        # ---- opening layout: like the end of step 4 (prod on top, dev_joel big below)
        prod_c0, prod_l0 = self.container_at("analytics_prod", SCHEMA_W, self.TOP_H, SCHEMA_CX, y_top)
        prod_dag0 = self.placed_dag_at(MODEL_NODES, ALL_PASS, {}, SCHEMA_W, self.TOP_H, SCHEMA_CX, y_top)
        joel_c0, joel_l0 = self.container_at("dev_joel", SCHEMA_W, self.BIG_H, SCHEMA_CX, y_big)
        joel_dag0 = self.placed_dag_at(MODEL_NODES, WARN, {"orders": 7}, SCHEMA_W, self.BIG_H, SCHEMA_CX, y_big)

        self.add(sources, prod_c0, prod_l0, prod_dag0, joel_c0, joel_l0, joel_dag0,
                 arrs, panel, dots)
        self.setup_terminal(panel, dots)
        self.wait(0.6)

        # ---- rearrange: prod shrinks to the top-left, dev_joel moves up to the
        # top-right, and dev_toby grows up into the space dev_joel vacated.
        prod_c, prod_l = self.container_at("analytics_prod", half_w, self.TOP_H, left_cx, y_top)
        prod_dag = self.placed_dag_at(MODEL_NODES, ALL_PASS, {}, half_w, self.TOP_H, left_cx, y_top)
        joel_c, joel_l = self.container_at("dev_joel", half_w, self.TOP_H, right_cx, y_top)
        joel_dag = self.placed_dag_at(MODEL_NODES, WARN, {"orders": 7}, half_w, self.TOP_H, right_cx, y_top)

        toby_c, toby_l = self.container_at("dev_toby", SCHEMA_W, self.BIG_H, SCHEMA_CX, y_big)
        toby_solid = self.placed_dag_at({"orders"}, {"orders": "warn"}, {"orders": 7},
                                        SCHEMA_W, self.BIG_H, SCHEMA_CX, y_big)
        toby_pass = self.placed_dag_at({"orders"}, {"orders": "pass"}, {"orders": 6},
                                       SCHEMA_W, self.BIG_H, SCHEMA_CX, y_big,
                                       ref_scale=toby_solid.ref_scale, ref_shift=toby_solid.ref_shift)
        toby_dotted = self.placed_dag_at(set(), {}, {}, SCHEMA_W, self.BIG_H, SCHEMA_CX, y_big,
                                         ref_scale=toby_solid.ref_scale, ref_shift=toby_solid.ref_shift)

        self.play(
            ReplacementTransform(VGroup(prod_c0, prod_l0, prod_dag0),
                                 VGroup(prod_c, prod_l, prod_dag)),
            ReplacementTransform(VGroup(joel_c0, joel_l0, joel_dag0),
                                 VGroup(joel_c, joel_l, joel_dag)),
            run_time=1.2,
        )
        self.play(FadeIn(VGroup(toby_c, toby_l, toby_dotted), shift=0.4 * UP, run_time=0.7))
        self.wait(0.4)

        # ---- phase 1: on main, build orders -> clones from prod with 6 passing tests
        self.term_type("$ git checkout main")
        self.term_type("$ dbt build --select orders --manage-state")
        self.term_stream([("dbt State is enabled (defer_to prod)", CLI_COLOR["info"])], run_time=0.35)

        # clone orders from analytics_prod into dev_toby
        cli = self.term_batch([("Reused    model orders (cloned from prod)",
                                CLI_COLOR["clone"])], run_time=0.3, lag_ratio=0.0)
        self.play(cli,
                  FadeOut(toby_dotted.boxes["orders"]),
                  TransformFromCopy(prod_dag.boxes["orders"], toby_pass.boxes["orders"], run_time=0.8))

        # the 6 passing tests are reused from prod; a green chip lands on orders
        model_lines, tests_main = group_capture("clone_from_prod.txt", MODEL_NODES)
        items = [cli_format(*t) for t in tests_main.get("orders", [])]
        self.play(self.term_batch(items, run_time=max(0.3, 0.12 * len(items)), lag_ratio=0.5),
                  TransformFromCopy(prod_dag.badge_by_name["orders"],
                                    toby_pass.badge_by_name["orders"], run_time=0.8))
        self.term_stream([("Summary: 8 total | 1 success | 7 reused", CLI_COLOR["summary"])], run_time=0.5)
        self.wait(1.0)

        # ---- phase 2: switch to the failing branch -> orders re-clones from dev_joel
        self.term_type("$ git checkout new-orders-column")
        self.term_type("$ dbt build --select orders --manage-state")
        self.term_stream([("dbt State is enabled (defer_to prod)", CLI_COLOR["info"])], run_time=0.35)

        # orders is now stale: the passing box + chip fall away, then it re-clones
        # from dev_joel (which already built this version of the model)
        cli = self.term_batch([("Reused    model orders (cloned from cached relation)",
                                CLI_COLOR["clone"])], run_time=0.3, lag_ratio=0.0)
        self.play(cli,
                  FadeOut(toby_pass.boxes["orders"]),
                  FadeOut(toby_pass.badge_by_name["orders"]),
                  TransformFromCopy(joel_dag.boxes["orders"], toby_solid.boxes["orders"], run_time=0.8))

        # reused test results stream; the warn chip is copied down from dev_joel
        # (the reused test keeps its warning — it is not re-evaluated as a pass)
        model_lines, tests_by_home = group_capture("clone_from_dev.txt", MODEL_NODES)
        items = [cli_format(*t) for t in tests_by_home.get("orders", [])]
        self.play(self.term_batch(items, run_time=max(0.3, 0.12 * len(items)), lag_ratio=0.5),
                  TransformFromCopy(joel_dag.badge_by_name["orders"],
                                    toby_solid.badge_by_name["orders"], run_time=0.8))
        self.term_stream([("Summary: 9 total | 1 success | 7 reused | 1 warn", CLI_COLOR["summary"])], run_time=0.5)
        self.wait(5)
