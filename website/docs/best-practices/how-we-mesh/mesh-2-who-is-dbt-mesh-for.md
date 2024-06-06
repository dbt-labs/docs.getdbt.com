---
title: Who is dbt Mesh for?
description: Understanding if dbt Mesh is the right fit for your team
hoverSnippet: Learn how to get started with dbt Mesh
---

Before embarking on a dbt Mesh implementation, it's important to understand if dbt Mesh is the right fit for your team. Here, we outline three common organizational structures to help teams identify whether dbt Mesh might fit your organization's needs. 

## The Enterprise Data Mesh

Some data teams operate on a global scale. By definition, the team needs to manage, deploy, and distribute data products across a large number of teams. Central IT may own some data products or simply own the platform upon which data products are built. Often, these organizations have “architects” who can advise line-of-business teams on their work while keeping track of what’s happening globally (regarding tooling and the substance of work). This is a lot like how software organizations work beyond a certain scale.

This is a true data mesh where many teams publish models for each others' consumption. The headcount ratio here is roughly ≥10:1. For each member of the central platform team, there might be dozens of members of domain-aligned data teams.

Is dbt Mesh a good fit in this scenario? Absolutely! There is no other way to share data products at scale. One dbt project would not keep up with the global demands of an organization like this.

### Tips and tricks

- **Managing shared macros**: Teams operating at this scale will benefit from a separate repository containing a dbt package of reusable utility macros that all other projects will install. This is different from public models, which provide data-as-a-service (a set of “API endpoints”) — this is distributed as a **library**. This package can also standardize imports of other third-party packages, as well as providing wrappers / shims for those macros. This package should have a dedicated team of maintainers — probably the central platform team, or a set of “superusers” from domain-aligned data modeling teams.


- **Adoption challenge:** Onboarding hundreds of people and dozens of projects is full of friction! The challenges of a scaled, global organization are not to be underestimated.
- **Adoption challenge:** Bi-directional project dependencies. If projects are aligned to domain teams, they need the ability to have “chatty” APIs; otherwise, they need to split projects beyond the 1:1 mapping with team boundaries. More information about this will be provided in the near future. 

If this sounds like your organization, dbt Mesh is the architecture you should pursue. ✅

### 2. Hub and Spoke

Some slightly smaller organizations still operate with a central data team serving several business-aligned analytics teams, in a ~5:1 headcount ratio. These central teams look less like a central IT function, and more like a modern data platform team of analytics engineers. This team provides the majority of the data products to the rest of the org, as well as the infrastructure for downstream analytics teams to spin up their own spoke projects to ensure quality + maintenance of the core platform.

**Is dbt Mesh a good fit? If so, why?**  Almost certainly! If your central data team starts to bottleneck analsyts’ work, you need a way for those teams to operate relatively independently while still ensuring the quality of the most used data products. dbt Mesh is designed to solve this exact problem.

**Tips and tricks**

- **Data products by some, for all.** The Spoke teams shouldn’t produce public models. By contrast, development in the Hub project should be slower and more careful, and should focus on producing foundational public models that are shared across domains. We’d recommend giving Hub team members access (at least read-only) to downstream projects, which will help with more granular impact analysis within dbt Explorer. If a public model isn’t being used in any downstream project, or a specific column in that model, the Hub team can feel better about removing it, but they should still utilize the dbt governance features like `deprecation_date` and `version` as appropriate — to set expectations.
- **Sources:** Spokes should be allowed/encouraged to define and use ***domain-specific*** data sources. The platform team should not need to worry about, say, `Thinkific` data when building out core data marts, but the Training project may need to! **No two sources anywhere in a dbt mesh should point to the same relation object.** If a spoke feels like they need to use a source that the hub already uses, the interfaces should change so that the spoke can get what they need from the platform project.
- **Project quality.** More analyst-focused teams will have different skill levels & quality bars. Owning their data means they own the consequences as well. Rather than being accountable for the end-to-end delivery of data assets, the Hub team is an enablement team: their role is to provide guardrails and quality checks, but not to fix all the issues exactly to their liking (and thereby remain a bottleneck).

**What are the adoption challenges?**

There are trade-offs to using this architecture, especially for the Hub team managing and maintaining public models. There is intentional friction in this workflow to reduce the chances of unintentional model changes that break unspoken data contracts. These assurances may come with some sacrifices, such as faster onboarding or more flexible development workflows.

If your organization sounds like this, it's very likely that dbt Mesh is a good fit for you. ✅

### 3. Single Team Monolith

Other organizations operate on an even smaller scale. If your data org is a single small team that controls the end to end process of building and maintaining all data products at the organization, dbt Mesh may not be required. The complexity in projects comes from having a wide ariety of data sources and stakeholders, but given the team's size, operating on a single codebase may be the most efficient way to manage data products. Generally, if a team of this size and scope is looking to implement dbt Mesh, it's likely that they are looking for better interface design and/or performance improvements for certain parts of their dbt DAG, and not because they necessarily have an organizational pain point to solve.

**Is dbt Mesh a good fit? If so, why?**  Maybe! There may be reason to separate out parts of a large monolithic project into several to better orchestrate and manage the models. However, if the same people are managing each project, they may find that the overhead of managing multiple projects is not worth the benefits.

If this sounds like your organization, it's worth considering whether dbt Mesh is a good fit for you.
