---
title: "Introducing dbt agent skills"
description: "dbt agent skills make it easy for LLMs and coding agents to do useful work on dbt projects by embedding expert knowledge about analytics engineering workflows, data testing, and the Semantic Layer - turning generalist agents into data specialists."
slug: dbt-agent-skills

authors: [joel_labes, jason_ganz]

tags: [analytics craft]
hide_table_of_contents: false

date: 2026-02-03
is_featured: true
---

## Introduction

Perhaps *the* driving factor behind the rise of dbt and analytics engineering has been the creation and curation of best practices for building trustworthy data systems.

Today we're releasing our first batch of [dbt agent skills](https://github.com/dbt-labs/dbt-agent-skills) making it easy for LLMs and software agents like Claude Code, OpenAI Codex, Cursor or Factory to do useful work on top of dbt projects.

These skills encapsulate a broad swath of hard won knowledge from the dbt Community and the dbt Labs Developer Experience team. Collectively, they represent dozens of hours of focused work by dbt experts based off of years of building expertise in using dbt.

Our early experiments show real promise for using these skills to **transform generalist coding agents into agents who demonstrate mastery in using data systems**. We believe they are very useful today and will become more useful over the coming weeks and months, as the ecosystem around skills matures, and as we integrate feedback from the community.

<!-- truncate -->

### What's included:

