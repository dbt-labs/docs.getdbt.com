---
name: product-term-rename
description: Rename dbt product terms across docs.getdbt.com per the finalized naming convention — Fusion/dbt Fusion engine to "dbt v2", dbt Core to "dbt v1", and genuinely product-agnostic uses to "dbt". Use when asked to run the product rename, flip Fusion terminology, apply the v1/v2 naming, or execute the Product Rename Strategy. Handles the constants flip, specific-vs-generic audit, grammar repair, scoped prose edits, raw-string sweep, and verification gates; excludes blogs and release notes, includes upgrade guides.
---

Rename dbt product terms across the docs, following the finalized naming
convention. Mechanical work is deterministic (bundled scripts); the LLM is spent
only on prose that needs editorial judgment.

## Core principle — be SPECIFIC, don't collapse

Each product renders as a **distinct** term so a reader can always tell which
product a sentence refers to. Do **not** collapse everything to bare `dbt` — that
makes contrasting sentences render identically ("removed in dbt and in dbt") and
hides the specific-vs-generic decision. Instead, constants render the specific
product, and `dbt` (generic) is applied **deliberately**, only where a statement
is genuinely product-agnostic.

## The naming rules this skill enforces

1. **Fusion / dbt Fusion engine** → **`dbt v2`**.
2. **dbt Core** → **`dbt v1`** (this is the default for `dbt Core` / the `core` constant).
3. **Genuinely product-agnostic** statements (true of dbt regardless of version) →
   **`dbt`** — applied deliberately, e.g. by switching the occurrence to `<Constant name="dbt" />`.
4. **Inline `v1`/`v2`; `dbt v1`/`dbt v2` only in a header or at the start of a sentence.**
5. **Scope:** exclude blogs and release notes; **include** upgrade guides;
   everything else in `website/docs/**` and `website/snippets/**` is in scope.
6. **`dbt` is ALWAYS lowercase** — never `Dbt`/`DBT`, even at a sentence/heading start.

## Constants (Layer 1 targets) — edit `website/constants.js`

| key | pre-rename value | render as | note |
|---|---|---|---|
| `fusion` | `Fusion` | **`dbt v2`** | the v2 engine |
| `fusion_engine` | `dbt Fusion engine` | **`dbt v2`** | needs article cleanup ("the dbt v2" → "dbt v2") |
| `core` | `dbt Core` | **`dbt v1`** | the v1 engine — biggest surface (~585 uses) |
| `core_v1` | `dbt Core v1.x` | **`dbt v1`** | |
| `core_v2` | `dbt Core 2.0` | **`dbt v2`** | |
| `dbt` | `dbt` | `dbt` | generic ONLY — use deliberately |

Rendering the specific version resolves the same-sentence collisions at the source
(a `core`+`fusion` contrast now reads "dbt v1 … dbt v2" automatically). The Layer 2
prose pass trims constant-adjacent versioned forms to bare `v1`/`v2` inline (rule 4).

## Procedure

1. **Read config.** `config/*.yml`. Confirm target strings with the operator.
2. **Update terminology sources FIRST** so terms can't regenerate — edit the
   product-name tables in `AGENTS.md` and `contributing/content-style-guide.md` to
   the corrected mapping: retire the `dbt Core` and `Fusion`/`dbt Fusion engine`
   rows; add `dbt v1` (formerly dbt Core) and `dbt v2` (formerly Fusion / dbt Core
   2.0), each noting `dbt v1`/`dbt v2` at a header or sentence start and bare
   `v1`/`v2` inline; keep the `dbt` row as **generic only — use deliberately for
   product-agnostic statements**, not as the default for former dbt Core/Fusion.
   Also confirm the `<Constant>` examples reference the specific constants.
3. **Scan.** `python3 scripts/scan.py` → `inventory.json`. Print the summary and
   **HALT**: counts by class, denylist hits, files needing judgment, raw-string residue.
4. **Layer 1 — constants flip.** Set the six values in `website/constants.js` (table above).
5. **Layer 1b — specific-vs-generic audit + grammar fix.** Partition
   `constant_grammar_risk` records by directory; spawn parallel subagents, one per file. Each:
   - fixes grammar the flip introduces (esp. `fusion_engine` → "dbt v2": drop the orphan
     article, "the dbt v2 is" → "dbt v2 is"; remove duplicate nouns);
   - **audits intent**: if a `core`/`fusion` constant is used *generically* (product-agnostic),
     switch that occurrence to `<Constant name="dbt" />`; otherwise leave the specific constant.
   Edit with `Edit`, never `Write`.
6. **Layer 2a — mechanical prose.** `python3 scripts/apply_mechanical.py` (auto_safe only).
   Deterministic. Run `--dry-run` first.
7. **Layer 2b — judgment prose.** Partition `auto_safe: false` by directory; spawn N≈10
   parallel subagents, each with ONLY its slice + `references/*.md`. Apply rules 1–4 and 6.
   **Term swaps only** — see the editorial guardrail below.
8. **Raw-string sweep.** After edits, `grep` for residual old names — `dbt Core`, `dbt Fusion`,
   `Fusion engine`, `Fusion` — across scope INCLUDING frontmatter `tags:`, JSX attribute
   strings, `hoverSnippet`, and pill arrays. These are easy to miss; drive the count to 0
   (excluding denylisted identifiers). Confirm pill/body agreement in `_adapters-*.md`
   (a `pills` array `<Constant name="fusion">` must match the rewritten body).
9. **Verify.** `python3 scripts/verify.py`, then `npm run build` (`onBrokenLinks: throw`)
   and `vale website/docs website/snippets`. Never proceed on a red gate.
10. **Report.** Files changed, occurrences by class, structural items deferred,
    generic-vs-specific coin-flips, and any editorial rewrites split out (below).

## Editorial guardrail — term swaps only

This is a **mechanical rename**, not a content rewrite. Subagents must change ONLY the
product term (and the minimal surrounding grammar to keep the sentence correct). Do **not**
add facts, rephrase for style, or introduce new sentences (e.g. "Rust engine", "adapters
live in a monorepo", migration prose). Anything that changes meaning belongs in a
**separate content-review PR** — flag it, don't apply it here.

## Guardrails

- **Never** text-replace anything in `config/never-touch.yml` (CI tokens, repo slugs,
  `AvailabilityMatrix fusion:` key, component names, release-track values, compound
  identifiers like `dbt-fusion#123`).
- **Never** edit inside `<Constant>` tags (except switching a generic one to `dbt`),
  code fences, inline backticks, URLs, frontmatter `id`/`slug`, or imports.
- **Structural** renames (slugs, redirects, heading anchors) are a **separate PR**. When you
  must change heading text, preserve the original anchor with an explicit `{#original-anchor}`.
- Ship the Vale rule in `references/Terminology.yml` in the same PR so terms can't regress.
- Keep PR descriptions light on naming specifics until dbt Summit.

## Targeted / test runs

```bash
python3 scripts/scan.py --scope-override "website/docs/docs/dbt-versions/dbt-upgrade/**/*.md"
```
