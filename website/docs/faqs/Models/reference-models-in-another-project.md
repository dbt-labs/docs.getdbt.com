---
title: How can I reference models or macros in another project?
description: "Use packages to add another project to your dbt project"
sidebar_label: 'Reference models or macros in another project'
id: reference-models-in-another-project
keywords: 
  - project dependency, project dependencies, ref project, dbt mesh, multi-project, mesh, cross-project dependencies
---

In dbt, you can manage dependencies across multiple dbt projects using:

1. **Packages**: You can install [packages](/docs/build/packages) as a way to add another project to your dbt project, including other projects you've created. When you install a project as a package, you bring in its entire source code, making its macros and models available in your own project.

While this is useful for reusing code and sharing utility macros, it may not be the best approach for large-scale collaboration, especially in larger organizations.

2. **Project dependencies**: You can use [project dependencies](/docs/collaborate/govern/project-dependencies) as an exciting way to depend on another project using the metadata service in dbt Cloud. It instantly resolves references to public models defined in other projects. You don't need to execute or analyze these upstream models yourself. Instead, you treat them as an API that returns a dataset. The responsibility for maintaining the quality and stability of these public models lies with their respective maintainers.

This approach offers more flexibility and scalability for collaboration, making it easier to work with external projects while ensuring data quality and consistency.


 
