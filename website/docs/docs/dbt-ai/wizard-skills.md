---
title: "Use skills with dbt Wizard CLI"
id: "wizard-skills"
description: "Create and use skills to give dbt Wizard CLI reusable, project-specific instructions."
sidebar_label: "Use skills"
tags: [AI, Wizard]
---

# Use skills with <Constant name="wizard" /> CLI <Lifecycle status="beta"/>

<IntroText>
Skills are reusable instructions that help <Constant name="wizard" /> follow your team's SQL conventions, naming rules, modeling patterns, and workflows without repeating them in every prompt.
</IntroText>

<Constant name="wizard" /> also includes built-in skills from [dbt Agent skills](https://github.com/dbt-labs/dbt-agent-skills), maintained by dbt Labs. These are always available, no setup needed.

When you initialize <Constant name="wizard" /> in a project, it can also detect existing Claude Code skills in the current directory.

For general project context (`AGENTS.md`, `CLAUDE.md`), refer to [Migrate to dbt Wizard](/docs/dbt-ai/wizard-migrate) — <Constant name="wizard" /> reads those instruction files out of the box.

## Locations and precedence

At the start of every session, <Constant name="wizard"/> scans for project-level skills in `.agents/skills/` from your dbt project root down to your current working directory:

```text
.agents/
  skills/
    your-skill-name/
      SKILL.md
```

The CLI also discovers user-level skills in `~/.agents/skills/`, user-level Claude Code skills under `~/.claude/skills/`, and project-level Claude Code skills under `.claude/skills/`.

```text
.claude/
  skills/
    your-skill-name/
      SKILL.md
```

Custom skills use the [Agent Skills](https://agentskills.io/specification) format, the same format used by [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) on GitHub. A skill file contains YAML frontmatter (`name`, `description`) and a Markdown body with instructions.

The following table summarizes where <Constant name="wizard" /> looks for skills. Use the intended locations for new skills, and keep compatibility locations only when migrating existing setup. Within project-level locations, the current working directory wins over parent directories. Project-level skills win over user-level and built-in skills.

<SimpleTable>

| Location | Level | Use for new skills? | Precedence |
| --- | --- | --- | --- |
| `.agents/skills/NAME/SKILL.md` | Project | Yes. Use this for skills shared with a repo or subdirectory. | Highest project skill location; closer to the current working directory wins over parent directories. |
| `~/.agents/skills/NAME/SKILL.md` | User | Yes. Use this for skills you want across all local projects. | Below project skills, above compatibility imports and built-in skills. |
| `.claude/skills/NAME/SKILL.md` | Project | No. Compatibility import for existing Claude Code skills. | Below intended project and user skill locations. |
| `~/.claude/skills/NAME/SKILL.md` | User | No. Compatibility import for existing Claude Code skills. | Below intended project and user skill locations. |
| Built-in [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) | Built-in | No. Shipped with <Constant name="wizard" />. | Lowest. |

</SimpleTable>

Avoid duplicate skill names across locations. If you need to replace a built-in or imported skill, create the replacement in an intended project or user location and remove or rename the older copy.

## Create a skill

From your terminal, use the following commands to create a skill folder and file:

```bash
mkdir -p .agents/skills/my-team-style
touch .agents/skills/my-team-style/SKILL.md
```

Then write your skill file. Refer to [Skill file format](#skill-file-format) in the next section for more information. Start a new `wizard` session to apply the changes. Skills are discovered at session start and changes made mid-session won't be picked up until you restart.

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

Reference the skill by name in your prompt:

```
Use my-team-style to refactor fct_orders.
```

Or point to the file directly with `@`:

```
@.agents/skills/my-team-style/SKILL.md — apply these conventions to the new model.
```

## Global skills (CLI only) {#global-skills-cli-only}

If you use the CLI, you can store skills in `~/.agents/skills/` to make them available across all your dbt projects. This is useful for personal conventions you want everywhere:

<File name='~/.agents/skills/'>

```text
personal-defaults/
SKILL.md
```

</File>

If a project skill and a global skill use the same name, the project skill takes precedence.

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
- [Use skills in the <Constant name="dbt_platform" />](/docs/dbt-ai/wizard-platform-skills)
- [How <Constant name="wizard"/> works](/docs/dbt-ai/wizard-how-it-works)
- [<Constant name="wizard"/> CLI overview](/docs/dbt-ai/about-dbt-wizard-cli)
