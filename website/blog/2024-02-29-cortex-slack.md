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

The original fundamental paradigm shift that enabled dbt to exist and be useful was databases going to the cloud.

All of a sudden it was possible for more people to do better data work as huge blockers became huge opportunities:

- That query won’t scale dynamically - I'd need to upgrade to a larger on-prem database)
- We can’t store that clickstream data (without pre-aggregating and transforming it)

Today, the next wave of innovation is happening in AI and LLMs, and they’re coming to the cloud data platforms dbt practitioners are already using every day. For one example, Snowflake have just released their Cortex functions to access specialised ML and LLM models tuned for specific tasks on top of your existing datasets where they already live. In doing so, there are a new set of opportunities available to us:

- We can now derive meaning from arbitraliy large blocks of text (without moving the data somewhere else)
- We can now elegantly extract structured data from unstructured data (like images)
- We can bake reasoning capabilities into our dbt models

Analytic Engineers have always existed at the intersection of business context and data - LLMs add a new translation layer.

## Anatomy of an LLM-powered workflow

When we were looking for our first AI powered use case in our analytics stack, we wanted to find something at the intersection of:

- Solves a real business problem for us today
- Makes use of the unique capabilities of LLMs
- Does so in a way that hedges against their current uncertainties and limitations
- Understanding that we can build workflows with expected model improvements in mind (things that don't work today might soon work very well indeed)

Once we selected our use case - the work of building out the dbt code to run and orchestrate it felt very familiar - in fact it was exactly the same as how we'd write any dbt Model.

When I was building in Cortex:
- I still built a DAG in layers, building on top of our staging models 
- I still followed the same best practices and conventions around writing, styling and versioning controling my dbt code
- I still orchestrated the running of my LLM workloads using the dbt Cloud orchestrator

In short, same dbt you know and love, now offering you all the power that Snowflake Cortex has to offer.

## Developing our first LLM-powered analytics workflow in dbt Cloud

The use case we found as our entry point to AI-powered analytics engineering was using Snowflake’s Cortex functions to help me keep up to date with the dbt Community Slack. 

We already pull Slack data into Snowflake for basic analytics, but having the ability to find interesting discussions and threads with unsolved questions would help the Developer Experience team do a better job of keeping our finger on the pulse of dbt developers’ needs.

We’re a team of six and have different focus areas, so for this to be useful there needs to be some classification - I don’t want to see every question about every piece of dbt functionality. Put another way, we wanted to create a triage agent that could keep a watchful eye over the Slack, and let us know about things we’d otherwise have missed.

Once it was finished, it looked like this:

[ screenshot tk].

Up to once a day, we’ll get a post in our internal Slack with links to a handful of interesting threads for each person’s focus areas and a brief summary of the discussion so far. From there, we can go deeper by diving into the thread or flagging it to a product manager.

Even though we spend a lot of time scouring the Slack, we can often miss important or interesting conversations simply due to the volume of messages that get posted every day - this allows us to help make sure high signal conversations don't get missed.

You could imagine a wide set of use case for LLM powered analytics engineering:
- A B2B saas company could dynamically pull information from sales calls or support tickets to gain insight into conversaions
- A mobile app developer might use this to gain interesting insight about their app store reviews
- (Assuming a model with visual capabilities) extracting information from paper documents or other analogue data sources

## Tips for building LLM powered dbt models

- **Always build incrementally.** Anyone who’s interacted with any LLM-powered tool knows that it can take some time to get results back from a request, and that the results can vary from one invocation to another. For speed, cost and consistency reasons, I implemented both models incrementally even though in terms of row count the tables are tiny. I also added the full-refresh: false config to protect against full refreshes we run to capture late-arriving facts.
- **Beware of token limits.** Some of my requestions failed due to exceeding token thresholds. In future I would first try to use the llama-70b model (~4k token limit), and for unsuccessful rows make a second pass using the mistral-7b model (~32k token limit). Like many aspects of LLM powered workflows, we expect token length constraints to increase substantially in the near term.
- **Orchestrate defensively, for now**. Because of the above considerations, I’ve got these steps running in their own dbt Cloud job, triggered by the successful completion of our main project job. I don’t want the data team to be freaked out by a failing production run due to my experiments. We use YAML selectors to define what gets run in our default job; I added another selector for these models and then added that selector to the default job’s exclusion list. Once this becomes more stable, I’ll fold it into our normal job.
- **Iterate on your prompt.** In the same way as you gradually iterate on a SQL query, you have to tweak your prompt frequently in development to ensure you’re getting the expected results. One slightly disappointing part of prompt engineering: I can spend an afternoon working on a problem, and at the end of it only have a single line of code to check into a commit.
- **Remember that your results are non-deterministic.** For someone who loves to talk about idempotency, having a model whose results vary based on the vibes of some rocks we tricked into dreaming is a bit weird, and requires a bit more defensive coding than you may be used to. For example, one of the prompts I use is classification-focused (identifying the discussion’s product area), and normally the result is just the name of that product. But sometimes it will return a little spiel explaining its thinking, so I need to explicitly extract that value from the response instead of unthinkingly accepting whatever I get back. Defining the valid options in a Jinja variable has helped keep them in sync.

## Share your experiences

If you’re doing anything like this in your work or side project, I’d love to hear about it in the comment section on Discourse or in machine-learning-general in Slack.
