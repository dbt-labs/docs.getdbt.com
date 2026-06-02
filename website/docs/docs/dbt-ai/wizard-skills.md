---
title: "dbt Wizard skills"
id: "wizard-skills"
description: "Create and use skills to give dbt Wizard reusable, project-specific instructions — in the dbt platform or the CLI."
sidebar_label: "Use skills"
tags: [AI, Wizard]
---

# <Constant name="wizard"/> skills <Lifecycle status="beta"/>

<IntroText>
Skills are reusable instructions that help <Constant name="wizard" /> follow your team's SQL conventions, naming rules, modeling patterns, and workflows without repeating them in every prompt.
</IntroText>

Skills work the same way in the [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) and the [<Constant name="wizard" /> CLI](/docs/dbt-ai/about-dbt-wizard-cli). They use the same file format and folder structure, but differ in how you create the files.

<Constant name="wizard" /> also includes built-in skills from [dbt Agent skills](https://github.com/dbt-labs/dbt-agent-skills), maintained by dbt Labs. These are always available, no setup needed.

When you initialize <Constant name="wizard" /> in a project, it can also detect existing Claude Code skills in the current directory.

For general project context (`AGENTS.md`, `CLAUDE.md`), refer to [Migrate to dbt Wizard](/docs/dbt-ai/wizard-migrate) — <Constant name="wizard" /> reads those instruction files out of the box.

## How skills work

At the start of every session, <Constant name="wizard"/> scans for repo-level skills in the `.agents/skills/` directory in your dbt project root:

```text
.agents/
  skills/
    your-skill-name/
      SKILL.md
```

The CLI also discovers user-global skills in `~/.agents/skills/`, and can auto-discover existing Claude Code skills under `.claude/skills/`.

```text
.claude/
  skills/
    your-skill-name/
      SKILL.md
```

Custom skills use the [Agent Skills](https://agentskills.io/specification) format, the same format used by [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) on GitHub. A skill file contains YAML frontmatter (`name`, `description`) and a Markdown body with instructions.

The following table summarizes where <Constant name="wizard" /> looks for skills and which location takes precedence when names clash, sorted by precedence (highest to lowest).

<SimpleTable>

| Location | Scope | Precedence |
| --- | --- | --- |
| `.agents/skills/NAME/SKILL.md` | Repo-level (project root) | Highest — overrides global and built-in |
| `~/.agents/skills/NAME/SKILL.md` | CLI-global (all your projects) | Below project, above built-in |
| `.claude/skills/NAME/SKILL.md` | Auto-discovered Claude Code skills | Below custom skills |
| Built-in [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) | Shipped with <Constant name="wizard" /> | Lowest |
| `~/.dbt/wizard/skills/` | CLI-global (legacy) | Backward-compatibility only |

</SimpleTable>

If a custom skill and a built-in skill share the same name, the custom skill takes precedence.

## Create a skill

<Tabs>
<TabItem value="platform" label="dbt platform" default>

In [Studio IDE](/docs/dbt-ai/wizard-ide), use the file explorer to create the skill directory and file:

1. Create a folder at `.agents/skills/SKILL_NAME/` in your project root.
2. Add a `SKILL.md` file inside it. A typical `SKILL.md` includes:
   - YAML frontmatter with at minimum `name` and `description`.
   - A Markdown body with sections for when to use the skill, workflow steps, and conventions.
   - Optional `references/` files for extra detail the agent can load when needed.
3. Optionally add supporting files under `.agents/skills/SKILL_NAME/references/` (for example, `references/naming-conventions.md`) that the agent can read when the skill is active.
4. Start a new <Constant name="wizard"/> chat — skills are discovered at session start, so mid-session changes won't be picked up until you start a new chat.

If a custom skill and a built-in skill use the same name, the custom skill takes precedence.

</TabItem>
<TabItem value="cli" label="CLI">

From your terminal, use the following commands to create a skill folder and file:

```bash
mkdir -p .agents/skills/my-team-style
touch .agents/skills/my-team-style/SKILL.md
```

Then write your skill file. Refer to [Skill file format](#skill-file-format) in the next section for more information. Start a new `wizard` session to apply the changes. Skills are discovered at session start and changes made mid-session won't be picked up until you restart.

</TabItem>
</Tabs>

## Skill file format

A skill file has two required parts: YAML frontmatter and a Markdown body.

- **Frontmatter**: Includes at minimum, `name` and `description`. The `description` is especially important: it's how <Constant name="wizard"/> decides when to apply the skill automatically.
- **Body**: Markdown sections explaining when to use the skill, what it does, and any conventions or constraints.
- **References** (optional): Supporting `.md` files in a `references/` subfolder for detail that would make `SKILL.md` too long.

### Example skill file

If you're new to skills, start with a small `SKILL.md` like the following example, then grow it over time:

```markdown
---
name: my-team-style
description: Apply Santi Corp's modeling conventions when editing or creating dbt models. Use when the user asks for refactors, new models, or YAML in this project.
---

# My team style

## When to use

Use this skill whenever you are changing SQL or YAML under `models/` and the user did not override these rules.

## Conventions

- Staging models use prefix `stg_` and live in `models/staging/`.
- Facts and dimensions use `fct_` and `dim_` prefixes respectively.
- Document new columns in the same PR as the model change.

## Optional detail

For edge cases, read `references/naming-conventions.md` in this skill folder before proposing renames.
```

For a full production-style example, refer to dbt's [`adding-dbt-unit-test` skill](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/adding-dbt-unit-test/SKILL.md).

## Folder layout

```text
.agents/
  skills/
    my-team-style/
      SKILL.md                      ← required
      references/                   ← optional: extra detail Wizard loads when needed
        naming-conventions.md
        sql-patterns.md
```

The `references/` subfolder is for supporting material that would make `SKILL.md` too long. <Constant name="wizard"/> reads reference files when the skill is active and the task is relevant.

## Use a skill

<Constant name="wizard"/> applies skills automatically when it detects a match between the skill's `description` and your task. You can also invoke a skill explicitly:

<Tabs>
<TabItem value="platform" label="dbt platform" default>

In the <Constant name="wizard"/> chat panel:

1. Prompt the agent and reference the skill by name — for example: `Use my-team-style to refactor this model and update related YAML`.
2. If needed, use `@` mentions to point to the skill file or supporting `.md` files directly.
3. Review and approve proposed changes as usual in the <Constant name="wizard"/> panel.

</TabItem>
<TabItem value="cli" label="CLI">

Reference the skill by name in your prompt:

```
Use my-team-style to refactor fct_orders.
```

Or point to the file directly with `@`:

```
@.agents/skills/my-team-style/SKILL.md — apply these conventions to the new model.
```

</TabItem>
</Tabs>

## Global skills (CLI only) {#global-skills-cli-only}

If you use the CLI, you can store skills in `~/.agents/skills/` to make them available across all your dbt projects. This is useful for personal conventions you want everywhere:

<File name='~/.agents/skills/'>

```text
personal-defaults/
SKILL.md
```

</File>

If a project skill and a global skill use the same name, the project skill takes precedence.

The CLI still reads `~/.dbt/wizard/skills/` for backward compatibility, but use `~/.agents/skills/` for new global skills.

## Built-in dbt skills

<Constant name="wizard"/> ships with skills from [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills), maintained by dbt Labs and the community. These capture analytics engineering knowledge for common workflows and are always available. The agent loads the relevant skill automatically when your prompt matches its use case.

The following skills are always available and refer to the [dbt Agent Skills repository](https://github.com/dbt-labs/dbt-agent-skills) for installation in other AI clients, contributing new skills, and the latest catalog.

<SimpleTable>

| Skill | What it does |
|-------|-------------|
| `using-dbt-for-analytics-engineering` | Build and modify dbt models, debug errors, explore data sources, write tests |
| `adding-dbt-unit-test` | Add unit tests for dbt models; practice test-driven development |
| `building-dbt-semantic-layer` | Create semantic models, metrics, and dimensions with MetricFlow |
| `answering-natural-language-questions-with-dbt` | Answer business questions by querying the semantic layer |
| `working-with-dbt-mesh` | Implement dbt Mesh governance and cross-project collaboration |
| `troubleshooting-dbt-job-errors` | Diagnose and resolve dbt platform job failures |
| `configuring-dbt-mcp-server` | Set up the dbt MCP server for Claude, Cursor, or VS Code |
| `fetching-dbt-docs` | Look up dbt documentation efficiently |
| `running-dbt-commands` | Run dbt CLI commands with correct flags, selectors, and parameter formats |
</SimpleTable>

### Migration (one-off use)

These skills are for migration projects rather than everyday sessions:

<SimpleTable>

| Skill | What it does |
|-------|-------------|
| `migrating-dbt-core-to-fusion` | Migrate dbt projects from dbt Core to the dbt Fusion engine |
| `migrating-dbt-project-across-platforms` | Migrate dbt projects across data platforms |
</SimpleTable>

Built-in skills are updated with each <Constant name="wizard"/> release. Custom skills with the same name take precedence.

## Tips

- **Keep `SKILL.md` focused.** One skill per concern (style guide, testing conventions, deployment workflow). Smaller skills are loaded more reliably than large monolithic ones.
- **Use `description` to control when <Constant name="wizard"/> activates the skill.** A precise description ("Use when creating or editing models in models/marts/") means the skill fires when relevant, not on every prompt.
- **Start a new session after adding or editing a skill.** Skills are discovered at session start — mid-session changes aren't picked up until you start a new chat.
- **Cross-project sharing isn't supported yet.** To reuse a skill in another repo, copy the skill files manually. CLI users can also use `~/.agents/skills/` for skills they want everywhere.

## Related docs

- [<Constant name="wizard"/> in Studio IDE](/docs/dbt-ai/wizard-ide)
- [How <Constant name="wizard"/> works](/docs/dbt-ai/wizard-how-it-works)
- [<Constant name="wizard"/> CLI overview](/docs/dbt-ai/about-dbt-wizard-cli)
