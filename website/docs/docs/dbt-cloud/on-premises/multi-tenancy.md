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

### Create new dbt Cloud Accounts
To create a new account, navigate to the dbt Cloud backend at `https://<hostname>/backend`. You can login as the `superuser` user to perform the steps below.

After logging in, you can create a new account by:

1. Under `Database` > `Accounts`, click `+ Add`. 
2. Enter a name for the account
3. Click `Show` next to `Resources`. Enter how many run slots (concurrent jobs) to allow for this account. 
    **If you are unsure, pick 1 for now.**

![image](https://user-images.githubusercontent.com/46451573/81334360-f2f4f500-9073-11ea-9412-e1b5428fff88.png)

4. Setting up SSO. Click `Show` next to `Enterprise options`.
Fill out this section of the enterprise options with your `unique identifier` and 
`login slug` for the specific SSO application created above. Once you click `Save`
at the bottom, the Enterprise login url will be updated.

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

### Onboarding users

Here are the steps to onboard users to the new account. 



##### 1. Create the Projects

The dbt Cloud administrator will need to create the projects either themselves or invite an AccountAdmin level user to the account to establish the projects necessary for the required environments. 
    
- Remember that it is one data warehouse connection and one git repository per dbt Cloud project.
- This needs to be created on the frontend of dbt Cloud.
        
##### 2. Establish the connections to the data warehouse and git repository.
 This needs to be created on the frontend of dbt Cloud.

##### 3. Create the Groups

 - If you want to utilize [Enterprise Permissions](dbt-cloud/dbt-cloud-enterprise/enterprise-permissions.md), create the groups with the appropriate SSO mapping groups so that new users will be associated to the appropriate groups once logged in. If you do 
 not have SSO mapping groups from your IdP, users can be manually added to groups if not SSO mapping groups are established

 - Associate the groups to the appropriate projects.

 - This needs to be created on the backend of dbt Cloud.

##### 4. Test the IDE (Develop) to assure that the connections are working correctly. 

- Follow the steps provided with the setup guide. 
- This needs to be performed on the frontend of dbt Cloud.
  
##### 5. Provide access to dbt Cloud via the Enterprise Login URL to users

### Management of dbt Cloud

Here is how the backend and front end management of the dbt Cloud instance will look 
like:

#### Backend
##### Creation and Maintenance of:

- Accounts 
- Groups
    - This is management of the Role Based Access Control groups established 
    with enterprise permissions.
- SSO configuration 

#### Frontend
##### Creation and Maintenance of:

- Projects 
- Group Membership
    - Membership of groups can be edited by the AccountAdmin permission set if 
        SSO Mapping groups are not established on the backend for the group
- Project level specifics 


#### Helpful Hints
- The total number of seats (developer and read-only) utilized in all of your accounts 
should never exceed the total number of seats associated with your license. 
Contact your account manager if additional seats are needed. 
- The way to track the number of users on an account is via Accounts > Account Name > User Licenses
- There is no console to provide an overview of seats in all accounts.


