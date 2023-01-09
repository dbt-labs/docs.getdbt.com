---
title: "Modeling email sends and their associated events"
id: "dbowser-demo"
---

## Everyone’s favorite thing: Modeling email sends and their associated events

You work for a business. Your marketing team send emails to customers, prospects, and everyone in-between. It’s vital for your marketing team to understand how those emails perform to modify subject lines, monitor that they’re not over-spamming folks, and ensure folks are engaging with them. Email platforms are CRMs not usually the best for looking at individual, aggregate, or comparison reporting, which is why many analytics engineering teams choose to model their email data into a unified table.

Why is modeling this data tricky enough to warrant a tutorial? A few reasons:

- **Volume**: If you’re sending multiple emails per week, tracking what happens with those emails, and have thousands of contacts, that’s thousands of rows generated in a short time span. Modeling data at this volume can be intimidating, expensive, and time-consuming.
- **Necessity**: This email data should be directly accessible within an email platform and a business user should be able to look at it there, but generally, because of the volume of data, email platforms don’t support the best analytics infrastructure. So, data teams end up needing to do this data modeling out of necessity to bring into their BI tool.
- **PII**: Emails are sent to real people who have real names, email addresses, and potential physical addresses. Depending on your data team’s governance and PII rules, it’s potentially very important that PII is masked in email data, which inherently adds a layer of complexity during data modeling.

So what are we actually trying to do in this tutorial?

We’ll walk through the common data sources and models required to build up to a final `fct_email_sends` model that captures all email sends, actions, their associated campaign, recipient information, and stats per those dimensions. Your resulting table will ultimately look a little like this:

![Sample  final table](/img/sample_email_data.png)

## Step 1: Explore your sources
In this tutorial, we have 5 sources from HubSpot, a marketing CRM, that are used to ultimately capture email sends. Below, we’ll breakdown what these 5 source tables are and give you some space to explore this raw data.

- `hubspot__marketing_email_campaign`: The raw table of marketing emails and their connection to campaigns in HubSpot.
- `hubspot__marketing_email`: The raw table of all marketing emails and their details (content, author, created date, etc.) in HubSpot, not necessarily connected to campaigns.
- `hubspot__email_event:` A log table of all email events (open/sends/clicks, etc.) with a unique id per email event.
- `hubspot__email_event_sent`: A log of all emails sent from your HubSpot account.
- `hubspot__contact`: The list of contacts in your HubSpot account, as well as some relevant information, such as first name and last name.

For the sake of this tutorial, we’re loading in our sources as [seeds](https://docs.getdbt.com/docs/build/seeds), static CSV files dbt can load into your data warehouse. In reality, if you were doing this with your own HubSpot (or other email platform) connector (via some Fivetran, Stitch, or other ETL tool), you would have this raw data already in your data warehouse and would treat them as [sources](https://docs.getdbt.com/docs/build/sources) in dbt.

Use this first IDE to explore these raw data sources, perform some exploratory data analysis (EDA), and get familiar with your dbt project. No wrong answers here 🙂

<dbtEditor project="dbt_sample_project" step="1" />

## Step 2: Build your staging models

As with any new modeling project in dbt, we always recommend by creating a 1-1 mapping of raw sources with new [staging models](https://docs.getdbt.com/guides/best-practices/how-we-structure/2-staging). These models are meant to perform relatively simple cleanup (type recasting, column renaming, rounding, etc.); they’re not meant to be performing any joins or complex logic.

At this stage, your goal in these models is to simply ensure our raw email source tables have the correct columns selected (and named appropriately), consistent naming conventions are applied across models for similar columns, and filtering of deleted records removed. (We always recommend filtering for removed records earlier in your DAG to improve performance in downstream models).

At the end of this modeling stage, you should have 5 new models (downstream from your sources):

- `stg_hubspot__contacts.sql`
- `stg_hubspot__marketing_email_campaigns.sql`
- `stg_hubspot__marketing_emails.sql`
- `stg_hubspot__email_events.sql`
- `stg_hubspot__email_event_sent.sql`

How would you go about ensuring columns are named properly across models? Which columns do you think you need selected to perform downstream joins?

Use the IDE below to create the staging models listed above. Remember: simpler is better (when it comes to most things in SQL and definitely in staging models 😉).

<!-- <dbtEditor project="dbt_sample_project" /> -->

## Step 3: Develop intermediate models
Getting to the good stuff! [Intermediate models](https://docs.getdbt.com/guides/best-practices/how-we-structure/3-intermediate) are low-key the powerhouse of many dbt projects. These are your atomic building blocks that may be used across different fact and dimensional models and should offer a high-level of flexibility. You’ll be joining, adding in some aggregates and case statements, and really leveraging your SQL skills.

By the end of this stage, you should come out with 4 new models:

- `int_hubspot__email_event_aggregates.sql:` This model captures aggregate counts of core email events (opens/deliveries/clicks/forwards/bounces, etc.) per email send.
- `int_hubspot__marketing_campaigns.sql:` This is a simple model that joins more robust campaign information, such as parent campaign ids, from `stg_hubspot__marketing_campaigns`to `stg_hubspot__marketing_emails`.
- `hubspot__email_event_sent.sql`: Another relatively simple model that joins `stg_hubspot__email_event_sent`, `stg_hubspot__email_event`, and `sgt_hubspot__contacts` together. `stg_hubspot__email_event_sent` and `stg_hubspot__email_event` need to be joined together because `stg_hubspot__email_event` has additional context (associate campaign_id, sent timestamp, and recipient email address) that are needed to join `contacts` to these models and for further downstream use.
- `hubspot__email_sends.sql`: Leverage the newly created `int_hubspot__email_event_aggregates` model to tag on aggregate metrics to `hubspot__email_event_sent` model. Optionally create booleans based off aggregates to create more user-friendly fields (`if count_opens > 1 then 'was_opened'`) for relevant metrics.

Use the IDE below with the already populated new files to fill out what you think should be in them.

<!-- <dbtEditor project="dbt_sample_project" /> -->

## Step 4: Bringing it all together with a final mart model

What you’ve really been waiting for…the final fact model that lives inside a `mart` directory. Don’t panic—this model isn’t doing the heavy work for you since you already did that in your intermediate models. 

As a jogger, this is the structure of the final table we want:
![Sample  final table](/img/sample_email_data.png)

Given all that you’ve accomplished leading up to this, your final `fct_hubspot__email_sends.sql` model is two things:

- Joining distinct campaign info (campaign id, parent campaign id, parent campaign name, email type) from s`tg_hubspot__marketing_campaigns` to your overall email send data (`hubspot__email_sends`).
- Optionally creating a new `status` column that determines the highest status (click, open, delivered, sent) an email has based off of the booleans you created in `hubspot__email_sends` .

Use the IDE below to create your final model using the guidance from above. (Note that if you were to take this code tutorial into your own dbt project, you should have your final model here materialized as a table).

<!-- <dbtEditor project="dbt_sample_project" /> -->
