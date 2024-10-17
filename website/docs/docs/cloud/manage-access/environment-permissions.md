---
title: "About environment-level permissions"
id: environment-permissions
description: "About environment-level permissions to protect your information"
sidebar_label: "Environment-level permissions"
pagination_next: null
pagination_prev: null
---

Environment-level permissions give dbt Cloud admins the ability to grant write permission to groups and service tokens for specific [environment types](/docs/dbt-cloud-environments) within a project. Granting access to an environment give users access to all environment-level write actions and resources associated with their assigned roles. For example, users with a Developer role can create and run jobs within the environment(s) they have access to. For all other environments, those same users will have read-only access. 

For configuration instructions, check out the [setup page](/docs/cloud/manage-access/environment-permissions-setup).

## Current limitations

Environment-level permissions give dbt Cloud admins more flexibility to protect their environments, but it's important to understand that there are some limitations to this feature, so those admins can make informed decisions about granting access.

- Environment-level permissions do not allow you to create custom roles and permissions for each resource type in dbt Cloud.
- You can only select environment types, and can’t specify a particular environment within a project.
- You can't select specific resources within environments. dbt Cloud jobs, runs, and environment variables are all environment resources.
    - For example, you can't specify that a user only has access to jobs but not environment variables. Access to a given environment gives the user access to everything within that environment.

## Environments and roles

dbt Cloud has four different environment types per project: 

- **Production** &mdash; Primary deployment environment. Only one unique Production env per project.
- **Development** &mdash; Developer testing environment. Only one unique Development env per project.
- **Staging** &mdash; Pre-prod environment that sits between development and production. Only one unique Staging env per project.
- **General** &mdash; Mixed use environments. No limit on the number per project. 

Environment write permissions can be specified for the following roles:

- Analyst
- Database admin
- Developer (Previous default write access for all environments. The new default is read access for environments unless access is specified)
- Git admin
- Team admin

Depending on your current group mappings, you may have to update roles to ensure users have the correct access level to environments. 

Determine what personas need updated environment access and the roles they should be mapped to. The personas below highlight a few scenarios for environment permissions: 

- **Developer** &mdash; Write access to create/run jobs in development environment
- **Testing/QA** &mdash; Write access to staging and development environments to test
- **Production deployment** &mdash; Write access to all environments, including production, for deploying
- **Analyst** &mdash; Doesn't need environmental write access but read-only access for discovery and troubleshooting
- **Other admins** &mdash; These admins may need write access to create/run jobs or configure integrations for any number of environments

## Projects and environments

Environment-level permissions can be enforced over one or multiple projects with mixed access to the environments themselves.

### Single project environments

If you’re working with a single project, we recommend restricting access to the Production environment and ensuring groups have access to Development, Staging, or General environments where they can safely create and run jobs. The following is an example of how the personas could be mapped to roles:

- **Developer:** Developer role with write access to Development and General environments
- **Testing/QA:** Developer role with write access to Development, Staging, and General environments
- **Production Deployment:** Developer role with write access to all environments or Job Admin which has access to all environments by default.
- **Analyst:** Analyst role with no write access and read-only access to environments.
- **Other Admins:** Depends on the admin needs. For example, if they are managing the production deployment grant access to all environments.

### Multiple projects

Let's say Acme corp has 12 projects and 3 of them belong to Finance, 3 belong to Marketing, 4 belong to Manufacturing, and 2 belong to Technology. 

With mixed access across projects:

- **Developer:** If the user has the Developer role and has access to Projects A, B, C, then they only need access to Dev and General environments.
- **Testing/QA:** If they have the Developer role and they have access to Projects A, B, C, then they only need access to Development, Staging, and General environments.
- **Production Deployment:** If the user has the Admin _or_ Developer role _and_ they have access to Projects A, B, C, then they need access to all Environments.
- **Analyst:** If the user has the Analyst role, then the need _no_ write access to _any environment_.
- **Other Admins:** A user (non-Admin) can have access to multiple projects depending on the requirements.

If the user has the same roles across projects, you can apply environment access across all projects.


## Related docs
- [Environment-level permissions setup](/docs/cloud/manage-access/environment-permissions-setup)
