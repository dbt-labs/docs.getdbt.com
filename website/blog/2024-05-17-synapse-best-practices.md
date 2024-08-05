---
title: Up and Running with Azure Synapse on dbt Cloud
description: "Some tips for getting started with Azure Synapse on dbt Cloud"
slug: synapse-best-practices

authors: [anders_swanson]

tags: ['Synapse', 'Azure','Microsoft', 'dbt Core','dbt Cloud']
hide_table_of_contents: false

date: 2024-05-17
is_featured: true
---

At dbt Labs, we’ve always believed in meeting analytics engineers where they are. That’s why we’re so excited to announce that today, analytics engineers within the Microsoft Ecosystem can use dbt Cloud with not only Microsoft Fabric but also Azure Synapse Analytics Dedicated SQL Pools (ASADSP).

Since the early days of dbt, folks have been interested having MSFT data platforms. Huge shoutout to [Mikael Ene](https://github.com/mikaelene) and [Jacob Mastel](https://github.com/jacobm001) for their efforts back in 2019 on the original SQL Server adapters ([dbt-sqlserver](https://github.com/dbt-msft/dbt-sqlserver) and [dbt-mssql](https://github.com/jacobm001/dbt-mssql), respectively)

The journey for the Azure Synapse dbt adapter, dbt-synapse, is closely tied to my journey with dbt. I was the one who forked dbt-sqlserver into dbt-synapse in April of 2020. I had first learned of dbt only a month earlier and knew immediately that my team needed the tool. With a great deal of assistance from Jeremy and experts at Microsoft, my team and I got it off the ground and started using it. When I left my team at Avanade in early 2022 to join dbt Labs, I joked that I wasn’t actually leaving the team; I was just temporarily embedding at dbt Labs to expedite dbt Labs getting into Cloud. Two years later, I can tell my team that the mission has been accomplished! Kudos to all the folks who have contributed to the TSQL adapters either directly in GitHub or in the community Slack channels. The integration would not exist if not for you!

<!--truncate-->

## Fabric Best Practices

With the introduction of dbt Cloud support for Microsoft Fabric and Azure Synapse Analytics Dedicated SQL Pools, we're opening up new possibilities for analytics engineers in the Microsoft Ecosystem.

The goal of this blog is to ensure a great experience for both

- end-user data analysts who rely upon the data products built with dbt and
- the analytics engineers, who should predominately spend time creating and maintaining data products instead of maintaining and spinning up infrastructure
- data engineers who focus on data movement and ingestion into Synapse

To achieve this goal, this post will cover four main areas

- Microsoft Fabric: the future of data warehousing in the Microsoft/Azure stack
- strategic recommendations for provisioning Synapse environment
- data modeling in dbt: Synapse style
- Considerations for upstream and downstream of a Synapse-backed dbt project

With that, let’s dive in!

## Fabric is the future

Many data teams currently use Azure Synapse dedicated pools. However, Fabric Synapse Data Warehouse is the future of data warehousing in the Microsoft Ecosystem.  Azure Synapse Analytics will remain available for a few more years, but Microsoft’s main focus is on Fabric as we can see in their roadmap and launches.

Because data platform migrations are complex and time-consuming, it’s perfectly reasonable to still be using dbt with Azure Synapse for the next two years while the migration is under way. Thankfully, if your team already is using ASADSP, transitioning to the new Cloud offering will be much more straightforward than the migration from on-premise databases to the Cloud.

In addition, if you're already managing your Synapse warehouse with a dbt project, you'll benefit from an even smoother migration process. Your DDL statements will be automatically handled, reducing the need for manual refactoring.

Bottom line, Fabric is the future of data warehousing for Microsoft customers, and Synapse is will be deprecated at an as-of-yet undeclared End-of-Life.

 There’s undeniable potential offered by Fabric with it’s:

- fully-separated storage and compute, and
- pay-per-second compute.

These two things alone greatly simplify the below section on Resource Provisioning.

For more information, see:

- the official guide: [Migration: Azure Synapse Analytics dedicated SQL pools to Fabric](https://learn.microsoft.com/en-us/fabric/data-warehouse/migration-synapse-dedicated-sql-pool-warehouse).
- this blog about [the Future of Azure Synapse Analytics](https://blog.fabric.microsoft.com/en-us/blog/microsoft-fabric-explained-for-existing-synapse-users/)

## Resource Provisioning

Here are some considerations if you’re setting up an environment from scratch. If the infrastructure of multiple Synapse dedicated SQL pools and a Git repo already exist, you can skip to the next section, though a review of the below as a refresher wouldn’t hurt.

### minimize pools; maximize DWUs

#### definitions

- dedicated SQL pools: effectively one data warehouse
- Data warehouse units (DWUs): the size of the cluster

#### number of pools

With Synapse, a warehouse is both storage and compute. That is to say, to access data, the cluster needs to be on and warmed up.

If you only have one team of analytics engineers, you should have two SQL pools: one for development and one for production. If you have multiple distinct teams that will be modeling data in Synapse using dbt, consider using dbt Cloud’s Mesh paradigm to enable cross team collaboration.

Each should be at the highest tier that you can afford. You should also consider purchasing “year-long reservations” for a steep discount.

Some folks will recommend looking into scaling up and down pools based on demand. However, I’ve learned from personal experience that this optimization is not a free lunch and will require significant investment to not only build out but maintain. A large enough instance that is on whenever needed, keeps at least half an engineers time free to work on actual data modeling rather than platform maintenance.

#### DWUs

The starting tier is `DW100c`, which costs $1.20/hour, has limitations such as only allowing 4 concurrent queries. To add 4  concurrent queries, you must increase the DWH tier. For every increase in 100 `c`'s, you gain an additional 4 concurrent queries.

If this warehouse is intended to be the single source of truth for data analysts, you should design it to perform for that use case. In all likelihood, that means paying for a higher tier. Just like the above discussed potential for saving money by turning the cluster on and off as needed, paying for a lower tier, introduces another host of problems. If the limitation of 4 concurrent queries becomes a bottleneck, your choice is to either

- design infrastructure to push the data out of Synapse and into a Azure SQL db or elsewhere
- increase the tier of service paid (i.e. increase the `DWU`s)

I’m of the opinion that minimizing Cloud spend should not come at the expense of developer productivity — both sides of the equation need to be considered. As such, I advocate predominately for the latter of the above two choices.

### Deployment Resources

In the Microsoft ecosystem, data warehouse deployments are more commonly conducted with Azure Data Factory instead of Azure DevOps pipelines or GitHub Actions. We recommend separating dbt project deployments from any ingestion pipeline defined in ADF.

However, if you must use ADF as the deployment pipeline, it is possible to use dbt Cloud APIs. Running dbt Core within Azure Data Factory can be challenging as there’s no easy way to install and invoke dbt Core, because there’s no easy way to install and run Python. The workarounds aren’t great, for example: Setting up dbt calls via Azure Serverless Functions and invoking them  from ADF.  

### access control

#### permissions for analytics engineers

:::caution
⚠️ User-based Azure Active Directory authentication is not yet supported in dbt Cloud. As a workaround, consider having a [Service Principal](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals?tabs=browser) made for each contributing Analytics Engineer for use in dbt Cloud
:::

In the development warehouse, each user should have the following privileges: `EXECUTE`, `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

#### service principal permissions

In addition, a service principal is required for dbt Cloud to directly interact with both the warehouse and your Git service provider (e.g. GitHub or Azure DevOps).

Only the Service Principal in charge of deployment has the above permissions in production. End users have only `SELECT` access to this environment.

## Model Considerations

The magic begins when the environments are provisioned and dbt Cloud is connected.

With dbt on Synapse, you can own the entire data transformation workflow from raw data to modeled data that data analysts and end users rely upon. The end product of which will be documented and tested.

With dbt Cloud, things are even more streamlined. The dbt Cloud CLI allows developers to build only the models they need for a PR, deferring to the production environment for dependencies. There’s also dbt Explorer, which now has column-level lineage.

While there are already platform-agnostic best practice guides that still apply for Synapse, there are some additional factors related to data distribution and indexing.

### distributions & indices

Working in ASADSP, it is important to remember that you’re working in a [Massively-Parallel Processing (MPP) architecture](https://www.indicative.com/resource/what-is-massively-parallel-processing-mpp/).

What this means for an analytics engineer working using dedicated SQL pools is that for every table model, it must have an `index` and `distribution` configured. In `dbt-synapse` the defaults are:

- index: `CLUSTERED COLUMNSTORE INDEX`
- distribution `ROUND_ROBIN`

If you want something different, you can define it like below. For more information, see [dbt docs: configurations for Azure Synapse DWH: Indices and distributions](https://docs.getdbt.com/reference/resource-configs/azuresynapse-configs#indices-and-distributions).

```sql
{{
    config(
        index='HEAP',
        dist='ROUND_ROBIN'
        )
}}
SELECT * FROM {{ ref('some_model') }}
```

A distribution specifies how the table rows should be stored across the 60 nodes of the cluster. The goal is to provide a configuration that both:

1. ensures data is split evenly across the nodes of the cluster, and
2. minimizes inter-node movement of data.

For example, imagine querying a 100-row seed table in a downstream model. Using `distribution=ROUND_ROBIN` instructs the pool to evenly distribute the rows between the 60 node, which equates to  having only one or two rows in each node. This `SELECT`-ing all these an operation that touches all 60 nodes. The end result is that the query will run much slower than you might expect.

The optimal distribution is `REPLICATE` which will load a full copy of the table to every node. In this scenario, any node can return the 100 rows without coordination from the others. This is ideal for a lookup table which could limit the result set within each node before aggregating each nodes results.


#### more information

- [Guidance for designing distributed tables using dedicated SQL pool in Azure Synapse Analytics](https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-distribute)
- [source code for `synapse__create_table_as()` macro](https://github.com/microsoft/dbt-synapse/blob/master/dbt/include/synapse/macros/materializations/models/table/create_table_as.sql)


## Deployments & Ecosystem

With the infrastructure in place and the analytics engineers enabled with best practices, the final piece is to think through how a dbt project sits in the larger data stack of your organization both upstream and downstream.

### Upstream

In dbt, we assume the data has already been ingested into the warehouse raw. This follows a broader paradigm known as Extract-Load-Transform (ELT). The same goes for dbt with Azure Synapse. The goal should be to have the data ingested into Synapse that is as “untouched” as possible from when it came from the upstream source system. It’s common for data teams using Azure Data Factory to continue to imploy an ETL-paradigm where data is transformed before it even lands in the warehouse. We do not recommend this, as it results in critical data transformation living outside of the dbt project, and therefore undocumented.

If you have not already, engage the central/upstream data engineering team to devise a plan to integrate data extraction and movement in tools such as SSIS and Azure Data Factory with the transformation performed via dbt Cloud.

### Downstream Consumers (Power BI)

It is extremely common in MSFT data ecosystem to have significant amounts of data modeling live within Power BI reports and/or datasets. This is ok up to a certain point.

The correct approach is not to mandate that all data modeling should be done in dbt with `SQL`. Instead seek out the most business critical Power BI datasets and reports. Any modeling done in those reports should be upstreamed into the dbt project where it can be properly tested and documented.

There should be a continuous effort to take and Power Query code written in PBI as transformation code and to upstream it into the data warehouse where the modeling can be tested, documented, reused by others and deployed with confidence.

## Conclusion

There’s great opportunity in dbt Cloud today for data teams using Azure Synapse. While Fabric is the future, there’s meaningful considerations when it comes to resource provisioning, model design, and deployments within the larger ecosystem.

As we look ahead, we're excited about the possibilities that Microsoft Fabric holds for the future of data analytics. With dbt Cloud and Azure Synapse, analytics engineers can be disseminate knowledge with confidence to the rest of their organization.
