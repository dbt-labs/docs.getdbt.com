# Contributing

## Want to get involved? Start here

The dbt Community predates dbt Labs as an organization and harkens back to the days when a scrappy analytics consultancy of a few [pissed off data analysts](https://www.hashpath.com/2020/12/an-analytics-engineer-is-really-just-a-pissed-off-data-analyst/#:~:text=Often%20times%2C%20an%20analytics%20engineer,necessity%20(and%20genius%20branding).) started hacking together an open source project around which gathered a community that would change how the world uses data.  

[The dbt Community](https://www.getdbt.com/community/) exists to allow analytics practitioners to share their knowledge, help others and collectively to drive forward the discipline of analytics engineering. This is something that can’t be done by any one individual or any one organization - to create a new discipline is necessarily a community effort. The **only** reason that dbt has become as widespread as it has is because people like you choose to get involved and share your knowledge. Contributing to the community can also be a great way to learn new skills, build up a public portfolio and make friends with other practitioners.

There are opportunities here for everyone to get involved. Whether you are just beginning your analytics engineering journey or you are a seasoned data professional - contributing isn’t about knowing all of the answers, it’s about learning things together.

Below - you’ll find a sampling of the ways to get involved. It might feel complicated or like there are a lot of options - but these are ultimately just variations on the theme of sharing knowledge with the broader community.

<Collapsible header="Writing" description="Contribute docs, guide, articles, and other recorded knowledge." expand="false">

### Contribute to the product documentation

#### What is it

The [dbt Product Documentation](https://docs.getdbt.com/docs/introduction) sits at the heart of how people learn to use and engage with dbt. From explaining dbt to newcomers to providing references for advanced functionality and APIs, the product docs are a frequent resource for *every* dbt Developer.

#### Contribution opportunities

We strive to create pathways that inspire you to learn more about dbt and enable you to continuously improve the way you solve data problems. We always appreciate the vigilance of the Community helping us to accurately represent the functionality and capabilities of dbt. You can participate by:

- [Opening an issue](https://github.com/dbt-labs/docs.getdbt.com/issues/new/choose) when you see something that can be fixed, whether it’s large or small.
- Creating a PR when you see something you want to fix, or to address an existing issue. You can do this by clicking **Edit this page** at the bottom of any page on [docs.getdbt.com](http://docs.getdbt.com).

#### Sample contributions

We appreciate these contributions because they contain context in the original post (OP) that helps us understand their relevance. The also add value to the docs, even in small ways!

- Larger contribution: https://github.com/dbt-labs/docs.getdbt.com/pull/1898
- Smaller contribution: https://github.com/dbt-labs/docs.getdbt.com/pull/1114

#### How to get started

- You can contribute to [docs.getdbt.com](http://docs.getdbt.com) by looking at our repository’s [README](https://github.com/dbt-labs/docs.getdbt.com#readme) or clicking **Edit this page** at the bottom of most pages at docs.getdbt.com.
- Read the [OSS Expectations](https://docs.getdbt.com/docs/contributing/oss-expectations).
- Find an issue labeled “[good first issue](https://github.com/dbt-labs/docs.getdbt.com/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22+).”
- Need help: Visit #community-writers on the Community Slack or mention `@dbt-labs/product-docs` in a pull request or issue comment.

### Write a Developer Blog Post

#### What is it

The [dbt Developer Blog](https://docs.getdbt.com/blog) is the place for analytics practitioners to talk about *what it’s like to do data work right now.* This is the place to share tips and tricks, hard won knowledge and stories from the trenches with the dbt Community.

#### Contribution opportunities

We want to hear your stories! Did you recently solve a cool problem, discover an interesting bug or lead an organizational change? Come tell the story on the dbt Developer Blog.

#### Sample contributions

- [Founding an Analytics Engineering Team From Scratch](https://docs.getdbt.com/blog/founding-an-analytics-engineering-team-smartsheet#our-own-take-on-data-mesh)
- [Tackling the Complexity of Joining Snapshots](https://docs.getdbt.com/blog/joining-snapshot-complexity)

#### How to get started

- [Read the contribution guide](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/developer-blog.md)
- [Open up an issue with your idea for a post](https://github.com/dbt-labs/docs.getdbt.com/issues/new?assignees=&labels=content%2Cdeveloper+blog&template=contribute-to-developer-blog.yml)

#### Need help?

Visit #community-writers in the dbt Community Slack

</Collapsible>

<Collapsible header="Coding" description="Contribute code and feedback to dbt Labs' open source software projects." expand="false">

### Contribute to dbt Packages

#### What is it

[dbt Packages](https://docs.getdbt.com/docs/building-a-dbt-project/package-management) are the easiest way for analytics engineers to get involved with contributing code to the dbt Community, because dbt Packages are just **standard [dbt Projects](https://docs.getdbt.com/docs/building-a-dbt-project/projects). If you can create a dbt Project, write a macro, and ref a model: you can make a dbt Package. Packages function much like libraries do in other programming languages. They allow for prewritten, modularized development of code to solve common problems in analytics engineering.  You can view all dbt Packages on the [dbt Package Hub](https://hub.getdbt.com/).

#### Contribution opportunities

- Create a new package for the dbt Package Hub. This might be a new set of macros or tests that have been useful to you in your projects, a set of models for engaging with a commonly used datasource or anything else that can be done from within a dbt project.
- Improve an existing package: Alternatively you can help improve an existing package. This can be done by creating and engaging with Issues or by functionality to address an existing issue via opening a PR.

#### Sample contributions

- [dbt Expectations](https://hub.getdbt.com/calogica/dbt_expectations/latest/)
- [dbt Artifacts](https://hub.getdbt.com/brooklyn-data/dbt_artifacts/latest/)

#### How to get started

- Use packages in your own projects! The best way to know how to improve a package is to use it in a production environment then look for ways it can be modified or improved.
- Read the following resources on package development:
- [So You Want to Build a dbt Package](https://docs.getdbt.com/blog/so-you-want-to-build-a-package)
- [Package Best Practices](https://github.com/dbt-labs/hubcap/blob/main/package-best-practices.md)
- Need help: Visit #package-ecosystem in the dbt Slack

### Contribute to dbt open source software

#### What is it

dbt Core, adapters, tooling, and the sites powering the Package Hub and Developer Hub are all vibrant open source projects. Unlike dbt Packages, contributing code to these projects typically requires some working knowledge of programming languages outside of SQL and Jinja, but the supportive community around these repositories can help you advance those skills. Even without contributing code, there are many ways to be part of open source development in these projects, detailed below. You can find a curated list of the most active OSS projects that dbt Labs supports [here](https://www.notion.so/OSS-Projects-3c4755bb3d6c4315bd7d000d5f47d2bc).

#### Contribution opportunities

There are three primary ways to contribute to the dbt OSS projects. We’ll use dbt Core as an example, as it’s the most active and mature OSS project we support, and a great place to start for newcomers:

- [Open an issue](https://github.com/dbt-labs/dbt-core/issues/new/choose) to suggest an improvement or give feedback.
- Comment / engage on existing [issues](https://github.com/dbt-labs/dbt-core/issues) or [discussions](https://github.com/dbt-labs/dbt-core/discussions). This could be upvoting issues that would be helpful for your organization, commenting to add nuance to a feature request or sharing how a feature would impact your dbt usage.
- Create a pull request that resolves an open Issue. This involves writing the code and tests that add the feature/resolve the bug described in an Issue, and then going through the code review process asynchronously with a dbt Labs engineer.

#### Sample contributions

- TODO (waiting on PMs and devs)

#### How to get started

- Read the dbt Core [contribution guide](https://github.com/dbt-labs/dbt-core/blob/main/CONTRIBUTING.md) and the [OSS Expectations](https://docs.getdbt.com/docs/contributing/oss-expectations) — these will give you a good sense of the expectations for contributors on dbt Labs-supported OSS projects.
- If contributing to dbt Core, find an issue labeled “[good first issue](https://github.com/dbt-labs/dbt-core/issues?q=is%3Aopen+is%3Aissue+label%3Agood_first_issue)”, or look for similar labels on other repositories. If in doubt, also feel free to ask the maintainers for a good first issue, they’ll be excited to welcome you!

#### Need help? 

The following channels in the dbt Community Slack are a great place to ask questions:

- #dbt-core-development
- #adapter-ecosystem

</Collapsible>

<Collapsible header="Engaging in online community spaces" description="Interact, learn, teach, and make new friends with the the best analytics engineers and data professionals in the world." expand="false">

### Maintaining a channel in the dbt Community Slack

#### What is it

The dbt Slack is the place for real time conversations with the dbt Community. Slack channels exist to for specific locations, tools, industries and methodologies. In order to make sure that every channel has dedicated attention from a committed community member, we have Community Maintainers who oversee the discussion in particular channels.

#### Contribution opportunities
  
We’re working on compiling a list of existing channels that could benefit from additional community maintainers. In the meantime, feel free to be on the lookout for opportunities to help maintain new channels that are getting spun up by keeping an eye on #channel-requests in the dbt slack.

#### Sample contributions

TODO figure out what goes here

#### How to get started

- Read the guide to [Maintaining a Slack Channel](https://docs.getdbt.com/community/maintaining-a-channel)
- Jump in to threads in #channel-requests for new channels and offer to help maintain or mention that you are interested in helping maintain a channel and we’ll reach out.

### Participating on Discourse

#### What is it
[GitHub Discussions](https://github.com/dbt-labs/docs.getdbt.com/discussions) are the dbt community’s platform for long-lived discussions about dbt, analytics engineering, and analytics. They’re a place for us to build up a long-lasting knowledge base around the common challenges, opportunities, and patterns we work with every day.

#### How is Discourse different from other community platforms?

- Compared to threads in the dbt Community Slack, GitHub Discussions are more asynchronous, long lived and intentional. Conversations on Slack are great for quick back and forths, but are hard to reference over time and not as good at building long-lasting community knowledge.
- Compared to drafting a blog post for the Developer Blog, GitHub Discussions have a faster iteration loop, require no direct intervention from the dbt Labs team and are more focused around interacting with others’ views on a given topic or question. A good Discussion can be focused around asking a question you’d like feedback on or it can be sharing an idea that you’re not quite ready to turn into a fully fledged blog post.

#### Contribution opportunities

Asking and answering questions. It is tremendously valuable to help answer community questions around dbt, data modeling or analytics in general. These discussions are what allows us to find gaps in our best practices, documentation and other recommendation, as well as to get folks onboarded and understanding dbt. Remember - it’s a mitzvah to answer a question.

#### Sample contributions

- TODO: find some good Discourse examples

#### How to get started

- Read [Long-Lived Discussions](https://docs.getdbt.com/docs/contributing/long-lived-discussions-guidelines) and why they are important to the dbt Community
- Head over to the “[I Need Help With](https://github.com/dbt-labs/docs.getdbt.com/discussions/categories/i-need-help-with)” section of the GitHub discussions board and look for areas to hop in! Remember - you don’t need to know the exact answer to a question to be able to provide helpful context.

</Collapsible>

<Collapsible header="Engaging in realtime community events" description="Participate in realtime events in-person or online to share knowledge and build community all over the globe." expand="false">

### Speak at a Meetup

#### What is it
Meetups are a place to engage and interact with your fellow dbt Community members (in person when possible but sometimes online). We’ve got X Meetup Attendees in Y cities.

#### Contribution opportunities
Give a talk! Meetups are all about sharing your knowledge with other analytics practitioners. Have you recently solved a problem in your data organization, published a package or generally done something of interest to the dbt Community? Meet your local pals and share what you’ve done at a meetup.

#### Sample contributions
TODO find some of these

#### How to get started
Read How to Deliver a Fantastic Meetup Talk
TODO find link for the above

### Speak at Coalesce

#### What is it
[Coalesce](https://coalesce.getdbt.com/) is the annual analytics engineering conference hosted by dbt Labs. While Meetups are focused on sharing knowledge with a specific local hub of the Community - Coalesce is the way to share ideas with everyone. Each year we gather together, take stock of what we’ve learned and pool our best ideas about analytics.

#### Contribution opportunities

- Attend Coalesce:
  - Coalesce is the once a year gathering for analytics engineers. Whether you choose to join online or at one of our in-person events, attending Coalesce is the best way to get an immersive experience of what the dbt Community is like.
- Speak at Coalesce!
  - We’d love to hear what you’ve been working on, thinking about and dreaming up in the analytics engineering space. Coalesce talks can be forward looking views on the industry, deep dives into particular technical solutions

#### Sample contributions

- [Run Your Data Team as a Product Team](https://www.getdbt.com/coalesce-2020/run-your-data-team-as-a-product-team/)
- [Tailoring dbt's incremental_strategy to Artsy's data needs](https://www.getdbt.com/coalesce-2021/tailoring-dbts-incremental-strategy-to-artsys-data-needs/)

#### How to get started

- If registrations are open register at the [Coalesce Site](https://coalesce.getdbt.com/)
- Join #coalesce-updates on the dbt Community Slack

</Collapsible>
