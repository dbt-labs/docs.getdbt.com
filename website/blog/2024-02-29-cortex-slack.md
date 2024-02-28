---
title: "LLM powered anlytics engineering - using Snowflake Cortex and dbt Cloud to solve production data problems, today"
description: "Learn how to take advantage of the defer to prod feature in dbt Cloud"
slug: defer-to-prod

authors: [joel_labes]

tags: [analytics craft]
hide_table_of_contents: false

date: 2024-01-09
is_featured: true
---


## Cloud Data Platforms make new things possible; dbt helps you put them into production

The original fundamental paradigm shift that enabled dbt to exist and be useful was databases going to the cloud. dbt itself isn’t the cool thing; the cool thing is being able to do higher quality, higher leverage work by effectively leveraging the capabilities of your data platform. Put another way, dbt the code compiler and execution environment is the way that dbt the mindset can manifest itself.

A decade ago, the big change was cloud data warehouses - all of a sudden it was possible for more people to do better data work, enabled by these platforms and the removal of so many bounds that we took for granted in the past:

- That query won’t scale (without upgrading to a larger on-prem database)
- We can’t store that clickstream data (without pre-aggregating and transforming it)
- Some other good examples

Today, the next wave of innovation is happening in AI and LLMs, and they’re coming to the same cloud data platforms dbt practitioners have been using since the start. For one example, Snowflake have just released their Cortex functions to access specialised ML and LLM models tuned for specific tasks on top of your existing datasets where they already live. In doing so, there are a new set of opportunities available to us:

- We can now derive meaning from these arbitraliy large blocks of text (without moving the data somewhere else)
- We can now elegantly extract structured data from unstructured data (like images)
- We can bake reasoning capabilities into our dbt models.

Which means that there is a new set of work that it’s possible to do inside of the existing tooling and mindset you know and love: dbt.

## Anatomy of an LLM-powered workflow

When we were looking for our first AI powered use case in our analytics stack, we wanted to find something at the intersection of:

- Solves a real business problem for us today
- Makes use of the unique capabilities of LLMs
- Does so in a way that hedges against their current uncertainties and limitations
- Understanding that we can build workflows with expected model improvements in mind (things that don't work today might soon work very well indeed)


## Developing our first LLM-powered analytics workflow in dbt Cloud

To try and put this into action, I started experimenting with Snowflake’s Cortex functions to help me keep up to date with the dbt Community Slack. We already pull Slack data into Snowflake for basic analytics, but having the ability to find interesting discussions and threads with unsolved questions would help the Developer Experience team do a better job of keeping our finger on the pulse of dbt developers’ needs.

We’re a team of six and have different focus areas, so for this to be useful there needs to be some classification - I don’t want to see every question about every piece of dbt functionality. Put another way, we wanted to create a triage agent that could keep a watchful eye over the Slack, and let us know about things we’d otherwise have missed.

Once it was finished, it looked like this:

[ screenshot tk].

Up to once a day, we’ll get a post in our internal Slack with links to a handful of interesting threads for each person’s focus areas and a brief summary of the discussion so far. From there, we can go deeper by diving into the thread or flagging it to a product manager.

## Even though it was powered by The Future, this was totally normal analytics engineering work

I needed to filter down to the most relevant threads (nothing too short, ignore threads that already have a dbt Labs employee in them, focus on channels that are q&a-oriented…), and then augment the resulting table with calls to the Cortex functions.

I still built a DAG in layers, building on top of our staging models of Slack threads with a new mart model containing the thread summary, the relevant product area, and the thread’s resolution status. On top of that I added another mart, which rolled up multiple threads into a single summary message grouped by date and product area.

## When should you do this instead of using a different tool?

We chose to implement this analysis in our warehouse and orchestrate it with dbt for a couple of reasons. Firstly, while Slack offers a similar product natively, it's designed for synchronous on-demand consumption, not bulk summaries. And while we have a community health tool - Common Room - with some related functionality, it lacks awareness of our individual product verticals. Finally, using Snowflake meant the data was already where we needed it, which meant we could start building immediately without evaluating other vendors and handling the governance issues that come from that.

From an orchestration perspective, running this alongside the rest of our models means that it always runs on freshly transformed data. I also had full access to columns from other tables, such as whether a Slack user works at dbt Labs or not.

## Tips for applying this in your own project

- **Always build incrementally.** Anyone who’s interacted with any LLM-powered tool knows that it can take some time to get results back from a request, and that the results can vary from one invocation to another. For speed, cost and consistency reasons, I implemented both models incrementally even though in terms of row count the tables are tiny. I also added the full-refresh: false config to protect against full refreshes we run to capture late-arriving facts.
- **Beware of token limits.** While in preview, requests that consume too many tokens caused the entire query to fail. (The Snowflake team tells me that this will change to returning null on the offending rows in future, which is much more workable). To protect against this, I summarised the whole thread when possible but for very long threads I had to just use the initial post. In future I would first try to use the llama-70b model (~4k token limit), and for unsuccessful rows make a second pass using the mistral-7b model (~32k token limit).
- **Orchestrate defensively, for now**. Because of the above limitations, I’ve got these steps running in their own dbt Cloud job, triggered by the successful completion of our main project job. I don’t want the data team to be freaked out by a failing production run due to my experiments. We use YAML selectors to define what gets run in our default job; I added another selector for these models and then added that selector to the default job’s exclusion list. Once this becomes more stable, I’ll fold it into our normal job.
- **Iterate on your prompt.** In the same way as you gradually iterate on a SQL query, you have to tweak your prompt frequently in development to ensure you’re getting the expected results. One slightly disappointing part of prompt engineering: I can spend an afternoon working on a problem, and at the end of it only have a single line of code to check into a commit.
- **Remember that your results are non-deterministic.** For someone who loves to talk about idempotency, having a model whose results vary based on the vibes of some rocks we tricked into dreaming is a bit weird, and requires a bit more defensive coding than you may be used to. For example, one of the prompts I use is classification-focused (identifying the discussion’s product area), and normally the result is just the name of that product. But sometimes it will return a little spiel explaining its thinking, so I need to explicitly extract that value from the response instead of unthinkingly accepting whatever I get back. Defining the valid options in a Jinja variable has helped keep them in sync.

## Share your experiences

If you’re doing anything like this in your work or side project, I’d love to hear about it in the comment section on Discourse or in machine-learning-general in Slack.
