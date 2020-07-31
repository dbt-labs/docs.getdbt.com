---
title: "Access Control Overview"
id: "access-control-overview"
---

## Overview
This overview provides a basic explanation of access control in dbt Cloud.

dbt Cloud approaches access control by combining aspects from both of the following models:

**Seat-based Access Control (LAC):** Each user is associated with a seat license, which is directly associated with specific capabilities. 
**Role-based Access Control (RBAC):** Access privileges are assigned to groups which in term are assigned to users. 


## Key Objects in dbt Cloud

**Seat License**
- In dbt Cloud, seats are used to allocate users to your account. There are two different types of seat licenses in dbt Cloud: Developer and Read Only. 
- The type of license a user is assigned to controls which capabilities of dbt Cloud the user is permitted to access. These licenses affect the permission sets a user can be granted. 

**Group**
An entity to which privileges can be granted. Groups are in turn assigned to users. 

**Permission Set**
- A defined level of access privileges. Each permission set is associated with specific privileges to dbt Cloud objects. You can be used to control the granularity of access granted by granting permission sets to groups.
- Access to different types of permission sets is defined by your dbt Cloud plan. See below for additional information. 

In dbt Cloud, access is allowed via permission sets assigned to groups, which are in turn assigned to users. 

For more information:
