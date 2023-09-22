---
id: dbt-mesh
title: dbt Mesh
description: dbt Mesh is a pattern that leverages dbt Cloud's more advanced features to interlace multiple dbt projects together. 
displayText: dbt Mesh  
hoverSnippet: dbt Mesh is a pattern that leverages dbt Cloud's more advanced features to interlace multiple dbt projects together.
---

dbt Mesh is a pattern inspired by dbt best practices and data mesh that leverages the advanced features of dbt Cloud on governance, access, versioning, and cross-project linking to interlace multiple dbt projects together. Each project in a dbt Mesh can have inputs and outputs from other projects that are treated like APIs so projects can communicate reliably in production and development. This pattern enables faster development, greater security, and more reliability by decoupling models that operate in separate groups.

## Related content
- [Model governance](/docs/collaborate/govern/about-model-governance)
- [Git version control](/docs/collaborate/git-version-control)
- [dbt Explorer](/docs/collaborate/explore-projects)
- [Discovery API](/docs/dbt-cloud-apis/discovery-api)