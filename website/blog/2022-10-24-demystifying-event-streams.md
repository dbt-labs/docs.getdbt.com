---
title: "Demystifying event streams: Transforming events into tables with dbt"
description: "Pulling data directly out of application databases is commonplace in the MDS, but also risky. Apps change quickly, and application teams might update database schemas in unexpected ways, leading to pipeline failures, data quality issues, data delivery slow-downs. There is a better way. In this blog post, Charlie Summers (Merit) describes how their organization transforms application event streams into analytics-ready tables, more resilient to event scheme changes."
slug: demystifying-event-streams

authors: [charlie_summers]

tags: [analytics craft]
hide_table_of_contents: false

date: 2022-11-04
is_featured: true
---

Let’s discuss how to convert events from an event-driven microservice architecture into relational tables in a <Term id="data-warehouse">warehouse</Term> like Snowflake. Here are a few things we’ll address:

- Why you may want to use an architecture like this
- How to structure your event messages
- How to use dbt macros to make it easy to ingest new event streams

<!--truncate-->

## Event Streams at Merit

At Merit, we’re building the leading verified identity platform. One key focus of our platform is data quality. Quality problems lead to first responders unable to check into disaster sites or parents unable to access ESA funds. In this blog post we’ll dive into how we tackled one source of quality issues: directly relying on upstream database schemas.

Under the hood, the Merit platform consists of a series of microservices. Each of these microservices has its own database. We use Snowflake as our data warehouse where we build dashboards both for internal use and for customers.

![](/img/blog/2022-10-24-demystifying-event-streams/merit-platform.png)

In the past we relied upon an <Term id="etl" /> tool (Stitch) to pull data out of microservice databases and into Snowflake. This data would become the main dbt sources used by our report models in BI.

![](/img/blog/2022-10-24-demystifying-event-streams/merit-platform-stitch.png)

This approach worked well, but as engineering velocity increased, we came up with a new policy that required we rethink this approach: **no service should directly access another microservice’s database**. This rule empowers microservices to change their database schemas however they like without worrying about breaking other systems.

Modern <Term id="etl" /> tools like Fivetran and Stitch can flexibly handle schema changes - for example, if a new column is created they can propagate that creation to Snowflake. However, BI tools and dbt models aren’t typically written this way. For example, if a column your BI tool filters on has a name change in the upstream database, that filter will become useless and customers will complain.

The approach we used before required over-communicating about schema changes. Engineers would need to talk to Data before any change or it could risk a data outage. Tools that provide column-level <Term id="data-lineage">lineage</Term> can improve detecting how schema changes affect dashboards. But a migration is still required should a used column be updated by a schema change.

This old approach frequently resulted in either busted dashboards or delayed schema changes. These issues were the exact reason engineering implemented the new policy.

The core challenge is contractual: in our old approach the contract between engineering and data was the database schema. But the database schema was intended to be a tool to help the microservice efficiently store and query data, not a contract.

So our solution was to start using an intentional contract: **Events**.

What are Events? Events are facts about what happened within your service. For example, somebody logged in or a new user was created. At Merit (and at many companies), we use an Event-Driven Architecture. That means that microservices primarily communicate information through events, often leveraging messaging platforms like Kafka.

![](/img/blog/2022-10-24-demystifying-event-streams/merit-platform-kafka.png)

Microservices consume messages from others that they’re interested in. We choose to use **thick messages** that store as much information as possible about each event - this means that consuming microservices can store and refer to event data instead of requesting fresh data from microservices. For distributed systems nerds: this improves Availability at the cost of Consistency.

Event schemas can still change, just like database schemas, but the expectation is that they are already a contract between this microservice and other systems. And the sole intention of events is to be this contract - unlike database schemas which are also used by microservices internally to store and query data. So, when an event schema changes, there already is a meeting between that team and all teams that consume the event - now Data is just another team at the meeting.

## Events as Contracts

