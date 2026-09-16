"""Animation: dbt-fusion → dbt-core licensing & codebase consolidation.

Three repository columns stay on screen from the start. Each capability
chip carries a tiny language mark at its bottom-right (Python two-square
logo for Python; orange gear for Rust). The two-step transformation:

  Step 1a — copies of the IOU chips fly from dbt-fusion-private into
            the IOU placeholder slots in dbt-fusion; the ghost
            placeholders and the dashed IOU box dissolve.
  Step 1b — the existing ELv2 chips plus the just-arrived copies
            recolor to Apache green; the ELv2 badge flips to Apache 2.0.
            (Chip icons stay Rust.)
  Step 2  — every chip in dbt-fusion slides into dbt-core, replacing
            the matching Python chip in place. The Rust-iconed fusion
            chips overwrite the Python-iconed core chips. The
            dbt-fusion repo dissolves.

dbt-fusion-private retains every chip throughout — only copies leave it.

    uv run manim -ql fusion_relicensing.py FusionRelicensing
"""

from pathlib import Path

from manim import *
import numpy as np


ASSETS_DIR = Path(__file__).parent / "assets"

config.frame_width = 16
config.frame_height = 7.3
config.pixel_width = 1920
config.pixel_height = 876
config.background_color = "#F9FAFB"  # Terminal Black 50 — off-white surface


# ---------- brand palette (from website/src/css/colors.css) ----------
# Transform Orange (primary brand)
TRANSFORM_ORANGE = ManimColor.from_hex("#fe6703")
# Coalesce Purple (accent)
COALESCE_PURPLE_600 = ManimColor.from_hex("#632ff5")
# Terminal Black scale (neutrals)
TB_50 = ManimColor.from_hex("#f9fafb")
TB_100 = ManimColor.from_hex("#f3f4f6")
TB_200 = ManimColor.from_hex("#e5e7eb")
TB_300 = ManimColor.from_hex("#d1d5dc")
TB_400 = ManimColor.from_hex("#99a1af")
TB_500 = ManimColor.from_hex("#6a7282")
TB_700 = ManimColor.from_hex("#364153")
TB_900 = ManimColor.from_hex("#101828")
# Brand semantic colors
GREEN_500 = ManimColor.from_hex("#7ca035")
YELLOW_600 = ManimColor.from_hex("#cb9900")
PINK_700 = ManimColor.from_hex("#c20059")
BLUE_500 = ManimColor.from_hex("#067fe0")

TEXT_DARK = TB_900
TEXT_MED = TB_500
REPO_BORDER = TB_300

PYTHON_BLUE = ManimColor.from_hex("#3776AB")
PYTHON_YELLOW = ManimColor.from_hex("#FFD43B")
RUST_COLOR = ManimColor.from_hex("#CE422B")

# License / section semantic colors
APACHE_COLOR = BLUE_500                # open-source target state
ELV2_COLOR = YELLOW_600                # intermediate, partial-open
PROPRIETARY_COLOR = PINK_700           # closed
PREMIUM_COLOR = COALESCE_PURPLE_600    # paid features
IOU_COLOR = TB_400                     # placeholder gray


CHIP_W = 1.85
CHIP_H = 0.38
CHIP_BUFF = 0.13
ICON_SIZE = 0.22
ICON_INSET = 0.08


def make_python_icon(size=ICON_SIZE):
    """Official Python logo (Wikimedia, rendered to PNG)."""
    icon = ImageMobject(str(ASSETS_DIR / "python-logo.png"))
    icon.height = size
    return icon


def make_rust_icon(size=ICON_SIZE):
    """Official Rust logo (Wikimedia black version, rendered to PNG)."""
    icon = ImageMobject(str(ASSETS_DIR / "rust-logo.png"))
    icon.height = size
    return icon


def make_chip(label, color, width=CHIP_W, height=CHIP_H, font_size=16, ghost=False, icon_fn=None):
    fill_opacity = 0.05 if ghost else 0.16
    text_opacity = 0.5 if ghost else 1.0
    stroke_opacity = 0.55 if ghost else 1.0
    rect = RoundedRectangle(
        corner_radius=0.08, width=width, height=height,
        fill_color=color, fill_opacity=fill_opacity,
        stroke_color=color, stroke_width=1.5,
    )
    rect.set_stroke(opacity=stroke_opacity)
    text = Text(label, font_size=font_size, color=color, font="Menlo").move_to(rect.get_center())
    text.set_opacity(text_opacity)
    # Group (not VGroup) so we can hold an ImageMobject icon alongside VMobjects.
    chip = Group(rect, text)
    chip.rect = rect
    chip.text = text
    chip.icon = None

    if icon_fn is not None:
        icon = icon_fn(size=ICON_SIZE)
        icon.move_to([
            rect.get_right()[0] - ICON_SIZE / 2 - ICON_INSET,
            rect.get_bottom()[1] + ICON_SIZE / 2 + ICON_INSET,
            0,
        ])
        chip.add(icon)
        chip.icon = icon

    return chip


