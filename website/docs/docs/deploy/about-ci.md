---
title: "About continuous integration (CI) in dbt Cloud"
sidebar_label: "About continuous integration"
pagination_prev: null
pagination_next: "docs/deploy/continuous-integration"
hide_table_of_contents: true
---

Use [CI jobs](/docs/deploy/ci-jobs) in dbt Cloud to set up automation for testing code changes before merging to production. Additionally, [enable Advanced CI features](/docs/cloud/account-settings#account-access-to-advanced-ci-features) for these jobs to evaluate whether the code changes are producing the appropriate data changes you want by reviewing the comparison differences dbt provides.

Refer to the guide [Get started with continuous integration tests](/guides/set-up-ci?step=1) for more information.

<div className="grid--2-col" >

<Card
    title="Continuous integration"
    body="Set up CI checks to test every single change prior to deploying the code to production."
    link="/docs/deploy/continuous-integration"
    icon="dbt-bit"/>

  <Card
    title="Advanced CI (preview)"
    body="Compare the differences between what's in the production environment and the pull request before merging those changes, ensuring that you're always shipping trusted data products."
    link="/docs/deploy/advanced-ci"
    icon="dbt-bit"/>

</div><br />