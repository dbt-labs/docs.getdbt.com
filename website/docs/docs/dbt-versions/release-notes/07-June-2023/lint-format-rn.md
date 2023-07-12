---
title: "New: You can now lint and format your code in the IDE"
id: "lint-format-rn"
description: "June 2023 release note: In the dbt Cloud IDE, you can perform linting and formatting on SQL, YAML, Markdown, Python, and JSON files using tools like SQLFluff, sqlfmt, Prettier, and Black."
sidebar_label: "New: Lint and format in the IDE"
sidebar_position: 10
tags: [June-2023, IDE]
---

dbt Labs is excited to announce you can now lint and format your dbt code in the dbt Cloud IDE. This is an enhanced development workflow which empowers you to effortlessly prioritize code quality. 

You can perform linting and formatting on five different file types: SQL, YAML, Markdown, Python, and JSON. 

For SQL files, you can easily lint and format your code using [SQLFluff](https://sqlfluff.com/) and apply consistent formatting using [sqlfmt](http://sqlfmt.com/). Additionally, for other file types like YAML, Markdown, JSON, and Python, you can utilize the respective tools powered by [Prettier](https://prettier.io/) and [Black](https://black.readthedocs.io/en/latest/) to ensure clean and standardized code formatting.

For more info, read [Lint and format your code](/docs/cloud/dbt-cloud-ide/lint-format).

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/sqlfluff.gif" width="100%" title="Use SQLFluff to lint/format your SQL code, and view code errors in the Code Quality tab."/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/sqlfmt.gif" width="95%" title="Use sqlfmt to format your SQL code."/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/prettier.gif" width="95%" title="Format YAML, Markdown, and JSON files using Prettier."/>

</DocCarousel>
