---
title: "Do coding agents still need dbt skills? We ran 17 agents through an F1 project to find out"
description: "We had Claude Opus, Sonnet, and Haiku build and maintain a Formula 1 dbt project from scratch, with and without dbt agent skills. Skills didn't decide correctness. Process did."
slug: dbt-skills-eval

authors: [alex_noonan]

tags: [ai]
hide_table_of_contents: false

date: 2026-10-21
is_featured: false
---

When we shipped [dbt agent skills](/blog/dbt-agent-skills), the bet was simple: coding agents know SQL, but they don't know dbt well enough to build a project the way an analytics engineer would. Skills would fill that gap with the conventions, commands, and patterns the model was missing.

Models have improved a lot since then, so we wanted to check whether that bet still holds. Can the latest models build and maintain a real dbt project at a meaningful level of complexity *without* skills, and if so, where do skills still earn their place?

We built an eval to find out. It ran 17 agents through up to 12 tickets each on a Formula 1 dbt project in Snowflake. The short version: **skills didn't decide whether the work was correct.** Every model built correct projects without them. What separated good runs from bad ones was process: tests that froze today's answers, a backup restored without checking it, a definition skimmed instead of read. That points to a different job for skills than the one we originally gave them.

<!-- truncate -->

## The eval environment

We wanted something closer to a real analytics engineering job than a single prompt: a project that starts empty, grows over a sequence of tickets, and keeps getting hit with the things that break real projects. Late data, vendor changes, bad rows, and stakeholders with vague questions.

### The data

We used the [Formula 1 World Championship dataset](https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020) from Kaggle: 14 relational tables covering every race from 1950 to 2024, about 700,000 rows in total, including 589,000 lap times. We loaded everything into Snowflake as text, exactly as it appeared in the CSVs, so cleaning and typing were part of the work.

F1 data is full of traps that don't look like traps:

- Nulls are the literal string `\N`, and in places an empty string.
- Lap times are stored as text like `1:27.452`.
- Before 1991, only a driver's best results counted toward the championship, so summing race points gets seasons wrong. In 1988, Alain Prost scored more points than Ayrton Senna, but Senna won the title.
- In the 1950s, drivers sometimes shared a car and split the points.
- Sprint result IDs collide with Grand Prix result IDs.
- Red-flag stoppages show up as 20-minute "pit stops."

We never mentioned any of these in the prompts. The agents had to find them.

### The arms

We tested three Claude models, Opus 5.5, Sonnet 5.5, and Haiku 5.5, each in three arms:

| Arm | Setup |
|---|---|
| **No skills** | A clean Claude Code session with web search and fetch turned off, so the agent works from what it knows and what it can learn from the data |
| **Skills available** | Same session, plus the dbt agent skills installed as project skills |
| **Skills forced** | Same as available, plus a one-line `CLAUDE.md` telling the agent to review and use the relevant skills before each task |

Every agent got the same tickets, word for word, and worked in its own Snowflake schemas. Agents ran in Claude Code's Auto permission mode. When an agent asked a question, it got the same canned reply every time ("Use your best judgment; I'm not available to answer questions."), and we logged that as an intervention.

### The grading loop

Correctness was graded by the harness, not by the agent's own tests. After each ticket, the harness did three things:

1. **Injected new data.** It added held-back races, reissued corrected lap times, changed driver numbers, broke the vendor schema, or planted duplicate rows, depending on the ticket.
2. **Rebuilt the project.** It ran `dbt build` itself, never with `--full-refresh`, so incremental logic had to actually work.
3. **Graded every required model against an answer key.** It compared each model row by row with the answer key, which was computed from a separate clean copy of the data that received the legitimate changes but none of the breakage.

<Lightbox src="/img/blog/2026-10-21-dbt-skills-eval/eval-loop.png" width="90%" title="The eval loop: each ticket is followed by data injection, an independent rebuild without full refresh, and grading against answer keys. Later tickets re-check every earlier model, so regressions show up." />

Every grade was cumulative. A mistake in ticket 1 kept costing points in every later ticket until the agent fixed it, which is how a real project works too.

We validated the answer keys against known history before running any agents: Hamilton and Schumacher's seven titles each, Senna's 1988 title on best-11 scoring, and Verstappen's 19 wins in 2023. On top of the data checks, a fresh Opus session gave each finished project a **blind code review**. It saw an anonymized copy with the skills, `CLAUDE.md`, and git history stripped out, and scored it on a 1–5 rubric covering layering, testing, data quirks, incremental design, documentation, and public-interface readiness.

We tracked results live in a [dbt Charts](/guides/dbt-charts) dashboard built from the grade files. We kept the grades local, out of the warehouse, so no agent could find its own score.

