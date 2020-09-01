---
title: Viewing Docs in the IDE
id: viewing-docs-in-the-ide
---

The dbt Cloud IDE makes it possible to view [documentation](/building-a-dbt-project/documentation)
for your dbt project while your code is still in development. With this
workflow, you can inspect and verify what your project's generated documentation
will look like before your changes are released to production.

## Generating documentation

To generate documentation in the IDE, run the `dbt docs generate` command in the
Command Bar in the IDE. This command will generate the Docs
for your dbt project as it exists in development in your IDE session.

<LoomVideo id="4c2373238b3d474e9239c457411ac458" />

After generating your documentation, you can click the "view docs" button to see
the latest version of your documentation rendered in a new browser window.

<LoomVideo id="c28ca8dcacae419187b7caa7aa71c7cd" />

