---
title: "Establishing dbt Cloud: Securing your account through SSO & RBAC"
description: "How to configure dbt Cloud with SSO & RBAC"
slug: dbt-cloud-sso-rbac

authors: [brian_jan]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2025-04-17
is_featured: true
---

As a dbt Cloud admin, you’ve just upgraded to dbt Cloud on the [Enterprise plan](https://www.getdbt.com/pricing) - **congrats**! dbt Cloud has a lot to offer such as [CI/CD](/docs/deploy/about-ci), [Orchestration](/docs/deploy/deployments), [dbt Explorer](/docs/explore/explore-projects), [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro), [Visual Editor](/docs/cloud/canvas), [dbt Copilot](/docs/cloud/dbt-copilot), and so much more. ***But where should you begin?*** 

We strongly recommend as you start adopting dbt Cloud functionality to make it a priority to set up Single-Sign On (SSO) and Role-Based Access Control (RBAC). This foundational step enables your organization to keep your data pipelines secure, onboard users into dbt Cloud with ease, and optimize cost savings for the long term.

<!--truncate -->

## Authentication vs. Authorization

Before we dig into SSO, RBAC, and more &mdash; let’s go over how they map into two foundational security concepts.

- **Authentication:** [SSO](/blog/dbt-cloud-sso-rbac#single-sign-on-sso) is configured to gate authentication - it verifies (via an IdP) that users are who they say they are and can log into the specified dbt Cloud account.
- **Authorization:** [RBAC](/blog/dbt-cloud-sso-rbac#role-based-access-control-via-idp) is an authorization model - it controls what users can see and do within dbt Cloud based on their assigned licenses, groups, and permission sets.

## Single-Sign On (SSO)

Your SSO configuration steps will depend on your IdP, so we encourage you to start at our [SSO Overview](/docs/cloud/manage-access/sso-overview) page and find the IdP-specific doc under that section that’s specific to your setup.

Regardless of what IdP you use, one of the first things you should do as a dbt Cloud admin is set the **login slug** value. This should be a *unique company identifier*. 

Keep in mind that whatever you set, the slug will be appended to the end of the SSO login URL that your users will use to sign into dbt Cloud. For example:
- If I set my login slug to `mynewco`
- My SSO login URL will look something like `https://cloud.getdbt.com/enterprise-login/mynewco`. 

At first glance, this screen has a lot of info and fields &mdash; but with the [SSO docs](/docs/cloud/manage-access/sso-overview) in hand, dbt Cloud admins are ready to start setting up smooth, scalable workflows.

<Lightbox src="/img/blog/2025-04-10-sso-and-rbac/1_sso_config.png" title="dbt Cloud's SSO configuration page" width="85%" />

Let’s break this down at a high level to make it more digestible:

1. After setting the desired login slug, a *dbt Cloud admin* will go to the dbt Cloud SSO configuration page and copy/paste everything under the **Identity provider values** section and will share the values with the *IdP admin*.
2. The *IdP admin* will create a [dbt Cloud app](/docs/cloud/manage-access/set-up-sso-saml-2.0#creating-the-application) and then provide the values under the **dbt configuration** section to the *dbt Cloud admin*.
   :::tip
   Refer to the appropriate setup docs for [Google Workspace](/docs/cloud/manage-access/set-up-sso-google-workspace), [Okta](/docs/cloud/manage-access/set-up-sso-okta), [Microsoft Entra ID](/docs/cloud/manage-access/set-up-sso-microsoft-entra-id), or [SAML 2.0](/docs/cloud/manage-access/set-up-sso-saml-2.0).
   :::
3. The *dbt Cloud admin* will fill in those values into the SSO configuration page under the **dbt configuration** section and click **Save** to complete the process.

After completing this process:
- We _strongly_ advise you validate the SSO flow is working by pasting the SSO login URL (it should look like `https://cloud.getdbt.com/enterprise-login/dbtlabs`) into your web browser’s private window 
- And try to log into your account via the IdP.
- If the SSO flow isn’t working as expected, an account admin will still be able to log in with a password to correct the configuration.

:::tip
Be aware of our [SSO enforcement policy](https://docs.getdbt.com/docs/cloud/manage-access/sso-overview#sso-enforcement) &mdash; once SSO is configured, all non-admin users will have to log in via SSO as a security best practice, while account admins, by default, can still authenticate with a password in lieu of [multi-factor authentication (MFA)](/docs/cloud/manage-access/mfa).
:::

Once you've set up SSO successfully, you have additional ways to onboard your users into dbt Cloud on top of sending out an email invite:

- Provide users the SSO login URL to access dbt Cloud. This is also known as the *SP-initiated flow* (SP stands for Service Provider; in this case, it would be dbt Cloud).
- Provision the dbt Cloud for users to access on their IdP’s dashboard. This is also known as the *IdP-initiated flow*.

<Lightbox src="/img/blog/2025-04-10-sso-and-rbac/2_sso_flows.png" title="SSO flows into dbt Cloud" width="85%" />

Get stuck setting up SSO? [Open a support ticket](mailto:support@getdbt.com), and one of our Customer Solutions Engineers will be happy to help you!

## Licenses and Groups

In dbt Cloud, there are two main levers to control user access:
- [Licenses](/blog/dbt-cloud-sso-rbac#licenses)
- [Groups](/blog/dbt-cloud-sso-rbac#groups)

As a prerequisite, these all should be set _before_ configuring RBAC. Let’s get into these!

### Licenses

There are three [license types](/docs/cloud/manage-access/seats-and-users) in dbt Cloud:

- **Developer:** User can be granted *any* permissions.
- **Read-Only:** User has read-only permissions applied to all dbt Cloud resources regardless of the role-based permissions that the user is assigned.
- **IT:** User has Security Admin and Billing Admin permissions applied, regardless of the group permissions assigned.

Odds are that the majority of your users will be developers or analysts who’ll need Developer licenses. You can assign default licenses to users based on the groups that they’re in on the IdP side under **Account Settings** --> **Groups & Licenses** --> **License mappings**.

<Lightbox src="/img/blog/2025-04-10-sso-and-rbac/3_license_mapping_example.png" title="An example license mapping" width="85%" />

If a user is in multiple groups with different license types assigned, they will be granted the highest license type &mdash; Developer.

### Groups

Groups are used to manage permissions. They define what a user can see and do across projects and environments. We recommend reviewing our [available permissions sets](https://docs.getdbt.com/docs/cloud/manage-access/enterprise-permissions) and determining which are applicable to your dbt Cloud user base. 

Keep in mind group permissions are additive in nature for users that belong to more than one group &mdash; meaning if a user belongs to multiple groups, they'll inherit all assigned permissions.

Navigating to Groups & Licenses page in dbt Cloud, you’ll see three default groups &mdash; Everyone, Member, and Owner. There’s also an option to create your own groups on the top right.

<Lightbox src="/img/blog/2025-04-10-sso-and-rbac/4_default_dbt_cloud_groups.png" title="The out-of-the-box dbt Cloud groups you may use" width="85%" />

Here’s a brief primer on the default groups:

- **Owner:** This group is for individuals responsible for the entire account and will give them elevated account admin privileges. You cannot change the permissions.
- **Member:** This group is for the general members of your organization, who will also have full developer access to the account. You cannot change the permissions. By default, dbt Cloud adds new users to this group.
- **Everyone:** A general group for all members of your organization. Customize the permissions to fit your organizational needs. By default, dbt Cloud adds new users to this group and only grants user access to their personal profile.

While we recommend creating your own groups and deleting the defaults to better tailor it to your business’ needs, you should only delete the defaults _after_ your own groups have been created and permission sets have been associated with them. These default groups are available to you as a means of getting users started in dbt Cloud. To sum up what they do, the Owner group will give users full account admin access while Everyone and Member groups will give users full developer access.

To help get you started, these are the main permission sets that should be assigned to most users:

| **User persona** | **Permission set** |
| --- | --- |
| dbt Cloud Admin | Account Admin |
| dbt Developer | Developer |
| dbt Analyst | Analyst |

You can also use groups to control which projects and environments users can access.

<Lightbox src="/img/blog/2025-04-10-sso-and-rbac/5_new_dbt_cloud_group.png" title="Creating a new dbt Cloud group" width="85%" />

## Role-Based Access Control via IdP

If you made it this far, thanks for staying with me here! We’re now ready to configure RBAC, which assign users to the right groups and effectively the right permission sets after they authenticate into dbt Cloud. This hinges on the *SSO group mapping(s)* you’ll find within a group.

As an example, let’s say that I want specific users in this group where the SSO group mapping is `dbt-developer`. Note that you can also specify more than one.

<Lightbox src="/img/blog/2025-04-10-sso-and-rbac/6_sso_group_mapping.png" title="Configuring a SSO group mapping within a group" width="85%" />

Here’s what we do to make it happen:

1. Have your IdP admin create a `dbt-developer` group in the IdP.
2. Assign users who should be in the dbt Cloud group to that IdP group.
3. Have users sign into dbt Cloud to confirm they get assigned to that group.

Easy enough, right? Just make sure these two conditions are checked for RBAC to work properly between your IdP and dbt Cloud:

- Group names must be an exact match
- Group names have the same casing

<Lightbox src="/img/blog/2025-04-10-sso-and-rbac/7_okta_sso_group_mapping_example.png" title="Making a SSO group mapping work with your idenity provider" width="85%" />

## Automate SSO & RBAC: Introducing SCIM

We have exciting news &mdash; [System for Cross-Domain Identity Management) (SCIM)](/docs/cloud/manage-access/scim) support will be generally available in May 2025 (for SCIM-compliant IdPs & Okta)! If you’re unfamiliar with SCIM, you can think of it as automated user provisioning in dbt Cloud. It makes user data more secure and simplifies the admin and user experience by automating the user identity and group lifecycle. 

Here’s why you should care about SCIM as a dbt Cloud admin:

1. **Improved Admin and end user experience** &mdash; Through automating user onboarding and offboarding, SCIM saves time for dbt Cloud admins that are managing multiple users on a weekly basis. If a user is added or removed in the IdP, their license and user account is automatically added/removed from dbt Cloud.
2. **Simplified RBAC with group management** &mdash; Admins can simplify access control management by using SCIM to update group membership. Currently, SSO group mapping enables admins to add new users to groups when they are JIT provisioned. SCIM would build on that functionality to allow group management not only for new users but also for existing users. 

## Closing thoughts

Securing your account through SSO and RBAC should be one of your first priorities after getting on the Enterprise plan. 

Not only does it keep your data safe, it allows you to onboard users into your account at scale. While it may be just the beginning of your dbt Cloud journey, putting in the work to check off this crucial step will establish that users are leveraging dbt responsibly at an enterprise grade level!