## Round 1: everyone aced it

The first suite had seven tickets: build four marts from scratch, add an incremental lap-times model that handles reissued corrections, snapshot driver history, fold sprints into session results and refactor standings, recover from vendor drift, debug a doubled Ferrari total, and ship contracts and a versioned model.

Every Opus and Sonnet run, with or without skills, passed all 43 answer-key checks. Haiku without skills did too. The only run that lost points was Haiku with skills forced, and it lost them on a definition, not on dbt: it counted "career starts" as races started instead of the specified "Grands Prix entered", and never revisited it.

Two other things stood out:

- **The skills mostly went unread.** In the "skills available" arm, agents opened between zero and three skill files across all seven tickets. The models simply didn't think they needed them.
- **Round 1 was at the ceiling.** When nearly every run scores 100%, an eval can't tell you anything about the difference between arms.

## Why we built round 2

A ceiling means the test is too easy, so we built a harder suite. The goal wasn't just "more models." It was the kinds of work that separate a senior analytics engineer from a SQL writer.

Round 2 has 12 tickets. It starts with a deeper version of every Round 1 ticket (seven required marts instead of four, including teammate head-to-heads and green-flag race pace, plus tyre stints, late-arriving drivers, and what-if championship scoring with full countback tie-breaks). Then it adds work that tests engineering judgment more than dbt syntax:

| Ticket | What it tests |
|---|---|
| **Second vendor feed** | A cross-check feed with its own IDs, `SURNAME Forename` names without accents, a nickname, and sessions named by circuit, so the two 2020 races at Spielberg can only be told apart by date. The agent builds crosswalks and a discrepancy mart, graded exactly against 11 planted conflicts. |
| **Telemetry at scale** | 20 million rows of car telemetry, where samples can arrive weeks late. Routine runs must not rescan the raw table. Graded on correctness after late data lands, plus bytes scanned. |
| **Slim CI** | Prod and CI targets, saved prod artifacts, and a CI script that builds only what changed and defers the rest to prod. Graded by editing a model and checking that the script built exactly the right models. |
| **Vague leadership asks** | "Which drivers actually overperform their car? I want a list I can trust." and "Are pit stops really getting faster, or is that a myth?" Graded by the blind reviewer only. |

Round 2 also hid harder traps. The vendor drift ticket switched dates to `DD/MM/YYYY`, which some parsers read with day and month swapped. The data-bug ticket only mentioned Ferrari, but the harness also resent a race's standings rows. We added the **skills forced** arm at this point because Round 1 showed that skills that go unread can't help.

## Results

### Correctness: skills didn't move it

<Lightbox src="/img/blog/2026-10-21-dbt-skills-eval/correctness-by-arm.png" width="95%" title="Share of answer-key checks passed across every ticket, by model and skills arm. Round 1 had 43 checks per run; Round 2 had 154." />

Across both rounds, 11 of 17 runs passed every check on every ticket. Of the six that didn't, **five had skills available or forced.** No pattern links skills to correctness in either direction. The lowest score in the whole experiment, Sonnet with skills available at 61%, came from a single bad decision. While fixing the Ferrari bug, the agent restored its tables from a backup it had taken earlier. That backup predated the lap-time corrections from ticket 2, so the restore silently reverted 215 laps and the damage cascaded into four downstream models.

The harder engineering tickets were solved almost everywhere:

- **Slim CI:** all 9 Round 2 runs built exactly the edited model, its downstream models, and any new models, deferring the rest to prod.
- **Vendor feed:** all 9 matched every one of 41 drivers and 167 sessions automatically, including the Spielberg double-header.
- **Hidden bug:** all 9 found the resent standings rows nobody had asked about and added uniqueness tests upstream.
- **Telemetry:** 8 of 9 keyed their incremental models on load time and landed the late samples correctly.

### Code quality: a small lift that fades with model strength

<Lightbox src="/img/blog/2026-10-21-dbt-skills-eval/review-score-by-arm.png" width="95%" title="Blind code-review score, 1 to 5, by model and skills arm. Reviewing the same project twice gave 4.00 and 4.22, so gaps under about 0.2 are noise." />

In Round 1, skills did nudge code quality. Every skills arm scored above its model's no-skills run, by about 0.1 for Opus and 0.1–0.5 for Sonnet and Haiku. The most common reviewer complaint was layering, such as intermediate models reading from marts, and it showed up most in smaller models without skills.

In Round 2, that lift mostly disappeared. Every model produced projects scoring 3.9–4.7, the arms overlap, and the differences are within the reviewer's own noise. We measured that noise by reviewing the same project twice, which gave 4.00 and 4.22. Model size mattered more than skills: in Round 1, Opus projects scored 4.5–4.6 while Sonnet and Haiku scored 3.5–4.0.

