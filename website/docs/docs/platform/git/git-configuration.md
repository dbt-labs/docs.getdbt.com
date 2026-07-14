---
title: "Configure Git in dbt"
description: "Learn about the Git providers supported in dbt"
id: "configure-git"
hide_table_of_contents: true
pagination_next: "docs/platform/git/managed-repository"
---

[Version control](/docs/platform/git/version-control-basics) &mdash; a system that allows you and your teammates to work safely and simultaneously on a single project &mdash; is an essential part of the dbt workflow. It enables teams to collaborate effectively and maintain a history of changes to their dbt projects. 

In <Constant name="dbt" />, you can configure <Constant name="git" /> integrations to manage your dbt project code with ease. <Constant name="dbt" /> offers multiple ways to integrate with you <Constant name="git" /> provider, catering to diverse team needs and preferences. 

Whether you use a <Constant name="git" /> integration that natively connects with <Constant name="dbt" /> or prefer to work with a managed or cloned repository, <Constant name="dbt" /> supports flexible options to streamline your workflow.

<div className="grid--3-col">

<Card
    title="Managed repository"
    body="Learn how to quickly set up a project with a managed repository."
    link="/docs/platform/git/managed-repository"
    icon="dbt-bit"/>

<Card
    title="Git clone"
    body="Learn how to connect to a git repository using a git URL and deploy keys."
    link="/docs/platform/git/import-a-project-by-git-url"
    icon="dbt-bit"/>

<Card
    title="Connect to GitHub"
    body="Learn how to connect to GitHub using dbt's native integration."
    link="/docs/platform/git/connect-github"
    icon="dbt-bit"/>

<Card
    title="Connect to GitLab"
    body="Learn how to connect to GitLab using dbt's native integration."
    link="/docs/platform/git/connect-gitlab"
    icon="dbt-bit"/>

<Card
    title="Connect to Azure DevOps"
    body="Learn how to connect to Azure DevOps using dbt's native integration. <br /><br />Available on dbt Enterprise or Enterprise+ plans."
    link="/docs/platform/git/connect-azure-devops"
    icon="dbt-bit"/>

<Card
    title="Availability of CI features by Git provider"
    body="Learn which Git providers have native support for Continuous Integration workflows"
    link="/docs/deploy/continuous-integration#git-providers-who-support-ci"
    icon="dbt-bit"/>
</div>
