---
title: "Lint and format your code"
id: "lint-format"
description: Integrate with popular linters and formatters like SQL Fluff, sqlfmt, Black, and Prettier."
sidebar_label: "Lint and format"
tags: [IDE]
---

Enhance your development workflow by integrating with popular linters and formatters like [SQLFluff](https://sqlfluff.com/), [sqlfmt](http://sqlfmt.com/), [Black](https://black.readthedocs.io/en/latest/), and [Prettier](https://prettier.io/). Leverage these powerful tools directly in the dbt Cloud IDE without interrupting your development flow.

<details>
<summary>What are linters and formatters? </summary>
Linters analyze code for errors, bugs, and style issues, while formatters fix style and formatting rules. 
</details>


In the dbt Cloud IDE, you have the capability to perform linting, auto-fix, and formatting on five different file types:
 
- SQL &mdash; [Lint](#lint) and fix with SQLFluff, and [format](#format) with sqlfmt
- YAML, Markdown, and JSON &mdash; Format with Prettier
- Python &mdash; Format with Black

Each file type has its own unique linting and formatting rules. You can [customize](#customize-linting) the linting process to add more flexibility and enhance problem and style detection.

By default, the IDE uses sqlfmt rules to format your code, making it convenient to use right away. However, if you have a file named `.sqlfluff` in the root directory of your dbt project, the IDE will default to SQLFluff rules instead.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/sqlfluff.gif" width="100%" title="Use SQLFluff to lint/format your SQL code, and view code errors in the Code Quality tab."/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/sqlfmt.gif" width="95%" title="Use sqlfmt to format your SQL code."/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/prettier.gif" width="95%" title="Format YAML, Markdown, and JSON files using Prettier."/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-sql-popup.jpg" width="95%" title="Use the Config button to select your tool."/>

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-sqlfluff-config.jpg" width="95%" title="Customize linting by configuring your own linting code rules, including dbtonic linting/styling."/>

</DocCarousel>

## Lint

With the dbt Cloud IDE, you can seamlessly use [SQLFluff](https://sqlfluff.com/), a configurable SQL linter, to warn you of complex functions, syntax, formatting, and compilation errors. This integration allows you to run checks, fix, and display any code errors directly within the Cloud IDE:

- Works with Jinja and SQL, 
- Comes with built-in [linting rules](https://docs.sqlfluff.com/en/stable/rules.html). You can also [customize](#customize-linting) your own linting rules.
- Empowers you to [enable linting](#enable-linting) with options like **Lint** (displays linting errors and recommends actions) or **Fix** (auto-fixes errors in the IDE).
- Displays a **Code Quality** tab to view code errors, and provides code quality visibility and management. 

### Enable linting

1. To enable linting, make sure you've opened a `.sql` file.
2. Click on the **`</> Config`** button on the right side of the [console](/docs/cloud/dbt-cloud-ide/ide-user-interface#console-section). 
3. In the code quality tool config pop up, you have the option to select **sqlfluff** or **sqlfmt**. 
4. To lint your code, select the **sqlfluff** radio button. (Use sqlfmt to [format](#format) your code)
5. Once you've selected the **sqlfluff** radio button, go to the console section (located below the **File editor**) to select the **Lint** or **Fix** dropdown button:
    - The **Lint** button displays linting issues in the IDE as wavy underlines in the **File editor**. You can hover over an underlined issue to display the details and actions, including a **Quick Fix** option to fix all or specific issues. After linting, you'll see a message confirming the outcome. Linting doesn't rerun after saving. Click on the **Lint** button again to rerun linting.
    - The **Fix** dropdown button auto-fixes errors in the **File editor**. Once you've auto-fixed, you'll see a message confirming the outcome. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-lint-format-console.gif" width="95%" title="Use the Lint or Fix button in the console section to lint or auto-fix your code."/>

### Customize linting

SQLFluff is a configurable SQL linter, which means you can configure your own linting rules instead of using the default linting settings in the IDE.  

To configure your own linting rules:

1. Create a new file in the root project directory (the parent or top-level directory for your files).
2. Name the file `.sqlfluff` (make sure you add the `.` before `sqlfluff`).
3. Add your custom config code. 
4. Save and commit your changes.
5. Restart the IDE.
6. Test it out and happy linting!

:::tip Configure dbtonic linting rules

Use the following code example to incorporate well-written dbt code (or dbtonic) to your linting:

<details>
<summary>dbtonic config code example provided by dbt Labs</summary>

```
[sqlfluff]
templater = dbt
# This change (from jinja to dbt templater) will make linting slower
# because linting will first compile dbt code into data warehouse code.
runaway_limit = 10
max_line_length = 80
indent_unit = space

[sqlfluff:indentation]
tab_space_size = 4

[sqlfluff:layout:type:comma]
spacing_before = touch
line_position = trailing

[sqlfluff:rules:capitalisation.keywords] 
capitalisation_policy = lower

[sqlfluff:rules:aliasing.table]
aliasing = explicit

[sqlfluff:rules:aliasing.column]
aliasing = explicit

[sqlfluff:rules:aliasing.expression]
allow_scalar = False

[sqlfluff:rules:capitalisation.identifiers]
extended_capitalisation_policy = lower

[sqlfluff:rules:capitalisation.functions]
capitalisation_policy = lower

[sqlfluff:rules:capitalisation.literals]
capitalisation_policy = lower

[sqlfluff:rules:ambiguous.column_references]  # Number in group by
group_by_and_order_by_style = implicit
```
</details>
:::

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-sqlfluff-config.jpg" width="95%" title="Customize linting by configuring your own linting code rules, including dbtonic linting/styling."/>

## Format

In the dbt Cloud IDE, you can format your code to match style guides with a click of a button. The IDE integrates with formatters like sqlfmt, Prettier, and Black to automatically format code on five different file types &mdash; SQL, YAML, Markdown, Python, and JSON:

- SQL &mdash; Format with [sqlfmt](http://sqlfmt.com/), which provides one way to format your dbt SQL and Jinja.
- YAML, Markdown, and JSON &mdash; Format with [Prettier](https://prettier.io/). 
- Python &mdash; Format with [Black](https://black.readthedocs.io/en/latest/).

The Cloud IDE formatting integrations take care of manual tasks like code formatting, enabling you to focus on creating quality data models, collaborating, and driving impactful results.

### Format SQL

To format your SQL code, dbt Cloud integrates with [sqlfmt](http://sqlfmt.com/), which is an uncompromising SQL query formatter that provides one way to format the SQL query and Jinja.

To enable formatting:

1. Make sure you open a `.sql` file.
2. Click on the **`</> Config`** button on the right side of the console. (Make sure you're in a .sql file).
3. In the code quality tool config pop up, you have the option to select sqlfluff or sqlfmt. 
4. To format your code, select the **sqlfmt** radio button. (Use sqlfluff to [lint](#linting) your code).
5. Once you've selected the **sqlfmt** radio button, go to the console section (located below the **File editor**) to select the **Format** button. 
6. The **Format** button auto-formats your code in the **File editor**. Once you've auto-formatted, you'll see a message confirming the outcome. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/sqlfmt.gif" width="95%" title="Use sqlfmt to format your SQL code."/>

### Format YAML, Markdown, JSON

To format your YAML, Markdown, or JSON code, dbt Cloud integrates with [Prettier](https://prettier.io/), which is an opinionated code formatter.

1. To enable formatting, make sure you open a `.yml`, `.md`, or `.json` file.
2. In the console section (located below the **File editor**), select the **Format** button to auto-format your code in the **File editor**. 
3. Once you've auto-formatted, you'll see a message confirming the outcome. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/prettier.gif" width="95%" title="Format YAML, Markdown, and JSON files using Prettier."/>

### Format Python

To format your Python code, dbt Cloud integrates with [Black](https://black.readthedocs.io/en/latest/), which is an uncompromising Python code formatter.

1. To enable formatting, make sure you open a `.py` file.
2. In the console section (located below the **File editor**), select the **Format** button to auto-format your code in the **File editor**. 
3. Once you've auto-formatted, you'll see a message confirming the outcome. 

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/python-black.gif" width="95%" title="Format Python files using Black."/>

## Troubleshooting

<details>
<summary>Can I nest <code>.sqlfluff</code> files?</summary>

To ensure optimal code quality, it's highly recommended you have one main `.sqlfluff` configuration file in the root folder of your project. However, you have the flexibility to customize and include an additional child `.sqlfluff` configuration file within specific subfolders of your dbt project. <br /><br />By nesting a `.sqlfluff` file in a subfolder, SQLFluff will apply the rules defined in that subfolder's configuration file to any files located within it. For all other files and folders outside of the subfolder, the rules specified in the parent `.sqlfluff` file will be used. This hierarchical approach allows for tailored linting rules while maintaining consistency throughout your project. Refer to [SQLFluff documentation](https://docs.sqlfluff.com/en/stable/configuration.html#configuration-files) for more info.

</details>
<details>
<summary>Can I nest <code>.sqlfluff</code> files?</summary>

To ensure optimal code quality, it's highly recommended you have one main `.sqlfluff` configuration file in the root folder of your project. However, you have the flexibility to customize and include an additional child `.sqlfluff` configuration file within specific subfolders of your dbt project. <br /><br />By nesting a `.sqlfluff` file in a subfolder, SQLFluff will apply the rules defined in that subfolder's configuration file to any files located within it. For all other files and folders outside of the subfolder, the rules specified in the parent `.sqlfluff` file will be used. This hierarchical approach allows for tailored linting rules while maintaining consistency throughout your project. Refer to [SQLFluff documentation](https://docs.sqlfluff.com/en/stable/configuration.html#configuration-files) for more info.

</details>


## Next steps

- [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)
- [Tips and tricks](/docs/cloud/dbt-cloud-ide/dbt-cloud-tips)
