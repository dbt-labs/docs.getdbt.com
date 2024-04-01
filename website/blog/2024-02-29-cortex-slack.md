---
title: "LLM-powered Analytics Engineering: How we're using AI inside of our dbt project, today, with no new tools."
description: "By orchestrating Snowflake's new Cortex functions inside of dbt Cloud, we can do once-impractical analytics with no additional tooling."
slug: dbt-models-with-snowflake-cortex

authors: [joel_labes]

tags: [analytics craft, data ecosystem]
hide_table_of_contents: false

date: 2024-03-19
is_featured: true
---

## Cloud Data Platforms make new things possible; dbt helps you put them into production

The original paradigm shift that enabled dbt to exist and be useful was databases going to the cloud.

All of a sudden it was possible for more people to do better data work as huge blockers became huge opportunities:

- We could now dynamically scale compute on-demand, without upgrading to a larger on-prem database.
- We could now store and query enormous datasets like clickstream data, without pre-aggregating and transforming it.

Today, the next wave of innovation is happening in AI and LLMs, and it's coming to the cloud data platforms dbt practitioners are already using every day. For one example, Snowflake have just released their [Cortex functions](https://docs.snowflake.com/LIMITEDACCESS/cortex-functions) to access LLM-powered tools tuned for running common tasks against your existing datasets. In doing so, there are a new set of opportunities available to us:

<!-- truncate -->

- We can now **derive meaning from large unstructured blocks of text**, without painstakingly building complex regexes
- We can now **summarize or translate content** without having to call out to external third-party APIs.
- Most significantly, we can now **bake reasoning capabilities into our dbt models** by describing what we want to happen.

Analytics Engineers have always existed at the intersection of business context and data - LLMs on the warehouse make it possible to embed more business context _and_ unlock more data, increasing our leverage in both directions at once.

## Anatomy of an LLM-powered workflow