The [agent skills repo](https://github.com/dbt-labs/dbt-agent-skills) contains skills for:

- **Analytics engineering**: Build and modify dbt models, write tests, explore data sources
- **Semantic layer**: Create metrics, dimensions, and semantic models with MetricFlow
- **Platform operations**: Troubleshoot job failures, configure the dbt MCP server
- **Migration**: Move projects from dbt Core to the Fusion engine

You'll notice these skills vary in size of task and complexity. The primary "using dbt for analytics engineering skill" contains information about the entire workflow loop for analytics engineering. Other skills are more focused and task dependent.

We plan to continue refining these and adding more skills over time. If there's a skill that would be useful that you don't see - please open an issue on the repo.

## Quickstart

### Add these tools to your agent

In Claude Code, run these commands:

```bash
/plugin marketplace add dbt-labs/dbt-agent-skills
/plugin install dbt@dbt-agent-marketplace
```

For other agents, use this command ([requires Node to be installed](https://nodejs.org/en/download)):

```bash
npx skills add dbt-labs/dbt-agent-skills --global
```

### Try it yourself

After installing the skills, boot up the coding agent of your choice and try giving an instruction like:

- Plan and build models for my new Hubspot source tables
- Work out why my `dbt build` just failed
- Write unit tests based on the requirements in this GitHub issue, then create a new model that passes
- Update `dim_customers` to become a semantic model
- Is there a difference in bounce rate for free vs paid email domains?

We focused on tasks that are either common (daily model building, debugging) or complex (semantic layer setup, unit testing edge cases). Each skill contains high-signal knowledge, and has been validated in real world testing and against the analytics and data engineering benchmark ADE-bench.

If you just want to get started today, you can stop reading now. But there's a whole lot to say about what skills are, why they're useful and how we expect them to plug into the dbt workflows of today and tomorrow.

:::note
Normal cautions around agentic coding apply. Please take appropriate safeguards, particularly when working with production or sensitive data.
:::

## So what is a skill, anyway?

[Agent skills](https://agentskills.io/home) are an open standard originally released by Anthropic in October 2025 with this purpose:

> Agents are increasingly capable, but often don't have the context they need to do real work reliably. Skills solve this by giving agents access to procedural knowledge and company-, team-, and user-specific context they can load on demand.

Some people have asked how skills differ from MCP servers and whether both are necessary. In short:

- MCP is how you provide access to tools (especially remote tools requiring authentication)
- Skills are how you provide context and knowledge around using those tools

As you'll see below, we've found dbt Agent skills and the dbt MCP server to be *complementary.* With Skills, an agent can choose which MCP tool to use more quickly and make better use of the results.

With that said, you do not have to use the MCP server to get value out of skills.

<Lightbox src="/img/blog/2026-02-03-dbt-agent-skills/skills-mcp-quadrant.png" width="85%" title="A quadrant showing how skills and MCP complement each other: with both, agents have access to systems and knowledge about workflows" />

The best way to think of skills is as a layered training manual. If you took a very smart generalist off the street, what would they need to be able to use and implement *your organization's workflows?*

Consider this example from Anthropic. Working with PDF files doesn't require a MCP server because the editing library can be installed locally, you that library to be used in a consistent way instead of the LLM inventing something from first principles every time.

<Lightbox src="/img/blog/2026-02-03-dbt-agent-skills/anthropic-skills-architecture.png" width="85%" title="Anthropic's diagram showing how agent skills use progressive disclosure with YAML frontmatter, markdown content, and reference files" />

Source: [https://claude.com/blog/equipping-agents-for-the-real-world-with-agent-skills](https://claude.com/blog/equipping-agents-for-the-real-world-with-agent-skills)

## Why skills matter

### Skills allow you to embed complex process knowledge that is non-obvious to agents

Any experienced dbt practitioner will have a number of intuitions when working with a dbt project:

- When working on a new dataset, you want to poke around a bit and get a sense of the schema and underlying data before doing anything else
- When building a new model, you need to review the details of input models to know how to use them
- When building a new model, you also need to review the results as well as summary/aggregate statistics and see if it matches the expected shape and output

Coding agents are extremely capable. If you ask a coding agent to build you a new model, refactor your DAG or add a new source to your project, it will produce code that looks very good and is often correct.

But it's sometimes very wrong, and not because the agent isn't smart enough - it's because by default they will not follow the workflows described above. In particular, these agents have been highly tuned for software engineering workflows, but much less so for data and analytics engineering ones.

Skills allow you to include the broad best practices like the ones above, but they can also provide very in-depth and nuanced guidance through supplemental reference materials, such as:

- Warehouse-specific configurations, like avoiding full table scans on BigQuery when discovering data
- Variations based on the specific dbt version or engine you're using; `dbt compile` can detect many SQL errors when invoked from the dbt Fusion engine, but dbt Core needs to run `dbt build` for the same result.

Skills can also evolve at a faster pace than frontier AI model releases, making it easier to fix misconceptions and adapt to changes in the dbt authoring layer. We recently revamped the authoring experience for semantic models; including details on the new spec inside of a skill prevents legacy code from being written even though it is the predominant training data online.

### Skills protect against plausible but incorrect output

If you ask an LLM to add some tests to your model, it might add an `accepted values` test. dbt's documentation on `accepted_values` tests contains an example saying that the right values on an `order_status` column are `['placed', 'shipped', 'completed', 'returned']` , and we've seen some models replicate this or otherwise hallucinate potential column values.

With a skill, you can instruct the agent to **preview the data before writing tests** to ensure that the output matches the real data in your warehouse.

### Skills allow you to give opinionated guidance to agents

If you ask an agent to write a dbt project from scratch on top of a data source, there are a number of opinionated decisions that will need to be made.

- What types of data tests should I have on my models?
- When should I use the Semantic Layer vs. sql for natural language questions?
- How should the project be structured (stg/int/mart? Medallion? Data vault?)

Our current skills are only semi-opinionated - they have opinions on how and where you should apply your data tests but not on whether you should use dbt's recommended project structure or style guide. In the future we anticipate that we will release first party opinionated guides on project and code structure and that there will be a thriving ecosystem of opinionated Community sourced skills on different dimensions of data work.

### Skills allow you to give non-public information to agents

This section is our pitch to you: in addition to adopting our skills, you should add some of your own.

Taking a smart generalist across all disciplines and turning them into a smart generalist with a specialization in dbt still isn't enough. They also need to become a specialist in the way your company does data.

Obviously we can't include those in our general best practices skills, but this is where the composability of skills comes in. You can add context about your company, your data, the specific ins and outs and nuances of interacting with your systems, and expect it to augment what we provide.

Examples of questions you might like to answer in your skills:

- Have any default macros been overridden in my organization's project?
- What is my organization's cross-project or cross-platform mesh strategy?
- What partitioning rules should be applied to new models for a given usage pattern?

## How we validated the dbt Agent Skills

It can be challenging to assess the performance of AI workflows. There are many different ways to do this and each all of them are imperfect, so we have settled onto a multilayered strategy for ensuring our agent skills are performant.

### Careful expert generation and curation of skills

While we *did* have some LLM assistance in generating some of the skills, these are very much not "oneshotted outputs". Each skill represents hours of crafting, reviewing and refining by world class dbt experts to ensure that our knowledge has been accurately encoded into the skills.

### Hands on testing of each skill in real life examples

Nothing beats hands on usage and so we've tested each skill to see how it performs in real life use cases. This has helped us tune the performance and identify non-obvious gaps in our instructions.

### Custom suite for A/B testing skills

We developed a [system for rapidly comparing different tool combinations](https://github.com/dbt-labs/dbt-agent-skills/tree/main/evals) (MCP + skills, skills alone, no tools) to understand how they changed an agent's output.

This library allows testing how variations of skills perform for a given scenario and reviewing in detail the skills and tools called by the agent. 

We provide context to Claude Code (e.g. a dbt project or some YAML files) and we ask it to solve a problem with different setups.
- with different variations of a skill
- with or without some MCP server connected
- suggesting or not to the agent to use specific skills

And we can then either manually compare the conversations (which skills were called, what output was produced), or ask Claude Code to rate the different runs automatically.

### Benchmarking against ADE-bench, the analytics engineering benchmark

We also re-ran ADE-bench, the analytics engineering benchmark to assess performance with and without skills. While not every skill has corresponding tasks in the benchmark (yet!), this provides helpful signal, particular on the primary analytics engineering skill.

It's not all good news though. Today, skill loading can be [a little hit-and-miss](https://scottspence.com/posts/claude-code-skills-dont-auto-activate). But it's early days and we don't think that's going to be a long term issue. We'd also love to see stronger and more reliable cross-skill referencing, such as [what's described here](https://github.com/agentskills/agentskills/issues/90).

When skills do work, their benefits are meaningful.

We found that in a wide variety of cases, skills notably increase performance. We were particularly thrilled when we asked the agent to make performance recommendations on one of the largest tables in our dbt project, both with and without the skill. While both results gave plausible recommendations, the recommendations with the skill were more tailored and relevant to our use case as determined by our internal data team.

<Lightbox src="/img/blog/2026-02-03-dbt-agent-skills/skills-validation-feedback.png" width="85%" title="Feedback from testing: the recommendations with skills were more tailored and relevant" />

## Conclusion / CTA

This is just the beginning for agent skills and dbt. It's going to take many people from across the Community trying them, testing them on real-world workflows, and building new skills to realize their full potential.

As with everything in AI, things are moving fast. we expect substantial iteration on agent skills themselves in the near future (think versioning and the ability to reference other skills).
We're also exploring ways to enable tighter integration between dbt and agent skills, as well as making it easier to manage custom skills for your specific dbt project and data.

Steps for staying involved:

- Install dbt Agent skills into your agent and give them a try
- Share what you're discovering in #topic-agentic-analytics
