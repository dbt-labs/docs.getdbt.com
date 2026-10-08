# dbt State blog animations

[Manim](https://docs.manim.community/en/stable/) generates these animations as code.
This directory holds the source for the videos and diagrams in the
[How dbt State works](../../../../blog/2026-06-17-how-dbt-state-works.md) blog post.

## Running

Run from this directory with `uv` (a virtualenv is created automatically):

```bash
uv run manim -qm <file>.py <SceneName>     # medium-quality MP4
uv run manim -s  <file>.py <SceneName>     # single still PNG (for the diagram)
uv run manim -ql <file>.py <SceneName>     # fast low-quality preview
```

Rendered output lands under `media/` (git-ignored). Copy the final asset to the
blog's static directory at
`website/static/img/blog/2026-06-17-how-dbt-state-works/`.

## Scene → blog asset mapping

Each clone demo is one scene in `clone_demos.py`; it replays a real captured CLI
log (`cli_captures/*.txt`) line by line while the DAG animates.

| Scene | File | Capture(s) read | Blog asset |
|---|---|---|---|
| `ReuseCloneUnchanged` | `clone_demos.py` | `clone_unchanged.txt` | `reuse-clone-unchanged-objects.mp4` |
| `SkipCosmeticChanges` | `clone_demos.py` | `skip_cosmetic.txt` | `skip-cosmetic-sql-changes.mp4` |
| `TargetedRebuild` | `clone_demos.py` | `rebuild_orders.txt` | `targeted-rebuild-orders.mp4` |
| `ReuseFromAnySchema` | `clone_demos.py` | `clone_from_prod.txt`, `clone_from_dev.txt` | `reuse-clone-from-any-schema.mp4` |
| `StateNormalisation` | `dbt_state_normalisation.py` | — | `query-normalisation-hash-comparison.png` |
| `VolatileSql` | `dbt_state_normalisation.py` | — | `volatile-sql-hash.mp4` |

## File layout

| File | Role |
|---|---|
| `dag_model.py` | Shared data + mobject factories: the demo DAG, colour palette, multi-environment scene geometry, and the CLI line-colour map. No `Scene`. Imported by the scene files below. |
| `clone_demos.py` | The four animated clone demos (the table above). |
| `dbt_state_normalisation.py` | The query-normalisation still + the volatile-SQL animation. |
| `cli_captures/*.txt` | Curated terminal output from real dbt runs, replayed by the animations. |
| `specs/` | Design + implementation notes for the scenes. |
