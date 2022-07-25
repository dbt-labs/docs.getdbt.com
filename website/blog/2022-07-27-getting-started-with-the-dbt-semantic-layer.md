---
title: "Getting Started With The dbt Semantic Layer"
description: "There's been a lot of discussion around dbt Metrics and what they are. Callum Mccann clarifies what the Semantic Layer is, what is available today, and how one can already begin to use parts of it!"
slug: getting-started-with-the-dbt-semantic-layer

authors: [callum_mccann]

tags: [dbt product updates]
hide_table_of_contents: false

date: 2022-07-27
is_featured: true
---

# Getting Started With The dbt Semantic Layer

## Intro

<aside>
📔 TLDR: The Semantic Layer is made up of a combination of open-source and SaaS offerings and is going to change how you consume and define metrics.

</aside>

In recent months, we’ve seen a lot of excitement (and some understandable confusion) in the community around what the dbt Semantic Layer is. This is completely understandable, as elements of this “layer” are currently available while others aren’t. To those who aren’t following this saga with the intensity of [someone watching their investments on the crypto market](https://mobile.twitter.com/scannergr1/status/1536198701215109122/photo/1), we hope this blog can provide clarification on the following things:

1. What is the dbt semantic layer?
2. How do I use it?
3. What is publicly available now?
4. What is still in development?

With that, lets get into it!

<aside>
❗ Some of you might be confused - you’ve seen us talk about the Metrics Layer in the past and now we’re talking about the Semantic Layer. Well, what was previously called the Metrics Layer has been re-branded to the “Semantic Layer” in order to better reflect our long term plans. Today’s functionality focus largely on metrics but tomorrow’s will expand to be a programmatic interface to the DAG, to better understand entities and what models represent, and much more. Drew’s post about the future of the Semantic Layer explains this far better.

</aside>

## What is the dbt Semantic Layer?

The dbt semantic layer is a combination of several components - some of these are part of `dbt-core`, some part of `dbt Cloud` (our SaaS offering), and some are net new functionality. They all [combine together like Voltron](https://www.youtube.com/watch?v=5rPSLQxMT8w) to create a single experience through which business users can query data in a context that is familiar to them — metrics. And the best part is that they can do it in systems they are already comfortable using.

***What will this look like for my data consumers and business stakeholders?*** 

Ultimately, this looks like people being able to interact with trusted datasets in the tools that they are comfortable with (and eventually new tools designed specifically around metrics). 

An example that we’ve found helpful is [ARR](https://www.zuora.com/billing-topics/annual-recurring-revenue/#:~:text=Annual%20Recurring%20Revenue%2C%20or%20ARR,for%20a%20single%20calendar%20year). A business-critical metric to SaaS companies, ARR can be a tricky calculation to keep consistent across all of the tools used in the business. With the semantic layer, this definition would live in dbt and the logic to create the dataset for that metric would be consistent across all different consuming experiences. Best of all, definition changes would get reflected in downstream tools, so you no longer need to manually search and update every downstream dependency. Callum of 3 years ago is jumping with joy.

***That’s good and all, but what does this look like for practitioners to use?*** 

We’re building it with the following components:

**Available Today**

- `**[metric` node in `dbt-core` :](https://docs.getdbt.com/docs/building-a-dbt-project/metrics)** Similar to `models` or `sources` , this is a specific node type in `dbt-core`. It is the definition of a time-series aggregation over a table that supports 0+ dimensions. The resulting metadata is stored in the `manifest` just like `models` and referenced in the DAG.
- `**[dbt_metrics` package:](https://github.com/dbt-labs/dbt_metrics)** this package provides macros that take in metric information regarding the `metrics` defined by users and then produces the necessary SQL to return the dataset containing that metric along with any other parameters defined (secondary calculations, specific dimensions, time grain, etc).
- **[dbt Cloud Metadata API](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview):** a GraphQL API which supports arbitrary queries over the metadata produced by dbt Cloud jobs. Contains metadata related to the accuracy, recency, configuration, and structure of the views and tables in the warehouse, as well as much more.

**Forthcoming**

- **dbt Server:** this component wraps dbt Core in a persistent server that is responsible for handling RESTful API requests for dbt operations. It’s a thin interface that is primarily responsible for performance and reliability in production environments.
- **dbt Cloud proxy server:** this component enables dbt Cloud to intercept requests to a database and compile dbt-SQL into raw SQL that the database understands. It then returns the dataset produced by the raw SQL to the platform that sent it.

![Untitled](/img/blog/2022-07-27-getting-started-with-the-dbt-semantic-layer/semantic-layer-description.png)

### Understanding how and when to use metrics?

Let’s walk through a jaffle shop example of how you can use the components listed above to get started with the semantic layer today, as well as what it might look like once the forthcoming components are released.

Say your CFO comes to you on a Monday morning and commands the data team to overhaul how the company is reporting on Revenue. Right now its a mess of tools and inconsistencies - Jim’s numbers are defined in Tableau and say one thing, Pam’s within Hex and say another! The CFO is frustrated with it and wants a cohesive experience across the company where everyone has the same numbers for revenue. 

**Defining the Metric with Metric Node**

In this example, we’ll say that both Jim and Pam are pulling from a table created by dbt called `orders`. It currently contains fields for `amount` and all `payment_amounts`. Jim has been calculating revenue by summing up the `credit_card_amount` and `gift_card_amount` fields, as he forgot to update his definition when the business added coupons and bank transfers payments. Meanwhile, Pam is correctly summing the `amount` field but hasn’t accounted for return orders that shouldn’t be counted!

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

**Running The Metric Package To Calculate the Metric**

<aside>
❗ In the future, this is where Jim and Pam would directly query the proxy server to obtain the metric data (aka revenue). We will now cover what you can do with metrics today.

</aside>

In order to ensure that both Jim and Pam are pulling from the same dataset with the same definition, we’ll want to create a model that materializes this metric for them - this ensures that they’ll always get the same answer for ARR.

Creating a new model called `revenue.sql` , we’ll enter the following macro to call the metrics package. In this example, we’re not interested in the specific payment types and only want to see revenue broken up by `week`and `customer_status`. 

```sql
select * 
from {{ metrics.metric(
    metric_name='revenue',
    grain='week',
    dimensions=['customer_status']
) }}
```

This would return a dataset that looks like this:

| period | customer_status | revenue |
| --- | --- | --- |
| 2018-01-01 | Churn Risk | 43 |
| 2018-01-01 | Churned | 0 |
| 2018-01-01 | Healthy | 26 |
| 2018-01-08 | Churn Risk | 27 |

Jim and Pam would then be able to reference the `revenue` column within the newly created dataset and never have to worry about the calculation of revenue ever again! The world is perfect and [balance has been restored.](https://www.youtube.com/watch?v=d1EnW4kn1kg) 

**In the near Future with dbt Server and dbt Cloud proxy Server**

When dbt Server and the dbt Cloud proxy Server release later this year, the flow of how metrics are consumed will potentially change significantly. Your organization will no longer need to materialize each metric within a model in order to take advantage of the metric definition. Instead, you’ll be able to directly query the proxy server with the metric code provided and have the correct dataset returned to your BI tool of choice. 

Additionally, integration partners will have built out experiences around Metrics using the Metadata API to create unique and creative ways for consumers to obtain metric data while abstracting away complexity. For example, a box that allows the user to select from a list of metrics, time grains, dimensions, and secondary calculation and then have the correct information returned to them regardless of the selection!

This is an exciting future where data can be consumed in the context of how most people think about it - **metrics.**

### So what is publicly available now?

Right now, the two main open-source components that are publicly available are the `metric` node within `dbt-core` and the `dbt_metrics` package. Combined, these two can operate a simplistic semantic layer experience by allowing analytics engineers to define metrics and then use that metric with the package to materialize a table that contains the value for that metric on the defined date range. 

It is limited in dimension flexibility (as the selected dimensions have to be defined at model creation) but is useful for those who want to ensure that metrics remain consistent across every BI tool. If you identify with any of the following conditions, you could be a good fit for implementing this as it exists today:

- Your organization has at least a few key metrics
- Your organization uses 1 or more BI tools
- Your organization occasionally has issues around different metric calculations
- You want to set your organization up for the dbt proxy server.
- Your organization wants a centralized location for all metrics so everyone in the business knows where to look

All of these are great reasons to begin exploring implementing metrics in your dbt project! If you’re curious about what an implementation of this might look like, we recommend referencing the [jaffle_shop_metrics](https://github.com/dbt-labs/jaffle_shop_metrics) repo!

### What is still in development?

Both the dbt Cloud proxy server and dbt Server are currently in development, with a scheduled release of later this year. If you’re curious about testing them once they are released, we recommend keeping an eye on our product announcements and then reaching out once they become publicly available! 

### What if I have questions?

If you have any questions about those components, or metrics in general, please feel free to post in the #dbt-metrics-and-server channel on dbt Slack! The author of this post hangs around there and is always willing to chat metrics!

### Footnotes

---

---

We’re specifically calling out the licensing because there is a lot of confusion in the community around what is open-source and what isn’t. This is only becoming trickier with the introduction of the BSL licensing, which ensures users can run their own server but it cannot be sold as a cloud service. For more information on why these licensing types were picked, we recommend [Tristan’s blog around licensing dbt.](https://www.getdbt.com/blog/licensing-dbt/) 

The big takeaway around licensing is that you can still run components of the semantic layer even if you aren’t a dbt Cloud customer! More on that later.

**Referencing the Metadata (API)**

Psych! They’re definitely interested in the calculation of ARR. In fact, they don’t really trust the numbers **unless** they understand how it’s calculated. This is where they could use the Metadata API in order to query all the information about the metric, such as definition, run-time, acceptable dimensions, etc. 

Right now Jim and Pam would need to query the API directly but in the future we expect there to be a number of different ways to obtain this information, ranging from [direct integration with the BI tool](https://hex.tech/integrations/dbt) all the way to having that information materialized in a dbt information schema!

*For current tabular alternatives, there are some interesting macros in the newly released [dbt-project-evaluator package](https://github.com/dbt-labs/dbt-project-evaluator). Take a look there if you’re curious about materializing your metric information!*

- **Memes**
    
    **Memes:**
    
    ![Screen Shot 2022-06-21 at 1.42.58 PM.png](Getting%20Started%20With%20The%20dbt%20Semantic%20Layer%20To%20Met%20e7cb105269474558a812c9e8aab07c42/Screen_Shot_2022-06-21_at_1.42.58_PM.png)
    
    **Voltron Combine:**
    
    [https://www.youtube.com/watch?v=5rPSLQxMT8w](https://www.youtube.com/watch?v=5rPSLQxMT8w)
    
    **Bringing Balance**
    
    [https://www.youtube.com/watch?v=d1EnW4kn1kg](https://www.youtube.com/watch?v=d1EnW4kn1kg)
    
    - Pasta Section
        
        Wow thats a lot of components. How will we keep all of them straight? Let’s follow the example of prophet, Benn Stancil, and break this down with a food metaphor. Is this metaphor a thinly veiled excuse to introduce you all to the best food youtuber? Perhaps. 
        
        **The dbt Metrics Layer, is a [5 Ingredient Risotto Style Pasta.](https://www.youtube.com/watch?v=vKvosQcfh8U)** 
        
        We’ve got the Pasta (dbt-core), some Chicken Broth (dbt_metrics), a handful of Broccolini (dbt Server), a good Italian Sausage (proxy server), and finally some amazing Parmesan Cheese (dbt Cloud API).
        
        We begin with the Pasta of `dbt-core` and chicken broth of `dbt_metrics`. These are the base components of our fledgling pasta server - they’re easy to obtain, affordable/free to all, and great even without all the other ingredients that we’re adding. Together they allow you to define your metric and materialize the dataset all through the lens of dbt macros and yml definitions. These two pieces alone would be a solid meal that would leave you feeling full. The secret is that you cook them both together at the same time, almost like a Risotto. This lets the starch, or all the value of dbt-core, stick around in the dish and not get washed out like normal pasta.
        
        But now we take that great meal and add so much more. 
        
        Next, we add the freshly grated Parmesan cheese of the `dbt Cloud API`. This thickens the sauce of our ‘pasta’ and binds everything together. It helps us query the metrics, understand our run times, get metadata about our projects or environments, and so much more. It tastes great with everything and every dish (data product) could do with a [little bit of dbt Metadata sprinkled on top](https://hex.tech/integrations/dbt).
        
        I’m well aware that this metaphor is running out of legs but you best believe I’m gonna finish on it. 
        
        Finally, we finish up with the hearty parts of our dish. The Brocollini of `dbt Server` and the Italian Sausage of the `proxy Server`. These two take a dish that you’ve had before (but not nearly as good as the style above) and take it to a new level of culinary satisfaction - elevate it to a new audience of consumers who wouldn’t have considered a bowl of data before. They’ve always consumed their metrics on a plate. With the two server components, we can serve it in a bowl, on a plate, or even straight onto the *google* sheet. 
        
        We lost it a bit there at the end but the promise of the metric layer is that it standardizes the entire data experience across whatever method the consumer is most familiar with. And dbt is able to accomplish this with the preceding 5 components!
        

![Untitled](Getting%20Started%20With%20The%20dbt%20Semantic%20Layer%20To%20Met%20e7cb105269474558a812c9e8aab07c42/Untitled%202.png)