Each event output by a microservice is inserted into a single Kafka topic with a well-defined schema. This schema is managed as part of the [Kafka Schema Registry](https://docs.confluent.io/platform/current/schema-registry/index.html). The Schema Registry doesn’t strictly enforce that events comply with the topic’s schema, but any microservice that produces an event that does not comply with the schema will cause downstream failures - a high-priority bug. These bad events are replayed with the correct schema when the microservice is fixed.

We use [Avro](https://avro.apache.org/) to encode all of our event schemas. We also tried out [Protobuf](https://developers.google.com/protocol-buffers), but found that the Avro tooling was a bit better for Kafka.

Event schema design (what should the data contract be?) is a deep topic that we can only touch on briefly here. At a high level, we must design for change. A schema will almost always be tweaked and tuned over time as your product changes.

As an example, consider a LicenseCreated event. The internal License data model might have several boolean fields in its schema such as IsValid, IsCurrent, IsRestricted, etc. We would recommend instead modeling a License with a single Status field that has a VARCHAR representing the status of the License. New values are easier to add to a VARCHAR than adding or removing boolean fields.

One very useful feature of the Kafka Schema Registry is it can restrict changes that aren’t compatible with old schema versions. For example, if a data type is changed from an INT to a VARCHAR it will throw an error as the new schema is added. This can be an extra line of defense as schemas change. [Read more about this awesome feature here](https://docs.confluent.io/platform/current/schema-registry/avro.html).

## OMG Contract

So we started consuming events from Kafka into Snowflake using [Kafka’s Snowflake Connector](https://docs.snowflake.com/en/user-guide/kafka-connector.html).

![](/img/blog/2022-10-24-demystifying-event-streams/merit-platform-kafka-load.png)

The Snowflake Connector creates a new <Term id="table" /> for every Kafka topic and adds a new row for every event. In each row there’s a record_metadata column and a record_content column. Each column is a variant type in Snowflake.

![](/img/blog/2022-10-24-demystifying-event-streams/kafka-topic-table.png)

Since we use **thick messages** we actually can consider ourselves done. The messages have as much information as the underlying database, so we could make queries against tables like the above.

However, working with these <Term id="json" /> blobs is much less convenient than a relational table for the following reasons:

1. There may be multiple topics related to the same domain model (ex: Users or Customers). So there may be a CustomerCreated topic, a CustomerDeleted topic, a CustomerUpdated topic, and so on. We need to know to join between these tables to determine what the latest Customer data is.
1. We must know whether an event implies a create, an update, or a delete.
1. We must be aware of the ordering of events - the latest update will include the most up-to-date state unless there’s a delete. This can lead to some gnarly time logic that must be considered across all models.
    1. One challenge is partial updates - we disallow those currently so that we never need to recreate the state of a domain model across multiple json blobs.
    1. Distributed systems folks will identify another problem: relying on timing. Due to clock skew, we can’t guarantee that event A’s timestamp being earlier than another B’s means that A occurred before B. If both messages are sent on the same Kafka topic then Kafka can ensure ordering (if configured properly), but we don’t want to limit all events to using the same topic. So we choose to ignore this problem since we have relatively low traffic and low machine volume compared to the Googles and Facebooks of the world. We can also verify the likelihood of clock skew affecting our data by looking for events with the same identifying ID happening within the same second - it doesn’t happen often for us.

Instead of repeatedly working with the above challenges, we decided to create a relational layer on top of the raw event streams. This takes the form of [dbt macros](/docs/build/jinja-macros) that handle all of the above problems.

In order to make the dbt macros easier to write, we requested that engineering add some metadata to all of their events. This formalized the contract between engineering and data - any domain models that don’t comply with the contract will not be able to be used in reports unless the engineering team themself builds a custom pipeline. We named this the Obvious Model Generation (OMG) Contract since providing the metadata leads to obvious domain model generation. And we liked the acronym.

The OMG contract states that every Kafka message related to a domain model:
1. Must have its topic name added to a dbt variable associated with that domain model in our dbt_project.yml
1. Must have a single uniquely identifying field for each object. We provide a default - id - and a way to override it in our dbt_project.yml. We currently disallow composite ids, but they wouldn’t be too hard to support in the future.
1. Must have a field `changeType` set to one of the following values: INSERT, UPDATE, DELETE.
1. If an INSERT or UPDATE, it must specify a field **data** that encodes the state of the domain model object after the change.
1. If a DELETE, it must specify a field `deletedID` that is set to the identifying field for the deleted domain model object.

We now can run obvious model generation streams processing on all data that complies with the OMG contract.

![](/img/blog/2022-10-24-demystifying-event-streams/omg-contract.png)

## Generic table pipelines via dbt macros 

After solidifying the OMG contract, we built the macros to execute obvious model generation. We wanted to make these as generic as possible while also following good engineering practices. We ended up building three macros that together process event streams into tables. All three macros take in `streams_var` - a list of all the event stream tables related to this domain model. We pull streams_var in from dbt_project.yml. We also take in `streams_schema` which defaults to ‘streams’ but allows overriding for our internal testing.

The first model is called `stream_model_extract_columns` which iterates through every row in the event stream tables to identify all of the columns that will be part of the domain model table.

```sql
{%- macro stream_model_extract_columns_macro(streams_var, streams_schema='streams') -%}

SELECT DISTINCT
    CONCAT('DATA:', KEY, ' ', 'AS', ' ', UPPER(e.KEY)) AS COLUMN_NAME
FROM
(
{% for stream in streams_var %}
    SELECT
        '{{ stream }}' as streamName,
        RECORD_CONTENT:data AS data
    FROM {{ source(streams_schema, stream ) }}
    {%- if not loop.last %} UNION ALL{% endif -%}
{% endfor %}
), LATERAL FLATTEN( INPUT => data ) AS e

{%- endmacro -%}
```

The second macro is called `stream_model_latest_snapshot`. It includes the logic to identify the latest state of every domain model object in the table, applying deletes when it finds them.

```sql
{%- macro stream_model_latest_snapshot_macro(streams_var, streams_schema='streams') -%}
{%- set identityFields = var("overriddenIdentityFields") -%}

WITH changeStream AS (
{% for stream in streams_var %}
    SELECT
        '{{ stream }}' as streamName,
        -- Need to alias ID column here to custom column if its overwritten in the variable
        RECORD_CONTENT:data.{{ identityFields.get(stream,'id') }} AS idCol,
        RECORD_METADATA:CreateTime AS createTime,
        RECORD_CONTENT:changeType::STRING AS changeType,
        RECORD_CONTENT:data AS data,
        GET(RECORD_CONTENT,'deletedID') AS deletedID
    FROM {{ source(streams_schema, stream ) }}
    {%- if not loop.last %} UNION ALL{% endif -%}
{% endfor %}
),

orderedStream AS (
    SELECT
        cs.*
        , cs.deletedID IN (SELECT deletedID FROM changeStream WHERE changeType = 'DELETE') AS isDeleted
        , ROW_NUMBER() OVER (PARTITION BY cs.idCol ORDER BY cs.createTime DESC, cs.changeType DESC) AS LatestRow
    FROM changeStream AS cs
    WHERE changeType IN ('INSERT', 'UPDATE')
),
selectedStream AS (
    SELECT
        *
    FROM orderedStream
    WHERE LatestRow = 1
)

{%- endmacro -%}
```

The final macro is called `stream_model` and it coordinates the usage of the first two. Particularly, it uses [run_query()](https://docs.getdbt.com/reference/dbt-jinja-functions/run_query) to run the first macro, then uses the results to execute the final query which leverages the second macro.

```sql
{%- macro stream_model_macro(streams_var, streams_schema='streams') -%}

{%- set column_name_query -%}
{{ stream_model_extract_columns_macro(streams_var, streams_schema) }}
{%- endset -%}

{%- set results = run_query(column_name_query) -%}

{% if execute %}
{# Return the first column #}
{%- set column_names = results.columns[0].values() -%}
{% else %}
{%- set column_names = [] -%}
{% endif %}

{{ stream_model_latest_snapshot_macro(streams_var, streams_schema) }}
,
dynamicStream AS (
    SELECT
        {# rendering_a_new_line_in_sql_block_code #}
        {%- for columns in column_names -%}
        {{ ", " if not loop.first }}{{columns}}
        {%- if not loop.last -%}
            {# rendering_a_new_line_in_sql_block_code #}
        {% endif %}
        {%- endfor %}
    FROM selectedStream AS e
)
SELECT * FROM dynamicStream

{%- endmacro -%}
```

Now all we need to do is call the final macro in a dbt model and provide the list specified as a variable in `dbt_project.yml`. This file is in `src_container.sql`:

```sql
{{ stream_model_macro(var('container')) }}
```

In `src_container.yml` we explicitly set and have tests for the columns we expect to be associated with this model. This is the first time we introduce the actual column names anywhere in our dbt code.

```yaml
---
version: 2

models:
  - name: src_container
    description: pass the OMG model variable to generate the data
    columns:
      - name: templateName
        description: STRING Specifies the templateName
        tests:
          - not_null
      - name: complete
        description: STRING Specifies the complete
      - name: aggregateID
        description: STRING Specifies the aggregateID
      - name: recipientID
        description: STRING Specifies the recipientID
      - name: templateID
        description: STRING Specifies the templateID
      - name: templateType
        description: STRING Specifies the templateType
      - name: state
        description: STRING Specifies the state
      - name: id
        description: STRING Specifies the id
      - name: orgID
```
```yaml
---
version: 2

models:
  - name: users
    description: Lovely humans that use our app
    columns:
      - name: id
        description: INT The id of this user
        tests:
          - not_null
          - unique
      - name: email
        description: STRING User's contact email
        tests:
          - not_null
      - name: state
        description: STRING The current state of the user
        tests:
          - accepted_values:
             values:
               - "active"
               - "invited"
          - not_null
```

## Future ideas

We learned a lot from both working with event streams and building these macros.

One consideration that we haven’t discussed yet is [materialization](https://docs.getdbt.com/docs/build/materializations) strategy. Since event stream tables are append-only, this is a natural fit for incremental models. At Merit, we haven’t worked much with incremental models, so we’re opting to start with views. As we roll this out to production models we’ll be doing a ton of performance testing to figure out the perfect materialization strategy for us.

We also plan on adding a dbt test that alerts whenever the columns of any domain model table changes. This may indicate that an unexpected change has happened to an event schema, which could affect dashboards.

These were certainly the most complicated dbt macros that we’ve built so far. This has inspired us to build a test framework to make sure that macros work as expected - including features like mocking run_query() calls. We’re considering open sourcing this framework - if you’re interested then let us know!

## Let's talk!

We’ve used dbt macros to transform event streams into tables so that we don’t need our data pipelines to rely directly on database schemas. I’ll be talking about this more at Coalesce 2022 - come check out my talk [Demystifying event streams: Transforming events into tables with dbt](https://coalesce.getdbt.com/agenda/demystifying-event-streams-transforming-events-into-tables-with-dbt). You can also reach out to me in the dbt slack (@Charlie Summers) or [LinkedIn](https://www.linkedin.com/in/charliesummers/).
