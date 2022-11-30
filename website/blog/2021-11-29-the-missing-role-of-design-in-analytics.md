---
title: "The (Missing) Role of Design in Analytics"
description: "Opportunities to make the shift from building dashboards to designing analytical applications."
slug: design-for-analytics-towards-analytical-applications

authors: [seth_rosen]

tags: [analytics craft]
hide_table_of_contents: false

date: 2021-11-29
is_featured: false
---

If you’ve spoken to me lately, follow me on [Twitter](https://twitter.com/sethrosen), or have taken my order at [Wendy’s](https://i.ytimg.com/vi/_oMc4eD9-XM/maxresdefault.jpg), you probably know how much I hate traditional dashboards. My dad, a psychotherapist, has been working with me to get to the root of my upbringing that led to this deep-rooted feeling.

<!--truncate-->

As it turns out, the cause of my feelings towards traditional dashboarding are actually quite obvious. Before entering the field of data, I spent my entire career as a product manager working alongside user experience designers and engineers on cross-functional product teams.

When building software, getting users to actually use the product is no easy feat. The smallest amount of friction can cause a user to abandon the flow. Add enough friction to any product and users and engagement will drop dramatically.  As analysts, we know this intuitively. We are constantly measuring retention, cohorts, and engagement within our business.

These principles also apply to analytics. The more friction there is in analytics and the less we focus on the user, the less our output will be used. So it makes me wonder why, within the field of data, is design thinking often so absent?


## Why are we lacking design thinking in analytics?

Painting with broad strokes, design is generally not something that is a top priority for data teams. There are a few primary reasons that I see off the top:

1. Data teams think within the limitations of their current tools, not the ideal user experience.
2. Traditional Dashboards have become so commoditized that there is a perception that anyone can build good ones.
3. There is a belief that analytics ends at the data visualization, not the user experience.
4. There is a general misconception that the overall look and feel does not matter in data analytics.
5. Stakeholders often ask for a “dashboard” when they actually need something else (with more functionality).

These more or less boil down to data teams running like service teams rather than [product teams](https://locallyoptimistic.com/post/run-your-data-team-like-a-product-team/)—when you always give the squeakiest wheel the grease, it’s impossible to put in the strategic effort that design thinking requires.

One solution I proposed back in 2019 is hiring a [data product manager](https://www.hashpath.com/2019/11/why-your-organization-may-need-a-data-product-manager/), which seems to be picking up a bit of steam. But what would that person actually do?

 I have attempted to sum the solutions to these complex issues into a table of overly-simplified do’s and don’ts:

<table>
  <tr>
   <td>Don’t
   </td>
   <td>Do
   </td>
  </tr>
  <tr>
   <td>Think only within the constraints of your current tooling.
   </td>
   <td>First define the ideal user experience, irrespective of tooling.  
   </td>
  </tr>
  <tr>
   <td>Think users can simply build their own solution given a self-service interface.
   </td>
   <td>Recognize that hard ongoing problems require a design-focused analyst.
   </td>
  </tr>
  <tr>
   <td>Stop at the data visualization.
   </td>
   <td>Think about how to group visualizations, the interactions, and purpose-built exploratory flows.
   </td>
  </tr>
  <tr>
   <td>Ignore look and feel.
   </td>
   <td>Think about the overall aesthetics of your output.
   </td>
  </tr>
  <tr>
   <td>Just respond to tickets and user requests.
   </td>
   <td>Truly try to understand the problem and design the appropriate solution.
   </td>
  </tr>
</table>

## The Full-Stack Analyst and Analytical Applications

An analyst who can gather the necessary data, transform it into the analytics-ready format, and understand & analyze it is an incredible asset to your team. An analyst who can also build a user experience around it is unstoppable.

If you think about the workflow for an analyst, a simple process might go something like this:

1. Initial exploratory analysis and ad-hoc queries
2. Model data in dbt
3. Build out data visualizations
4. Write tests/monitor performance

But, you might also consider adding the following to your workflow.

1. Build user stories and use cases: Work with the end-user to understand exactly why they need the data and what decisions they need to make. Generally speaking, do not ask them to define the solution. That’s your job.
2. Build out wireframes and user flows: A very quick sketch of the end-user experience can be shared for discussion. This might get some really great feedback about how the user may end up using the data.
3. Build out the user interface: Break free from the traditional dashboard design and implement the design which truly solves the pain.

In order to realize the full potential of the ["full stack analyst"](https://roundup.getdbt.com/p/seth-rosen-topcoat)”, we must apply the principles of design to be part of our workflows. We should shift our thinking from making traditional dashboards to building user-centric [analytical applications](https://towardsdatascience.com/the-analytical-application-stack-eead8ce6b70).

This simple shift from thinking in “dashboards” towards thinking in “analytical applications” is one of the key changes which has helped me be more design-focused.

Here are a few examples:


<table>
  <tr>
   <td><strong>Traditional Dashboards</strong>
   </td>
   <td><strong>Analytical Applications</strong>
   </td>
  </tr>
  <tr>
   <td>Built for generic use cases
   </td>
   <td>Purpose-built for specific use cases
   </td>
  </tr>
  <tr>
   <td>Standard dashboard interactions
   </td>
   <td>Interactive based on the desired workflow
   </td>
  </tr>
  <tr>
   <td>Fixed, static layout
   </td>
   <td>Dynamic layout determined by logic
   </td>
  </tr>
  <tr>
   <td>Each element is a tile
   </td>
   <td>Elements can be grouped and purposefully-arranged
   </td>
  </tr>
  <tr>
   <td>Filters are global
   </td>
   <td>Users have preferences and their own defaults
   </td>
  </tr>
  <tr>
   <td>Minimal software development lifecycle
   </td>
   <td>Strong SDLC to promote user trust
   </td>
  </tr>
  <tr>
   <td>Look and feel are ignored
   </td>
   <td>Custom look and feel to match company products
   </td>
  </tr>
  <tr>
   <td>Low bar for performance
   </td>
   <td>High bar for performance
   </td>
  </tr>
</table>


## An Example: Weather Applications

Let’s take a look at one of the OG analytical applications: the weather forecast.

Like most people, I rely on weather apps to make all sorts of decisions throughout the day. We are fortunate  to have very smart and talented user experience designers working on these apps.

[![twitter screenshot](/img/blog/analyst-ux-twitter.png)](https://twitter.com/sethrosen/status/1455176609288396807)

Here are a few examples from AccuWeather and the decisions it enables me to make:

![weather app screenshots](/img/blog/analyst-ux-weather.png)

While the data being presented in the weather app could technically be presented in any dashboarding tool, the designers of this app agonized about every screen, interaction, and component to build a bespoke experience.  

When it is done right, the user has everything they need to make quick decisions and take appropriate actions.

It’s worth noting this simple weather app is purpose-built for everyday weather situations. There are some use cases where highly specific information may be needed by a particular subset of users.

For example, surfers want different information. Ultimately, they may want an overall "Surf or don't surf" recommendation. Additionally, pilots could never simply rely on AccuWeather. These use cases warrant their own user-centered, purpose-built experiences.


## The missing piece of the puzzle

While a design process can help you build better analytics output, there is still a missing part of the analytics stack to enable true user-centered design.

How would you, today, build out a weather-like application?

Traditional dashboarding tools limit the user experience and prevent purpose-built applications from being created. Luckily our tools are evolving to meet the needs of the data consumer.

I encourage you to explore these new tools as much as possible and to work design into your analytics workflows. I’m always up for chatting, especially about this - my DMs are always open on [Twitter](https://twitter.com/sethrosen).
