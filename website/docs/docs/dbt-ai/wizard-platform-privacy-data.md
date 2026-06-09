---
title: "dbt Wizard in the dbt platform privacy and data"
id: "wizard-platform-privacy-data"
description: "Understand how dbt Wizard in the dbt platform handles your privacy and data."
sidebar_label: "Data & privacy"
tags: [AI, Wizard, Privacy]
---

# <Constant name="wizard" /> in the <Constant name="dbt_platform" /> privacy and data <Lifecycle status="beta"/>

<IntroText>
dbt Labs is committed to protecting your privacy and data. This page explains how <Constant name="wizard" /> in the <Constant name="dbt_platform" /> handles your data.
</IntroText>

<Expandable alt_header="Is my data used by dbt Labs to train AI models?">

No. <Constant name="wizard" /> in the <Constant name="dbt_platform" /> does not use client warehouse data to train AI models. It uses API calls to an AI provider.
</Expandable>

<Expandable alt_header="Does dbt Labs share my personal data with third parties?">

dbt Labs only shares client personal information as needed to perform the services, under client instructions, or for legal, tax, or compliance reasons.
</Expandable>

<Expandable alt_header="Does dbt Wizard store or use personal data?">

The user opens <Constant name="wizard" /> and prompts the agent. <Constant name="wizard" /> in the <Constant name="dbt_platform" /> uses the context needed to perform the requested action.
</Expandable>

<Expandable alt_header="Does dbt Wizard access my warehouse data?">

<Constant name="wizard" /> in the <Constant name="dbt_platform" /> uses metadata, including column names, model SQL, model names, and model documentation. Row-level data from the warehouse is never used or sent to a third-party provider. You must double-check AI output for completeness and accuracy.
</Expandable>

<Expandable alt_header="Can dbt Wizard data be deleted upon client written request?">

Data from using <Constant name="wizard" /> in the <Constant name="dbt_platform" />, aside from usage data, does not persist on dbt Labs systems. Usage data is retained by dbt Labs. dbt Labs does not have possession of any personal or sensitive data. To the extent a client identifies personal or sensitive information uploaded by or on behalf of the client to dbt Labs systems, that data can be deleted within 30 days of written request.
</Expandable>

## Related docs

- [About <Constant name="wizard" /> in the <Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [<Constant name="wizard" /> in Studio IDE](/docs/dbt-ai/wizard-ide)
- [<Constant name="wizard" /> CLI Data & privacy](/docs/dbt-ai/wizard-telemetry)
