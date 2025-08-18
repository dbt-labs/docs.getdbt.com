--- 
title: "dbt Copilot FAQs" 
sidebar_label: "dbt Copilot FAQs" 
description: "Answers to common questions about dbt Copilot."
---

<IntroText>
Read about common questions about <Constant name="copilot" /> to understand how it works and how it can help you.
</IntroText>

<Constant name="copilot" /> is an AI-powered assistant fully integrated into your <Constant name="cloud" /> experience that handles the tedious tasks, speeds up workflows, and ensures consistency, helping you deliver exceptional data products faster.

dbt Labs is committed to protecting your privacy and data. This page provides information about how <Constant name="copilot" /> handles your data. For more information, check out the [dbt Labs AI development principles](https://www.getdbt.com/legal/ai-principles) page.

## Overview 

<Expandable alt_header="What is dbt Copilot?">

<Constant name="copilot" /> is a powerful AI-powered assistant that's fully integrated into your <Constant name="cloud" /> experience and designed to accelerate your analytics workflows. <Constant name="copilot" /> embeds AI-driven assistance across every stage of the analytics development life cycle (ADLC), empowering data practitioners to deliver data products faster, improve data quality, and enhance data accessibility. 

With automatic code generation, let <Constant name="copilot" /> [generate code](/docs/cloud/use-dbt-copilot) using natural language, and [generate documentation](/docs/build/documentation), [data tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models) for you with the click of a button in the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-copilot), [<Constant name="visual_editor" />](/docs/cloud/use-canvas), and [<Constant name="query_page" />](/docs/explore/dbt-insights).

<Constant name="copilot"/> is optimized for OpenAI's `gpt-3.x`, `gpt-4o`, `gpt-4.1-[mini|nano]`, and `gpt-4.5` (deprecated by OpenAI) models. Other models, like `o1` and `o2`, are not supported and will not work with <Constant name="copilot"/>.

</Expandable>

<Expandable alt_header="Where can I find dbt Copilot?">

<Constant name="copilot" /> is available in the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-copilot), [<Constant name="visual_editor" />](/docs/cloud/use-canvas), and [<Constant name="query_page" />](/docs/explore/dbt-insights). Future releases will bring <Constant name="copilot" /> to even more parts of the <Constant name="cloud" /> application!

