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

Assign profiles to [deployment environments](/docs/dbt-cloud-environments#deployment-environment) and reuse those profiles in other deployment environments within the same project. You can manage profiles programmatically using our [API documentation](https://docs.getdbt.com/dbt-cloud/api-v3#/operations/List%20Profiles).

#### Considerations
- Profiles don't apply to development environments because of the unique configurations and individual credentials applied.
- The <Constant name="semantic_layer" /> configuration isn't supported with profiles yet. We're building toward supporting it in the future.

## Create a pro file

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

<Lightbox src="/img/docs/dbt-cloud/profile-from-project.png" width="60%" title="Creating a profile from project settings." />


</TabItem>

<TabItem value="From environment settings" >

1. From the main menu, click **Orchestration** and select **Environments**.
2. Click an available deployment environment.
3. Click **Settings**, then click **Edit**.
4. Navigate to the **Connection profiles** section, click the three-dot menu next to an existing profile, and select **Change profile**.
5. Click the **Profile** dropdown and select **Create new profile**.

<Lightbox src="/img/docs/dbt-cloud/profile-from-environment.png" width="60%" title="Creating a profile from the environment settings." />

</TabItem>

</Tabs>

The following steps are the same regardless of which approach you take:

1. Give the profile a name that's unique across all projects in the account, easy to identify, and adheres to the naming policy:
    - Starts with a letter
    - Ends with a letter or number
    - Contains only letters, numbers, dashes, or underscores
    - Has no consecutive dashes or underscores
2. From **Connection details**, select a connection from the list of available [global connections](/docs/cloud/connect-data-platform/about-connections#connection-management) or add a new connection. 
3. Configure the **Deployment credentials** for your warehouse connection.
4. Add any [**Extended attributes**](/docs/dbt-cloud-environments#extended-attributes) you need.
5. Click **Save** at the top of the screen. 

<Lightbox src="/img/docs/dbt-cloud/profile-sample.png" width="60%" title="Sample of a configured profile." />

Repeat these steps until you've created all the profiles you need for your project's deployment environments. 

## Assign a profile

You configure profiles when you create a deployment environment. For accounts that already have environments configured when you enable profiles, dbt automatically creates and assigns a default profile to all projects. 

To assign a different profile, update the deployment environment settings:

1. From the main menu, click **Orchestration** and select **Environments**.
2. Click an available deployment environment.
3. Click **Settings**, then click **Edit**.
4. Navigate to the **Connection profiles** section, click the three-dot menu next to an existing profile, and select **Change profile**.
5. Click the **Profile** dropdown and select the new profile to assign.

## Permissions and access to profiles

Profiles are shared at the project level, which means anyone with permission to create or edit deployment environments in a project can use those credentials &mdash; including running jobs or querying data in any environment the profile is assigned to.

To avoid unintended access, only grant permission sets like **Job Admin** or **Project Admin** to users who should have access to all credentials in a project. Be mindful that shared credentials could allow a user to deploy changes or access data beyond their intended scope.

For more information on permission sets, see [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions).

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

Profile-specific APIs are available. Check out our [API documentation](/docs/dbt-cloud-apis/overview) for more information.

</DetailsToggle>

<DetailsToggle alt_header="Does the Semantic Layer support profiles?">

<Constant name="semantic_layer" /> configuration isn't supported with profiles yet. We're building toward supporting it in the future.

</DetailsToggle>
