---
title: "Have dbt skills been bitter lesson’d?"
description: "Models have improved a lot since we shipped dbt agent skills, so I ran Claude Opus, Sonnet, and Haiku 5.5, and then Sonnet 4.5, through a Formula 1 dbt project with and without them. The 5.5 models already knew dbt, run-to-run noise was bigger than any skills effect, and what separated good runs from bad ones was process."
slug: do-coding-agents-still-need-dbt-skills
image: /img/blog/2026-10-27-dbt-skills-eval/00_summary_results.png

authors: [alex_noonan]

tags: [ai]
hide_table_of_contents: false

date: 2026-10-27
is_featured: false
---

Do you remember what it was like trying to code with AI this time last year? The models could write SQL, but their judgment was poor. They skipped many of the signals of tradecraft that skilled analytics engineers have. Skills were the intuitive fix: give the agent the knowledge it needs for this task, without starting from zero every time or stuffing one AGENTS.md with everything that might come up. Skills arrived for Claude in October 2025 and became an open standard that December. We built our own set of [dbt agent skills](https://github.com/dbt-labs/dbt-agent-skills) to give coding agents the conventions, commands, and patterns they were missing.

Models have improved a lot since then, and one must always remember the [Bitter Lesson for AI](http://www.incompleteideas.net/IncIdeas/BitterLesson.html), where being too clever is a losing strategy compared to just pointing more computing resources at the problem. So I wanted to check whether that bet still holds. Can the latest models build and maintain a real dbt project at the scale of a real project without skills? And if they can, where do skills still earn their place?

I spent an afternoon or two building a [proof of concept eval](https://github.com/C00ldudeNoonan/f1-dbt-skills-eval) to find out: 22 agent runs, up to 12 tickets each, on a Formula 1 dbt project in Snowflake. I found that the difference between good runs and bad ones was process, not dbt knowledge. I wouldn't call that conclusive, but in an environment moving this fast it has changed how I think about skills.

<Lightbox src="/img/blog/2026-10-27-dbt-skills-eval/00_summary_results.png" width="100%" title="Round 2 checks passed by model and arm. Model generation moved the score; skills didn't" />

- **Run-to-run variance is bigger than any skills effect.** The same arm, Sonnet 5.5 with skills available, scored 61%, 100% and 67% on three runs.
- **The 5.5 models already know dbt.** 12 of 19 Claude 5.5 runs passed every check, and without skills every 5.5 model cleared at least 92%.
- **Agents only opened a skill when the ground was unfamiliar,** like the Semantic Layer or dbt Mesh.
- **A model generation is worth more than a skill.** Sonnet 4.5 scored 38% without skills and 17% with them forced, the two lowest scores of any run, and the forced run had read the skills before it wrote its first model. (The Bitter Lesson.)
- **Process failures dominated:** a test that froze today's answers, failed backup attempts, ignoring definitions, miscalibrated lookback windows.

If you maintain skills for a team: cut the docs that explain how dbt works, keep the ones covering features that aren't fully integrated into your stack, and write new ones for how your team tests, deploys, and reviews. Going forward, teams that understand their process and how to support and improve it will be in a much stronger position to leverage frontier models.

<!-- truncate -->

## The eval environment

I wanted something closer to a real analytics engineering job than a set of tasks the agent can one-shot. A project that starts empty, grows over a sequence of tickets, and gets hit with the things that break real projects. Late data, vendor changes, bad rows, and stakeholders with vague questions.

### The data

I used the [Formula 1 World Championship dataset](https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020) from Kaggle, which is a copy of the old Ergast F1 database (hence the stg_ergast model names later on): 14 relational tables covering every race from 1950 to 2024, about 700,000 rows in total, including 589,000 lap times. I loaded everything into Snowflake as text, exactly as it appeared in the CSVs, so cleaning and typing were part of the work. The agents built against dbt v2, the Fusion engine.

F1 data is full of traps that don't look like traps:

- Nulls are the literal string `\N`, and in places an empty string.
- Lap times are stored as text like `1:27.452`.
- Before 1991, only a driver's best results counted toward the championship, so summing race points gets seasons wrong. In 1988, Alain Prost scored more points than Ayrton Senna, but Senna won the title.
- In the 1950s, drivers sometimes shared a car and split the points.
- Sprint result IDs collide with Grand Prix result IDs.
- Red-flag stoppages show up as 20-minute "pit stops."

I never mentioned any of these in the prompts. The agents had to find them.

### The arms

Three Claude models, Opus 5.5, Sonnet 5.5, and Haiku 5.5 (Opus, Sonnet, and Haiku below), each in three arms:

| Arm | Setup |
| --- | --- |
| No skills | A clean Claude Code session, web search and fetch off |
| Skills available | The same, plus the dbt agent skills installed as project skills |
| Skills forced | The same, plus a one-line `CLAUDE.md` telling the agent to use the relevant skills before each task |

Same tickets word for word, own Snowflake schemas, Claude Code's Auto permission mode, and a canned "use your best judgment" reply to any question. After the first 17 runs I added five more: the Sonnet 5.5 skills-available arm twice more, and Sonnet 4.5 (September 2025) in all three arms.

### The grading loop

After each ticket the harness injected new data (late races, corrected lap times, vendor drift, duplicate rows), rebuilt the project itself without `--full-refresh`, and graded every required model row by row against an answer key built from a clean copy. The agent never saw a score. Grades were cumulative, so a mistake in ticket 1 kept costing points until it was fixed, and each run was one continuous session, so a skill read on ticket 1 could still shape ticket 9.

<Lightbox src="/img/blog/2026-10-27-dbt-skills-eval/01_grading_loop.png" width="100%" title="The per-ticket loop: the harness injects data, rebuilds and grades after every ticket" />

At the end, a fresh Opus session gave each project a blind code review on a 1–5 rubric, with the skills, `CLAUDE.md`, and git history stripped out.

## Round 1: everyone aced it

The first suite had seven tickets: build four marts, add an incremental lap-times model that handles reissued corrections, snapshot driver history, fold sprints into the results and refactor standings, recover from vendor drift, debug a doubled Ferrari total, and ship contracts and a versioned model. Every run but one passed all 43 answer-key checks, with or without skills, and the one miss (Haiku with skills forced) was a misread definition, not a dbt mistake. Agents with skills available opened between zero and three skill files in seven tickets. Round 1 wasn't hard enough: building a good eval is difficult, and it needs to be a lot more complex and specific than discrete tasks.

## Round 2: a harder suite

For round 2 I wanted to increase the scale and complexity and feature usage of dbt, to more closely mimic the analytics engineer workflow and also find the point to where I could get some significant results.

Round 2 has 12 tickets. It starts with a deeper version of every Round 1 ticket: seven required marts instead of four, plus tyre stints, late-arriving drivers, and what-if championship scoring with full countback tie-breaks. Then it adds work that tests engineering judgment more than dbt syntax:

| Ticket | What it tests |
| --- | --- |
| Second vendor feed | A cross-check feed with its own IDs, `SURNAME Forename` names without accents, a nickname, and sessions named by circuit, so the two 2020 races at Spielberg can only be told apart by date. The agent builds crosswalks and a discrepancy mart, graded exactly against 11 planted conflicts. |
| Telemetry at scale | 20 million rows of car telemetry, where samples can arrive weeks late. Routine runs must not rescan the raw table. Graded on correctness after late data lands, plus bytes scanned. |
| Slim CI | Prod and CI targets, saved prod artifacts, and a CI script that builds only what changed and defers the rest to prod. Graded by editing a model and checking that the script built exactly the right models. |
| Vague leadership asks | "Which drivers actually overperform their car? I want a list I can trust." and "Are pit stops really getting faster, or is that a myth?" Graded by the blind reviewer only. |

Round 2 also hid harder traps. The vendor drift ticket switched dates to `DD/MM/YYYY`, which some parsers read with day and month swapped. The data-bug ticket only mentioned Ferrari, but the harness also resent a race's standings rows. And Round 2 ran Opus with skills forced, an arm Round 1 had skipped, so every model ran in all three arms.

### Round 1 vs Round 2 at a glance

|  | Round 1 | Round 2 |
| --- | --- | --- |
| Tickets | 7 | 12 |
| Runs | 8 | 9, plus 5 reruns |
| Required marts in the greenfield ticket | 4 | 7 |
| Answer-key checks per run | 43 | 154 |
| Raw inputs | 14 Ergast tables, about 700,000 rows | The same, plus a 3-table vendor feed and 20 million telemetry rows |
| Models in the Opus no-skills project | 20 | 50 |
| Beyond the marts | Incremental lap times, driver snapshot, sprints, vendor drift, a planted Ferrari bug, contracts and a versioned model | All of that, plus stints, late-arriving drivers, countback scoring, Semantic Layer metrics, a vendor cross-check, telemetry at scale, slim CI and two vague asks |

<Lightbox src="/img/blog/2026-10-27-dbt-skills-eval/02_project_architecture.png" width="100%" title="dbt project layers: grey in both rounds, orange added in Round 2" />

The grey boxes are the whole Round 1 project. Round 2 asked for all of it again and added the orange, so a mistake in a grey box kept costing points through 12 tickets instead of 7.

## Results

### Correctness: variance moved more than skills did

Across both rounds, 12 of the 19 Claude 5.5 runs passed every check on every ticket, and without skills every 5.5 model cleared at least 92%. Six of the seven misses were in a skills arm, but I wouldn't read much into that. The forced-arm misses came from busywork and misread definitions, not from anything a skill said about dbt, and the repeats below show how far a single run can swing. What the data doesn't support is the idea that skills made the work more correct.

<Lightbox src="/img/blog/2026-10-27-dbt-skills-eval/03_checks_passed.png" width="100%" title="Answer-key checks passed by model and arm" />

The lowest score in the whole experiment, Sonnet with skills available at 61%, came from a single bad decision that compounded. While fixing the Ferrari bug, the agent restored its tables from a backup it had taken earlier. That backup predated the lap-time corrections from ticket 2, so the restore silently reverted 215 laps, and the damage cascaded into four downstream models. So I ran that arm twice more. The repeats scored 100% and 67%. The 67% run never touched a backup; it got `is_podium` off by one on ticket 2 and missed a 215-row lap-time correction on ticket 6 because its lookback window was too short, and both carried through every later ticket. Same pattern, different mistake, and a wider spread inside one arm than between any two arms. With one run per arm you can't say whether skills help, only what that run did.

The harder engineering tickets were solved almost everywhere:

- **Slim CI:** all 9 Round 2 runs built exactly the edited model, its downstream models, and any new models, deferring the rest to prod.
- **Vendor feed:** all 9 matched every one of 41 drivers and 167 sessions automatically, including the Spielberg double-header.
- **Hidden bug:** all 9 found the resent standings rows nobody had asked about and added uniqueness tests upstream.
- **Telemetry:** 8 of 9 keyed their incremental models on load time and landed the late samples correctly.

### What about an older model?

To see what a model generation is worth next to a skill, I ran Sonnet 4.5 (September 2025) on the same 12 tickets in all three arms. Without skills it scored 38%: its build was broken from ticket 7 to the end, it mapped the vendor drivers wrong, its lookback window missed the lap-time correction to an older race, and its telemetry model scanned 10× the raw table where the 5.5 runs scanned a fraction of it. With skills forced it scored 17%, the lowest of any run in either round. It read the skills two minutes before writing its first model, then wrote a filter that dropped every Grand Prix on a sprint weekend, and later added a source test that fails on a known duplicate row while telling me every test passed. Reading the skills didn't stop a judgment error. Lesson there.

### Code quality

In Round 1, skills did nudge code quality. Every skills arm scored above its model's no-skills run, by about 0.1 for Opus and 0.1–0.5 for Sonnet and Haiku. The most common reviewer complaint was layering, such as intermediate models reading from marts, and it showed up most in smaller models without skills.

In Round 2, every model produced projects scoring 3.9–4.7, the arms overlap, and the differences sit inside the reviewer's own noise. I measured that noise by reviewing the same project twice, which gave 4.00 and 4.22. Model size mattered more than skills: in Round 1, Opus projects scored 4.5–4.6 while Sonnet and Haiku scored 3.5–4.0. The three Sonnet 5.5 skills-available runs reviewed at 4.22, 4.44 and 4.33, so review scores were steadier than correctness, and Sonnet 4.5's 2.67 (no skills) and 2.22 (skills forced) are the lowest of any run. One caveat on all of these: the reviews weren't perfectly blind, because run IDs survived in schema names.

<Lightbox src="/img/blog/2026-10-27-dbt-skills-eval/04_review_scores.png" width="100%" title="Blind code-review score by model and arm" />

In Round 1 every orange point sits to the right of its grey one. In Round 2 the gaps shrink to about the width of the noise bar at the bottom, and model size explains more than the arm does.

### Skill usage

When the skills were available, agents opened between zero and five skill files across an entire suite, and Sonnet 4.5 with skills available opened none at all. Where they did reach for one, it was for a feature that is more specific to dbt: the Semantic Layer skill and the dbt Mesh skill (for contracts and versioning). Those are the corners of dbt where the model is least sure of current syntax. For staging models, incrementals, snapshots, and tests, the models already knew what to do.

<Lightbox src="/img/blog/2026-10-27-dbt-skills-eval/05_skill_files_opened.png" width="100%" title="Skill files opened per run, available vs forced" />

The lighter points are what agents did on their own. The darker ones are what a one-line `CLAUDE.md` made them do, and the extra reading didn't change the scores.

Forcing skills changed usage but not outcomes. Haiku with skills forced used about 1.6× the output tokens and 1.5× the dbt calls of Haiku without skills in Round 1. It was also the Round 1 run that lost points, but the transcript shows its definition mistake came four minutes before it opened its first skill file. Forcing skills didn't cause the miss; it just didn't prevent it. On Sonnet 4.5, forcing them produced the weakest run of the whole experiment.

## Failures

When I sorted every failure by cause, none were dbt knowledge related.

- **Tests that froze today's answers.** Nine runs, three in each arm, wrote a test that hard-coded expected values: a list of world champions ending in 2023, or fixed career totals. When the harness delivered the final 2024 race, those tests failed the build even though the data was correct. It's an easy mistake to make, and a test that breaks on correct data is a test people learn to ignore.
- **Skimming the spec.** Three runs missed a detail the ticket stated plainly, such as "Grands Prix entered" rather than starts, or a placeholder row for a late-arriving driver.
- **Trusting a restore, or a lookback.** One run restored a backup without checking it against current data. Another missed a 215-row correction to an older race because its incremental lookback only covered the last two races.
- **Expensive guardrails.** Fifteen of 17 projects added vendor-drift checks that query `information_schema`, which is reasonable. One of them (Haiku 5.5, skills available) ran the check on every build, and from ticket 5 on each build took about 13 minutes instead of 15 seconds, 40 to 57× slower. Another hit the same wall mid-ticket and switched to `DESCRIBE` before the harness ever saw it. The problem wasn't the check; it's that nothing made the agent measure what it cost. The same query in CI, or once a day, would have caught the drift.
- **Claiming tests passed when they didn't.** One Sonnet 4.5 run added a source test that fails on a known duplicate row, then told me every test passed. The harness build failed from that ticket to the end.
- **Dedups that hid problems.** `row_number()` dedups in staging that made duplicates disappear instead of surfacing them, plus exploration scripts left in the repo.
- **Stopping partway.** Four times in the reruns an agent stopped mid-ticket and needed a standard "please continue," once after sitting idle for 18 hours.
- **Working outside the workspace.** One Sonnet 4.5 run rewrote the global `~/.dbt/profiles.yml` twice, once by moving its project file over it. Grading wasn't affected and no permission mode caught it. That's the kind of rule a team writes down once: don't touch `~/.dbt`.

The models also ran into things only a team process could settle. Three agents were blocked from running `dbt build --target prod` by Claude Code's safety check, which treats a production deploy as something only a person should approve. One of them also refused an approval relayed from another session, because it hadn't come from the person in charge. That's the right behavior, and it's also a workflow question: who approves a prod build, and how? (The reruns muddied this check: Sonnet 4.5 can't run in Auto mode, and one Sonnet 5.5 repeat's prod build went through without an approval, so I don't count ticket 11 toward any arm.)

## Is dbt too easy?

Before treating this as a general result about skills, remember what the models were working with. dbt has been open source for a decade. Its docs are thorough and public, and so are years of community Slack and Discourse threads, Stack Overflow answers, courses, conference talks, and thousands of public dbt projects on GitHub. Much of this likely ended up in training data.

So dbt is close to a best case for "it's already in the weights," and this result is about dbt, not about frameworks in general. Tools with a smaller footprint don't get that coverage: a proprietary orchestrator, a vendor SDK that shipped last year, an in-house macro library. For those, a framework skill is still doing the job we originally built skills for.

## Write skills for what the model can't know

### Cut what's already in the weights or the docs

The frontier models already carry most of what a dbt skill can teach about dbt itself: layering, incremental strategies, snapshots, tests, deferral, the CLI. I watched 17 agents build staging layers, incremental models, snapshots, and slim CI pipelines without opening a skill file, and get them right. Anything a skill explains that the model already knows, or that's one search away in the dbt docs, is dead weight. You might even be hampering frontier models with vestigial documentation.

### Write skills for the four things the model can't infer

**1. Knowledge that isn't common, because it's new or because it's niche.** The Semantic Layer and dbt Mesh skills were the only ones agents reached for on their own. Neither is new: contracts and versioning date back to dbt 1.5 and 1.6. They're niche, so there's less public code for the model to have learned from, and the YAML is easy to get subtly wrong. The same goes for anything that shipped after the model's training data ends, which with dbt v2 is a lot. For those, a well-written skill still beats a guess.

**2. How your team works.** Who approves a prod build, and through which job. Which branch CI runs against. What "done" means for a ticket. Investing in process will set you up for success as more automation is added to your workflow.

**3. Org standards and consistent practices.** The conventions a senior teammate enforces in review: naming, layering rules, how metrics are defined and where those definitions live, what every model's docs must quote. Some of this belongs in deterministic checks, not prose. A layering rule or a naming convention is better enforced by dbt-project-evaluator than suggested by a skill; the skill should just say which checks have to pass.

**4. Testing and retesting your assumptions about the data.** Good analytics engineers are paranoid in specific, repeatable ways, and the agents weren't:

- Tests assert invariants, not today's values. Never hard-code expected totals or lists that change when new data lands.
- Before trusting a restore or backfill, diff it against the current source.
- Measure build time before and after adding a check. Anything that adds more than X seconds needs a reason.
- When a bug report names one table, look for the same pattern in its neighbors.
- Before you finish, check the diff touches only your workspace. One agent rewrote `~/.dbt/profiles.yml` and nothing stopped it.

### Where that leaves general-purpose skills

Framework knowledge isn't worthless, and the dbt agent skills will keep covering the parts of dbt where a guess isn't good enough. We aren't changing dbt-agent-skills on the back of this. One afternoon's eval doesn't tell us enough about how models, harnesses, and skills interact, and we want to understand that before pulling anything, so the existing skills stay supported. But if you're deciding where to invest, a skill that captures how your team tests, deploys, and reviews will do more for your agents than one that explains how dbt works. That's the part of context engineering that's actually yours to do: write down how your team works.
