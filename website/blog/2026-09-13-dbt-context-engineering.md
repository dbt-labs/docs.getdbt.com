---
title: "dbt_context_engineering: modeling the context your AI agents read"
description: "dbt-context-engineering is a new package, published by dbt, that helps you create AI ready data when you need it."
slug: dbt-context-engineering

authors: [stephen_thibeault]

tags: [ai, context engineering, data ecosystem]
hide_table_of_contents: false

date: 2026-09-13
is_featured: true
---

Every company is trying to put AI to work on its own data right now, and most are discovering the same thing: the model isn't the hard part. An agent's answer is only ever as good as the context behind it, and in most organizations that context was never modeled for a machine to read. 

As a community, we've traditionally been asked to build the analytical systems our teams need to understand measurable performance, and that work already serves AI: an agent can pull a governed, tested metric through the semantic layer today. But the reasons behind the numbers sit in call transcripts, support threads, and contracts that analytics tooling has never been able to reach. Shaping that data so AI can retrieve it, trust it, and cite it has a name: context engineering. It's a practice we believe the dbt community is unusually well positioned to lead.

That belief comes from the observation that context engineering isn't a new discipline you have to learn from scratch. It's analytics engineering, pointed at a new consumer. The habits that made your metrics trustworthy (version control, testing, documentation, lineage) are exactly what AI context is missing today. So we're releasing [dbt_context_engineering](https://github.com/dbt-labs/dbt-context-engineering), an open source package that brings the first set of context engineering patterns into the framework you already use. This post walks through what's in the package, what it unlocks, and why we want to work out the rest of the practice with the community.

<!-- truncate -->

## Why dbt, why now?

If you have built a metric or gold layer in your data platform, you already have many of the skills you need to perform context engineering. It comes down to pointing the same skills you use to shape, curate, and enrich data at a new target: the unstructured text an AI agent reads.

Let's think about the metrics layer and where it gets you today:

- Everyone agrees what a number means and how to define that number
- The data team models it out, tests it, and then deploys it so it's available to everyone
- When someone asks about the number (say, "the revenue last quarter"), they always arrive at the same answer as the next person who asks it. They both get one governed, reliable answer

<Lightbox
  src="/img/blog/2026-09-13-dbt-context-engineering/metrics-rollup-rows-to-dashboard.png"
  width="85%"
  alt="A diagram tracing rows of deal data through an aggregate step into a single Q2 win-rate metric on a dashboard"
/>

We can ask something like _why did revenue drop_, and the LLM will try to piece together an answer from whatever other sources it can access outside of the warehouse, but there's no governed layer serving that information to the agent. The context it needs is scattered across your organization: call transcripts, support threads, contracts, dispatch notes, and more.

This unstructured free-text data has been around a long time, but it hasn't been used much in day-to-day data work. That's because analytics tooling is built for deterministic outputs, which is exactly what makes metrics easy to govern. To understand whether a revenue drop comes from a systemic issue in the sales pipeline, a major bug, or a missing feature, an analytics team today might start with ticket completion rates, statuses, and categories. But those only get you so far. Actually deciding which specific reasons are contributing takes creative reasoning and often intensive qualitative analysis, and analytics functions like sum and count can't do that on their own. So analysts end up using dimensions like ticket status, labels, categories, or brittle regex to search through conversations.

AI in the data platform changes this. We now have not-exactly-deterministic-but-equally-valuable functionality at our fingertips that can reason about a conversation tied to a ticket (or a cluster of similar tickets) and help us pin down what's actually driving the number. That is context engineering, the practice of modeling the data that AI agents read.

<Lightbox
  src="/img/blog/2026-09-13-dbt-context-engineering/ai-agent-answers-beyond-the-metric.png"
  width="85%"
  alt="A diagram showing follow-up questions to a win-rate metric routed to an AI agent that reads the underlying tables and returns a cited answer"
/>

## What is a reliable answer, anyway?

If AI output isn't deterministic, meaning if it won't return the exact same string every time, how can it be reliable? Isn't reliability the whole point of a governed layer?

The answer is that reliability in this case isn't really about getting an identical string back. It's about getting the information you decided matters. Consider three different answers an agent might give to "why did revenue drop last quarter?":

1. "A spike in churn among enterprise accounts, driven by complaints about a billing bug."
2. "Enterprise customers left over billing problems."
3. "~12 enterprise accounts (roughly 60% of the quarter's revenue miss) churned, citing the March billing bug in their cancellation calls."

All three get the same message across. But whether they're _reliable_ depends entirely on what you needed. If the answer has to include the size of the impact and the specific cause so someone can act on it, only the third one clears the bar. If all you needed was to know that churn drove the drop, the first is perfectly reliable.

