---
title: "November 2021 dbt Update: v1.0, Environment Variables, and a Question About the Size of Waves 🌊"
description: "Stay up-to-date with the latest features in dbt. Read about our November 2021 product update."
slug: dbt-product-update-2021-november
authors: [lauren_craigie] 

hide_table_of_contents: false

date: 2021-11-15
is_featured: false
---

Hi there,

Before I get to the goods, I just wanted to quickly flag that Coalesce is less than 3 weeks away! 😱 If you had to choose just ONE of the 60+ sessions on tap, consider [Tristan's keynote with A16z's Martin Casado](https://coalesce.getdbt.com/talks/keynote-how-big-is-this-wave/?utm_medium=email&utm_source=hs_email&utm_campaign=h2-2021_coalesce-2021_awareness&utm_content=connect_prod-2_&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo).

It has two of my favorite elements:

1) Spice 🌶️

2) Not-actually-about-us 😅

Martin and Tristan will discuss something we've all probably considered with the latest wave of innovation (and funding) in our space:

*Is the modern data stack just another wave in a long string of trendy technologies, or is it somehow more permanent?*

Hear their take, and share your own by [registering here](https://coalesce.getdbt.com/talks/keynote-how-big-is-this-wave/?utm_medium=email&utm_source=hs_email&utm_campaign=h2-2021_coalesce-2021_awareness&utm_content=connect_prod-2_&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo).

<!--truncate-->

## **What's New**
--------------

### dbt v1.0.0rc1:
- Check out the [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) channel in the dbt Community Slack, and Jeremy's [Discourse post](https://discourse.getdbt.com/t/prerelease-dbt-core-v1-0-0-b1/3180?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo)!

-   A first release candidate of v1.0 is now live! 🎉 I've talked about v1.0 a bit, but this version also includes a new logging interface, and a start at the [metrics issue](https://github.com/dbt-labs/dbt-core/issues/4071?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) mentioned last month *(Drew will have a lot more to say about that at [Coalesce](https://coalesce.getdbt.com/talks/keynote-building-a-force-of-gravity/?utm_medium=ema%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo)!)*

### dbt v0.21.1: 
- Check out the [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) channel in the dbt Community Slack!

-   A release candidate for v0.21.1 is available, with an official release coming next week. This release resolves some [slowdown issues](https://github.com/dbt-labs/dbt-core/issues/4012?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) encountered in large projects on v0.21.0.

### dbt Cloud v1.1.38 - v1.1.39: *Changelog + docs located [here.](https://docs.getdbt.com/docs/dbt-cloud/cloud-changelog?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo)*

-   [Environment Variables](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-environment-variables?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) have landed in dbt Cloud! Clone private packages, limit data processed in dev environments, and a whole lot more

## New Resources 
--------------

### Things to Try 🛠️

-   New Course! If you're new to dbt and wondering how to migrate legacy transformation code into modular dbt data models, our new [Refactoring course](https://blog.getdbt.com/sql-refactoring-course/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) can help! *It's also just 3.5hrs, so no excuses* 🙂 

### Things to Read 📚

-   The [dbt Discourse](https://discourse.getdbt.com/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) has been a great place for asking long-form questions, and sharing helpful how-to's like [this insanely popular piece](https://discourse.getdbt.com/t/how-we-sped-up-our-ci-runs-by-10x-using-slim-ci/2603?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) on 10x-ing CI runs using Slim CI. But to collect more knowledge from across our community, we need a bigger boat. Stay tuned for the solution, arriving November 29th 👀
-   Can you guess the #1 job title of Coalesce registrants? 🛎️ Data Engineer! But you don't have to be one to get value out of the 60+ sessions on offer that week. Check out [this blog](https://blog.getdbt.com/coalesce-returns-for-year-two-this-december/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) by the Coalesce Queen herself to help you decide which sessions are right for you.

### Things to Listen To 🎧

- Julien Le Dem joined the [Analytics Engineer Podcast](https://roundup.getdbt.com/p/ep-10-why-data-lineage-matters-w?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) to talk about how OS projects become standards, and why <Term id="data-lineage" /> in particular is in need of an open standard. 

-   [The rise of the Analytics Engineer](https://youtu.be/ixyzF4Dy9Us?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo): Anna, dbt Labs Director of Community, joined Thoughtspot to talk about the evolution of analytics engineering, or the emergence of the "full stack data analyst."


That's all for now! See you at Coalesce!

*Lauren Craigie*  
*Director of Product Marketing, dbt Labs*
