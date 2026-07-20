---
title: "dbt Wizard CLI data use and telemetry"
id: "wizard-telemetry"
description: "Understand what dbt Wizard CLI telemetry collects, why it is collected, and how to opt out."
sidebar_label: "Data & privacy"
tags: [AI, Wizard, Privacy]
---

# <Constant name="wizard" /> CLI data use and telemetry

<IntroText>
<Constant name="wizard" /> CLI collects anonymous product telemetry to improve the AI agent experience, understand usage patterns, optimize performance, and attribute compute costs without capturing your code, queries, prompts, responses, or file contents.
</IntroText>

## Opt out of client telemetry

<Constant name="wizard" /> CLI respects the following opt-out mechanisms, checked in order:

1. Set `DO_NOT_TRACK=1`.
2. Set `DBT_SEND_ANONYMOUS_USAGE_STATS=false`.
3. Store telemetry consent in `~/.dbt/.user.yml`.

Setting any of these disables telemetry from the <Constant name="wizard" /> CLI client.

## What dbt Wizard does not collect

<Constant name="wizard" /> CLI does not collect:

- Prompt or response content.
- SQL queries, file paths, or dbt node names.
- MCP tool call arguments or outputs.
- Raw API keys or tokens. Identifiers are hashed before transmission.
- Error messages that contain user content. Errors are limited to class or code.

## Events collected

<SimpleTable>

| Event | When it is collected | Why it is collected |
| --- | --- | --- |
| LLM request completed or failed | When an LLM request completes | Token usage, model, latency monitoring, error rates, and cost attribution |
| Wizard session started or ended | When a user opens or closes a <Constant name="wizard" /> CLI session | Weekly active users, session duration, model adoption, and client surface usage |
| Wizard turn completed | After a user message and AI response complete | Engagement depth, token consumption, model usage, status, and duration |
| Wizard tool use | Each time the agent invokes a tool | Tool adoption, reliability, and performance |
| Conversation feedback | If you submit feedback on a <Constant name="wizard" /> conversation. | We may retain the associated transcript for up to 400 days to investigate the feedback. These transcripts are not used for model training and can be deleted upon written request. |

</SimpleTable>

Tool telemetry records the tool type, tool name, whether the call failed, and execution time. Tool arguments and outputs are not collected.

## Data handling

- Telemetry is transmitted over HTTPS to dbt Labs ingestion infrastructure.
- Events are stored in an internal dbt Labs data warehouse.
- Telemetry is not shared with third parties.
- API keys and tokens are not transmitted in raw form.
- Local development users who opt out with the supported environment variables generate no <Constant name="wizard" /> CLI client telemetry events.

## Related docs

- [Install <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-cli)
- [Configure BYOK for <Constant name="wizard" />](/docs/dbt-ai/wizard-byok)
- [<Constant name="wizard" /> in the <Constant name="dbt_platform" /> Data & privacy](/docs/dbt-ai/wizard-platform-privacy-data)
- [dbt AI FAQs](/docs/dbt-ai/dbt-ai-faqs)
