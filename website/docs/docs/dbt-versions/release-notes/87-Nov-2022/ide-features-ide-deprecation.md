---

title: "New IDE features and classic IDE deprecation"
id: "ide-features-ide-deprecation"
description: "Nov 2022 release note: We've enhanced the IDE by adding a button to automatically format your SQL. Added dark mode, Git diff view, and 4 new autocomplete options. We have deprecated the classic IDE."
sidebar_label: "Enhancement and deprecation: New IDE features and classic IDE deprecation"
tags: 
  - Nov-2022
  - v1.1.67.0 
  - IDE

---

### Extra features in new and refreshed IDE

The refreshed version of the dbt Cloud IDE has launched four brand-new additional features, making it easier and faster for you to develop in the IDE.

The new features are:

- **Formatting** &mdash; Format your dbt SQL files to a single code style with a click of a button. This uses the tool [sqlfmt](https://github.com/tconbeer/sqlfmt).
- **Git diff view** &mdash; Highlights the changes in a file before opening a pull request.
- **dbt autocomplete** &mdash; There are four new types of autocomplete features to help you develop faster:
    - Use `ref` to autocomplete your model names
    - Use `source` to autocomplete your source name + table name
    - Use `macro` to autocomplete your arguments
    - Use `env var` to autocomplete env var
- **Dark mode**	&mdash;  Use dark mode in the dbt Cloud IDE for low-light environments.

Read more about all the [Cloud IDE features](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#cloud-ide-features).

### Classic IDE deprecation notice

In December 2022, dbt Labs will deprecate the classic IDE. The [new and refreshed IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) will be available for _all_ dbt Cloud users. You will no longer be able to access the classic IDE and dbt Labs might introduce changes that break the classic IDE.

With deprecation, dbt Labs will only support the refreshed version of the dbt Cloud IDE.

Virtual Private Cloud (VPC) customers with questions about when this change will affect your account can contact your account team or support contact for assistance.
