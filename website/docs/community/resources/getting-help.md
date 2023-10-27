---
title: Getting help
---
## Community help
dbt is open source, and has a generous community behind it. Asking questions well contributes to the community by building our collective body of knowledge. By following these steps, you'll be more likely to receive help from another community member.

### 1. Try to solve your problem first before asking for help

#### Search the existing documentation
The docs site you're on is highly searchable, make sure to explore for the answer here as a first step. If you're new to dbt, try working through the [quickstart guide](/guides) first to get a firm foundation on the essential concepts.
#### Try to debug the issue yourself
We have a handy guide on [debugging errors](/guides/best-practices/debugging-errors) to help out! This guide also helps explain why errors occur, and which docs you might need to search for help.

#### Search for answers using your favorite search engine
We're committed to making more errors searchable, so it's worth checking if there's a solution already out there! Further, some errors related to installing dbt, the SQL in your models, or getting YAML right, are errors that are not-specific to dbt, so there may be other resources to check.

#### Experiment!
If the question you have is "What happens when I do `X`", try doing `X` and see what happens! Assuming you have a solid dev environment set up, making mistakes in development won't affect your end users

### 2. Take a few minutes to formulate your question well
Explaining the problems you are facing clearly will help others help you.

#### Include relevant details in your question
Include exactly what's going wrong! When asking your question, you should:
* Paste the error message or relevant code inside three backticks in your question, instead of sharing a screenshot
* Include the version of dbt you're on (which you can check with `dbt --version`)
* Let us know which warehouse you're using

#### Avoid generalizing your code
While we understand that you may wish to generalize your problem, or that you may have sensitive information you wish to anonymize, often replacing references in SQL can result in invalid code that creates an error different to the one you're hitting. This makes it harder for us to understand your problem. Wherever possible, share the exact code that you're trying to run.

#### Let us know what you've already tried
In general, people are much more willing to help when they know you've already given something your best shot!

#### Share the context of the problem you're trying to solve
Sometimes you might hit a boundary of dbt because you're trying to use it in a way that doesn't align with the opinions we've built into dbt. By sharing the context of the problem you're trying to solve, we might be able to share insight into whether there's an alternative way to think about it.

#### Post a single message and use threads
The dbt Slack's culture revolves around threads. When posting a message, try drafting it to yourself first to make sure you have included all the context. Include big code blocks in a thread to avoid overwhelming the channel. 

#### Don't tag individuals to demand help
If someone feels inclined to answer your question, they will do so. We are a community of volunteers, and we're generally pretty responsive and helpful! If nobody has replied to your question, consider if you've asked a question that helps us understand your problem. If you require in-depth, ongoing assistance, we have a wonderful group of experienced dbt consultants in our ecosystem. You can find a full list [below](#receiving-dedicated-support).


### 3. Choose the right medium for your question
We use a number of different mediums to share information
- If your question is roughly "I've hit this error and am stuck", please ask it on [the dbt Community Forum](https://discourse.getdbt.com).
- If you think you've found a bug, please report it on the relevant GitHub repo (e.g. [dbt repo](https://github.com/dbt-labs/dbt), [dbt-utils repo](https://github.com/dbt-labs/dbt-utils))
- If you are looking for a more wide-ranging conversation (e.g. "What's the best approach to X?", "Why is Y done this way?"), join our [Slack community](https://getdbt.com/community). Channels are consistently named with prefixes to aid discoverability. 

## Receiving dedicated support
If you need dedicated support to build your dbt project, consider reaching out regarding [professional services](https://www.getdbt.com/contact/), or engaging one of our [consulting partners](https://partners.getdbt.com/english/directory/).

## dbt Training
If you want to receive dbt training, check out our [dbt Learn](https://learn.getdbt.com/) program.

## dbt Cloud support
**Note:** If you are a **dbt Cloud user** and need help with one of the following issues, please reach out to us by using the speech bubble (💬) in the dbt Cloud interface or at support@getdbt.com
- Account setup (e.g. connection issues, repo connections)
- Billing
- Bug reports related to the web interface

As a rule of thumb, if you are using dbt Cloud, but your problem is related to code within your dbt project, then please follow the above process rather than reaching out to support.
