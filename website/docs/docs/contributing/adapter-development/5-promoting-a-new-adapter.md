---
title: "Promoting a new adapter"
id: "5-promoting-a-new-adapter"
---

## What is the model for engagement in the dbt Community?

- The most important thing here is recognizing that people are successful in the community when they join, first and foremost, to authentically engage. What does authentic engagement look like? It’s hard to have hard and fast rules but a good rule of thumb is to be a good Kantian about it - contributors to the community should think of contribution *as the end itself,* not a means towards other business KPIs (leads, members of their community etc). Profits are exhaust. Some ways to know if you’re authentically engaging:
    - Is the *primary* purpose of an engagement to share knowledge and resources or to build brand engagement?
    - Imagine you didn’t work at the org you do - can you imagine yourself still writing this?
    - Is it written in formal / marketing language or does it sound like you, the human?

## **Who should join the dbt community slack:**

### **People that have insight into what it means to do hands on [analytics engineering](https://www.getdbt.com/analytics-engineering/) work**

The dbt Community Slack workspace is fundamentally a place for analytics practitioners to interact with each other - the closer the folks are in the community to actual data / analytics engineering work the more natural their engagement will be (and as such, the better outcomes for partners + community)

### **DevRel folks who have a strong practitioner focus**

DevRel folks often have a strong analytics background and good understanding of the community. It’s important to be sure that they are focused on *contributing,* not on driving community metrics for partner org (ie sign people up for their slack or events - although this will come naturally through authentic engagement)

### **Founder/execs who are interested in directly engaging in the community**

This is either incredibly successful or not at all depending on the profile of the founder. Typically

### **Software Engineers at partner products that are building and supporting integrations with either dbt Core or dbt Cloud
**
This is successful when the engineers are familiar with dbt as a product or at least have taken our training course

### **Who might struggle in the dbt community:**
  - Folks in marketing roles:
      - dbt Slack is not a marketing channel and attempts to use it as such invariable fall flat and can even lead to people being turned off of your product. Again, this doesn’t mean that dbt can’t serve marketing objectives, but the only proven method to do this sustainably is by along term commitment to engaging
  - (*sometimes*) Folks in product roles:
      - The dbt Community can be an invaluable source of feedback on your product and how to improve it. There are two main ways this can happen - organically (community members proactively suggesting a new feature) and via direct calls for feedback and users research. Direct calls for engagement must be done in your dedicated #tools channel - in general we’d recommend doing this relatively infrequently and with intentionality as they can overwhelm more organic discussions and feedback.

## What is the audience for an adapter release?

A new adapter is likely to drive huge community interest from several groups of people:
- Folks that currently use the database that the adapter is supporting
- Folks that are *interested* in potentially using that database/adapter
- Folks that are interested in dbt development in general.
    
If possible - it’s best to get the adapter in front of each of these groups. The first two will hopefully be found in a dedicated channel for your database. If one does not exist already, reach out in #channel-requests and we will get one made for you and include it in the next announcement about new channels.
    
The third group - is where the non-slack community comes into play. Twitter and LinkedIn are both great places to engage with the community and a well-orchestrated adapter release can generate some great authentic engagement here.
    
## How should we message our initial rollout and follow-up content?
    
The goal here is to tell the a story that is engaging to your users and the dbt Community. This means highlighting new use cases / functionality unlocked by this adapter in a way that will particularly resonate with for each segment. Note that there is a slight tension between what each of these two audiences may find interesting.

### For existing users of your technology new to dbt:
  - A more general overview of what the value of dbt is and why it’s useful to your users. This can lean on general dbt messaging and talking points which are laid out in the [dbt viewpoint.](https://docs.getdbt.com/docs/about/viewpoint)
  - Example of a rollout that speaks to the overall value of dbt + your product well

### For folks that are already familiar with dbt / the dbt Community:
- What unique use cases or advantages does your adapter provide over existing adapters? Who might be excited for this?
- How are you contributing to the dbt Community and ensuring that dbt users on your adapter will be well supported (tutorial content, packages, documentation, etc)
- Example of a rollout that is compelling for those familiar with dbt: [Firebolt](https://www.linkedin.com/feed/update/urn:li:activity:6879090752459182080/)

## How do we tactically manage distribution of content about new or existing adapters?

There are some tactical pieces on how and where to share that can help ensure success.

### On slack:
- #i-made-this channel - note that this channel has a policy against “marketing” and “content marketing” posts but if you write your content with the above guidelines in mind it should be able to be successful. Even with that it’s important to post here sparingly.
- Your own database / tool channel - this is where the folks that have opted in to receive communications from you and always a great place to share things that are relevant to them.

### On social media:
- Twitter
- LinkedIn
- We find that social media posts *from the author* or an individual connected to the project tend to have better engagement than posts from a company or organization account.
- Ask your partner representative about:
    - Retweets / shares from the official dbt Labs accounts
    - Flagging posts internally at dbt Labs to get individual employees to share

## How do we know if we have enough engagement for a dedicated channel in the dbt Slack?

You don’t need 1000 people in a channel to make it successful - but you do need at least a few active participants who can make it feel lived in. If you’re comfortable working in public this could be members of your own team - or it can be a few folks who you know that are highly engaged and would be interested in participating. Having even 2 or 3 regulars hanging out in a channel is really all that’s needed for a successful start and is in fact much more impactful than 250 people that never post.

## Is there a boilerplate announcement message that we can use for our initial adapter release?

This is a tough one - in general we’d recommend *against* boilerplate announcements and encourage finding a unique voice. That being said there are a couple things that we’d want to include:

- A summary of the value prop of your database / technology for folks that aren’t familiar
- The personas that might be interested in this news
- A description of what an adapter *is* ie:
  > with the release of our new dbt adapter, you’ll be able to to use dbt to model and transform your data in [name-of-your-org]
- Particular or unique use cases or functionality unlocked by this adapter
- Plans for future / ongoing support / development
- The link to the documentation for using the adapter on the dbt Labs docs site
- An announcement blog

## Is there an example of how to announce new releases of an existing adapter?

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