Ultimately, the definition of "reliable" belongs to the engineer building the context, not to the model, which is no different from how metrics have always worked. "Reliable revenue" already means something specific and deliberately chosen at your organization, like which subscriptions count, how refunds are handled, and when revenue is recognized. Every org, and often every team within an org, draws that line differently. Context engineering is the same discipline applied to new forms of data like unstructured text: deciding what a good answer must contain, and shaping the data so the agent surfaces it every time.

## Where joins, regex, and classic SQL run out of road

So why can't the tools already in your warehouse fully do this? The issue is that traditional SQL operates on characters, not meaning. Ask a data team to "find every account that raised a concern about a competitor" and the instinct is `LIKE '%competitor%'`, which is a good starter. It catches the literal mentions but misses the paraphrase, the sarcasm, and the sentence where the competitor is implied but never named. Ask standard SQL to connect a Slack thread to the account it's about, and a join has nothing to grab onto. The signal is there, and a human reading the text can likely see it no problem, but it's locked inside free text that joins and regex can't reach.

That ceiling is where context engineering begins. Instead of matching characters, you model the text as vectors, so an AI reader can retrieve it by meaning, with the label, the lineage, and the citation still attached.

Most of the raw capability for this already sits in your warehouse. Snowflake, Databricks, and BigQuery have all shipped AI functions for embedding, classification, extraction, and generation, right next to your data. What hasn't shipped is the discipline around them: how to call them consistently across engines, how to version the prompts they run on, how to keep a job from overspending, and how to test that an answer is grounded in its source text. Bringing that kind of discipline to raw capability is exactly what dbt was built for, and it's the gap this package closes. Everything in it is a normal dbt object, so there's nothing new to stand up.

It's a deliberate first release. We've proven one pattern end to end, the rest is earlier, and we'd rather put the work in the community's hands while the practice is still taking shape than keep polishing it in private. Analytics engineering became a shared craft because this community argued over working code until the patterns earned their place, and we want context engineering to start the same way.

## What you get in this package

Everything is a macro you call from a model:

- Chunking that packs text into token-sized pieces without cutting a sentence in half.
- AI calls for embedding, classification, extraction, and generation with controls so the inputs and outputs match on all three warehouses.
- Prompts and schemas kept in the repo, named and versioned.
- A spend ceiling and a run log on every AI call.
- Vector search that needs no index, plus a knowledge base that spans multiple sources.
- Grounding and accuracy tests that don't hit a warehouse or spend tokens.

## Try it in five minutes

Add the package to `packages.yml` and run `dbt deps`:

```yaml
packages:
  - package: dbt-labs/dbt-context-engineering
    version: 0.1.0
```

Chunking is plain SQL and costs nothing, so it's the easiest place to start. Think of the unstructured text you already have in your warehouse. Call transcripts, emails, Slack messages, summary fields, any of these could be pointed at for chunking.

```sql
{{ dbt_context_engineering.chunk(
  relation = ref('stg_gong__transcripts'), id_column = 'utterance_id',
  order_column = 'turn_index', text_column = 'utterance_text',
  partition_column = 'call_id', label_column = 'speaker'
) }}
```

Embed those chunks and search them and you've got a working corpus. The full version is in the worked example below.

## The first pattern: semantic search

The pattern we trust most, and the one we'd start a team on, is semantic search. Three models, run in a simple DAG:

<Lightbox
  src="/img/blog/2026-09-13-dbt-context-engineering/semantic-search-dag-chunk-embed-search.png"
  width="85%"
  alt="A three-step DAG: chunk raw text into token-bounded pieces, embed them into governed vectors, then search with ranked cosine retrieval"
/>

Chunk breaks long text into pieces that keep a citation to the rows they came from. Embed turns each piece into a vector. Search takes a query, ranks the text by similarity, and returns the closest passages with their citations attached. Three dbt models built with three macros.

What comes out is a corpus an agent can answer from and point back to a source: why deliveries slipped last quarter and who it hit, what a contract actually committed you to, what the runbook says about a given process.

## When "similar" isn't "relevant"

We love to tell you it just works, but that wouldn't be completely accurate. There’s more that’s needed to make this hit a sufficient level of accuracy that teams need. Through our own explorations, we identified limitations and worked towards additional engineering to pass our threshold.

