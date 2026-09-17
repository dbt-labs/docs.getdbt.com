# Edge cases & landmines (verbatim from the audit)

Every subagent gets this file. If an occurrence looks like anything below, do not
edit it — it is either denylisted or a false positive.

## Must-not-touch identifiers (see config/never-touch.yml)

| Identifier | Where | Consequence if renamed |
|---|---|---|
| `FUSION_REPO_TOKEN`, `FUSION_ISSUES_TOKEN`, `FUSION_REPO=dbt-labs/fs` | `scripts/create-fusion-gap-issues.js`, `.github/workflows/update-platform-functions.yml` | Silently breaks the weekly function-gap issue bot |
| `dbt-labs/dbt-fusion`, `dbt-labs/fs`, `CHANGELOG-fusion.md` | Dozens of files | Dead external links |
| `fusion:` row key in `<AvailabilityMatrix>` | `src/components/availabilityMatrix/index.js` + call sites | Column renders blank |
| `docusaurus-build-fusion-releases-plugin` | `plugins/buildFusionReleases/` ↔ `components/fusionReleases/` | `usePluginData()` returns `undefined` |
| `fusion-stable`, `fusion-nightly`, `fusion_cloud`, `dbt.fusionPath`, `is_fusion_ready`, `fusion_readiness_read` | Release tracks, Wizard config, VS Code settings, release notes | Wrong API/config values documented |
| `#dbt-fusion-engine` (Slack), `/img/fusion/*` (assets) | Various | Broken channel refs / 404 images |
| `Fusion admin` | `manage-access/enterprise-permissions.md` | Renames a real permission-set name |
| `FusionLifecycle`, `AboutFusion`, `FusionThreads`, `FusionReadinessPanel`, … + `_fusion-*.md` snippets | ~30 files | Import failures / build breaks |

## Word-level traps (false positives — never edit)

- **`confusion`** contains `fusion`. Appears in 10+ files.
- **Apache DataFusion** — third-party Rust project. In
  `2025-05-28-dbt-fusion-engine-components.md` and `adapter-creation-v2.md`.
- Generic-English **"fusion"** meaning merger, in
  `2025-06-16-the-new-dbt-vscode-extension.md`.
- **Casing** is inconsistent — the same page uses `Fusion` and `fusion` for one
  concept. Match case-insensitively; output case-aware.
- **Constant spacing** varies: `<Constant name="fusion"/>` vs `<Constant name="fusion" />`.

## Structural — reported, never auto-edited

URLs, markdown link targets, anchors, slugs, filenames, component names, code
samples, CLI flags, env vars, image paths, version strings, frontmatter `id`/`slug`.
These move in a separate, human-approved structural PR — not in this rename.

## JSX attribute strings ARE prose

`alt_header=`, `<Lightbox title=…>`, `label=`, `text="Fusion compatible"` are
user-facing copy that cannot hold a `<Constant>` tag. Treat as prose,
`auto_safe: false`. Concentrated in `_fusion-troubleshooting.md`,
`_install-dbt-extension.md`, and the six connector pages.

## Easily-missed raw-string sources — SWEEP these (don't skip)

The first pass missed ~171 raw old-name strings because they don't look like body
prose. Include them in the rename and the Step 8 residue sweep:

- **Frontmatter `tags:`** — e.g. `tags: ['dbt Fusion', 'dbt Core']`. These are
  user-facing taxonomy; rename to the new terms (`'dbt v2'`, `'dbt v1'`). (Only `id`
  and `slug` are structural and left alone.)
- **`hoverSnippet` / `description` / `title` / `sidebar_label`** frontmatter — prose.
- **JSX attribute strings** — `alt_header=`, `<Lightbox title=`, `label=`, `text=`.
- **Code comments** in fenced blocks (e.g. `# Ignored by dbt Core`) — these are prose
  to a reader; rename the comment text (never the code itself).

## Pill/body agreement — `_adapters-*.md`

The adapter cards carry a `pills` array (e.g. `<Constant name="fusion" />`) AND body
copy. When you rewrite the body, the pill must render the SAME product. After the
constants flip, a `fusion` pill renders "dbt v2" — make sure the card body says
"Install with dbt v2" (the v2 path), not a generic "Install with dbt", so pill and
body agree. This is where "Fusion loses its identity" if you collapse to bare `dbt`.
