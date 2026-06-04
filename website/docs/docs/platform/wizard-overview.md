---
title: "Overview of dbt Wizard"
id: "wizard-overview"
description: "dbt Wizard is an AI agent purpose-built for governed data development in dbt — available in the dbt platform and from your terminal."
sidebar_label: "Overview"
pagination_next: null
keywords: ["dbt Wizard", "dbt Agents", "AI", "analytics", "dbt"]
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# About dbt Wizard

<IntroText>
Your personal dbt agent &mdash; wherever you work.
</IntroText>

<Constant name="wizard" /> is an AI agent purpose-built for governed data development in dbt. Unlike general-purpose coding agents, it understands your dbt project through a [native metadata engine](/docs/dbt-ai/wizard-how-it-works#native-metadata-engine) &mdash; a structured index of lineage, model health, tests, contracts, run results, and semantic definitions.

Think of it like a map of your city: <Constant name="wizard" /> knows how everything connects before it starts, rather than walking every street to figure out the layout.

To learn more about <Constant name="wizard" /> and see it in action, check out the [demo video](https://www.youtube.com/watch?v=-lIzh1xQWMA)!

<Constant name="wizard"/> comes with the following capabilities:

- **Project understanding:** A native dbt metadata engine for lineage, contracts, tests, and runtime context
- **Impact awareness:** Checks upstream and downstream dependencies before you change code
- **Safe validation:** Compiles and builds changes before review
- **Complete workflow:** Investigate, change, validate, and review in one place
- **Setup and governance:** Works out of the box with dbt governance built in

<WizardFeedbackCallout />

## Use dbt Wizard
<Constant name="wizard" /> is available in:

- **[<Constant name="dbt_platform" />](/docs/platform/wizard-platform)**:  Use <Term id="managed" /> AI provider keys or bring your own key (BYOK) credentials for a [supported provider](#supported-ai-providers). Available in public preview for <Constant name="studio_ide"/> and in public beta for the <Constant name="wizard"/> home tab.
- **[Terminal](/docs/dbt-ai/wizard-cli)** (public beta): Use BYOK credentials for a [supported provider](#supported-ai-providers).

For more info on pricing, refer to the [Billing](/docs/platform/billing) page.

<Constant name="wizard" /> is data warehouse agnostic and works with both the [<Constant name="fusion_engine" />](/docs/fusion) and [<Constant name="core" />](/docs/local/install-dbt) &mdash; no specific engine is required.

<WizardSupportedProviders />

## Get started with dbt Wizard

<Tabs>
<TabItem value="terminal" label={<span className="tabs-lifecycle-label">Terminal <Lifecycle status="beta" size="90%" /></span>} default>

_Available in public beta._

A terminal-based agent for governed data development in dbt, whether your team uses the <Constant name="dbt_platform" /> or self-hosts. Bring your own key to experience the full agentic analytics engineering loop.

<NewToTerminal />

<WizardCliInstall />

<div style={{maxWidth: '100%', margin: '20px 0'}}>
<video width="100%" controls autoPlay muted loop playsInline>
  <source src="/img/wizard.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', color: 'var(--ifm-color-emphasis-600)', marginTop: '8px'}}>dbt Wizard CLI in your terminal</span>
</div>

</TabItem>
<TabItem value="platform" label={<span className="tabs-lifecycle-label">dbt platform <Lifecycle status="preview" size="90%" /></span>}>

_Available in public preview._

Leverage agentic capabilities in the home app or [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) for governed data development in dbt.

To get started:

1. Make sure an admin has [enabled](/docs/platform/enable-dbt-ai) <Constant name="wizard" />.
2. Navigate to the <Constant name="wizard" /> icon in the left sidebar of the <Constant name="dbt_platform" />.
3. Open a project in [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) or the home app.
4. Try a prompt, such as:
    - `summarize what this project does`
    - `list all models with no tests`
    - `add not_null and unique tests to the primary key of stg_customers`

Refer to [Use cases and examples](/docs/dbt-ai/wizard-use-cases) for more prompts.

<Lightbox src="/img/docs/dbt-platform/wizard-home-agent.png" width="85%" title="dbt Wizard in the dbt platform" />

(Be warned, the wizard has been known to <WizardPopcorn>cast spells</WizardPopcorn>.)

</TabItem>
</Tabs>

## Next steps

Now that you know where to start, continue with the **[Quickstart](/docs/dbt-ai/wizard-quickstart)** for prerequisites, authentication, prompt examples, and additional commands.

<WizardPlatformPreviewDisclaimer />

## Related docs

- [dbt Wizard in Studio IDE](/docs/dbt-ai/wizard-ide) — generate docs, tests, semantic models, SQL, and delegate end-to-end model work
- [Skills](/docs/dbt-ai/wizard-skills) — give dbt Wizard reusable instructions for your project
- [Migrate to dbt Wizard](/docs/dbt-ai/wizard-migrate) — switch from Claude Code, Cursor, or another AI agent to dbt Wizard
- [dbt MCP server](/docs/dbt-ai/about-mcp) — bring dbt context into any MCP-compatible AI tool
