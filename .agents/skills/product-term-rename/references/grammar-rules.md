# Grammar & editorial rules for the LLM prose pass

The Layer 1b and 2b subagents apply these. The mechanical script applies nothing
here — everything below needs sentence-level judgment.

## The mapping (be specific)

- **Fusion / dbt Fusion engine** → **`dbt v2`**
- **dbt Core** → **`dbt v1`** (default)
- **genuinely product-agnostic** statement → **`dbt`** (deliberate; see below)

Render the specific product. Do NOT collapse to bare `dbt` — that produces
identical text for different products ("removed in dbt and in dbt").

## Rule 3 — specific vs generic (the key judgment)

Default to the specific version. Use bare `dbt` ONLY when the sentence is true of
dbt regardless of engine/version and naming the version would be wrong or noisy:

- _"dbt Core compiles your SQL"_ → the compile step is generic → **"dbt compiles your SQL"**.
- _"upgrade from dbt Core to the Fusion engine"_ → a version contrast → **"upgrade from v1 to v2"**.
- _"dbt Core v1.10 introduced UDFs"_ → v1-specific → **"dbt v1.10 introduced UDFs"**.

For **constant** occurrences (`<Constant name="core"/>` / `<Constant name="fusion"/>`):
if the usage is generic, switch the tag to `<Constant name="dbt" />`. Otherwise leave
the specific constant (it now renders `dbt v1` / `dbt v2` correctly). If genuinely
ambiguous, prefer the specific version and flag it.

## Rule 4 — v1 / v2 positioning

The `core*`/`fusion*` constants render `dbt v1` / `dbt v2`. That's correct at the
**start of a sentence or in a header**. **Inline / mid-sentence, trim to bare `v1` / `v2`:**

- Header / sentence-start: "dbt v2 is faster." (keep)
- Inline: "…performance improvements in v2…" (not "in dbt v2")
- "Upgrade from dbt v1 to dbt v2." (both mid-sentence) → "Upgrade from v1 to v2."

Trimming applies to LITERAL prose you write. Do not delete a `<Constant>` tag just to
trim it inline — leave the tag; the small "dbt v2" it renders inline is acceptable.

## `fusion_engine` article cleanup (Layer 1b)

`fusion_engine` was "dbt Fusion engine" (a noun phrase) and now renders "dbt v2".
Fix the article/nouns around it:

- _"the `<fusion_engine/>` is fast"_ → renders "the dbt v2 is fast" → **"dbt v2 is fast"** (drop "the").
- _"a `<fusion_engine/>` feature"_ → "a dbt v2 feature" (keep the article; noun follows — fine).
- _"the `<fusion_engine/>` engine"_ → "dbt v2" (drop the duplicate "engine").

## Rule 6 — `dbt` is ALWAYS lowercase

Never `Dbt`/`DBT`, even at a sentence/heading start ("Fusion builds on…" → "dbt v2
builds on…"; heading "## Fusion behavior" → "## dbt v2 behavior"). If a lowercase
start reads oddly, reword so the term isn't first — do not capitalize it.

## Editorial guardrail — swap terms, don't rewrite

Change ONLY the product term plus the minimal grammar to keep the sentence correct.
Do not add facts, restructure, or introduce new sentences. Meaning-changing edits
(new "Rust engine" prose, monorepo/adapter architecture claims, migration narratives)
go in a SEPARATE content PR — flag them, don't apply them.

## Structural — don't rename anchors

Changing heading TEXT changes its auto-generated anchor and can break links. That's
structural (a separate PR). When you must change heading text, preserve the original
anchor with an explicit `{#original-anchor}`.

## Hard don'ts

- Never edit a `never-touch.yml` identifier (incl. compound ids like `dbt-fusion#123`,
  `x-dbt-fusion-*`, `fusion-stable`).
- Never edit inside fenced code, inline backticks, URLs, or frontmatter `id`/`slug`.
- `confusion` / `DataFusion` are false positives — never touch.
- Use `Edit`, never `Write`.