def chip_recolor_anims(chip, new_color):
    """Recolor only rect + text; leave any language icon untouched."""
    return [
        chip.rect.animate.set_color(new_color),
        chip.text.animate.set_color(new_color),
    ]


def crisp_text(text_str, font_size, **kwargs):
    """Render text at 4x then shrink to 0.25x; produces crisper kerning at small sizes."""
    t = Text(text_str, font_size=font_size * 4, **kwargs)
    t.scale(0.25)
    return t


def make_badge(label, color, height=0.34, font_size=13):
    text = crisp_text(label, font_size=font_size, color=WHITE, weight=BOLD, font="Helvetica")
    rect = RoundedRectangle(
        corner_radius=0.17,
        width=max(text.width + 0.4, 0.9),
        height=height,
        fill_color=color, fill_opacity=1.0, stroke_width=0,
    )
    text.move_to(rect.get_center())
    badge = VGroup(rect, text)
    badge.rect = rect
    badge.text = text
    return badge


def make_repo(name, width=4.7, height=7.4):
    container = RoundedRectangle(
        corner_radius=0.18, width=width, height=height,
        fill_color=WHITE, fill_opacity=1.0,
        stroke_color=REPO_BORDER, stroke_width=2,
    )
    title = Text(name, font_size=22, color=TEXT_DARK, font="Menlo", weight=BOLD)
    title.move_to(container.get_top() + 0.4 * DOWN)
    repo = VGroup(container, title)
    repo.container = container
    repo.title = title
    return repo


def make_section_label(text_str, color=TEXT_MED, font_size=12):
    return crisp_text(text_str, font_size=font_size, color=color, weight=BOLD, font="Helvetica")


def make_dashed_box(width, height, color=IOU_COLOR, stroke_width=2):
    base = Rectangle(width=width, height=height, color=color, stroke_width=stroke_width, fill_opacity=0)
    return DashedVMobject(base, num_dashes=max(24, int((width + height) * 5)), equal_lengths=True)


