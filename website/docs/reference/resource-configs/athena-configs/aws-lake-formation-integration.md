---
title: "AWS Lake Formation integration"
sidebar_label: "Lake Formation"
description: "How the Amazon Athena adapter manages AWS Lake Formation tags for tables and columns."
---

The following describes how the adapter implements the AWS Lake Formation tag management:

- [Enable](/reference/resource-configs/athena-configs/models#table-configuration) LF tags management with the `lf_tags_config` parameter. By default, it's disabled. 
- Once enabled, LF tags are updated on every dbt run.
- First, all lf-tags for columns are removed to avoid inheritance issues.
- Then, all redundant lf-tags are removed from tables and actual tags from table configs are applied.
- Finally, lf-tags for columns are applied.

It's important to understand the following points:

- dbt doesn't manage `lf-tags` for databases
- dbt doesn't manage Lake Formation permissions

That's why it's important to take care of this yourself or use an automation tool such as terraform and AWS CDK. For more details, refer to:

* [terraform aws_lakeformation_permissions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_permissions)
* [terraform aws_lakeformation_resource_lf_tags](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_resource_lf_tags)
