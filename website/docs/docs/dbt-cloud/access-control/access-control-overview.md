---
title: "Access Control Overview"
id: "access-control-overview"
---

## Overview
This overview provides a basic explanation of access control in dbt Cloud.

dbt Cloud approaches access control by combining aspects from both of the following models:

**Seat-based Access Control (LAC):** Each user is associated with a seat license, which allows for specific capabilities. 
**Role-based Access Control (RBAC):** Access privileges are assigned to groups which in term are assigned to users. 


## Key Objects in dbt Cloud

**Seat License**
- Seats are used to allocate users to your account. 
- The type of license a user is assigned to controls which capabilities of dbt Cloud the user is permitted to access. These licenses affect the permission sets a user can be granted. 
- For more information about seats, check out [Seats & Users](/docs/dbt-cloud/access-control/cloud-seats-and-users)

**Group**
An entity to which privileges can be granted. Groups are in turn assigned to users. 

**Permission Set**
- A defined level of access privileges. Each permission set is associated with specific privileges to dbt Cloud objects. Permission sets are granted to groups in order to easily control the grandularity of access for users. 
- Access to different types of permission sets is defined by your dbt Cloud plan. Self Service dbt Cloud plans have access to the 'Member' and 'Owner' permission sets. Enterprise dbt Cloud plans have access to a greater selection of permission sets.