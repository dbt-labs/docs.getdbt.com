---
title: "dbt Wizard in the dbt platform privacy and data"
id: "wizard-platform-privacy-data"
description: "Understand how dbt Wizard in the dbt platform handles your privacy and data."
sidebar_label: "Data & privacy"
tags: [AI, Wizard, Privacy]
pagination_prev: "docs/dbt-ai/wizard-platform-mcp"
---

# <Constant name="wizard" /> in the <Constant name="dbt_platform" /> privacy and data <Lifecycle status="beta"/>

<IntroText>
dbt Labs is committed to protecting your privacy and data. This page explains how <Constant name="wizard" /> in the <Constant name="dbt_platform" /> handles your data.
</IntroText>

<Expandable alt_header="Does dbt Wizard access my warehouse data?">

<Constant name="wizard" /> can run dbt commands and queries on your behalf, and every query needs your explicit permission first. When a query runs, <Constant name="wizard" /> sends those results &mdsah; which may include row-level data &mdash; to the AI provider so it can respond in your session. 

For dbt-managed AI providers, we have zero data retention (ZDR) agreements in place that prevents the provider from retaining or using this data for training. If you bring your own AI provider (BYOK), that provider's terms will govern retention and training. Always review AI output for accuracy.

</Expandable>

<Expandable alt_header="Does dbt Wizard store or use personal data?">

<Constant name="wizard" /> stores your conversation history &mdash; including your prompts, responses, and any query results returned during your session &mdash; so you can revisit past chats.  Conversation history is retained for 90 days; feedback you submit on a <Constant name="wizard" /> conversation is retained for 400 days. You can delete your conversation history or feedback at any time in the product. dbt Labs does not use your prompts, chat history, command results, or feedback for model training. 
</Expandable>

<Expandable alt_header="Is my data used by dbt Labs to train AI models?">

No. dbt Labs does not use customer content processed by <Constant name="wizard" /> &mdash; including warehouse query results, prompts, or conversation history &mdash; for AI model training. A zero data retention (ZDR) policy is also in place with AI providers, which prevents training on the provider side as well.
</Expandable>

<Expandable alt_header="Does dbt Labs share my personal data with third parties?">

dbt Labs only shares client personal information as needed to perform the services, under client instructions, or for legal, tax, or compliance reasons.
</Expandable>

<Expandable alt_header="Can dbt Wizard data be deleted upon client written request?">

Yes. <Constant name="wizard" /> conversation history is retained for 90 days by default, feedback you submit on a <Constant name="wizard" /> conversation is retained for 400 days, and you can delete this information in the product at any time. To the extent a client identifies personal or sensitive information uploaded to dbt Labs systems, that data can be deleted within 30 days of written request.
</Expandable>



## Related docs

- [About <Constant name="wizard" /> in the <Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [<Constant name="wizard" /> in Studio IDE](/docs/dbt-ai/wizard-ide)
- [<Constant name="wizard" /> CLI Data & privacy](/docs/dbt-ai/wizard-telemetry)
