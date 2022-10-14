---
title: "How to design and structure dbt metrics: Recommendations for getting started"
description: "The introduction of the dbt Semantic Layer expands what users can do with dbt but introduces a familiar questions around where logic should live. Read along as the dbt Labs team talks about best practices through the lens of two different examples!"
slug: how-to-design-and-structure-metrics

authors: [callum_mccann]

tags: [dbt product updates]
hide_table_of_contents: false

date: 2022-10-12
is_featured: true
---

---

**IMPORTANT:** This document serves as the temporary location for information on how to design and structure your metrics. It is our intention to take this content and turn it into a Guide, like [How we structure our dbt projects](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview), but we feel that codifying information in a Guide first requires that metrics be rigorously tested by the community so that best practices can arise. This document contains our early attempts to create best practices. In other words, read these as suggestions for a new paradigm and share in the community where they do (or don’t) match your experiences! You can find more information on where to do this at the end.

---

## The power of a semantic layer on top of a mature data modeling framework

As a longtime [dbt Community](https://www.getdbt.com/community/join-the-community/) member, I knew I had to get involved when I first saw the dbt Semantic Layer in the now infamous [`dbt should know about metrics` Github Issue](https://github.com/dbt-labs/dbt-core/issues/4071). It gave me a vision of a world where metrics and business logic were unified across an entire organization; a world where the data team was no longer bound to a single consuming experience and could enable their stakeholders in dozens of different ways. To me, it felt like the opportunity to contribute to the next step of what dbt could become.

In past roles, I’ve been referred to as the `dbt zealot` and I’ll gladly own that title! It’s not a surprise - dbt was built to serve data practitioners expand the power of our work with software engineering principles. It gave us flexibility and power to serve our organizations. But I always wondered if there were more folks who could directly benefit from interacting with dbt.

The Semantic Layer expands the reach of dbt **by coupling dbt’s mature data modeling framework with semantic definitions.** The result is a first of its kind data experience that serves both the data practitioners writing your analytics code and stakeholders who depend on it. Metrics are the first step towards this vision, allowing users to version control and centrally define their key business metrics in a single repo while also serving them to the entire business.

However, this is still a relatively new part of the dbt toolbox and you probably have a lot of questions on how exactly you can do that. This blog contains our early best practice recommendations for metrics in two key areas:
- **Design**: What logic goes into metrics and how to use calculations, filters, dimensions, etc.
- **Structure**: Where these metrics will live in your dbt project and how to compose the files that contain your metrics

We developed these recommendations by combining the overall philosophy of dbt, with our hands-on learning gathered during the beta period and internal testing.

<!--truncate-->

**Pre-reading:** We recommend reading through the [metrics documentation](/docs/building-a-dbt-project/metrics), which contains a table of all the required/optional properties.

### When to put business logic in the semantic layer vs the modeling layer

Our instinct when designing metrics might be to encode as much information as possible into the semantic layer. An example of this is case statements - the analytics engineer’s gut instinct might be to mimic tools of the past and provide complicated case statements for the metric `expression` property to try and capture the nuance of how it should be calculated.

But remember - you always have the option of performing this logic _in the modeling layer_. This is the key difference between dbt and other semantic layer offerings - by sitting the semantic layer atop a mature transformation layer, you always have the option to configure and optimize your logic within your models and then _define semantic components with intentionality_.

Getting the balance  just right is a learning experience and developing community best practices and standards will take time, which is why it’s important for us to think from first principles. What should really be our goal when determining whether logic lives in a model or a metrics?

To explore this question and begin to develop an intuition, we’ll walk through two examples of handling this divide.

## Basic example: Revenue

### Designing your metrics

In this example, we’ll cover the basics of defining a metric and a fairly straightforward example of where users can draw the line between the semantic layer and the modeling layer. You should finish this section with a better understanding of dbt metrics and its relationship to the modeling layer.

In the past, the `marts` tables were often your end stage layer before data was consumed in another tool or system. Now, the mart is the springboard for the creation of our metric. So we'll begin by looking our end-state `marts` model called `order_events` that looks something like the below table, but on the order of millions of rows instead of five. Our finance team uses the below model to better understand revenue but inconsistencies in how it's reported have led to requests that the data team centralize the definition in the dbt repo.

| event_date | order_id | order_country | order_status | customer_id | customer_status | amount |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-10-01 | 1 | United States | completed | 19 | Healthy | 10 |
| 2022-10-01 | 2 | France | completed | 36 | Churn Risk | 15 |
| 2022-10-02 | 2 | France | returned | 36 | Churned | 15 |
| 2022-10-02 | 3 | Turkey | completed | 20 | Healthy | 80 |
| 2022-10-03 | 4 | Korea | completed | 14 | Churn Risk | 24 |

### Logic in the modeling layer vs the semantic layer

We know from our upstream dbt models that the `amount` field represents the revenue from from each order. The inconsistent reporting, however, has arisen because the correct definition of revenue only refers to orders that are completed, not returned. Some teams aren’t familiar with this additional filter and it has led to company wide misreporting.

The solution is to use the flexibility of the dbt modeling layer to add a boolean field called `is_active_row` that shows whether or not the row in question is the most recent version. With this, we can understand and filter out duplicate rows that may be connected to the same order.

Once we have this field, we reach a diverging path:

- If we are not interested in seeing the history of `order_events` , we can add a `where` clause **to the model itself**. This would ensure there is only one row per order.
- If we **are** interested in seeing the history of `order_events` , we can add a `filter` to the metric definition to ensure that these duplicate order rows don’t cause us to misreport revenue

Both of these paths ensure that only the correct orders are included in the metric calculation but one does it at the modeling layer and the other the semantic layer. There is no **best** path here - it depends on your organization's reporting and analytics needs. For this example, we’ll say that our business isn’t interested in understanding orders that have gone from completed to returned and so we’ll use option one moving forward. Now lets define the metric:

```yaml
version: 2
metrics:
  - name: total_revenue
    label: The revenue of our business
    model: ref('order_events')
    description: "The revenue for our business, as defined by Jerry in Finance"

    calculation_method: sum
    expression: amount

    timestamp: event_date
    time_grains: [day, week, month, all_time]

    dimensions:
      - customer_status
      - order_country

    ## We don't need this section because we chose option 1
    ## filters:
    ##   - field: order_status
    ##     operator: '='
    ##     value: 'completed
```

Each of the properties of the above definition are defined [in the metrics documentation](https://docs.getdbt.com/docs/building-a-dbt-project/metrics), but let’s dig into the two that might require some additional explanation. The two in question are `expression` and `dimensions`.

In plain english, the `expression` property is the sql column (or expression) that we are applying the calculation method on. In our example above, this simplifies to `sum(amount)`. However, this doesn’t **need** to be a field in the model. It could also be a sql expression like `case when condition = true then field else 0 end` .

And then there’s `dimensions`.

### Choosing which dimensions to use with your metric

The `dimensions` attribute is a bit more nuanced than the others because it involves curating the ways through which a user can interact with the metric. To that end …

❗ **We recommend curating dimensions, not including all columns within the model. Most models contain dimensions that aren’t relevant for end-user analysis.**

What do we mean? Well, there is a lot of nuance in what constitutes a useful or less useful dimension that is dependent on the shape of the underlying data and the ways with which the metric will be consumed. Continuing with our revenue use case, here are some examples:

- **Useful Dimensions:**
    - `customer_status`: This field is helpful to end users because it allows them to break down the revenue generated by each customer status grouping. Members of the retention team might be interested in understanding the long-term trends of revenue from the Churn Risk group so that they can better understand the impact that their retention initiatives campaigns have had.
    - `order_country`: This field is useful because it allows members of the finance team to break down the accepted revenue from each country of origin so that they can better understand which countries are experiencing the highest growth.
- **Less Useful Dimensions:**
    - `order_status` : Given that order_status is a part of the metric definition, it doesn’t make sense to include in the acceptable dimensions list because the value returned would always be `completed`.
    - `order_id`: Each order id corresponds to a single order and a single point in time. Grouping the metric of revenue by order_id would just return the base grain of the table and the same value as the amount field - not useful from a metric perspective!
- **Nuanced Dimensions:**
    - `customer_id`: This is an interesting field because it can be both good and bad depending on the context in which it is used and the underlying data. In our example use case, this dimension wouldn’t be that useful - it would contain too many unique values and tracking the individual revenue impact by a single customer doesn’t make sense on a retail scale.
        - In a SaaS business though, it might make more sense - especially with usage based pricing. The Customer Success team might be interested in tracking the revenue of certain customers and ensuring that they remain consistent.

To quote Cameron Afzal, Product Manager of the dbt Semantic Layer:

> Thoughtful curation of dimensions is essential for three main reasons:
- **Relevance:** Analysts must include the dimensions most relevant to answering the question.
- **Trust**: Curating high-quality dimensions with little to no known errors helps ensure trust in analysis results and the decisions that follow.
- **Efficiency**: Curation provides a faster path to high-quality analysis results.
>

To put it another way, **metrics are most useful when every dimension provided can help provide answers to the business.**

## Advanced example: NPS

### Designing a complex metric

Now let’s look at a more complex example of a metric  - one that is built from components that could theoretically themselves be metrics. The metric in question is Net Promoter score, which is used by the dbt Labs internal analytics team to understand the experience that users are having on dbt Cloud.

For those of you who are unfamiliar with the industry metric of Net Promoter Score, here is a [great article from the folks over at Delighted on how it is calculated.](https://delighted.com/net-promoter-score) The short version of it is `the percentage of promoters - the percentage of detractors`.

---

Here at dbt Labs we provide users with short surveys where they can provide feedback (as well as in a few other locations). The data is collected from those surveys is used to calculate our NPS Score, which helps us understand user sentiment over time.

Given that these surveys come from a few different sources, there is a large amount of upstream modeling performed in order to unify them in a single model, but the end result is something that looks like the table below:

| feedback_date | unique_id | feedback_source | user_type | account_plan | score | nps_category |
| --- | --- | --- | --- | --- | --- | --- |
| 2022-10-01 | 1 | nps_tool_1 | developer | team | 5 | detractor |
| 2022-10-01 | 2 | nps_tool_2 | read_only | developer | 8 | promoter |
| 2022-10-02 | 3 | nps_tool_1 | developer | enterprise | 10 | promoter |
| 2022-10-02 | 4 | nps_tool_1 | developer | developer | 7 | passive |
| 2022-10-02 | 5 | nps_tool_2 | developer | team | 9 | promoter |
| 2022-10-03 | 6 | nps_tool_1 | developer | enterprise | 7 | passive |

The dbt Internal Analytics team ([long may they reign](https://www.linkedin.com/feed/update/urn:li:activity:6962884130569080833/)) took this data and decided to build the NPS Score metric into our repo so that it could be surfaced to stakeholders in multiple tools. This process is where we began to form our opinions on what should live in the modeling layer vs semantic layer - but these are sure to progress as we add in more and more real world use cases.

### Option 1: Putting everything in the semantic layer

If we wanted to store all the logic inside metric definitions, we could use the following code in the Semantic Layer section to create 6 different metrics that result in the NPS Score metric. This would allow end users to retrieve the NPS Score they are interested in a version-controlled, standard way across any of their BI tools of choice. Additionally, it allows users to individually slice/dice any of the component metrics by themselves.

```yaml
metrics:
  - name: total_respondents
    label: Total of NPS Respondents
    model: ref('customer_nps')
    description: 'The count of users responding to NPS surveys in dbt Cloud.'
    calculation_method: count
    expression: unique_id
    timestamp: created_at
    time_grains: [day, month, quarter, year]
    dimensions:
      - feedback_source
      - account_plan
      - user_type

  - name: total_promoter_respondents
    ......... ##same as total_respondents
    filters:
    - field: nps_category
      operator: '='
      value: "'promoter'"

  - name: total_detractor_respondents
    ......... ##same as total_respondents
    filters:
    - field: nps_category
      operator: '='
      value: "'detractor'"

  - name: promoters_pct
    label: Percent Promoters (Cloud)
    description: 'The percent of dbt Cloud users in the promoters segment.'
    calculation_method: expression
    expression: "{{metric('total_promoter_respondents')}} / {{metric('total_respondents')}}"
    timestamp: created_at
    time_grains: [day, month, quarter, year]
    dimensions:
      - feedback_source
      - account_plan
      - user_type 

  - name: detractor_pct
    ... ##same as promoters_pct
    expression: "{{metric('total_detractor_respondents')}} / {{metric('total_respondents')}}"

  - name: nps_score
    label: Net Promoter Score
    description: 'The NPS (-1 to 1) of all dbt Cloud users.'
    calculation_method: expression
    expression: "{{metric('promoters_pct')}} - {{metric('detractors_pct')}}"
    timestamp: created_at
    time_grains: [day, month, quarter, year]
    dimensions:
      - feedback_source
      - account_plan
      - user_type

```

### Option 2: Keeping logic in the modeling layer

But what if we didn’t want to encode all that information in the metric definitions? If we didn’t need the ability to dig into the component metrics and only wanted to look at the final score? In that case, we could encode most of the logic into the model itself and define the metric on top of that!

Thinking through this, we know that our NPS Score is a series of ratios dependent on conditions of which category people fall into with the end result being a number between 100 to -100. That number is usually then *displayed* in a percentage format but it is *calculated* as a number.

So in order to reduce the complexity of metric code, we can add a new field into the model that assigns an `nps_value` to each survey received. The logic for this field would assign a value of 100, 0, or -100 depending on the survey’s `nps_category`. Example code below:

```sql
case
	when nps_category = 'detractor' then -100
	when nps_category = 'promoter' then 100
	else 0
end as nps_value
```

The end result of adding this code to the model would look something like this:

| feedback_date | unique_id | feedback_source | user_type | account_plan | score | nps_category | nps_value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2022-10-01 | 1 | nps_tool_1 | developer | team | 5 | detractor | -100 |
| 2022-10-01 | 2 | nps_tool_2 | read_only | developer | 9 | promoter | 100 |
| 2022-10-02 | 3 | nps_tool_1 | developer | enterprise | 10 | promoter | 100 |
| 2022-10-02 | 4 | nps_tool_1 | developer | developer | 7 | passive | 0 |
| 2022-10-02 | 5 | nps_tool_2 | developer | team | 9 | promoter | 100 |
| 2022-10-03 | 6 | nps_tool_1 | developer | enterprise | 7 | passive | 0 |

Now that each survey has an associated `nps_value` we can forgo the ratio calculations used in the Metric Logic section and create our NPS Score metric as a single average metric.

```yaml
metrics:
  - name: nps_score
    label: NPS Score
    model: ref('customer_nps')
    calculation_method: average
    expression: nps_value
    timestamp: created_at
    time_grains: [day, month, quarter, year]
    dimensions:
      - feedback_source
      - account_plan
      - user_type
```

<details>
  <summary>Why does this work?</summary>

This is a slightly different way of calculating NPS from the usually provided formula but it ends up with the same result. Here is why:

- `promoter_pct` was defined as `total_promoter_respondents` / `total_respondents`
    - In our example dataset, this nets out to 3 / 6 = 50%.
    - If we instead assign a value of 100 and take the average, it becomes 300 / 6 = 50.
- `detractor_pct` was defined as `total_detractor_respondents` / `total_respondents`
    - In our example dataset, this nets out to 1 / 6 = 16.67%.
    - If we instead assign a value of 100 and take the average, it becomes -100 / 6 = -16.67.
- Therefore, our `nps_score` follows suit:
    - In our example dataset, 50% - 16.67% = 33.33%
    - If we instead assign a value of 100 and take the average, it becomes 200 / 6 = 33.33

The underlying principle of why this works is based on the fact that averages divide the sum of the values in the set by their number. In more dbt friendly terms, what it really means is that average is creating the following equation: `sum(value)/count(*)`. In the first example implementation, we were doing roughly the same thing with multiple metric definitions - the only difference was our numerator was a count that assigned each row a value of 1. So if we duplicate that logic and give each row a value of 1 then we can create far fewer metrics.

But that only gets us to the `promoter_pct` and `detractor_pct` metrics. In order to combine these both into a single metric definition, we needed to change the value that we assign. Given that the total range of values that the metric could output is -100 (all detractors) to 100 (all promoters) we can assign each of those categories that peak value, along with 0 for passives. This means that when the numerator is aggregated, it nets out promoters against detractors just like the documented equation does `promoter score - detractor score` .

</details>

**Is this what I should do?**

[It depends!](https://twitter.com/SBinLondon/status/1413113782214266885) There will be times when it might be better to have logic stored in the modeling layer and there will be times when it might be better to have logic stored in the semantic layer. Our shorthand is to only include logic in the semantic layer if it is needed by our stakeholders - if they don't need to analyze the components, we keep them in the modeling layer. In the end, the needs of your business stakeholders should drive your decision on where to keep this logic.

## How to structure your metrics

Now that we’ve designed our metrics, let's move on to structuring them within our project. We'll examine the different ways to organize metrics  and take a look at the pros and cons of several strategies.

### Folder structure

If you follow [dbt’s best practices for structuring your project](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview), you will have a folder structure that looks similar to this:

```yaml
models:
  staging:
  intermediate:
  marts:
```

Your marts folder would most likely contain your end-state models ready for business consumption. Given that metrics are meant for business consumption, we are presented with two options - staying within the same framework or representing metrics as their own level.

We recommend Option A (metrics within marts) but recognize that some people might prefer Option B (metrics within models).

**A. Metrics within marts**

Create a metrics folder within marts and use this to contain all of your metric definitions.

```yaml
models:
  staging:
  intermediate:
  marts:
    metrics:
```

**B. Metrics within models**

Create a metrics folder within models and use this to contain all of your metric definitions.

```yaml
models:
  staging:
  intermediate:
  marts:
  metrics:
```

### File structure

Once you’ve decided ***where*** to put your metrics folder, you can now decide ***how*** you want to structure your metrics within this folder. Choose one of two methods for structuring metrics:

**Option A: The all-in-one YML method**
This method follows a similar pattern to [dbt’s best practices around model structure](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview). The introduction of the metrics folder is the only change from the standard best practice.

In practice, the all-in-one YML method would look like the following:

```yaml
## Metrics within Marts
models:
  marts: 
    metrics:
      - metrics.yml
------
## Metrics within Models
models:
  metrics:
    - metrics.yml
```

**Option B: The single-metric-per-file method**
In this method, you create *one* yml file for *each* metric*.* Although this is an opinionated stance that differs from [dbt’s best practices](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview), here are some reasons why this **could** be useful:

- Individual files are more easily discovered by new analytics engineers as your organization expands
- Individual files can more easily define specific code owners that may not be part of the data team.

For example, Jerry from the Finance department is the code owner for the `revenue` metric definition and oversees it for the business. So, any change to this specific file would need Jerry’s sign-off.

This can be tricky for code owners who aren’t familiar with your git flow, but it brings them into the chain of responsibility for the metric definition. It also helps them take ownership for reporting on this metric and creates a responsible party when definitions need to change.

The single-file-code-owner method would look like this:

```yaml
models:
  metrics:
    marts:
      - revenue.yml
      - average_order_value.yml
      - some_other_metric_name.yml
```

### Folder and file structure is a preference, not a hard rule

In the end, all of the structuring information above is just a recommendation. Your project probably has a defined convention in how nodes are organized, whether or not it follows dbt best practices, and you should continue to follow your own organizational practices. That said, we do recommend that metrics should be separate from model yml files. The reason?

**Metrics are important business objects unto themselves and should live separate from the model definitions.**

## A call to action

This is just the beginning of dbt metrics and the Semantic Layer. We have a number of exciting ideas for expanding capabilities that we plan to begin work on in the coming months. However, we can’t do that without you.

This semantic layer is a fundamental change to what it means to interact with dbt and ultimately most of the best practices will come from the dbt Community - folks like you. It does not matter if you consider yourself an "expert" on this - we want to talk to you and hear how you are using or would like to use metrics and the semantic layer.  Y’all are going to be our guiding light to help us make sure that all the functionality we add helps **you** serve the needs of your business.

If your experience with the Semantic Layer match what we’ve written in this post, and especially if they don’t, please share [comments and feedback in this Discourse Discussion](https://discourse.getdbt.com/t/how-to-design-and-structure-metrics/5040)!

Additionally, I would invite you to join us over at #dbt-core-metrics on the dbt Slack where we’ll be posting updates, answering questions, discussing usage, and hopefully responding with the best emojis.
