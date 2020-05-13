---
id: multi-tenancy
title: Multi-tenancy Deployment
---

##  Overview
This article is intended for system administrators of dbt Cloud. Follow the steps below to increase the number of accounts supported in your on-premises instance of dbt Cloud. For more information on configuring a multi-tenant deployment of dbt Cloud, contact your Account Manager or support (support@getdbt.com). 

## Implementation Process

### Single Sign On (SSO)

Each dbt Cloud account requires its own SSO application in your identity provider. These separate applications are required to ensure that users are mapped to the correct dbt Cloud account based the SSO application that they log in with.

#### Please follow the appropriate integration-specific guide for your SSO provider:
- [Azure Active Directory](dbt-cloud/dbt-cloud-enterprise/setting-up-enterprise-sso-with-azure-active--directory.md)
- [GSuite](dbt-cloud/dbt-cloud-enterprise/setting-up-sso-with-google-gsuite.md)
- [Okta](dbt-cloud/dbt-cloud-enterprise/setting-up-sso-with-okta.md)

#### Helpful Hints  
- **Name your SSO applications clearly**. Use a descriptive name like `dbt Cloud [Account Name]` to identify different account-specific applications in your identity provider.
- Be sure to follow the instructions completely in the setup guide for each new application created in your identity provider. 

## Create new dbt Cloud Accounts
To create a new account, navigate to the dbt Cloud backend at `https://<hostname>/backend`. You can login as the `superuser` user to perform the steps below.

After logging in, you can create a new account by:

1. Under `Database` > `Accounts`, click `+ Add`. 
2. Enter a name for the account
3. Click `Show` next to `Resources`. Enter how many run slots (concurrent jobs) to allow for this account. 
    **If you are unsure, pick 1 for now.**

![image](https://user-images.githubusercontent.com/46451573/81334360-f2f4f500-9073-11ea-9412-e1b5428fff88.png)

4. Setting up SSO. 
  1. Click `Show` next to `Enterprise options`.
    Fill out this section of the enterprise options with your `unique identifier` and 
    `login slug` for the specific SSO application created above. 
  2. Once you click `Save` at the bottom, the Enterprise login url will be updated.

![image](https://user-images.githubusercontent.com/46451573/81210559-0d5d9e80-8fa0-11ea-9422-eebd834f9e96.png)

5. Add users to the account (this is important -- if you don't add users, nobody will be able to access the account!)
6. Save the new account.


#### Helpful Hints

 - For Azure AD and GSuite, the unique identifier will be provided to by your Account Manager.
 - For Okta, the unique identifier is the "Identity Provider Issuer" in Okta. It is generated in the Okta application creation process.
 - A unique login link for the application is generated as the concatenation of the Enterprise Login URL and the `login slug`. 
 - **If you aren't sure which values to use, contact your Account Manager.**
 - We recommend that [Account Admins](dbt-cloud-enterprise/enterprise-permissions#account-admins) are added to the account first.
 - With Just-In-Time Provisioning (JIT), user accounts will be created automatically when new users log into the application for the first time. Alternatively, new users can be invited from the Team page in the frontend if user/password auth is enabled for the account.



-----------



## Create dbt Cloud Account Objects

Prior to on-boarding users to the new dbt Cloud account, two dbt Cloud Account objects need to be created for each account:  projects and groups.      

If you are not going to be utilzing [Role Based Account Control/Enterprise Permissions](dbt-cloud/dbt-cloud-enterprise/enterprise-permissions.md), feel free to skip the instructions below concerning Group Creation. This is because dbt Cloud ships with [three core groups](dbt-cloud/cloud-configuring-dbt-cloud/cloud-managing-permissions.md): `Owner`, `Member`, and `Everyone`.  For every new account, those default groups are automatically generated. The `Everyone` group does not have any permissions associated with it and is the group assigned at default. 

##### Create the Projects

1. Log in to the frontend of dbt Cloud. You will need the permission set of one of these listed groups: `AccountAdmin`, `Owner`, `Member `

   **To Check User Permissions:  go to `Account` > `User Licenses` > `Manage Permissions`**

2. If this is your first project on the account, you will be directed through the `Set Up a New Project` guide. If not, you will need to navigate to the guide. Click on the left hamburger dropdown and go into `Account Settings`. From `Projects`, click on `New Project`.

3. The guide will assist you with establishing the project including setting up the data warehouse and git repository connections. Each dbt Cloud project may only have one data warehouse connection and git repository. 

4. Establish at least two environments: a deployment environment for your scheduled runs and a development environment for your developers to utilize. 

5. We recommend that the IDE is tested prior to onboarding users.  In order to do this, you must have your personal development credentials established. Afterwards,  click on the left hamburger dropdown and go into `Develop`. 

##### Create the RBAC Groups

1. Log into the backend of dbt Cloud as a `superuser` user. 

2. Click on `Groups` > `Add Group +`

3. Fill out these sections

   1. `Name`: For simplicity, we recommend utilizing the same name as the SSO Mapping Group

   2. `Account`: Input the account number or search for it on the list

   3. `SSO Mapping Group`:  This is under `SSO Settings` and the input is *case sensitive*. Users from the specified IdP groups will be added to this dbt Cloud group once they log in via SSO. If you do not have SSO mapping groups established from your IdP, users can be manually added to these groups. 

      **We highly recommend that SSO Mapping Groups are utilized for an improved maintainance experience.**  

4. Create the Group Permissions

   1. Click `Add another Group Permission`
   2. Select the appropriate `Account`, `Permission Set`, and `Project`. Be sure to click `All Projects` if this permission set is Account wide. 
   3. If you need to change the permission sets of a group, users need to relog in in order to refresh their access.

5. Change the state of the `Owner` and `Member` group to `Deleted`. For the `Member` group, uncheck the `Assign by default`. These two groups have account level permissions and should be not be utilized if you are creating Enterprise Permission on the project level.

6. Provide access to dbt Cloud via the Enterprise Login URL to users.

#### Helpful Hints

 - You should configure your groups based on your specific security guidelines. For guidance, our standard configuration consists of these following groups per account: 
    - One AccountAdmin group
    - One Developer group per Project
    - One Stakeholder group per Project

------



## Management of dbt Cloud

Here is a breakdown of where the creation and maintainance of dbt Cloud objects exists:

### **Backend**

- Accounts
- Account level Objects 
  - Groups
    - This is management of the Role Based Access Control groups.
  - SSO configuration 

### Frontend

- Projects 
- Project objects 
  - Connections (git repository & data warehouse)
  - Jobs
- Group Membership
  - Membership of groups can be edited by the AccountAdmin permission set if 
    SSO Mapping groups are not established on the backend for the group


#### Helpful Hints

- The total number of seats (developer and read-only) utilized in all of your accounts 
  should never exceed the total number of seats associated with your license. 
  Contact your Account Manager if additional seats are needed. 
- The way to track the number of users on an account is via `Accounts` > `Account Name` > `User Licenses`
- There is no console to provide an overview of seats in all accounts.

