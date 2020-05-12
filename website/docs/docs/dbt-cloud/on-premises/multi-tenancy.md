---
id: multi-tenancy
title: Multi-Tenancy Deployment
---

##  Overview
This is intended for system administrators of dbt Cloud to increase the number of accounts 
supported on their dbt cloud instance. If this is something you are interested in, please contact your
Account Manager or support (support@getdbt.com). 

## Implementation Process

### Setup SSO

For every dbt cloud account with SSO configuration, a new application should be created on the SSO provider. 
This will assure users of the same IdP organization will be mapped to appropriate dbt Cloud accounts via SSO login. 

#### Please follow the appropriate integration-specific guide for your setup:
- [Azure Active Directory](dbt-cloud/dbt-cloud-enterprise/setting-up-enterprise-sso-with-azure-active--directory.md)
- [GSuite](dbt-cloud/dbt-cloud-enterprise/setting-up-sso-with-google-gsuite.md)
- [Okta](dbt-cloud/dbt-cloud-enterprise/setting-up-sso-with-okta.md)

#### Helpful Hints  
- Rather than naming the application name as `dbt Cloud`, associate it with the Account so it would be 
`dbt Cloud Account_Name` so it is clear which application is associated to which dbt Cloud account.
- You will still need to send over the requested information at the bottom of the guides to your Account Manager. 

### Create a dbt Cloud Account
To create a new account, navigate to the dbt Cloud backend at `https://<hostname>/backend`. You can login as the `superuser` to perform the steps below.

After logging in, you can create a new account and invite members of your team, by doing the following:

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
 - The `login slug` is added to the Enterprise Login URL to create a unique login link for users of this account.
 - **If you aren't sure which values to use, contact your Account Manager.**
 - It is highly recommended that the first users to associate to the account would be the account administrators. If those users are not already setup in the backend, once you provide the SSO login URL, the user will be created. Alternatively a new user can be emailed an invite via the frontend after configuration is completed. 


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