### Usage: agents reach for skills only when the ground is unfamiliar

<Lightbox src="/img/blog/2026-10-21-dbt-skills-eval/skill-usage.png" width="95%" title="Skill files opened across each whole suite, for runs that had skills. Without an instruction to use them, agents opened between zero and four." />

When the skills were simply available, agents opened between zero and four skill files across an entire suite. Where they did reach for one, the pattern is telling: the Semantic Layer skill and the dbt Mesh skill (for contracts and versioning). Those are the corners of dbt where the model is least sure of current syntax. For staging models, incrementals, snapshots, and tests, the models already knew what to do.

Forcing skills changed usage but not outcomes. Haiku with skills forced used about 1.6× the output tokens and 1.5× the dbt calls of Haiku without skills in Round 1, and it was the run that lost points.

## What actually went wrong

When we sorted every failure by cause, we found none that came from the agent not knowing dbt.

<Lightbox src="/img/blog/2026-10-21-dbt-skills-eval/defects-by-arm.png" width="95%" title="Every defect across the 17 runs, by cause and skills arm. The most common, hard-coded tests that broke on new data, split evenly three ways." />

- **Tests that froze today's answers.** Nine runs, three in each arm, wrote a test that hard-coded expected values: a list of world champions ending in 2023, or fixed career totals. When the harness delivered the final 2024 race, those tests failed the build even though the data was correct. It's an easy mistake to make, and a test that breaks on correct data is a test people learn to ignore.
- **Skimming the spec.** Three runs missed a detail the ticket stated plainly, such as "Grands Prix entered" rather than starts, or a placeholder row for a late-arriving driver.
- **Trusting a restore.** One run restored a backup without checking it against current data.
- **Guardrails that cost more than they saved.** Two runs added vendor-drift checks that queried `information_schema` on every build and made builds about 10× slower. Nothing told them the checks were expensive until they measured.

The models also ran into things only a team process could have settled. Three agents were blocked from running `dbt build --target prod` by Claude Code's safety check, which treats a production deploy as something only a person should approve. One of them also refused an approval relayed from another session, because it hadn't come from the person in charge. That's exactly the right instinct, and it's also a workflow question: who's allowed to approve a prod build, and how?

## The takeaway: write skills for your process, not for the framework

This result changes how we think about skills. The frontier models already carry most of what a dbt skill can teach about dbt itself: layering, incremental strategies, snapshots, tests, deferral. The knowledge gaps that remain are narrow, recent, or niche, like the newest Semantic Layer syntax, and that's exactly where agents reached for skills on their own.

What the models didn't have was *your team's* judgment. Every failure above maps to a rule an experienced team would write down once and expect everyone to follow:

- "Tests assert invariants, not today's values. Never hard-code expected totals or lists that change when new data lands."
- "Before trusting a restore or backfill, diff it against the current source."
- "Re-read the ticket's definitions before you build, and quote them in the model's docs."
- "Measure build time before and after adding a check. Anything that adds more than X seconds needs a reason."
- "Prod builds go through the deploy job, approved by the on-call engineer."

Those are processes, conventions, and workflows, and they're specific to how a team works. A model can't infer them from SQL, and no general-purpose dbt skill can know them. That's where we think skills earn their place now: as the way a team encodes its playbook, review checklists, and definitions of done, so every agent follows the same process a senior teammate would.

Framework knowledge isn't worthless. For new or fast-moving features, a well-written skill still beats a guess. But if you're deciding where to invest, a skill that captures how your team tests, deploys, and reviews will do more for your agents than one that explains how dbt works.

## Caveats

- **One run per cell.** Each combination of model, arm, and round ran once, so individual gaps are hints. The patterns across 17 runs are what hold up.
- **Some runs shared notes.** The app gave our sessions a shared notes folder, and agents used it to trade data findings. Eight runs read another run's notes, mostly during Round 2's first ticket, before we noticed and locked the folder.
- **Grader fixes.** We found and fixed three bugs in our own grader mid-run (an ambiguous podium definition, a cost query that missed queries through staging views, and a CI check that read a file some scripts overwrite) and regraded the affected tickets. No agent ever saw a grade.
- **Semantic Layer queries weren't run.** Running `dbt sl` needs a dbt platform connection, so that ticket was graded on the metric definitions only.

## Try it yourself

The harness, ticket prompts, answer keys, grades, and the final state of all 17 agent projects are on GitHub at [C00ldudeNoonan/f1-dbt-skills-eval](https://github.com/C00ldudeNoonan/f1-dbt-skills-eval). Bring your own Snowflake schema and Kaggle download, and run your own models, your own skills, or your own team's process skills against the same 12 tickets.
