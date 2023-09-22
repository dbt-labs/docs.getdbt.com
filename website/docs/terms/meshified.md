---
id: meshified
title: Meshified
description: A dbt project is considered meshified when it’s been built as a node in a dbt Mesh.
displayText: meshified  
hoverSnippet: A dbt project is considered meshified when it’s been built as a node in a dbt Mesh.
---

A dbt project is considered meshified when it’s been built as a node in a <term id="dbt-mesh">dbt Mesh</term>. Typically this means it’s utilizing contracts, constraints, versioning, access, groups, and cross-project references to link reliably with other projects in its dbt Mesh. A meshified project typically has a smaller number of models than a monolithic project, which enables faster development and is more focused. Meshifying a project requires the advanced features of dbt Cloud that enable the mesh pattern.