class FusionRelicensing(Scene):
    def construct(self):
        REPO_W = 4.7
        REPO_H = 6.5
        REPO_Y = 0
        CORE_X = -5.4
        FUSION_X = 0
        PRIVATE_X = 5.4

        canonical = ["parse", "deps", "jinja", "adapters", "render", "build", "docs", "..."]
        ELV2_COUNT = 4
        canonical_premium = ["SQL comprehension", "dbt Mesh", "LSP", "Compare", "..."]

        # ----- repos -----
        core_repo = make_repo("dbt-core", REPO_W, REPO_H).move_to([CORE_X, REPO_Y, 0])
        fusion_repo = make_repo("dbt-fusion", REPO_W, REPO_H).move_to([FUSION_X, REPO_Y, 0])
        private_repo = make_repo("dbt-fusion-private", REPO_W, REPO_H).move_to([PRIVATE_X, REPO_Y, 0])

        # ----- license badges only (language now lives on the chips) -----
        def badge_under(repo, badge):
            badge.next_to(repo.title, DOWN, buff=0.16)
            badge.set_x(repo.get_center()[0])
            return badge

        core_apache = badge_under(core_repo, make_badge("Apache 2.0", APACHE_COLOR))
        fusion_elv2 = badge_under(fusion_repo, make_badge("ELv2", ELV2_COLOR))
        private_propr = badge_under(private_repo, make_badge("Proprietary", PROPRIETARY_COLOR))

        # ----- core: full canonical column, Python-iconed -----
        core_chips = Group(*[
            make_chip(label, APACHE_COLOR, icon_fn=make_python_icon) for label in canonical
        ])
        core_chips.arrange(DOWN, buff=CHIP_BUFF)
        core_chips.next_to(core_apache, DOWN, buff=0.3)
        core_chips.set_x(CORE_X)

        # ----- fusion: single canonical column; first 3 amber+Rust, rest ghost placeholders -----
        fusion_chips_all = Group(*[
            make_chip(
                canonical[i],
                ELV2_COLOR if i < ELV2_COUNT else IOU_COLOR,
                ghost=(i >= ELV2_COUNT),
                icon_fn=make_rust_icon if i < ELV2_COUNT else None,
            )
            for i in range(len(canonical))
        ])
        fusion_chips_all.arrange(DOWN, buff=CHIP_BUFF)
        fusion_chips_all.next_to(fusion_elv2, DOWN, buff=0.3)
        fusion_chips_all.set_x(FUSION_X)

        fusion_elv2_chips = Group(*fusion_chips_all[:ELV2_COUNT])
        fusion_iou_chips = Group(*fusion_chips_all[ELV2_COUNT:])

        # IOU label sits BELOW the ghost chips, inside the dashed box
        iou_label = make_section_label("IOU", color=IOU_COLOR, font_size=14)
        iou_label.next_to(fusion_iou_chips, DOWN, buff=0.08)
        iou_label.set_x(FUSION_X)

        iou_box_content = Group(fusion_iou_chips, iou_label)
        iou_box_pad = 0.05
        iou_box = make_dashed_box(
            width=fusion_iou_chips.width + 0.4,
            height=iou_box_content.height + 2 * iou_box_pad,
        )
        iou_box.move_to(iou_box_content.get_center())

        # ----- private: full canonical column proprietary red + Rust icons, plus premium -----
        private_main_chips = Group(*[
            make_chip(canonical[i], PROPRIETARY_COLOR, icon_fn=make_rust_icon)
            for i in range(len(canonical))
        ])
        private_main_chips.arrange(DOWN, buff=CHIP_BUFF)
        private_main_chips.next_to(private_propr, DOWN, buff=0.3)
        private_main_chips.set_x(PRIVATE_X)

        # Reflow ALL 8 proprietary chips into a 2-column × 4-row grid so the section is compact
        # and the chips fly to fusion as a unified 2x4 set.
        GRID_COL_OFFSET = 0.95
        grid_top_y = private_main_chips[0].get_y()
        for i in range(len(canonical)):
            chip = private_main_chips[i]
            row = i // 2
            col = i % 2
            new_y = grid_top_y - row * (CHIP_H + CHIP_BUFF)
            new_x = PRIVATE_X + (GRID_COL_OFFSET if col == 1 else -GRID_COL_OFFSET)
            chip.move_to([new_x, new_y, 0])

        private_premium_chips = Group(*[
            make_chip(label, PREMIUM_COLOR, width=3.0, height=0.38, font_size=13, icon_fn=make_rust_icon)
            for label in canonical_premium
        ])
        private_premium_chips.arrange(DOWN, buff=0.1)

        premium_label = make_section_label("Premium", color=PREMIUM_COLOR, font_size=12)
        premium_label.next_to(private_main_chips, DOWN, buff=0.26)
        premium_label.set_x(PRIVATE_X)
        private_premium_chips.next_to(premium_label, DOWN, buff=0.1)
        private_premium_chips.set_x(PRIVATE_X)

        # ============ static initial state ============
        self.add(
            core_repo, fusion_repo, private_repo,
            core_apache, fusion_elv2, private_propr,
            core_chips,
            fusion_elv2_chips, fusion_iou_chips, iou_box, iou_label,
            private_main_chips,
            premium_label, private_premium_chips,
        )
        self.wait(2.0)

        # ============ STEP 1a: only the IOU-bound 5 copies fly from private → fusion ============
        # parse/deps/jinja already exist in fusion's ELv2 section, so they don't need to fly.
        copied_owed_chips = [private_main_chips[i].copy() for i in range(ELV2_COUNT, len(canonical))]

        self.add(*copied_owed_chips)

        move_anims = [
            copy.animate.move_to(fusion_iou_chips[i].get_center())
            for i, copy in enumerate(copied_owed_chips)
        ]

        self.play(
            *move_anims,
            FadeOut(fusion_iou_chips),
            FadeOut(iou_box),
            FadeOut(iou_label),
            run_time=1.4,
        )

        self.wait(0.25)

        # ============ STEP 1b: relicense - chip rect/text → Apache; badge → Apache 2.0 ============
        new_fusion_apache = make_badge("Apache 2.0", APACHE_COLOR)
        new_fusion_apache.move_to(fusion_elv2.get_center())

        recolor_anims = []
        for chip in fusion_elv2_chips:
            recolor_anims.extend(chip_recolor_anims(chip, APACHE_COLOR))
        for chip in copied_owed_chips:
            recolor_anims.extend(chip_recolor_anims(chip, APACHE_COLOR))

        self.play(
            *recolor_anims,
            Transform(fusion_elv2, new_fusion_apache),
            run_time=0.9,
        )

        self.wait(1.4)

        # ============ STEP 2: dbt-fusion → dbt-core, in-place replacement ============
        all_fusion_chips_now = list(fusion_elv2_chips) + copied_owed_chips

        replace_anims = []
        for i, fusion_chip in enumerate(all_fusion_chips_now):
            target = core_chips[i].get_center()
            replace_anims.append(fusion_chip.animate.move_to(target))
            replace_anims.append(FadeOut(core_chips[i]))

        self.play(
            *replace_anims,
            FadeOut(fusion_repo.title),
            FadeOut(fusion_elv2),
            FadeOut(fusion_repo.container),
            run_time=2.0,
        )

        self.wait(2.0)
