---
title: Can I render docs for multiple projects?
description: "Using packages to render docs for multiple projects"
sidebar_label: 'Render docs for multiple projects'
id: docs-for-multiple-projects

---

Yes! To do this, you'll need to create a "super project" that lists each project as a dependent [package](/docs/build/packages) in a `packages.yml` file. Then run `dbt deps` to install the projects as packages, prior to running `dbt docs generate`.

If you are going down the route of multiple projects, be sure to check out our advice [1](https://discourse.getdbt.com/t/should-i-have-an-organisation-wide-project-a-monorepo-or-should-each-work-flow-have-their-own/666) [2](https://discourse.getdbt.com/t/how-to-configure-your-dbt-repository-one-or-many/2121) on the topic.
