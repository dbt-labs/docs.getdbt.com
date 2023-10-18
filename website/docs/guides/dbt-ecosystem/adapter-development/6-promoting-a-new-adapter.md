---
title: "Promoting a new adapter"
id: "6-promoting-a-new-adapter"
---

## Model for engagement in the dbt community

The most important thing here is recognizing that people are successful in the community when they join, first and foremost, to engage authentically. 

What does authentic engagement look like? It’s challenging to define explicit rules. One good rule of thumb is to treat people with dignity and respect. 

Contributors to the community should think of contribution *as the end itself,* not a means toward other business KPIs (leads, community members, etc.). [We are a mission-driven company.](https://www.getdbt.com/dbt-labs/values/) Some ways to know if you’re authentically engaging:

- Is an engagement’s *primary* purpose of sharing knowledge and resources or building brand engagement?
- Imagine you didn’t work at the org you do &mdash; can you imagine yourself still writing this?
- Is it written in formal / marketing language, or does it sound like you, the human?

## Who should join the dbt community slack

### People who have insight into what it means to do hands-on [analytics engineering](https://www.getdbt.com/analytics-engineering/) work

The dbt Community Slack workspace is fundamentally a place for analytics practitioners to interact with each other &mdash; the closer the users are in the community to actual data/analytics engineering work, the more natural their engagement will be (leading to better outcomes for partners and the community).

### DevRel practitioners with strong focus

DevRel practitioners often have a strong analytics background and a good understanding of the community. It’s essential to be sure they are focused on *contributing,* not on driving community metrics for partner org (such as signing people up for their slack or events). The metrics will rise naturally through authentic engagement.

### Founder and executives who are interested in directly engaging with the community

This is either incredibly successful or not at all depending on the profile of the founder. Typically, this works best when the founder has a practitioner-level of technical understanding and is interested in joining not to promote, but to learn and hear from users.

### Software Engineers at partner products that are building and supporting integrations with either dbt Core or dbt Cloud

This is successful when the engineers are familiar with dbt as a product or at least have taken our training course. The Slack is often a place where end-user questions and feedback is initially shared, so it is recommended that someone technical from the team be present. There are also a handful of channels aimed at those building integrations, which tend to be a font of knowledge.

### Who might struggle in the dbt community
#### People in marketing roles
dbt Slack is not a marketing channel. Attempts to use it as such invariably fall flat and can even lead to people having a negative view of a product. This doesn’t mean that dbt can’t serve marketing objectives, but a long-term commitment to engagement is the only proven method to do this sustainably.

#### People in product roles
The dbt Community can be an invaluable source of feedback on a product. There are two primary ways this can happen &mdash; organically (community members proactively suggesting a new feature) and via direct calls for feedback and user research. Immediate calls for engagement must be done in your dedicated #tools channel. Direct calls should be used sparingly, as they can overwhelm more organic discussions and feedback.

## Who is the audience for an adapter release

A new adapter is likely to drive huge community interest from several groups of people:
- People who are currently using the database that the adapter is supporting
- People who may be adopting the database in the near future.
- People who are interested in dbt development in general.
    
The database users will be your primary audience and the most helpful in achieving success. Engage them directly in the adapter’s dedicated Slack channel. If one does not exist already, reach out in #channel-requests, and we will get one made for you and include it in an announcement about new channels.
    
The final group is where non-slack community engagement becomes important. Twitter and LinkedIn are both great places to interact with a broad audience. A well-orchestrated adapter release can generate impactful and authentic engagement.
    
## How to message the initial rollout and follow-up content
    
Tell a story that engages dbt users and the community. Highlight new use cases and functionality unlocked by the adapter in a way that will resonate with each segment. 

### Existing users of your technology who are new to dbt

- Provide a general overview of the value dbt will deliver to your users. This can lean on dbt's messaging and talking points which are laid out in the [dbt viewpoint.](/community/resources/viewpoint)
  - Give examples of a rollout that speaks to the overall value of dbt and your product.

### Users who are already familiar with dbt and the community
- Consider unique use cases or advantages your adapter provide over existing adapters. Who will be excited for this?
- Contribute to the dbt Community and ensure that dbt users on your adapter are well supported (tutorial content, packages, documentation, etc).
- Example of a rollout that is compelling for those familiar with dbt: [Firebolt](https://www.linkedin.com/feed/update/urn:li:activity:6879090752459182080/)

## Tactically manage distribution of content about new or existing adapters

There are tactical pieces on how and where to share that help ensure success.

### On slack:
- #i-made-this channel &mdash; this channel has a policy against “marketing” and “content marketing” posts, but it should be successful if you write your content with the above guidelines in mind. Even with that, it’s important to post here sparingly.
- Your own database / tool channel &mdash; this is where the people who have opted in to receive communications from you and always a great place to share things that are relevant to them.

### On social media:
- Twitter
- LinkedIn
- Social media posts *from the author* or an individual connected to the project tend to have better engagement than posts from a company or organization account.
- Ask your partner representative about:
    - Retweets and shares from the official dbt Labs accounts.
    - Flagging posts internally at dbt Labs to get individual employees to share.

## Measuring engagement

You don’t need 1000 people in a channel to succeed, but you need at least a few active participants who can make it feel lived in. If you’re comfortable working in public, this could be members of your team, or it can be a few people who you know that are highly engaged and would be interested in participating. Having even 2 or 3 regulars hanging out in a channel is all that’s needed for a successful start and is, in fact, much more impactful than 250 people that never post.

## How to announce a new adapter

We’d recommend *against* boilerplate announcements and encourage finding a unique voice. That being said, there are a couple of things that we’d want to include:

- A summary of the value prop of your database / technology for users who aren’t familiar.
- The personas that might be interested in this news.
- A description of what the adapter *is*.  For example:
  > With the release of our new dbt adapter, you’ll be able to to use dbt to model and transform your data in [name-of-your-org]
- Particular or unique use cases or functionality unlocked by the adapter.
- Plans for future / ongoing support / development.
- The link to the documentation for using the adapter on the dbt Labs docs site.
- An announcement blog.

## Announcing new release versions of existing adapters

This can vary substantially depending on the nature of the release but a good baseline is the types of release messages that [we put out in the #dbt-releases](https://getdbt.slack.com/archives/C37J8BQEL/p1651242161526509) channel.

![Full Release Post](/img/adapter-guide/0-full-release-notes.png)

Breaking this down:

- Visually distinctive announcement - make it clear this is a release
    <Lightbox src="/img/adapter-guide/1-announcement.png" title="title"/>
- Short written description of what is in the release
    <Lightbox src="/img/adapter-guide/2-short-description.png" title="description"/>
- Links to additional resources
   <Lightbox src="/img/adapter-guide/3-additional-resources.png" title="more resources"/>
- Implementation instructions:
    <Lightbox src="/img/adapter-guide/4-installation.png" title="more installation"/>
- Future plans
    <Lightbox src="/img/adapter-guide/5-coming-up.png" title="coming soon"/>
- Contributor recognition (if applicable)
    <Lightbox src="/img/adapter-guide/6-thank-contribs.png" title="thank yous"/>
