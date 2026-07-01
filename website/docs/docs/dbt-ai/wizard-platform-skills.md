---
title: "Use skills with dbt Wizard in the dbt platform"
id: "wizard-platform-skills"
description: "Create and use skills to give dbt Wizard in the dbt platform reusable, project-specific instructions."
sidebar_label: "Use skills"
tags: [AI, Wizard]
pagination_prev: "docs/platform/wizard-home"
pagination_next: "docs/dbt-ai/wizard-platform-mcp"
---

# Use skills with <Constant name="wizard" /> in the <Constant name="dbt_platform" /> <Lifecycle status="beta"/>

<IntroText>
Skills are reusable instructions that help <Constant name="wizard" /> follow your team's SQL conventions, naming rules, modeling patterns, and workflows without repeating them in every prompt.
</IntroText>

<Constant name="wizard" /> also includes built-in skills from [dbt Agent skills](https://github.com/dbt-labs/dbt-agent-skills), maintained by dbt Labs. These are always available, no setup needed.

For general project context (`AGENTS.md`, `CLAUDE.md`), refer to [Migrate to dbt Wizard](/docs/dbt-ai/wizard-migrate) — <Constant name="wizard" /> reads those instruction files out of the box.

## How skills work

At the start of every session, <Constant name="wizard"/> scans for repo-level skills in the `.agents/skills/` directory in your dbt project root:

```text
.agents/
  skills/
    your-skill-name/
      SKILL.md
```

Custom skills use the [Agent Skills](https://agentskills.io/specification) format, the same format used by [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) on GitHub. A skill file contains YAML frontmatter (`name`, `description`) and a Markdown body with instructions.

If a custom skill and a built-in skill share the same name, the custom skill takes precedence.

## Create a skill

In [Studio IDE](/docs/dbt-ai/wizard-ide), use the file explorer to create the skill directory and file:

1. Create a folder at `.agents/skills/SKILL_NAME/` in your project root.
2. Add a `SKILL.md` file inside it. A typical `SKILL.md` includes:
   - YAML frontmatter with at minimum `name` and `description`.
   - A Markdown body with sections for when to use the skill, workflow steps, and conventions.
   - Optional `references/` files for extra detail the agent can load when needed.
3. Optionally add supporting files under `.agents/skills/SKILL_NAME/references/` (for example, `references/naming-conventions.md`) that the agent can read when the skill is active.
4. Start a new <Constant name="wizard"/> chat — skills are discovered at session start, so mid-session changes won't be picked up until you start a new chat.

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
```

For a full production-style example, refer to dbt's [`adding-dbt-unit-test` skill](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/adding-dbt-unit-test/SKILL.md).

## Use a skill

In the <Constant name="wizard"/> chat panel:

1. Prompt the agent and reference the skill by name — for example: `Use my-team-style to refactor this model and update related YAML`.
2. If needed, use `@` mentions to point to the skill file or supporting `.md` files directly.
3. Review and approve proposed changes as usual in the <Constant name="wizard"/> panel.

## Built-in dbt skills

<Constant name="wizard"/> ships with skills from [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills), maintained by dbt Labs and the community. These capture analytics engineering knowledge for common workflows and are always available. The agent loads the relevant skill automatically when your prompt matches its use case.

For the latest catalog, refer to the [dbt Agent Skills repository](https://github.com/dbt-labs/dbt-agent-skills).

## Tips

- **Keep `SKILL.md` focused.** One skill per concern (style guide, testing conventions, deployment workflow). Smaller skills are loaded more reliably than large monolithic ones.
- **Use `description` to control when <Constant name="wizard"/> activates the skill.** A precise description ("Use when creating or editing models in models/marts/") means the skill fires when relevant, not on every prompt.
- **Start a new session after adding or editing a skill.** Skills are discovered at session start — mid-session changes aren't picked up until you start a new chat.
- **Cross-project sharing isn't supported yet.** To reuse a skill in another repo, copy the skill files manually.

## Related docs

- [<Constant name="wizard"/> in Studio IDE](/docs/dbt-ai/wizard-ide)
- [Use skills locally](/docs/dbt-ai/wizard-skills)
- [How <Constant name="wizard"/> works](/docs/dbt-ai/wizard-how-it-works)
