---
title: "Access Control Overview"
id: "access-control-overview"
---

## Overview
This overview provides a basic explanation of access control in dbt Cloud.

dbt Cloud approaches access control by combining aspects from both of the following models:

- **Seat-based Access Control:** Each user is associated with an account-wide seat license type. The license type controls specific parts of the dbt Cloud application that a user can access on the account level.
- **Role-based Access Control (RBAC):** RBAC is a method of restricting access to dbt Cloud objects based on the access privileges assigned to groups, which in term are assigned to users. This can be used to control what a user can access both on the account and the dbt Cloud project level. 


## Key Objects in dbt Cloud

- **Seat License**
    - Seat licenses are allocated to users on the dbt cloud account level.
    - The type of license a user is assigned controls which capabilities of dbt Cloud the user is permitted to access. These licenses affect the permission sets a user can be granted. 
    - For more information about seats, check out [Seats & Users](/docs/dbt-cloud/access-control/cloud-seats-and-users)

- **Group**
    - An entity to which permission sets can be granted. Users can be assigned to multiple groups. Once 
    a user is assigned to the group, they have the permission sets granted to the group.
    -  **Enterprise Plans Only** Identify Provider (IdP) groups can be mapped to dbt Cloud groups. This will enable a user logging in via SSO to automatically be mapped to the dbt Cloud group. If they were newly added to a group, the user 
    will need to relog into dbt Cloud to refresh their group memberships.

- **Permission Set**
    - A defined set of access privileges. 
    - Each permission set is associated with specific privileges to dbt Cloud objects. You can control the granularity of access for users easily by granting permission sets to groups.
    - Your dbt Cloud plan defines access to different types of permission sets. Self-Service dbt Cloud plans have access to the 'Member' and 'Owner' permission sets. Enterprise dbt Cloud plans have access to a greater selection of permission sets.
    - For more information about Self-Service permission sets, check out [Self-Service Permissions](/docs/dbt-cloud/access-control/self-service-permissions).
    - For more information about Enterprise permission sets, check out [Enterprise Permissions](/docs/dbt-cloud/access-control/enterprise-permissions). 