To start, we ran semantic search against [jaffle-logistics](https://github.com/dbt-labs/jaffle-logistics), our demo corpus, which is one customer's history spread across eight systems, and asked "late deliveries and what is driving them." The top hit was six tokens long. Here's the top 10:

| rank | chunk | score | what it actually is |
| --- | --- | --- | --- |
| 1 | IR-9001::3 | 0.754 | a stray tail end: _"Reviewed with dispatch."_ |
| 2, 3, 5 | IR-70xx::2 | 0.57 to 0.66 | boilerplate remediation lines from unrelated incidents |
| 4, 6, 8 to 10 | TKT-2000xx | 0.55 to 0.58 | routine _"can you confirm the delivery window"_ notes |
| 7 | CT-99021::2 | 0.565 | the one useful chunk in the whole page |

The quarterly reviews that actually explain the root cause? Not on the first page at all. This is a common issue with vector search, because short, formulaic text sits near the middle of embedding space and reads as a little bit similar to almost anything you ask. The recall worked as expected. The relevance didn't.

What fixed it was a label. `classify()` tags each chunk with one category from a taxonomy you write, like account assessment, weather disruption, handling error, or routine status, and then you filter the search to the category the question is about before you rank. 

```sql
select
  chunk_id,
  {{ dbt_context_engineering.classify('chunk_text',
     dbt_context_engineering.prompt('signal_classify', 'v3'),
     dbt_context_engineering.schema_def('signal_classify', 'v3')) }} as classification
from {{ ref('stg_chunks') }}
```

When we ran this again with a proper filter, we got the relevant account context!

In this package, the prompt and taxonomy are versioned macros, so changing them is a pull request that can be tracked and reviewed, and the call is metered and logged like the others. We'd call classification an add-on to the pattern rather than a required fourth step, though as the demo shows, it's what turned recall into relevance once your text runs short and formulaic. The fastest way to see why you want it is to run without it.

## Testing the output

Metrics earned trust by being tested, and context has to clear the same bar. The common instinct of "ask a bigger model whether the answer looks right" doesn't clear it, because that's a paid opinion, not a reliable test. So the checks here are deterministic and free to run. We've added a few initial tests that check for proper source text citation and model accuracy, and we expect this set to grow quickly.

```yaml
columns:
  - name: evidence
    data_tests:
      - dbt_context_engineering.grounded:
          source_text_column: chunk_text
```

## The pillars we're building on

Our brand of context engineering rests on a handful of guiding principles. Each one starts from a practice the AI ecosystem already recognizes, and our opinion is about _how_ it should be done when the work lives in a governed warehouse. These are the pillars the package is built on, and the ones we invite the community to extend. A new capability belongs in the package if it advances one of them.

- **Chunking.** Text should be split into coherent, bounded units, never arbitrary character cuts.
- **Retrieval and RAG.** Units should be embedded and retrievable by meaning, as ordinary, inspectable models, not a black box bolted on the side.
- **Provenance and citations.** Every derived row should carry its source ids forward through the DAG, so every answer can cite exactly where it came from.
- **Structured outputs.** AI output should be contracted to a declared schema, so its shape stays consistent, joinable, and testable.
- **Prompts as code.** Prompts and output schemas should live in version control, diffable and explicitly versioned. No prompt should live only in a UI.
- **Cost governance.** No AI call should ship without cost monitoring and a guard that can stop a run before it overspends.
- **Groundedness and evaluation.** AI results should be testable like any other data asset: grounded in their source text, conformant to their schema, and scored against a golden set.

This is just an initial set, we expect this to grow as we continue to pioneer what it means for us to actively engineer context.

## What else is in there

The rest of the package covers capabilities we think context engineering needs. Some of these capabilities have been validated on all three major warehouse engines, others are still in beta:

- Generation and extraction, for the jobs a single label can't do, like summaries, rewrites, or pulling structured fields out of a document.
- Group-level reasoning over an entire transcript or an account's full ticket history at once.
- Managed vector indexes for when brute-force search stops scaling.
- A drift canary that re-checks a fixed set of probes each build and flags a provider quietly swapping a model on you.

These are on the list because the practice needs them. They're just earlier and less proven, and real usage is what moves them forward. The full breakdown, with the maturity of each, is in the package README.

## Build it with us

We believe that no single package or vendor gets to decide what context engineering is. The community that turned data modeling into a shared craft is the right community to work out how data becomes context. Context engineering asks for the same move again. The metrics work you've already shipped doesn't get replaced. It becomes the trusted foundation a larger surface gets built on.

We'll keep investing in this package, in educational content for the community, and in many other avenues that help data teams grow into the next wave of the craft: turning the data you already govern into context that agents and AI use cases can rely on, the foundation an enterprise AI strategy actually needs.

The fastest way to shape where this goes is to get your hands on it. What have you improvised on your own? Where does this meet friction with your data? What should graduate out of beta first?

- Install it and run chunk, embed, and search against something real.
- Look at the worked example, [jaffle-logistics](https://github.com/dbt-labs/jaffle-logistics), including the before-and-after search comparison.
- Read the ADRs if you want the reasoning.
- Tell us where it breaks, open issues and PRs, and suggest the patterns you want next.