My colleagues and I did some [experiments last year](https://roundup.getdbt.com/p/semantic-layer-as-the-data-interface) using GPT-4 to enhance the Semantic Layer, but this is the first time it's been possible to use AI directly inside of our dbt project, without any additional tooling.

When we were looking for a first AI-powered use case in our analytics stack, we wanted to find something that:

- Solves a real business problem for us today
- Makes use of the unique capabilities of LLMs
- Was cognisant of their current uncertainties and limitations
- Anticipated future improvements to the models available to us, so things that don't work today might soon work very well indeed.

Once we selected our use case, the analytics engineering work of building and orchestrating the new dbt models felt very familiar; in fact it was exactly the same as any other model I've built.

- I still built a DAG in layers, with existing staging models as the foundation and building new modular segments on top
- I still followed the same best practices and conventions around writing, styling and versioning controlling my code
- I still ensured my models behaved as I expected by going through a code review and automated testing process, before deploying my LLM workloads to production with the dbt Cloud orchestrator.

In short, the same dbt I know and love, but augmented by the new power that Cortex exposes.

## Developing our first LLM-powered analytics workflow in dbt Cloud

When thinking about a project that would only be possible if we could make sense of a large volume of unstructured text, I pretty quickly realised this could help me keep up to date with the dbt Community Slack. Even though we spend a lot of time in Slack, there's hundreds of threads taking place across dozens of channels every day, so we often miss important or interesting conversations.

We already pull Slack data into Snowflake for basic analytics, but having a triage agent that could keep a watchful eye over the Slack – and let us know about things we'd otherwise have missed – would help the Developer Experience team do a better job of keeping our finger on the pulse of dbt developers' needs.

Once it was finished, it looked like this:

<Lightbox src="/img/blog/2024-02-29-cortex-slack/slack-summaries.png" width="85%" title="An example of some summarized threads for review (lightly edited for anonymity)." />

Up to once a day, we'll get a post in our internal Slack with links to a handful of interesting threads for each person's focus areas and a brief summary of the discussion so far. From there, we can go deeper by diving into the thread ourselves, wherever it happens to take place. While developing this I found multiple threads that I wouldn't have found any other way (which was itself a problem, since my model filters out threads once a dbt Labs employee is participating in it, so I kept losing all my testing data).

You probably don't have the exact same use case as I do, but you can imagine a wide set of use case for LLM powered analytics engineering:

- A SaaS company could pull information from sales calls or support tickets to gain insight into conversations
- A mobile app developer might pull in app store reviews for sentiment analysis
- By calculating the vector embeddings for text, deduplicating similar but nonidentical text becomes more tractable.

Here's an extract of some of the code, using the [cortex.complete() function](https://docs.snowflake.com/sql-reference/functions/complete-snowflake-cortex) - notice that the whole thing feels just like normal SQL, because it is!

```sql
        select trim(
            snowflake.cortex.complete(
                'llama2-70b-chat',
                concat(
                    'Write a short, two sentence summary of this Slack thread. Focus on issues raised. Be brief. <thread>',
                    text_to_summarize,
                    '</thread>. The users involved are: <users>',
                    participant_metadata.participant_users::text,
                    '</users>'
                )
            )
        ) as thread_summary,
```

## Tips for building LLM-powered dbt models

- **Always build incrementally.** Anyone who's interacted with any LLM-powered tool knows that it can take some time to get results back from a request, and that the results can vary from one invocation to another. For speed, cost and consistency reasons, I implemented both models incrementally even though in terms of row count the tables are tiny. I also added the [full_refresh: false](https://docs.getdbt.com/reference/resource-configs/full_refresh) config to protect against other full refreshes we run to capture late-arriving facts.
- **Beware of token limits.** Requests that contain [too many tokens](https://docs.snowflake.com/LIMITEDACCESS/cortex-functions#model-restrictions) are truncated, which can lead to unexpected results if the cutoff point is halfway through a message. In future I would first try to use the llama-70b model (~4k token limit), and for unsuccessful rows make a second pass using the mistral-7b model (~32k token limit). Like many aspects of LLM powered workflows, we expect token length constraints to increase substantially in the near term.
- **Orchestrate defensively, for now**. Because of the above considerations, I've got these steps running in their own dbt Cloud job, [triggered by the successful completion of our main project job](/docs/deploy/deploy-jobs#trigger-on-job-completion--). I don't want the data team to be freaked out by a failing production run due to my experiments. We use [YAML selectors](/reference/node-selection/yaml-selectors) to define what gets run in our default job; I created a new selector for these models and then added that selector to the default job's exclusion list. Once this becomes more stable, I'll fold it into our normal job.
- **Iterate on your prompt.** In the same way as you gradually iterate on a SQL query, you have to tweak your prompt frequently in development to ensure you're getting the expected results. In general, I started with the shortest command I thought could work and tweaked it based on the results I was seeing. One slightly disappointing part of prompt engineering: I can spend an afternoon working on a problem, and at the end of it only have a single line of code to check into a commit.
- **Remember that your results are non-deterministic.** For someone who loves to talk about <Term id="idempotent">idempotency</Term>, having a model whose results vary based on the vibes of some rocks we tricked into dreaming is a bit weird, and requires a bit more defensive coding than you may be used to. For example, one of the prompts I use is classification-focused (identifying the discussion's product area), and normally the result is just the name of that product. But sometimes it will return a little spiel explaining its thinking, so I need to explicitly extract that value from the response instead of unthinkingly accepting whatever I get back. Defining the valid options in a Jinja variable has helped keep them in sync: I can pass them into the prompt and then reuse the same list when extracting the correct answer.

```sql
-- a cut down list of segments for the sake of readability
{% set segments = ['Warehouse configuration', 'dbt Cloud IDE', 'dbt Core', 'SQL', 'dbt Orchestration', 'dbt Explorer', 'Unknown'] %}

    select trim(
        snowflake.cortex.complete(
            'llama2-70b-chat',
            concat(
                'Identify the dbt product segment that this message relates to, out of [{{ segments | join ("|") }}]. Your response should be only the segment with no explanation. <message>',
                text,
                '</message>'
            )
        )
    ) as product_segment_raw,

    -- reusing the segments Jinja variable here
    coalesce(regexp_substr(product_segment_raw, '{{ segments | join ("|") }}'), 'Unknown') as product_segment
```

## Share your experiences

If you're doing anything like this in your work or side project, I'd love to hear about it in the comment section on Discourse or in machine-learning-general in Slack.

## Appendix: An example complete model

Here's the full model that I'm running to create the overall rollup messages that get posted to Slack, built on top of the row-by-row summary in an earlier model:

```sql
{{
    config(
        materialized='incremental',
        unique_key='unique_key',
        full_refresh=false
    )
-}}


{# 
    This partition_by dict is to dry up the columns that are used in different parts of the query. 
    The SQL is used in the partition by components of the window function aggregates, and the column 
    names are used (in conjunction with the SQL) to select the relevant columns out in the final model.
    They could be written out manually, but it creates a lot of places to update when changing from 
    day to week truncation for example. 

    Side note: I am still not thrilled with this approach, and would be happy to hear about alternatives!
#}
{%- set partition_by = [
    {'column': 'summary_period', 'sql': 'date_trunc(day, sent_at)'},
    {'column': 'product_segment', 'sql': 'lower(product_segment)'},
    {'column': 'is_further_attention_needed', 'sql': 'is_further_attention_needed'},
] -%}

{% set partition_by_sqls = [] -%}
{% set partition_by_columns = [] -%}

{% for p in partition_by -%}
    {% do partition_by_sqls.append(p.sql) -%}
    {% do partition_by_columns.append(p.column) -%}
{% endfor -%}


with

summaries as (

    select * from {{ ref('fct_slack_thread_llm_summaries') }}
    where not has_townie_participant

),

aggregated as (
    select distinct
        {# Using the columns defined above #}
        {% for p in partition_by -%}
            {{ p.sql }} as {{ p.column }},
        {% endfor -%}

        -- This creates a JSON array, where each element is one thread + its permalink. 
        -- Each array is broken down by the partition_by columns defined above, so there's
        -- one summary per time period and product etc.
        array_agg(
            object_construct(
                'permalink', thread_permalink,
                'thread', thread_summary
            )
        ) over (partition by {{ partition_by_sqls | join(', ') }}) as agg_threads,
        count(*) over (partition by {{ partition_by_sqls | join(', ') }}) as num_records,
        
        -- The partition columns are the grain of the table, and can be used to create
        -- a unique key for incremental purposes
        {{ dbt_utils.generate_surrogate_key(partition_by_columns) }} as unique_key
    from summaries
    {% if is_incremental() %}
        where unique_key not in (select this.unique_key from {{ this }} as this) 
    {% endif %}

),

summarised as (

    select
        *,
        trim(snowflake.cortex.complete(
            'llama2-70b-chat',
            concat(
                'In a few bullets, describe the key takeaways from these threads. For each object in the array, summarise the `thread` field, then provide the Slack permalink URL from the `permalink` field for that element in markdown format at the end of each summary. Do not repeat my request back to me in your response.',
                agg_threads::text
            )
        )) as overall_summary
    from aggregated

),

final as (
    select 
        * exclude overall_summary,
        -- The LLM loves to say something like "Sure, here's your summary:" despite my best efforts. So this strips that line out
        regexp_replace(
            overall_summary, '(^Sure.+:\n*)', ''
        ) as overall_summary

    from summarised
)

select * from final
```
