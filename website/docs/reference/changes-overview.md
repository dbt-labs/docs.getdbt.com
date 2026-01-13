---
title: "Deprecation & warnings overview"
id: "changes-overview"
sidebar_label: "Deprecation & warnings overview"
description: "Quick reference page to help you understand deprecations, behavior changes, and deprecated flags in dbt"
hide_table_of_contents: true
---

When using dbt, you may see warnings or other changes that need your attention. These changes help us move forward with the latest version of dbt and improve the experience for all users. 

Use this page to understand the different types of changes, what to do, and where to find more information.

<div className="grid--3-col">

<Card
  title="Deprecations"
  body="Features in your project code (models, YAML, macros) that still work but will be removed.<br/><br/><strong>Impact:</strong> Currently warnings; will cause errors in future versions.<br/><br/><strong>Action:</strong> Update your project code to use the new syntax."
  link="/reference/deprecations"
  icon="dbt-bit"
/>

<Card
  title="Behavior change flags"
  body="Settings in your dbt_project.yml file that let you opt in or out of new behaviors during migration periods.<br/><br/><strong>Impact:</strong> Controls whether dbt uses old or new behavior; defaults change over time.<br/><br/><strong>Action:</strong> Set flags to control timing of adoption."
  link="/reference/global-configs/behavior-changes"
  icon="dbt-bit"
/>

<Card
  title="Deprecated CLI flags"
  body="Command-line flags passed to dbt commands that are being removed in Fusion.<br/><br/><strong>Impact:</strong> Some ignored (with warnings); <strong>--models</strong> flag will error in Fusion.<br/><br/><strong>Action:</strong> Update job definitions and scripts to remove or replace these flags."
  link="/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags"
  icon="square-terminal"
/>

</div>

## Preparing for Fusion

If you're upgrading to <Constant name="fusion" />, you should:

- [ ] Resolve all [deprecations](/reference/deprecations) to avoid causing errors in <Constant name="fusion" />.
- [ ] Review [behavior change flags](/reference/global-configs/behavior-changes) to understand how <Constant name="fusion" /> will behave (new behavior is always enabled).
- [ ] Update [deprecated CLI flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags) to avoid errors in <Constant name="fusion" />.

## Related docs

- [Full deprecations list](/reference/deprecations)
- [Behavior change flags](/reference/global-configs/behavior-changes)
- [Upgrading to <Constant name="fusion" />](/docs/dbt-versions/core-upgrade/upgrading-to-fusion)
- [<Constant name="fusion" /> readiness checklist](/docs/fusion/fusion-readiness)
- [Events and logging](/reference/events-logging)
