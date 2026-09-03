---
title: "Invite read-only users to dbt Wizard"
id: "wizard-read-only-users"
description: "Invite business users to dbt Wizard with read-only licenses so they can ask questions of governed production data in Explore mode, without a developer license."
sidebar_label: "Invite read-only users"
tags: [AI, Wizard, Platform]
keywords: ["read-only users", "read-only license", "explore mode", "invite users", "seats", "dbt Wizard"]
availability: platform_usage
---

# Invite read-only users to dbt Wizard <Lifecycle status="preview" />

<IntroText>
Give the people who need answers a way to get them. With a few setup steps, read-only users can ask questions of governed production data in plain language &mdash; no developer license required.
</IntroText>

[Read-only users](/docs/platform/manage-access/seats-and-users) work in the <Constant name="wizard" /> home tab in [Explore mode](/docs/platform/wizard-home#ask-questions-in-explore-mode): the agent queries and explains your data but can't edit files, run builds, or change your project.

This page is for admins. It covers which license read-only users need, how to invite them, and how to set your project up for good answers. Users with development access don't need a read-only license &mdash; they get [Explore mode](/docs/dbt-ai/wizard-ide#agent-modes) alongside the authoring modes automatically. 

:::info

Read-only users see <Constant name="wizard" /> in the home tab as soon as they have access, but they can't query anything until two things are true: credentials exist (either their own or the project's [analytics credential](#set-up-analytics-credentials)), and the project has metadata or <Constant name="semantic_layer" /> definitions to ask questions against.

:::

## What read-only users can do

A read-only user in <Constant name="wizard" /> can:

-  Ask questions of production data in plain language in the [<Constant name="wizard" /> home tab](/docs/platform/wizard-home), and ask follow-ups in the same conversation. 
- See the <Constant name="semantic_layer" /> metric definition or SQL behind every answer.
- See which environment an answer was queried against.

A read-only user can't:

- Use <Constant name="wizard" /> in the [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide). Read-only users work in the [<Constant name="wizard" /> home tab](/docs/platform/wizard-home) only.
- Edit files, commit, or open pull requests.
- Run dbt commands or trigger builds.
- Switch to **Ask for approval** or **Edit files automatically** mode. Those options are disabled.
- Access data their [analytics credentials permissions](#set-up-analytics-credentials) don't already allow.

Read-only users only have access to Explore mode and see a simpler UI. The only tools available are analytics tools: project metadata and <Constant name="semantic_layer" /> definitions. Tools that need filesystem or development access, like the context panel and the branch picker, don't appear. Users with development access still see all three [agent modes](/docs/dbt-ai/wizard-ide#agent-modes) and choose between them. 

## FAQs


<Expandable alt_header="Which license does a read-only user need?">

Read-only. For current license types and how they're assigned, refer to [User licenses](/docs/platform/manage-access/about-user-access). 

</Expandable>

<Expandable alt_header="How many read-only users can we invite?">

It depends on your <Constant name="dbt_platform"/> plan. For license availability by plan, refer to [dbt pricing](https://www.getdbt.com/pricing).

</Expandable>


<Expandable alt_header="Does read-only usage count against our AI usage credits?">

Yes. Questions read-only users ask in Explore mode use dbt-<Term id="managed"/> <Term id="inference"/> and draw from your account's <Constant name="wizard" /> consumption pool, the same as any other <Constant name="wizard" /> usage. Refer to [dbt Wizard billing and access FAQs](/docs/dbt-ai/wizard-billing-faqs) for more information.
</Expandable>

<Expandable alt_header="Do read-only users need the Analyst read permission set?">

Not to use Explore mode. Anyone without development access who can reach <Constant name="wizard" /> sees Explore mode, whichever read permission set they have.

They do need [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) to set up their own warehouse credentials. Without it, they query through the project's [analytics credential](#set-up-analytics-credentials).

</Expandable>


<Expandable alt_header="Can read-only users use their own warehouse credentials?">

Yes, if they have the [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set and <Constant name="wizard" /> uses those instead of the analytics credential.


</Expandable>


<Expandable alt_header="Which credentials does Explore mode query with?">

The user's personal credentials first, if they have any. The project's [analytics credential](#set-up-analytics-credentials) is the fallback. If neither exists, <Constant name="wizard" /> asks the user to set up credentials or contact an admin.

</Expandable>


<Expandable alt_header="A read-only user can see dbt Wizard but can't get answers. Why?">

Seeing <Constant name="wizard" /> in the Home tab doesn't mean the account is ready to answer questions. Check that:

- An admin has [set up an analytics credential](#set-up-analytics-credentials) on the connection, and assigned that connection to the project.
- The project has metadata or <Constant name="semantic_layer" /> definitions to ask questions against. An empty project has nothing to answer from.
- The credential can reach the data the user is asking about.

</Expandable>


## Invite read-only users

Read-only users need AI features turned on to use Wizard. AI features are [enabled](/docs/platform/manage-dbt-ai) by default, so there's usually nothing to change.


1. In <Constant name="dbt_platform" />, go to **Account settings** --> **Users**.
2. Click **Invite users**.
3. Enter the email addresses of the people you want to invite.
4. Assign the [read-only license](/docs/platform/manage-access/seats-and-users#licenses) and a group whose [permission set](/docs/platform/manage-access/enterprise-permissions) matches the data they should see. Explore mode isn't limited to one permission set &mdash; anyone without development access who can reach <Constant name="wizard" /> gets it.
    - Use the [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set if you want these users to configure their own warehouse credentials rather than querying through the analytics credential.
5. Click **Send invitations**.

Invited users log in and should land on the account home, then open <Constant name="wizard" /> home tab from the left sidebar to start asking questions in Explore mode. 

These are the read-only specifics. For the full invite flow, seat management, and resending invites, refer to [Invite users](/docs/platform/manage-access/invite-users).

## Set up analytics credentials

To run a query, Explore mode needs warehouse credentials. Most read-only users don't have their own, so an admin sets up an **analytics credential**: a shared, project-level warehouse credential that read-only users fall back to when they haven't configured personal credentials. Read-only users that have their own credentials can use the [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set.

At query time, <Constant name="wizard" /> resolves credentials in this order:

1. The user's personal warehouse credentials if they have them.
2. The project's analytics credential, if an admin has [set one up](/docs/platform/wizard-read-only-users#add-an-analytics-credential-to-a-connection).
3. If neither exists, <Constant name="wizard" /> returns an error asking the user to set up personal credentials or contact an admin.

### Prerequisites

- An [account admin](/docs/platform/manage-access/about-user-access) role.
- A [connection](/docs/platform/connect-data-platform/about-connections) to one of the supported warehouses: Snowflake, BigQuery, Redshift, or Databricks.

### Add an analytics credential to a connection

1. In <Constant name="dbt_platform" />, go to **Account settings** --> **Connections** and select the connection.
2. Scroll to the **Analytics credential** card and click **Edit**. A connection can have one analytics credential.
3. Pick an **Auth method** and enter the warehouse credentials <Constant name="wizard" /> should query with, then click **Save**.

The fields you see depend on the connection's warehouse and the auth method you pick. The following example we'll use Snowflake, which supports these fields and authentication methods:

<Tabs>

<TabItem value="keypair" label="Key pair">

_Recommended_

1. Enter the **Username** and **Private key** for the warehouse user <Constant name="wizard" /> queries as. 
2. Add the **Private key passphrase** if your key is encrypted.
3. Optionally add a **Role** and **Warehouse** to pin which ones queries run with.

<Lightbox src="/img/docs/dbt-platform/analytics-credential-keypair.png" width="95%" title="Analytics credentials with Key pair selected as the auth method" />

</TabItem>

{/* Username and password auth is labeled "(deprecated)" in the platform UI, so we're not publicizing it. Uncomment if PM confirms it should be documented.

<TabItem value="userpass" label="Username and password">

1. Enter the **Username** and **Password** for the warehouse user <Constant name="wizard" /> queries as.
2. Optionally add a **Role** and **Warehouse** to pin which ones queries run with.

<Lightbox src="/img/docs/dbt-platform/analytics-credential-username-password.png" width="95%" title="Analytics credentials with Username and password selected as the auth method" />

</TabItem>

*/}

</Tabs>


Give the credential the _least privilege_ it needs to answer questions &mdash; read-only access to the data read-only users should see, and nothing more. It's a shared credential, so anyone querying through it sees whatever it can see, without a per-user trail. If you need per-user access control or auditing at the warehouse, have users configure personal credentials instead &mdash; that requires the [Analyst read](/docs/platform/manage-access/enterprise-permissions#analyst-read) permission set.


### Assign the connection to a project

1. Go to **Account settings** --> **Projects** and select the project.
2. In the **Analytics configuration** section, select a connection that has an analytics credential. Only connections with one appear in the picker.
3. Click **Save**. 

Read-only users on that project now query through this credential in Explore mode.

You can reuse the same connection across projects, but each project uses one analytics connection at a time.

## Control what read-only users can see

Explore mode respects your existing access controls. It doesn't create a new permission surface.

- Scope the [analytics credential](#set-up-analytics-credentials) to only the data read-only users should reach, since they all query through it.
- Use [permission sets and groups](/docs/platform/manage-access/enterprise-permissions) to scope which projects a read-only user can reach.
- Use [environment-level permissions](/docs/platform/manage-access/environment-permissions) to control which environments they can query.

## Set your team up for good answers

Explore mode answers are grounded in what your project defines. Here are some things to make the experience easier for users:

- Define the metrics people ask about in the [<Constant name="semantic_layer" />](/docs/build/about-metricflow). Questions that map to a governed metric return your approved numbers instead of ad-hoc SQL.
- Document your models and columns by writing up descriptions, which help <Constant name="wizard" /> pick the right table and explain the answer in business terms.
- Tell users which environment to trust by pointing them at production and explain what development data is, so a work-in-progress number never lands in a business review.

## Related docs

- [Agent modes in dbt Wizard](/docs/dbt-ai/wizard-ide#agent-modes) 
- [dbt Wizard home tab](/docs/platform/wizard-home)
- [User licenses](/docs/platform/manage-access/about-user-access) 
- [Invite users](/docs/platform/manage-access/invite-users)
- [Enable AI features in the dbt platform](/docs/platform/manage-dbt-ai)


