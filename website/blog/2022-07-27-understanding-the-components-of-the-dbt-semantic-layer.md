---
title: "Understanding the components of the dbt Semantic Layer"
description: "Heard about dbt Metrics or the dbt Semantic Layer and curious to give them a try? Callum McCann digs into what they are, walks through an example, and discusses how they all fit together!"
slug: understanding-the-components-of-the-dbt-semantic-layer

authors: [callum_mccann]

tags: [dbt product updates]
hide_table_of_contents: false

date: 2022-07-27
is_featured: true
---

# Getting started with the dbt Semantic Layer

> TLDR: The Semantic Layer is made up of a combination of open-source and SaaS offerings and is going to change how your team defines and consumes metrics.

At last year's Coalesce, Drew showed us the future[^1] - a vision of what metrics in dbt could look like. Since then, we've been getting the infrastructure in place to make that vision a reality. We wanted to share with you where we are today and how it fits into the broader picture of [where we're going](https://www.getdbt.com/blog/dbt-semantic-layer).

To those who haven't followed this saga with the intensity of [someone watching their investments on the crypto market](https://mobile.twitter.com/scannergr1/status/1536198701215109122/photo/1), we're rolling out this new resource to help you better understand the dbt Semantic Layer and provide clarification on the following things:

1. What is the dbt Semantic Layer?
2. How do I use it?
3. What is publicly available now?
4. What is still in development?

With that, lets get into it!

<!--truncate-->

> Some of you might have been around when this was initially being referred to as the Metrics Layer. As we evaluated the long term plans for what this part of dbt was going to become, we realized that naming it the Semantic Layer better reflected its capabilities and where we plan on taking it. 

## What is the dbt Semantic Layer?

The dbt Semantic Layer is a new part of dbt to help improve precision and consistency while expanding flexibility and capability in the modern data stack. Our maestro of metrics, Drew Banin, [released a blog post detailing the vision of where we're going here](https://www.getdbt.com/blog/dbt-semantic-layer). The first use case that we are addressing is one that most practicioners **and** stakeholders are familiar with - metrics. We'll walk through what this looks like in practice later on in this post.

Under the hood, the dbt Semantic layer is collection of several components - some of these are part of dbt Core, some part of dbt Cloud, and some are net new functionality. They all [combine together like Voltron](https://www.youtube.com/watch?v=5rPSLQxMT8w) to create a single experience through which business users can query data in the context of the metric that is most familiar to them. And the best part is that they can do it in systems they are already comfortable using.

***What will this look like for my data consumers and business stakeholders?*** 

Ultimately, this looks like people being able to interact with trusted datasets in the tools that they are comfortable with (and eventually new tools designed specifically around metrics). 

An example that we’ve found helpful is [ARR](https://www.zuora.com/billing-topics/annual-recurring-revenue/#:~:text=Annual%20Recurring%20Revenue%2C%20or%20ARR,for%20a%20single%20calendar%20year). A business-critical metric to SaaS companies, ARR can be a tricky calculation to keep consistent across all of the tools used in the business. With the dbt Semantic Layer, this definition would live in dbt and the logic to create the dataset for that metric would be consistent across all different consuming experiences. Best of all, definition changes would get reflected in downstream tools, so you no longer need to manually search and update every downstream dependency. Callum of 3 years ago is jumping with joy.

***That’s good and all, but what does this look like for practitioners to use?*** 

The dbt Semantic layer is comprised of the following components[^2]:

**Available Today**

- **[`metric` node in dbt Core :](https://docs.getdbt.com/docs/building-a-dbt-project/metrics)** Similar to `models` or `sources` , this is a specific node type in dbt Core. It is the definition of a time-series aggregation over a table that supports zero or more dimensions. The resulting node is stored in the `manifest.json` just like `models` and referenced in the DAG.
- **[`dbt_metrics` package:](https://github.com/dbt-labs/dbt_metrics)** this package provides macros that combine the version-controlled metric definition and query-time parameters (like dimensions, a time grain, and secondary calculations) to generate a SQL query which calculates the metric value.
- **[dbt Cloud Metadata API](https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api):** a GraphQL API which supports arbitrary queries over the metadata produced by dbt Cloud jobs. Contains metadata related to the accuracy, recency, configuration, and structure of the views and tables in the warehouse, as well as much more.

**New**

- **dbt Server:** this component wraps dbt Core in a persistent server that is responsible for handling RESTful API requests for dbt operations. It’s a thin interface that is primarily responsible for performance and reliability in production environments.
- **dbt Cloud proxy server:** this component enables dbt Cloud to dynamically rewrite requests to a data warehouse and compile dbt-SQL into raw SQL that the database understands. It then returns the dataset produced by the raw SQL to the platform that sent it. 

![Untitled](/img/blog/2022-07-27-getting-started-with-the-dbt-semantic-layer/semantic-layer-description.png)

### Understanding how and when to use metrics?

> Use of metrics and the metrics package is recommended for experienced dbt users and early adopters who want to explore this functionality.

Let's walk through an example of how you can use the components above to get started today using our old friend - [the Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics). We'll take a look at how you can start defining and testing metrics today as well as how you'll interact with them once the new components are released.

**When to use Metrics**

The first question you need to ask is, *Should we be using metrics?* 

It is our belief that metrics are not a one-size fits all solution. They are designed for core business metrics where consistency and precision are of key importance, not for exploratory use cases or ad hoc analysis. Our shorthand way of determining whether the metric should be defined in dbt has been - *is this something our teams need to report on?*

So, let’s say the CFO of our Jaffle comes to us on a Monday morning and commands the data team to overhaul how we're reporting on Revenue. Our Regional Manager Jim and Sales Director Pam[^3] have been giving him different reports! Right now its a mess of tools and inconsistencies - Jim’s numbers are defined in Tableau and say one thing, Pam’s within Hex and say another! The CFO is frustrated with it and wants a cohesive experience across the company where everyone has the same numbers for revenue. It passes the report test, it’s an important business metric; away we go!

**Defining the Metric with Metric Node**

In this example, we’ll say that both Jim and Pam are pulling from a table created by dbt called `orders`. It currently contains fields for `amount` and all different methods of payment_amounts, such as credit cards or gift cards.  Jim has been calculating revenue by summing up the `credit_card_amount` and `gift_card_amount` fields, as he forgot to update his definition when the business added coupons and bank transfers payments. Meanwhile, Pam is correctly summing the `amount` field but hasn’t accounted for return orders that shouldn’t be counted!

The first step is creating a unified definition for what revenue is. In order to do this, we will create the following yml definition within our dbt repo: 

```yaml
version: 2

metrics:
  - name: revenue
    label: Revenue
    model: ref('orders')
    description: "The total revenue of our jaffle business"

    type: sum
    sql: amount

    timestamp: order_date
    time_grains: [day, week, month, year]

    dimensions:
      - customer_status
      - has_coupon_payment
      - has_bank_transfer_payment
      - has_credit_card_payment
      - has_gift_card_payment

    filters:
      - field: status
        operator: '='
        value: "'completed'"
```

This metric has now been defined in the dbt metadata and can be seen in the DAG! 

![Untitled](/img/blog/2022-07-27-getting-started-with-the-dbt-semantic-layer/metrics-dag.png)

**Running The Metric Package To calculate the metric**

In order to ensure that both Jim and Pam are retrieving the same numbers for their metric, we’ll need them to both run a metrics `calculate` query. In this example, we’re not interested in the specific payment types and only want to see revenue broken up by `week` and `customer_status`.

```sql
select * 
from {{ metrics.calculate(
    metric('revenue'),
    grain='week',
    dimensions=['customer_status']
) }}
```
This would return a dataset that looks like this:

| date_week | customer_status | revenue |
| --- | --- | --- |
| 2018-01-01 | Churn Risk | 43 |
| 2018-01-01 | Churned | 0 |
| 2018-01-01 | Healthy | 26 |
| 2018-01-08 | Churn Risk | 27 |

Jim and Pam would then be able to reference the `revenue` column within the newly created dataset and never have to worry about the calculation of revenue ever again[^4]! The world is perfect and [balance has been restored.](https://www.youtube.com/watch?v=d1EnW4kn1kg) 

**In the near future with dbt Server**

When dbt Server releases later this year, the flow of how metrics are consumed will change significantly. Your organization will no longer need to materialize each metric within a model in order to take advantage of the metric definition. Instead, you’ll be able to directly query dbt Server with the metric code provided and have the correct dataset returned to your BI tool of choice. 

Additionally, integration partners will have built out experiences around Metrics using the Metadata API to create unique and creative ways for consumers to obtain metric data while abstracting away complexity. For example, a box that allows the user to select from a list of metrics, time grains, dimensions, and secondary calculation and then have the correct information returned to them regardless of the selection!

### So what is publicly available now?

Right now, the two main open-source components that are publicly available are the [`metric` node](https://docs.getdbt.com/docs/building-a-dbt-project/metrics) within dbt Core and the `dbt_metrics` package. Combined, these two can operate an introductory semantic layer experience by allowing analytics engineers to define metrics and then query that metric via the metrics package. 

These two components are a static experience that have to be defined in the dbt project (as the selected dimensions are defined at model creation) but are useful for those who want to ensure that metrics remain consistent across every BI tool. If you identify with any of the following conditions, you could be a good fit for implementing this as it exists today:

- You want to prepare your organization for the full Semantic Layer launch.
- Your organization has at least a few key metrics
- Your organization uses 1 or more BI tools
- Your organization occasionally has issues around different metric calculations
- Your organization wants a centralized location for all metrics so everyone in the business knows where to look

All of these are great reasons to begin exploring implementing metrics in your dbt project! If you’re curious about what an implementation of this might look like, we recommend referencing the [jaffle_shop_metrics](https://github.com/dbt-labs/jaffle_shop_metrics) repo!

### What is still in development?

Both the dbt Cloud proxy server and dbt Server are currently in development, with a scheduled release of later this year. If you’re curious about testing them once they are released, we recommend keeping an eye on our product announcements and then reaching out once they become publicly available! 

### What if I have questions?

If you have any questions about those components, or metrics in general, please feel free to post in the #dbt-metrics-and-server channel on dbt Slack! I hang around there and am always willing to chat metrics!

### Footnotes
[^1]: That future may not have mentioned robots but I'm holding out for [Jetson's style morning machine](https://www.youtube.com/watch?v=-0S3Jf-NxdI) to help me get ready in the morning.

[^2]: We’re specifically calling out the licensing because there is a lot of confusion in the community around what is open-source and what isn’t. This is only becoming trickier with the introduction of the BSL licensing, which ensures users can run their own server but it cannot be sold as a cloud service. For more information on why these licensing types were picked, we recommend [Tristan’s blog around licensing dbt.](https://www.getdbt.com/blog/licensing-dbt/). The big takeaway around licensing is that you can still run components of the dbt Semantic Layer even if you aren’t a dbt Cloud customer! 

[^3]: Full transparency, I've never seen the Office. The awkward humor makes me so uncomfortable that I have to turn off the TV. Apologies if the titles of the characters are incorrect.

[^4]: Psych! They’re definitely interested in the calculation of ARR. In fact, they don’t really trust the numbers **unless** they understand how it’s calculated. This is where they could use the Metadata API in order to query all the information about the metric, such as definition, run-time, acceptable dimensions, etc. Right now Jim and Pam would need to query the API directly but in the future we expect there to be a number of different ways to obtain this information, ranging from [direct integration with the BI tool](https://learn.hex.tech/docs/connect-to-data/data-connections/dbt-integration) all the way to having that information materialized in a dbt information schema! *For current tabular alternatives, there are some interesting macros in the newly released [dbt-project-evaluator package](https://github.com/dbt-labs/dbt-project-evaluator). Take a look there if you’re curious about materializing your metric information!*