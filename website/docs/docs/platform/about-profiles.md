---
title: About dbt platform profiles
id: about-profiles
description: "About dbt platform profile configuration."
sidebar_label: "About profiles"
pagination_next: null
pagination_prev: null
---

<IntroText>
<Constant name="dbt_platform" /> profiles define the connections, credentials, and attributes you use to connect to a data warehouse. 
</IntroText>

Assign profiles to [deployment environments](/docs/dbt-cloud-environments#deployment-environment) and reuse those profiles in other deployment environments within the same project. You can manage profiles programmatically using our [API documentation](/dbt-cloud/api-v3#/operations/List%20Profiles).

## Environment profiles table

On an environment's **Settings** page, the **Connection profiles** section lists the profiles assigned to that environment:

- **Profile name**: Click a profile name to open the view/edit drawer. In view mode, there’s no separate action column, so use the profile name to open and view a profile.
- **Connection**: Click the connection to open the [connection details](/docs/platform/connect-data-platform/about-connections#connection-management) page in a new tab.
- **Edit mode**: Click **Edit** to switch to edit mode. Use the **swap icon** <img src="/img/docs/deploy/swap-icon.png" alt="Swap icon" style={{ verticalAlign: 'middle', height: '1em' }} /> next to a profile row to assign a different profile.

### Considerations
- Profiles don't apply to development environments because of the unique configurations and individual credentials applied.
- The <Constant name="semantic_layer" /> configuration isn't supported with profiles yet. 

## Create a profile

:::important new feature rollout

dbt automatically creates a new project-level profile for each deployment environment and populates it with your existing connection, credentials, and extended attributes. You don't need to take any action to create profiles for your existing projects.

:::

You can create profiles from either the project or the environment settings. No matter which approach you take, dbt creates the profile at the project level. Profiles you create in one project won't be visible in others. 

To create a new profile:

<Tabs>

<TabItem value="From project settings" >

1. From the main menu, navigate to your project's **Dashboard**.
2. Click **Settings**.
3. Scroll down to the **Profiles** section and click **Create new profile**.

<Lightbox src="/img/docs/dbt-platform/profile-from-project.png" width="60%" title="Creating a profile from project settings." />

</TabItem>

<TabItem value="From environment settings" >

1. From the main menu, click **Orchestration** and select **Environments**.
2. Click an available deployment environment.
3. Click **Settings**.
4. Click **Edit** to switch to edit mode, then scroll to the **Connection profiles** section.
5. Click the **swap icon** <img src="/img/docs/deploy/swap-icon.png" alt="Swap icon" style={{ verticalAlign: 'middle', height: '1em' }} /> next to the profile row you want to change.
6. Select **Add new profile** from the **Profile** dropdown.
7. Click **Create profile**.
8. Click **Save**.

<Lightbox src="/img/docs/dbt-platform/profile-from-environment.png" width="60%" title="Creating a profile from the environment settings." />

</TabItem>

</Tabs>

The following steps are the same regardless of which approach you take:

1. Give the profile a name that's unique across all projects in the account, easy to identify, and adheres to the naming policy:
    - Starts with a letter
    - Ends with a letter or number
    - Contains only letters, numbers, dashes, or underscores
    - Has no consecutive dashes or underscores
2. From **Connection details**, select a connection from the list of available [global connections](/docs/platform/connect-data-platform/about-connections#connection-management) or add a new connection. 
3. Configure the **Deployment credentials** for your warehouse connection.
4. Add any [**Extended attributes**](/docs/dbt-cloud-environments#extended-attributes) you need. If you use [`env_var()`](/reference/dbt-jinja-functions/env_var) in Extended Attributes, the referenced environment variables must be _project-scoped_ in order to work with connection tests. Since profiles are environment-agnostic, environment-scoped variables are not available during connection tests.

   To set a project-scoped variable, go to **Orchestration** > **Environments** > **Environment variables**, and enter a value in the **Project default** column. Learn more in [environment variables](/docs/build/environment-variables?version=2.0#setting-environment-variables).
5. Click **Save** at the top of the screen. 

<Lightbox src="/img/docs/dbt-platform/profile-sample.png" width="60%" title="Sample of a configured profile." />

Repeat these steps until you've created all the profiles you need for your project's deployment environments. 

## Assign a profile

You configure profiles when you create a deployment environment. For accounts that already have environments configured when you enable profiles, dbt automatically creates and assigns a default profile to all projects. 

To assign a different profile, update the deployment environment settings:

1. From the left navigation, click **Orchestration** and select **Environments**.
2. Click an available deployment environment.
3. Click **Settings**.
4. Click **Edit** to switch to edit mode, then scroll to the **Connection profiles** section.
5. Click the **swap icon** <img src="/img/docs/deploy/swap-icon.png" alt="Swap icon" style={{ verticalAlign: 'middle', height: '1em' }} /> next to the profile row you want to change.
6. Select the new profile from the **Profile** dropdown.
7. Click **Assign profile**.
8. Click **Save**.

## Permissions and access to profiles

Profiles are created at the project level. Only users with permission to edit the project can create profiles and anyone with permission to create or edit deployment environments in that project can assign that profile and its credentials to those environments.

To avoid unintended access, only grant permission sets like **Job Admin** or **Project Admin** to users who should have access to all credentials in a project. Be mindful that profiles created at the project level can be used to configure credentials for any deployment environment in that project.

For more information on permission sets, see [Enterprise permissions](/docs/platform/manage-access/enterprise-permissions).

## FAQs

<DetailsToggle alt_header="Do I need to create profiles for all of my existing projects?">

You don't need to take any action. dbt automatically creates profiles for all existing projects and deployment environments based on the existing connection, credentials, and extended attributes.

</DetailsToggle>

<DetailsToggle alt_header="Are there any changes to development environments?">

Not at this time. Profiles only apply to deployment environments.

</DetailsToggle>

<DetailsToggle alt_header="What happens if I change my connection details, credentials, or attributes?">

Any profiles using those settings automatically update with the new information.

</DetailsToggle>

<DetailsToggle alt_header="What if I use APIs to configure project settings?">

Existing APIs continue to work and automatically map to a profile behind the scenes. You won't need to take any manual action unless you use APIs to create a deployment environment with no credentials configured. This is a rare occurrence unique to APIs, but it's the only scenario where dbt wouldn't create a profile.

Profile-specific APIs are available. Check out our [API documentation](/docs/dbt-apis/overview) for more information.

</DetailsToggle>

<DetailsToggle alt_header="Does the Semantic Layer support profiles?">

<Constant name="semantic_layer" /> configuration isn't supported with profiles yet.

</DetailsToggle>
