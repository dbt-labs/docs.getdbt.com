---
title: Viewing Docs in the IDE
id: viewing-docs-in-the-ide
---

The dbt Cloud IDE makes it possible to view [documentation](/docs/collaborate/documentation)
for your dbt project while your code is still in development. With this
workflow, you can inspect and verify what your project's generated documentation
will look like before your changes are released to production.

## Generating documentation

To generate documentation in the IDE, run the `dbt docs generate` command in the
Command Bar in the IDE. This command will generate the Docs
for your dbt project as it exists in development in your IDE session.

<Lightbox src="/img/docs/dbt-cloud/dbt-docs-generate-command.png" title="dbt docs generate"/>

After generating your documentation, you can click the "view docs" button to see
the latest version of your documentation rendered in a new browser window.

<Lightbox src="/img/docs/dbt-cloud/View-docs-in-IDE.png" title="View docs in the IDE"/>
