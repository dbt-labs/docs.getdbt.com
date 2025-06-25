---
title: "dbt support"
id: "dbt-support"
pagination_next: null
pagination_prev: null
---

Support for dbt is available to all users through the following channels:

- Dedicated dbt Support team (<Constant name="cloud" /> users).
- [The Community Forum](https://discourse.getdbt.com/).
- [dbt Community slack](https://www.getdbt.com/community/join-the-community/).
  
## dbt Core support

If you're developing on the command line (CLI) and have questions or need some help &mdash; reach out to the helpful dbt community through [the Community Forum](https://discourse.getdbt.com/) or [dbt Community slack](https://www.getdbt.com/community/join-the-community/).

## dbt platform support

The global dbt Support team is available to <Constant name="cloud" /> customers by [email](mailto:support@getdbt.com) or by clicking **Create a support ticket** through the <Constant name="cloud" /> navigation.

### Create a support ticket
To create a support ticket in <Constant name="cloud" />:
1. In the <Constant name="cloud" /> navigation, click on **Help & Guides**.
2. Click **Create a support ticket**.
3. Fill out the form and click **Create Ticket**.
4. A dbt Support team member will respond to your ticket through email.

<Lightbox src="/img/create-support-ticket.gif" title="Create a support ticket in dbt" />

### Ask dbt Support Assistant
dbt Support Assistant is an AI widget that provides instant, AI-generated responses to common questions. This feature is available to <Constant name="cloud" /> users and can help answer troubleshooting questions, give a synopsis of features and functionality, or link to relevant documentation. 

The dbt Support Assistant AI widget is separate from [<Constant name="copilot" />](/docs/cloud/dbt-copilot), a powerful AI engine that helps with code generation to accelerate your analytics workflows. The dbt Support Assistant focuses on answering documentation and troubleshooting-related questions. Enabling or disabling AI features in <Constant name="cloud" /> won't affect the dbt Support Assistant's availability.

:::info
We recommend validating information received in AI responses for any scenario using our documentation. Please [contact support](mailto:support@getdbt.com) to report incorrect information provided by the Support Assistant.
:::

### Support plans and resources

We want to help you work through implementing and utilizing <Constant name="cloud" /> platform at your organization. Have a question you can't find an answer to in [our docs](https://docs.getdbt.com/) or [the Community Forum](https://discourse.getdbt.com/)? Our Support team is here to `dbt help` you!

- **Enterprise and Enterprise+ plans** &mdash; Priority [support](#severity-level-for-enterprise-support), optional premium plans, enhanced SLAs, implementation assistance, dedicated management, and dbt Labs security reviews depending on price point.
- **Developer and Starter plans** &mdash; 24x5 support (no service level agreement (SLA); [contact Sales](https://www.getdbt.com/pricing/) for Enterprise plan inquiries).
- **Support team help** &mdash; Assistance with [common <Constant name="cloud" /> questions](/category/troubleshooting), like project setup, login issues, error understanding, setup private packages, link to a new GitHub account, [how to generate a har file](/faqs/Troubleshooting/generate-har-file), and so on.
- **Resource guide** &mdash; Check the [guide](/community/resources/getting-help) for effective help-seeking strategies.

<details>

<summary>Example of common support questions</summary>

Types of dbt cloud-based platform related questions our Support team can assist you with, regardless of your <Constant name="cloud" /> plan:<br /><br />
<b>How do I...</b><br />
    - set up a <Constant name="cloud" /> project?<br />
    - set up a private package in dbt?<br />
    - configure custom branches on git repos?<br />
    - link dbt to a new GitHub account?<br /><br />
<b>Help! I can't...</b><br />
    - log in.<br />
    - access logs.<br />
    - update user groups.<br /><br />
<b>I need help understanding...</b><br />
    - why this run failed.<br />
    - why I am getting this error message in <Constant name="cloud" />?<br />
    - why my CI jobs are not kicking off as expected.<br />
</details>

<!--
- **Enterprise plans** 
  - Have [priority access](#severity-level-for-enterprise-support)
  - Options for custom support coverage hours
  - Receive implementation assistance
  - Dedicated account management
  - Security review by dbt Labs depending on price point
- **Developer and Starter plans**
  - 24x5 support
  - No service level agreement included. If you are interested in adding one, [contact Sales](https://www.getdbt.com/pricing/) to ask about our Enterprise plan.
-->

## dbt Enterprise accounts

Basic assistance with dbt project troubleshooting.
Help with errors and issues in macros, models, and dbt Labs' packages.
For strategic advice, best practices, or expansion conversations, consult your Account team.

For customers on a <Constant name="cloud" /> Enterprise-tier plan, we **also** offer basic assistance in troubleshooting issues with your dbt project:
- **Something isn't working the way I would expect it to...**
    - in a macro I created...
    - in an incremental model I'm building...
    - in one of dbt Labs' packages like dbt_utils or audit_helper...
- **I need help understanding and troubleshooting this error...**
    - `Server error: Compilation Error in rpc request (from remote system)
    'dbt_utils' is undefined`
    - `SQL compilation error: syntax error line 1 at position 38 unexpected '<EOF>'.`
    - `Compilation Error Error reading name_of_folder/name_of_file.yml - Runtime Error Syntax
        error near line 9`

Types of questions you should ask your Account team:
- How should we think about setting up our dbt projects, environments, and jobs based on our company structure and needs?
- I want to expand my account! How do I add more people and train them?
- Here is our data road map for the next year - can we talk through how dbt fits into it and what features we may not be utilizing that can help us achieve our goals?
- It is time for our contract renewal, what options do I have?

### Severity level for Enterprise support

Support tickets are assigned a severity level based on the impact of the issue on your business. The severity level is assigned by dbt Labs, and the level assigned determines the priority level of support you will receive. For specific ticket response time or other questions that relate to your Enterprise or Enterprise+ account’s SLA, please refer to your Enterprise contract.

| Severity Level | Description |
| -------------- | ----------- |
| Severity Level 1 | Any Error which makes the use or continued use of the Subscription or material features impossible; Subscription is not operational, with no alternative available. | 
| Severity Level 2 | Feature failure, without a workaround, but Subscription is operational. | 
| Severity Level 3 | Feature failure, but a workaround exists. | 
| Severity Level 4 | Error with low-to-no impact on Client’s access to or use of the Subscription, or Client has a general question or feature enhancement request. | 

## Leave feedback

Leave feedback or submit a feature request for <Constant name="cloud" /> or <Constant name="core" />.

#### Share feedback or feature request for the dbt platform
1. In the <Constant name="cloud" /> navigation, click **Leave feedback**.
2. In the **Leave feedback** pop up, fill out the form.
3. Upload any relevant files to the feedback form (optional).
4. Confirm if you'd like dbt Labs to contact you about the feedback (optional).
5. Click **Send Feedback**.

<Lightbox src="/img/docs/leave-feedback.gif" title="Leave feedback in dbt" />

#### Share feedback or feature request for dbt Core
- [Create a GitHub issue here](https://github.com/dbt-labs/dbt-core/issues).

## External help

For SQL writing, project performance review, or project building, refer to dbt Preferred Consulting Providers and dbt Labs' Services.
For help writing SQL, reviewing the overall performance of your project, or want someone to actually help build your dbt project, refer to the following pages:
- List of [dbt Consulting Partners](https://partners.getdbt.com/english/directory/).
- dbt Labs' [Services](https://www.getdbt.com/dbt-labs/services/).
