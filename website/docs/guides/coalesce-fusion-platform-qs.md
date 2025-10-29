---
title: "Coalesce dbt Fusion Engine in platform Quickstart Guide"
id: "coalesce-fusion-platform-qs"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Beginner'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine', 'dbt platform','Quickstart']
recently_updated: true
---

## Introduction

Get hands-on with the <Constant name="fusion_engine"/> in a sandbox dbt platform account during Coalesce. 

:::info
This Quickstart guide is only intended to be used by in-person Coalesce registered users.
:::

Continue using this guide to get hands-on keyboard experience, preview the experience in the following video.

<div>
<iframe src="https://fast.wistia.net/embed/iframe/8w1n1xeqo9?web_component=true&seo=true&videoFoam=false" title="Coalesce Fusion Sandbox Walkthrough Video" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" width="840px" height="460px"></iframe>
<script src="https://fast.wistia.net/player.js" async></script>
</div>

## Section 1: Sandbox Sign-up

Let's get started with access to a <Constant name="fusion"/> sandbox!

<Lightbox src="/img/guides/coalesce-fusion-qs/workshop-form.png" width="90%" title="The form for accessing your Fusion Sandbox in dbt platform." />

1. Go to [https://workshops.us1.dbt.com/workshop](https://workshops.us1.dbt.com/workshop?id=46) (Note: In order to access the sign-up page, you may need to log out of any existing dbt Platform account you have or access this URL in Incognito Mode)

2. Enter your first name, last name, and company email.

3. From the dropdown, select **Mom’s Flower Shop** as your workshop.

4. Enter the passcode provided on the <Constant name="fusion"/> @ Coalesce website (linked via the QR code in your welcome bag).

5. Click **Complete Registration** and note your temporary email and password.   
   
   💡 *Accounts remain active for 7 days, but you must use the temporary email / password provided to you after registration to access the account. Store this in a notepad doc or password manager for the week.*	  

6. Click **Login**  

## Section 2: Developer productivity with Fusion

1. In the dbt platform left-hand navigation, click **Select a project** and choose **Mom’s Flower Shop**

2. In the left-hand navigation, click on **Studio** to open the <Constant name="fusion"/>-enabled IDE.

3. An in-app guide will appear for quick resources and videos about <Constant name="fusion"/>’s new capabilities. Please take a few minutes to review these resources\!

4. From the File Explorer in **Studio,** open the `models/staging/stg_flower_orders.sql` file.

5. Use **Preview CTE** above the first CTE to preview data for just this CTE (`raw_flower_orders`) . 
   
   💡 *<Constant name="fusion"/> enables modular previews for faster debugging.*  

6. Hover over the asterisk in `select *` to see column names and data types of available columns.   
   
<Lightbox src="/img/guides/coalesce-fusion-qs/select-star.png" width="90%" title="💡 Fusion provides live metadata and column insights as you code." />

7. Test <Constant name="fusion"/>’s live error detection — introduce a typo and click **Save**. (e.g., `change order_id` to `order_key`) to see real-time feedback. Hover over the red squiggly line to see details about the error.

<Lightbox src="/img/guides/coalesce-fusion-qs/sql-error.png" width="90%" title="Fusion can detect your SQL errors in real-time while you code and before you send it to your data platform." />

    Please note: any file edits stay local to your <Constant name="cloud_ide"/>; no feature branches are permitted for this sandbox account.

## Section 3: State-aware orchestration

1. From the left navigation, go to **Orchestration → Environments → Production**.

2. Navigate to **Prod Job (State Aware Orchestration Enabled)** at the bottom of the page.

3. Open **Settings** to enable State Aware Orchestration. Check **Enable Fusion cost optimization features** and expand to check **State Aware Orchestration.** Click **Save.**

<Lightbox src="/img/guides/coalesce-fusion-qs/toggle-sao.png" width="90%" title="SAO is easily enabled through the familiar job configurations view." />

4. Navigate back to the job page by clicking on the **Prod Job (State Aware Orchestration Enabled)** in the breadcrumb path above the Run \#. 

<Lightbox src="/img/guides/coalesce-fusion-qs/return-to-job.png" width="90%" title="Navigate back to the job itself through the breadcrumb." />

5. Click **Run now** on the **Prod Job (State Aware Orchestration Enabled)** and click into the run to view logs.  

<Lightbox src="/img/guides/coalesce-fusion-qs/prod-job-settings.png" width="90%" title="Choose the run now button to kick off the initial SAO run." />

6. After completion, open the **Lineage** tab.  
    
    All models should show **Success**, since this is the first full run of the project. 

7. Run the job again by clicking **Run now** again to see the power of State aware orchestration at work\!

8. When the job completes, open the **Lineage** tab to see **Reuse** statuses appear on most models. We have new flower orders, so the `stg_flower_orders` and downstream models are rerun (status: success), while the rest of the models are reused, since there is no new data.   
   
   💡 *<Constant name="fusion"/> automatically skips models without fresh data, saving pipeline execution time and avoiding data platform costs*

9. On the **Prod Job (State Aware Orchestration Enabled)** page, click on **Models** underneath the Overview section.

   View the **Models built vs. Models reused** charts to monitor efficiency gains.  

<Lightbox src="/img/guides/coalesce-fusion-qs/models-reused.png" width="90%" title="💡 State aware orchestration ensures only changed data is processed." />

## Section 4: Learn More

Stop by the **dbt Booth in the Discovery Hall** to learn more about the <Constant name="fusion"/>-powered features mentioned in the keynote, witness the magic firsthand at any of our demo pods, and dive deeper into use cases, success stories, and migration details through ongoing lightning talks.

- Learn more about the <Constant name="fusion_engine"/> in the docs: [the dbt Fusion engine](/docs/fusion)
- Continue learning dbt at [learn.getdbt.com](http://learn.getdbt.com)
- Learn about [Coalesce](https://coalesce.getdbt.com/event/21662b38-2c17-4c10-9dd7-964fd652ab44/summary) &mdash; the premier analytics engineering conference where data leaders and practitioners reimagine tools and reshape the future of data and AI.
