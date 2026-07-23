---
title: "Migrate to dbt Wizard"
id: "wizard-migrate"
description: "Move project context and skills from Claude Code to dbt Wizard."
sidebar_label: "Migrate to dbt Wizard"
tags: [AI, Wizard]
---

<IntroText>
Move from Claude Code to <Constant name="wizard" /> while keeping your project conventions.
</IntroText>

<Constant name="wizard" /> automatically imports Claude Code instructions, skills, and settings from your repo. Use this page if you already use Claude Code on dbt projects and want to bring over project context, skills, or model settings. If you're new to AI agents, start with [Use dbt Wizard locally](/docs/dbt-ai/wizard-quickstart).

## Prerequisites

You'll need:

- [<Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli) installed or <Constant name="wizard" /> enabled in the [<Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [BYOK](/docs/dbt-ai/wizard-byok) configured for a supported CLI provider (OpenAI, Anthropic, AWS Bedrock, or Snowflake Cortex in preview)
- Any existing Claude Code files you want to migrate, such as `CLAUDE.md`, `.claude/CLAUDE.md`, or `.claude/skills/`

## Review project context and skills

<Constant name="wizard" /> automatically reads common agent instruction files and skills from your repo. You usually don't need to move existing project context before using <Constant name="wizard" />.

<SimpleTable>

| File or folder | What Wizard does | Migration needed? |
| --- | --- | --- |
| `AGENTS.override.md` at the project root | Checks this first for local override instructions. | No |
| `AGENTS.md` at the project root | Uses this as the primary project instruction file. | No |
| `CLAUDE.md` at the project root | Uses this as a built-in fallback when `AGENTS.md` is absent. | No |
| `.claude/CLAUDE.md` | Uses this as another fallback instruction file. | No |
| `.claude/skills/NAME/SKILL.md` | Auto-discovers these as skills. | No |
| Reusable prompts or new skills | Place them in `.agents/skills/NAME/SKILL.md` at the repo root. | Yes |

</SimpleTable>

<Constant name="wizard" /> also walks the directory tree from your project root to your current working directory, picks up instruction files at each level, and combines them for the session.

For the full skill format, refer to [Skills](/docs/dbt-ai/wizard-skills).

### Convert reusable prompts to skills

Use skills for reusable workflows or specialized instructions, not for general project context that already lives in `AGENTS.md` or `CLAUDE.md`. Each repo-level skill lives in `.agents/skills/SKILL_NAME/SKILL.md`.

```bash
mkdir -p .agents/skills/my-team-style
touch .agents/skills/my-team-style/SKILL.md
```

Then add frontmatter and instructions:

```markdown
---
name: my-team-style
description: Apply team-specific dbt modeling conventions when creating, editing, refactoring, testing, or documenting models in this project.
---

# Team style

(add your reusable instructions here)
```

Write a specific `description:` because <Constant name="wizard" /> uses it to decide when to load the skill.

## Configure model settings

Set provider credentials in [Configure BYOK](/docs/dbt-ai/wizard-byok).

To set a default model across sessions, add this to `~/.dbt/wizard/config.toml`:

```toml
model = "claude-sonnet-4-6"   # use a model ID from `wizard debug models`
```

You can also pick a model in the TUI with `/model` without editing config or the `--config` flag. Run `wizard --help` to see all available flags.

## Verify the migration

From your dbt project root, start a new session:

```bash
wizard
```

Ask <Constant name="wizard" /> to do something that should use your migrated skill, such as:

```text
create a new staging model for raw_invoices
```

And if your conventions aren't applied, check:

- General project context is in an instruction file such as `AGENTS.md` or `CLAUDE.md`
- Reusable skills are under `.agents/skills/` at the project root or `~/.agents/skills/` for CLI-global skills
- The skill has a clear `description:`
- You started a new session after adding the skill

## Related docs

- [Use dbt Wizard locally](/docs/dbt-ai/wizard-quickstart)
- [Skills](/docs/dbt-ai/wizard-skills)
- [Configure BYOK](/docs/dbt-ai/wizard-byok)
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
- [How to use dbt Wizard in your dbt project](/best-practices/how-to-use-wizard/wizard-1-intro) for recommended workflows
