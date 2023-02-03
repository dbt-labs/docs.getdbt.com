---
title: "February 2023 dbt Update"
description: "The latest product updates from dbt Labs"
slug: dbt-product-update-2023-february
# authors: [lauren_craigie] 

tags: [dbt updates]
hide_table_of_contents: false

date: 2023-02-03
is_featured: false
---
Last month I asked my group chat what date was *too* late to open work conversations with "Happy New Year." Most said January 15th. No one said anything close to February 2nd/3rd but here we are... Happy New Year! 🎉 It’s been awhile since I’ve last seen you, and there’s lots to share. Read on for the latest in dbt Cloud + new tools and resources.

<!--truncate-->

## **What's new**

*What you might have missed this quarter*

- **[dbt utils v1.0 is live](https://docs.getdbt.com/guides/migration/versions/upgrading-to-dbt-utils-v1.0).** Pay close attention to the changes in surrogate key generation, and don’t miss [this developer blog post](https://docs.getdbt.com/blog/grouping-data-tests) from dbt utils contributor Emily Riederer discussing the new ability to run grouped checks.
- **[dbt-databricks adapter is now available in dbt Cloud](https://docs.getdbt.com/guides/migration/tools/migrating-from-spark-to-databricks#migration)**. The new adapter that dropped in November is easier to set up, has better defaults for developing on Databricks, and supports Unity Catalog (on dbt v1.1+).
- **[dbt natively supports Python.](https://www.getdbt.com/blog/introducing-support-for-python/)** As of October, you can deploy Python models alongside your SQL ones, enjoying a single view of lineage across both.
- **[dbt Semantic Layer hit Public Preview](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-semantic-layer)** for Snowflake users in October. Centrally define metrics in your dbt project, and enable anyone to query them from their preferred Semantic Layer integrated tooling.

![https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202023-02-01%20at%209.55.51%20PM.png?upscale=true&width=600&upscale=true&name=Screen%20Shot%202023-02-01%20at%209.55.51%20PM.png](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202023-02-01%20at%209.55.51%20PM.png?upscale=true&width=600&upscale=true&name=Screen%20Shot%202023-02-01%20at%209.55.51%20PM.png)

## **What's Better?**

- **[The new dbt Cloud IDE](https://www.getdbt.com/blog/new-improved-cloud-ide/)** is live, and available to everyone. It’s faster, more intuitive, and includes some neat quality-of-life features like git diff view, autocomplete, a code formatter, and an improved syntax highlighting.
- **[Custom node colors in the dbt DAG](https://www.getdbt.com/blog/announcing-dbt-v1.3-and-utils/).** Color coding your DAG makes it *much* easier to understand your project at a glance. Read about this update, as well as other dbt Core v1.3 improvements.
- **[New Service Bundles](https://www.getdbt.com/blog/revamped-professional-services):** The dbt Labs Pro Services team is re-launching its services offerings with new bundles and engagement models, making it simpler for customers to find an engagement scope that works for them.
- **Removing defaults:** “Run on schedule” is no longer the default setting when creating a new job definition in the dbt Cloud UI. No more accidentally scheduled jobs + unwanted runs.

## **New Resources**

*Check out the **[dbt Developer Hub](https://docs.getdbt.com/)** for all-in-one location to learn, engage with peers, and contribute to the craft of analytics engineering.*

- **[How we cut our tests by 80% while increasing data quality: the power of aggregating test failures in dbt](https://docs.getdbt.com/blog/aggregating-test-failures-with-dbt)** by Noah Kennedy at Tempus
- **[How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics)** by Callum McCann, dbt Labs
- **[Auto-scaling CI: The intelligent CI](https://docs.getdbt.com/blog/intelligent-slim-ci)** by Doug Guthrie, dbt Labs
- **[Spin up a dbt+Postgres environment](https://discourse.getdbt.com/t/spin-up-a-dbt-postgres-environment-with-a-single-click-in-vs-code-for-demos-and-interview-assignments/5285/1)** with Panasenco’s template for creating quick demo environments via VS Code.
- **[Query the dbt Semantic Layer via dbt](https://github.com/Delphi-Data/dbt_natural_language)** with the Delphi API.
- **[Generate some dogs](https://www.loom.com/share/e33fdfa062dd4764b828002f6cffbf6a)** in the IDE, on the house. 🐶

![https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202023-02-01%20at%208.12.43%20PM.png?upscale=true&width=600&upscale=true&name=Screen%20Shot%202023-02-01%20at%208.12.43%20PM.png](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202023-02-01%20at%208.12.43%20PM.png?upscale=true&width=600&upscale=true&name=Screen%20Shot%202023-02-01%20at%208.12.43%20PM.png)

---

## **Weekend Reads**📚

*New resources from the community*

- **[ELT eBook for data analysts](https://go.fivetran.com/ebooks/modernize-your-data-transformation-skills-and-accelerate-your-career?utm_medium=partners&utm_source=dbtlabs&utm_campaign=WCT-2022-Q4-Global-FMRR-Modernize-transformaton-skills-and-accelerate-career&utm_content=ebook)**: If you’ve got friends in the data team that aren’t fully up to speed on how the data transformation space has evolved, and how they might get involved, this new ebook from Fivetran and dbt Labs can help!
- **[The long-awaited Part III of Jonathan Talmi’s blog on dbt at Super](https://medium.com/super/dbt-at-super-part-3-observability-c8755109901f)** covering observability! Don't miss previous chapters on CI and orchestration.
- **[Sydney Bang's journey to Spotify Analytics Engineer:](https://medium.com/@sydneybang18/how-i-became-an-analytics-engineer-at-spotify-2-years-after-graduating-with-an-exercise-science-e756e9eff6ca)** If you were wondering what a "typical" AE career path looks like... you might be surprised.

## **Places to Go** 🌎

*dbt meetups and events happen all around the globe. Check out our [events page](https://www.getdbt.com/events/) to find one in your area!*

- **[Nasdaq on dbt Cloud:](https://www.getdbt.com/resources/nasdaq-fireside-chat//?utm_medium=event&utm_source=hs_email&utm_campaign=q1-2024_nasdaq-fireside-chat_awareness)** Virtual Feb 16. Hear how Brian Taylor, PM for Market Platforms, uses dbt Cloud to inform faster pricing and product decisions.
- **[Hex + dbt Labs](https://hex.tech/events/inventa-delivers-operational-analytics/?utm_id=h_7015f000000VLkDAAW&utm_campaign=hexcontent&utm_medium=hex%20event&utm_source=dbt)**: Virtual Feb 15. Learn how [Inventa](https://inventa.shop/) replaced manual workflows with a live Hex app, powered by dbt's Semantic Layer.
- **[Barcelona:](https://www.meetup.com/barcelona-dbt-meetup/events/291138340/)** In-person Meetup Feb 9, hosted by Spaulding Ridge
- **[London:](https://www.meetup.com/london-dbt-meetup/events/290846280/)** In-person Meetup Feb 9, hosted by Datatonic
- **[Auckland:](https://www.getdbt.com/resources/mdsc-countdown/)** In-person event Feb 16, hosted by Countdown
- **[Chicago:](https://www.meetup.com/chicago-dbt-meetup/events/290180068/)** In-person Meetup Feb 16, hosted by Analytics8
- **[San Francisco](https://www.getdbt.com/resources/data-dates-sf/?utm_medium=event&utm_source=marketing&utm_campaign=q1-2024_data_dates_event_awareness)**: In-person event Feb 16, hosted by dbt Labs, ThoughtSpot, Fivetran, & InterWorks

## **Consulting Corner** 🌎

*A few incredibly helpful pieces from our partner network, including many on how to optimize your dbt implementation 🔥*

- **[Querying dbt metrics](https://aimpointdigital.com/querying-dbt-metrics/)** - Aimpoint Digital shows how to use dbt Metrics via the Proxy Server if your BI tool if it isn't yet integrated with the dbt Semantic Layer.
- **[Simplifying Data Validation with dbt Data Audit](https://medium.com/slalom-build/simplifying-data-validation-with-dbt-ba492d216abe)** Slalom shares how to speed up query validation with the dbt-audit-helper package.
- **[A Guide to Passing the dbt Analytics Engineering Certification](https://aimpointdigital.com/guide-passing-dbt-analytics-engineering-certification/)**  Join 500+ dbt certified analytics engineers with Aimpoint’s latest guide!