To use <Constant name="copilot" />, you must have a <Constant name="cloud" /> [Starter, Enterprise, or Enterprise+ account](https://www.getdbt.com/contact) and administrative privileges to opt-in to the feature for your team.

Certain features like [BYOK](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok), [natural prompts in Canvas](/docs/cloud/build-canvas-copilot), and more are only available on Enterprise and Enterprise+ plans.

</Expandable>

<Expandable alt_header="What are the benefits of using dbt Copilot?">

Use <Constant name="copilot" /> to:

- Generate code from scratch or edit existing code with natural language.
- Generate documentation, tests, metrics, and semantic models for your models.
- Accelerate your development workflow with AI-driven assistance.

with a click of a button and ensuring data privacy and security.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Example of using dbt Copilot to generate documentation in the IDE" />

</Expandable>

## Availability 

<Expandable alt_header="Who has access to dbt Copilot?" >

When enabled by an admin, <Constant name="copilot" /> is available on a <Constant name="cloud" /> [Starter, Enterprise, or Enterprise+ account](https://www.getdbt.com/contact) to all <Constant name="cloud" /> [developer license users](/docs/cloud/manage-access/seats-and-users).

</Expandable>

<Expandable alt_header="Is dbt Copilot available for all deployment types?">

Yes, <Constant name="copilot" /> is powered by ai-codegen-api, which is deployed everywhere including [multi-tenant and single-tenant deployments](/docs/cloud/about-cloud/access-regions-ip-addresses).

</Expandable>

## How it works 

<Expandable alt_header="What data/code is used to train the model supporting dbt Copilot?">

<Constant name="copilot" /> is not used to train a large language model (LLM). dbt Labs does not train any models at all. Currently, we use OpenAI models, and our agreement with OpenAI prohibits OpenAI from retaining our data persistently. Refer our [dbt Labs AI principles page](https://www.getdbt.com/legal/ai-principles) for more information.

</Expandable>

<Expandable alt_header="Which model providers does dbt Copilot use?">

dbt Labs works with OpenAI to build and operationalize <Constant name="copilot" />. Enterprise-tier accounts can [supply their own OpenAI keys](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok).

</Expandable>

<Expandable alt_header="Do we support BYOK (bring your own key) at the project level?">

The <Constant name="copilot" /> BYOK option is currently an account-only configuration. However, there may be a future where we make this configurable on a project-level.

</Expandable>

## Privacy and data

<Expandable alt_header="Does dbt Copilot store or use personal data?">

The user clicks the <Constant name="copilot" /> button. Aside from authentication, it works without personal data, but the user controls what is input into <Constant name="copilot" />.

</Expandable>

<Expandable alt_header="Does dbt Copilot access my warehouse data?">

To provide the services, <Constant name="copilot" /> utilizes the data entered by the user in addition to metadata, including column names, model SQL, the model's name, and model documentation. The row-level data from the warehouse is never used or sent by dbt Labs to a third-party provider without action by the user. The user is responsible for double-checking output for completeness and accuracy.

</Expandable>

<Expandable alt_header="Can dbt Copilot data be deleted upon client written request?">

To the extent client identifies personal or sensitive information uploaded by or on behalf of client to dbt Labs systems by the user in error, such data can be deleted within 30 days of written request.


</Expandable>

<Expandable alt_header="Does dbt Labs own the output generated by dbt Copilot?">

No, dbt Labs will not dispute your ownership of any code or artifacts unique to your company that's generated when you use <Constant name="copilot" />. Your code will not be used to train AI models for the benefit of dbt Labs or other third parties, including other dbt Labs customers. 

</Expandable>

<Expandable alt_header="Does dbt Labs have terms in place for dbt Copilot?">

Clients who signed with terms after January 2024 don't need additional terms prior to enabling <Constant name="copilot" />. Longer term clients have also protected their data through confidentiality and data deletion obligations. In the event client prefer additional terms, clients may enter into the presigned AI & Beta Addendum available at [here](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=85817ff4-9ce5-4fae-8e34-20b854fdb52a&env=na2&acct=858db9e4-4a6d-48df-954f-84ece3303aac&v=2) (the dbt Labs signature will be dated as of the date the client signs).

</Expandable>

## Considerations

<Expandable alt_header="What are the considerations for using dbt Copilot?">

<Constant name="copilot" /> has the following considerations to keep in mind:

- <Constant name="copilot" /> is not available in the <Constant name="cloud_cli" />.
- <Constant name="copilot" /> is not available in the <Constant name="cloud" /> API.

Future releases are planned that may bring <Constant name="copilot" /> to even more parts of the <Constant name="cloud" /> application.

</Expandable>

## Copilot allowlisting URLs

<Expandable alt_header="Allowlisting URLs">

<Constant name="copilot" /> doesn't specifically block AI-related URLs. However, if your organization use endpoint protection platforms, firewalls, or network proxies (such as Zscaler), you may encounter the following issues with <Constant name="copilot" />: 

    - Block unknown or AI-related domains.
    - Break TLS/SSL traffic to inspect it.
    - Disallow specific ports or services.

We recommend the following URLs to be allowlisted:

**For <Constant name="copilot" /> in the IDE**:

- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_generic_tests/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_documentation/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_semantic_model/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_inline`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_metrics/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/track_response`

**For <Constant name="copilot" /> in Canvas**:

- `/api/private/visual-editor/v1/ai/llm-generate`
- `/api/private/visual-editor/v1/ai/track-response`
- `/api/private/visual-editor/v1/files/${fileId}/llm-generate-dag-through-chat`

</Expandable>
