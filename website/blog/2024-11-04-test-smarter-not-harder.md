---
title: "Test smarter not harder: add the right tests to your dbt project"
description: "Testing your data should drive action, not accumulate alerts. We synthesized countless customer experiences to build a repeatable testing framework."
slug: test-smarter-not-harder

authors: [faith_mckenna, jerrie_kumalah_kenney]

tags: [analytics craft]
hide_table_of_contents: false

date: 2024-11-11
is_featured: true
---



The [Analytics Development Lifecycle (ADLC)](https://www.getdbt.com/resources/guides/the-analytics-development-lifecycle) is a workflow for improving data maturity and velocity. Testing is a key phase here. Many dbt developers tend to focus on [primary keys and source freshness.](https://www.getdbt.com/blog/building-a-data-quality-framework-with-dbt-and-dbt-cloud) We think there is a more holistic and in-depth path to tread. Testing is a key piece of the ADLC, and it should drive data quality.

In this blog, we’ll walk through a plan to define data quality. This will look like:

- identifying *data hygiene*  issues
- identifying *business-focused anomaly*  issues
- identifying *stats-focused anomaly*  issues

Once we have *defined* data quality, we’ll move on to *prioritize* those concerns. We will:

- think through each concern in terms of the breadth of impact
- decide if each concern should be at error or warning severity

<!-- truncate -->

### Who are we?

Let’s start with introductions - we’re Faith and Jerrie, and we work on dbt Labs’s training and services teams, respectively. By working closely with countless companies using dbt, we’ve gained unique perspectives of the landscape.  

The training team collates problems organizations think about today and gauge how our solutions fit. These are shorter engagements, which means we see the data world shift and change in real time. Resident Architects spend much more time with teams to craft much more in-depth solutions, figure out where those solutions are helping, and where problems still need to be addressed. Trainers help identify patterns in the problems data teams face, and Resident Architects dive deep on solutions.

Today, we’ll guide you through a particularly thorny problem: testing.

## Why testing?

Mariah Rogers broke early ground on data quality and testing in her [Coalesce 2022 talk](https://www.youtube.com/watch?v=hxvVhmhWRJA). We’ve seen similar talks again at Coalesce 2024, like [this one](https://www.youtube.com/watch?v=iCG-5vqMRAo) from the data team at Aiven and [this one](https://www.youtube.com/watch?v=5bRG3y9IM4Q&list=PL0QYlrC86xQnWJ72sJlzDqPS0peE7j9Ed&index=71) from the co-founder at Omni Analytics. These talks share a common theme: testing your dbt project too much can get out of control quickly, leading to alert fatigue.

In our customer engagements, we see *wildly different approaches* to testing data. We’ve definitely seen what Mariah, the Aiven team, and the Omni team have described, which is so many tests that errors and alerts just become noise. We’ve also seen the opposite end of the spectrum—only primary keys being tested. From our field experiences, we believe there’s room for a middle path.
A desire for a better approach to data quality and testing isn’t just anecdotal to Coalesce, or to dbt’s training and services. The dbt community has long called for a more intentional approach to data quality and testing - data quality is on the industry’s mind! In fact, [57% of respondents](https://www.getdbt.com/resources/reports/state-of-analytics-engineering-2024) to dbt’s 2024 State of Analytics Engineering survey said that data quality is a predominant issue facing their day-to-day work.

### What does d@tA qUaL1Ty even mean?!

High-quality data is *trusted* and *used frequently.* It doesn’t get argued over or endlessly scrutinized for matching to other data. Data *testing* should lead to higher data *quality* and insights, period.

Best practices in data quality are still nascent. That said, a lot of important baseline work has been done here. There are [case](https://medium.com/@AtheonAnalytics/mastering-data-testing-with-dbt-part-1-689b2a025675) [studies](https://medium.com/@AtheonAnalytics/mastering-data-testing-with-dbt-part-2-c4031af3df18) on implementing dbt testing well. dbt Labs also has an [Advanced Testing](https://learn.getdbt.com/courses/advanced-testing) course, emphasizing that testing should spur action and be focused and informative enough to help address failures. You can even enforce testing best practices and dbt Labs’s own best practices using the [dbt_meta_testing](https://hub.getdbt.com/tnightengale/dbt_meta_testing/latest/) or [dbt_project_evaluator](https://github.com/dbt-labs/dbt-project-evaluator) packages and dbt Explorer’s [Recommendations](https://docs.getdbt.com/docs/collaborate/project-recommendations) page.

The missing piece is still cohesion and guidance for everyday practitioners to help develop their testing framework.

To recap, we’re going to start with:

- identifying *data hygiene* issues
- identifying *business-focused anomaly* issues
- identifying *stats-focused anomaly* issues

Next, we’ll prioritize. We will:

- think through each concern in terms of the breadth of impact
- decide if each concern should be at error or warning severity

Get a pen and paper (or a google doc) and join us in constructing your own testing framework.

## Identifying data quality issues in your pipeline

Let’s start our framework by *identifying* types of data quality issues.

In our daily work with customers, we find that data quality issues tend to fall into one of three broad buckets: *data hygiene, business-focused anomalies,* and *stats-focused anomalies.* Read the bucket descriptions below, and list 2-3 data quality concerns in your own business context that fall into each bucket.

### Bucket 1: Data hygiene

*Data hygiene* issues are concerns you address in your [staging layer.](https://docs.getdbt.com/best-practices/how-we-structure/2-staging) Hygienic data meets your expectations around formatting, completeness, and granularity requirements. Here are a few examples.

- *Granularity:* primary keys are unique and not null. Duplicates throw off calculations.
- *Completeness:* columns that should always contain text, *do.* Incomplete data often has to get excluded, reducing your overall analytical power.
- *Formatting:* email addresses always have a valid domain. Incorrect emails may affect things like marketing outreach.

### Bucket 2: Business-focused anomalies

*Business-focused anomalies* catch unexpected behavior. You can flag unexpected behavior by clearly defining *expected* behavior. *Business-focused anomalies* are when aspects of the data differ from what you know to be typical in your business. You’ll know what’s typical either through your own analyses, your colleagues’ analyses, or things your stakeholder homies point out to you.

Since business-focused anomaly testing is set by a human, it will be fluid and need to be adjusted periodically. Here’s an example.

Imagine you’re a sales analyst. Generally, you know that if your daily sales amount goes up or down by more than 20% daily, that’s bad. Specifically, it’s usually a warning sign for fraud or the order management system (OMS) dropping orders. You set a test in dbt to fail if any given day’s sales amount is a delta of 20% from the previous day. This works for a while.

Then, you have a stretch of 3 months where your test fails 5 times a week! Every time you investigate, it turns out to be valid consumer behavior. You’re suddenly in hypergrowth, and sales are legitimately increasing that much.

Your 20%-change fraud and OMS failure detector is no longer valid. You need to investigate anew which sales spikes or drops indicate fraud or OMS problems. Once you figure out a new threshold, you’ll go back and adjust your testing criteria.

Although your data’s expected behavior will shift over time, you should still commit to defining business-focused anomalies to grow your understanding of what is normal for your data.

Here’s how to identify potential anomalies.

Start at your business intelligence (BI) layer. Pick 1-3 dashboards or tables that you *know* are used frequently. List these 1-3 dashboards or tables. For each dashboard or table you have, identify 1-3 “expected” behaviors that your end-users rely on.  Here are a few examples to get you thinking:

- Revenue numbers should not change by more than X% in Y amount of time. This could indicate fraud or OMS problems.
- Monthly active users should not decline more than X% after the initial onboarding period. This might indicate user dissatisfaction, usability issues, or that users not finding a feature valuable.
- Exam passing rates should stay above Y%.  A decline below that threshold may indicate recent content changes or technical issues are affecting understanding or accessibility.

You should also consider what data issues you have had in the past! Look through recent data incidents and pick out 3 or 4 to guard against next time. These might be in a #data-questions channel or perhaps a DM from a stakeholder.

### Bucket 3: Stats-focused anomalies

*Stats-focused anomalies* are fluctuations that go against your expected volumes or metrics.  Some examples include:

- Volume anomalies. This could be site traffic amounts that may indicate illicit behavior, or perhaps site traffic dropping one day then doubling the next, indicating that a chunk of data were not loaded properly.
- Dimensional anomalies, like too many product types underneath a particular product line that may indicate incorrect barcodes.
- Column anomalies, like sale values more than a certain number of standard deviations from a mean, that may indicate improper discounting.

Overall, stats-focused anomalies can indicate system flaws, illicit site behavior, or fraud, depending on your industry. They also tend to require more advanced testing practices than we are covering in this blog. We feel stats-based anomalies are worth exploring once you have a good handle on your data hygiene and business-focused anomalies. We won’t give recommendations on stats-focused anomalies in this post.

## How to prioritize data quality concerns in your pipeline

Now, you have a written and categorized list of data hygiene concerns and business-focused anomalies to guard against. It’s time to *prioritize* which quality issues deserve to fail your pipelines.

To prioritize your data quality concerns, think about real-life impact. A couple of guiding questions to consider are:

- Are your numbers *customer-facing?* For example, maybe you work with temperature-tracking devices. Your customers rely on these devices to show them average temperatures on perishable goods like strawberries in-transit. What happens if the temperature of the strawberries reads as 300C when they know their refrigerated truck was working just fine? How is your brand perception impacted when the numbers are wrong?
- Are your numbers *used to make financial decisions?* For example, is the marketing team relying on your numbers to choose how to spend campaign funds?
- Are your numbers *executive-facing?* Will executives use these numbers to reallocate funds or shift priorities?

We think these 3 categories above constitute high-impact, pipeline-failing events, and should be your top priorities. Of course, adjust priority order if your business context calls for it.

Consult your list of data quality issues in the categories we mention above. Decide and mark if any are customer facing, used for financial decisions, or are executive-facing. Mark any data quality issues in those categories as “error”. These are your pipeline-failing events.

If any data quality concerns fall outside of these 3 categories, we classify them as **nice-to-knows**. **Nice-to-know** data quality testing *can* be helpful. But if you don’t have a *specific action you can immediately take* when a nice-to-know quality test fails, the test *should be a warning, not an error.*

You could also remove nice-to-know tests altogether. Data testing should drive action. The more alerts you have in your pipeline, the less action you will take. Configure alerts with care!

However, we do think nice-to-know tests are worth keeping *if and only if* you are gathering evidence for action you plan to take within the next 6 months, like product feature research. In a scenario like that, those tests should still be set to warning.

### Start your action plan

Now, your data quality concerns are listed and prioritized. Next, add 1 or 2 initial debugging steps you will take if/when the issues surface. These steps should get added to your framework document. Additionally, consider adding them to a [test’s description.](https://discourse.getdbt.com/t/is-it-possible-to-add-a-description-to-singular-tests/5472/4)

This step is *important.* Data quality testing should spur action, not accumulate alerts. Listing initial debugging steps for each concern will refine your list to the most critical elements.

If you can't identify an action step for any quality issue, *remove it*. Put it on a backlog and research what you can do when it surfaces later.

Here’s a few examples from our list of unexpected behaviors above.

- For calculated field X, a value above Y or below Z is not possible.
  - *Debugging initial steps*
    - Use dbt test SQL or recent test results in dbt Explorer to find problematic rows
    - Check these rows in staging and first transformed model
    - Pinpoint where unusual values first appear
- Revenue shouldn’t change by more than X% in Y amount of time.
  - *Debugging initial steps:*
    - Check recent revenue values in staging model
    - Identify transactions near min/max values
    - Discuss outliers with sales ops team

You now have written out a prioritized list of data quality concerns, as well as action steps to take when each concern surfaces. Next, consult [hub.getdbt.com](http://hub.getdbt.com) and find tests that address each of your highest priority concerns. [dbt-expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/) and [dbt_utils](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/) are great places to start.

The data tests you’ve marked as “errors” above should get error-level severity. Any concerns falling into that nice-to-know category should either *not get tested* or have their tests *set to warning.*

Your data quality priorities list is a living reference document. We recommend linking it in your project’s README so that you can go back and edit it as your testing needs evolve. Additionally, developers in your project should have easy access to this document. Maintaining good data quality is everyone’s responsibility!

As you try these ideas out, come to the dbt Community Slack and let us know what works and what doesn’t. Data is a community of practice, and we are eager to hear what comes out of yours.
