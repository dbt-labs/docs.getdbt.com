---
title: "October 2021 dbt Update: Metrics and Hat Tricks 🎩"
description: "Stay up-to-date with the latest features in dbt. Read about our October 2021 product update."
slug: dbt-product-update-2021-october
authors: [lauren_craigie]

hide_table_of_contents: false

date: 2021-10-15
is_featured: false
---

Hello there,

While I have a lot of fun things to share this month, I can't start with anything other than this:

[![Screen Shot 2021-10-20 at 6.12.16 PM](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202021-10-20%20at%206.12.16%20PM.png?upscale=true&width=800&upscale=true&name=Screen%20Shot%202021-10-20%20at%206.12.16%20PM.png)](https://twitter.com/getdbt/status/1449090582865981442?s=20&utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)

Yep, it's official:

**💥[dbt will support metric definitions](https://github.com/dbt-labs/dbt-core/issues/4071?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)💥**

With this feature, you'll be able to centrally define rules for aggregating metrics (think, "active users" or "MRR") in version controlled, tested, documented dbt project code.

<!--truncate-->

We still have a ways to go, but in future, you'll be able to explore these metrics in the BI and analytics tools that you know and love.

Jeremy (dbt PM) will share more about the metrics layer in his [v1.0 reveal at Coalesce](https://coalesce.getdbt.com/talks/dbt-v10-reveal/?utm_medium=email&utm_source=hs_email%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).

While this topic plays a significant supporting role in [Drew's keynote](https://coalesce.getdbt.com/talks/keynote-building-a-force-of-gravity/?utm_medium=ema%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ), *it's not the whole story*🍿. Drew's talk will tie together several threads across the industry right now, and introduce some *very* exciting futures for dbt and the community as a whole.

*You really don't want to miss this one - [register for free here](https://coalesce.getdbt.com/talks/keynote-building-a-force-of-gravity/?utm_medium=ema%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).*

## What's New
--------------

I've got three really exciting things to share this month!

### dbt v0.21: 
-	Check out the [#dbt-releases](https://getdbt.slack.com/archives/C37J8BQEL?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) channel in the dbt Community Slack for full detail!

-   [dbt build](https://docs.getdbt.com/reference/commands/build?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) is here! 🙌 This command executes everything you'd want to do in the DAG, in order, and does it with attitude *opinions:* Run models, test tests, snapshot snapshots and seed seeds while prioritizing quality and resiliency. Reduce several steps to a single command and bring best practices along for the ride 🚗

### v1.0 beta: 
-	Check out the [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) channel in the dbt Community Slack**, and Jeremy's [Discourse post](https://discourse.getdbt.com/t/prerelease-dbt-core-v1-0-0-b1/3180?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)!*

-   v1.0 is a huge milestone with all the trimmings, including 100x faster project parsing compared to v0.19.0 ⚡. We're excited to celebrate with you during [Jeremy's session at Coalesce](https://coalesce.getdbt.com/talks/dbt-v10-reveal/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ), but until then, we hope you give the [beta a spin](https://getdbt.slack.com/archives/C016X6ABVUK/p1634151813050300?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)! And don't forget to join the [#dbt-v1-readiness](https://getdbt.slack.com/archives/C02HM9AAXL4?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) channel in Slack.

### dbt Cloud v1.1.36 - v1.1.37
-	Changelog + docs located [here.](https://docs.getdbt.com/docs/dbt-cloud/cloud-changelog?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)

-   [Model bottlenecks beta](https://getdbt.slack.com/archives/C02GUTGK73N?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ): Identify long-running models ripe for refactoring (or re-scheduling). The new model timing dashboard in the run detail page helps you quickly assess job composition, order, and duration to optimize your workflows and cut costs💰

 ![image-1](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/image-1.png?upscale=true&width=1120&upscale=true&name=image-1.png)

The Model Timing tab in dbt Cloud highlights models taking particularly long to run.


## New Resources 
--------------

### Things to Try 🛠️

-   Nearly *500* dbt Cloud accounts are using CI. Want to know why? (or maybe... *how?*) Julia breaks it down in her [latest blog](https://blog.getdbt.com/adopting-ci-cd-with-dbt-cloud/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) and shares how to choose and configure continuous delivery or continuous deployment at your organization.
- Hex just [launched an integration](https://hex.tech/blog/dbt-integration?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) with dbt! It uses the [dbt Cloud Metadata API](https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) to surface metadata from dbt right in Hex, letting you quickly get the context you need on things like data freshness without juggling multiple apps and browser tabs. Get started [here](https://docs.hex.tech/connecting-to-data/configuring-data-connections/dbt-integration?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).
-   The [dbt-Rockset adapter](https://github.com/rockset/dbt-rockset?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) (now in beta) just received a major update. It now supports View, Table, Incremental, and Ephemeral materializations to help you perform real-time data transformations on Rockset. Read more [here.](https://rockset.com/blog/real-time-data-transformations-dbt-rockset?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).

### Things to Read 📚

-   Everyone is talking about the next layer of the modern data stack. It's [not a new conversation](https://benn.substack.com/p/metrics-layer?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ), but it is starting to heat up. Anna (dbt Labs Director of Community), does a phenomenal job connecting this week's events in the latest issue of the [Analytics Engineering Roundup](https://roundup.getdbt.com/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).

### Things to Watch 📺

-   [Infrastructure-as-Code and the Modern Data Experience](https://futuredata.brighttalk.live/talk/19069-506932/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)

    At the Future Data Conference last week Tristan noted that data workflows borrow much from software engineering, but haven't really crossed the DevOps chasm. What's missing? Spreadsheets? Actually... *maybe.* 😅 Okay you had to be there. Luckily you still can! Check out the [recording](https://futuredata.brighttalk.live/talk/19069-506932/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).
-   [Modeling behavioral data with Snowplow and dbt](https://get.snowplowanalytics.com/wbn/dbt-and-snowplow/data-modeling/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) (coming up on 10/27).
    Our own Sanjana Sen joins the Snowplow team to talk modeling Snowplow event data in dbt -- including how to structure your data models, best practices to follow, and key pitfalls to avoid.
- How Blend Eliminated Data Silos with dbt and Hightouch.
    Fin-tech behemoth, Blend, processes trillions of dollars in loans (and recently IPO'd). Join this talk with William Tsu (Customer Success Operations at Blend) to learn how adopting dbt and Hightouch has helped them overcome data silos to keep kicking a$$.


That's all for now! Thanks for reading, and as always, *let me know if there's anything else you want to see in these updates!*

*Lauren Craigie*  
*Director of Product Marketing, dbt Labs*
