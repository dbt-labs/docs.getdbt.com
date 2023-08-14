--- 
title: "Billing"
id: billing 
description: "dbt Cloud billing information." 
sidebar_label: Billing
---

dbt Cloud offers a variety of [plans and pricing](https://www.getdbt.com/pricing/) to fit your organization’s needs. With flexible billing options that appeal to large enterprises and small businesses and [server availability](/docs/cloud/about-cloud/regions-ip-addresses) worldwide, dbt Cloud is the fastest and easiest way to begin transforming your data.

## How does dbt Cloud pricing work?

As a customer, you pay for the number of seats you have and the amount of usage consumed each month. Usage is based on the number of Successful Models Built, and seats are billed primarily on the amount of Developer licenses purchased. All billing computations are conducted in Coordinated Universal Time (UTC).

### What counts as a Successful Model Built?

dbt Cloud considers a Successful Model Built as any model that is successfully built via a run through dbt Cloud’s orchestration functionality in a dbt Cloud deployment environment. Models are counted when built and run. This includes any jobs run via dbt Cloud's scheduler, CI builds (jobs triggered by pull requests), runs kicked off via the dbt Cloud API, and any successor dbt Cloud tools with similar functionality. This also includes models that are successfully built even when a run may fail to complete. For example, you may have a job that contains 100 models and on one of its runs, 51 models are successfully built and then the job fails. In this situation, only 51 models would be counted.

Any models built in a dbt Cloud development environment (for example, via the IDE) do not count towards your usage. Tests, seeds, ephemeral models, and snapshots also do not count. 


### What counts as a seat license? 

There are three types of possible seat licenses:

* **Developer** &mdash; for roles and permissions that require interaction with the dbt Cloud environment day-to-day.
* **Read-Only** &mdash; for access to view certain documents and reports. 
* **IT** &mdash; for access to specific features related to account management (for example, configuring git integration). 

### Viewing usage in the product 

Viewing usage in the product is restricted to specific roles:

* Team plan &mdash; Owner group
* Enterprise plan &mdash; Account and billing admin roles

For an account-level view of usage, if you have access to the **Billing** and **Usage** pages, you can see an estimate of the usage for the month. In the Billing page of the **Account Settings**, you can see how your account tracks against its usage. You can also see which projects are building the most models. 

As a Team and Developer plan user, you can see how the account is tracking against the included models built. As an Enterprise plan user, you can see how much you have drawn down from your annual commit and how much remains. 

On each Project Home page, any user with access to that project can see how many models are built each month. From there, additional details on top jobs by models built can be found on each Environment page. 

In addition, you can look at the Job Details page's Insights tab to show how many models are being built per month for that particular job and which models are taking the longest to build. 

Any usage data is only an estimate of your usage, and there may be a delay in showing usage data in the product &mdash; your final usage for the month will be visible on your monthly statements (statements applicable to Team and Enterprise plans).


## Plans and Billing

dbt Cloud offers several [plans](https://www.getdbt.com/pricing) with different features that meet your needs. We may make changes to our plan details from time to time. We'll always let you know in advance, so you can be prepared. The following section explains how billing works in each plan.

### Developer plan billing

Developer plans are free and include one Developer license and 3,000 models each month. Models are refreshed at the beginning of each calendar month. If you exceed 3,000 models, any subsequent runs will be canceled until models are refreshed or until you upgrade to a paid plan. The rest of the dbt Cloud platform is still accessible, and no work will be lost.

All included successful models built numbers above reflect our most current pricing and packaging. Based on your usage terms when you signed up for the Developer Plan, the included model entitlements may be different from what’s reflected above.


### Team plan billing 

Team customers pay monthly via credit card for seats and usage, and accounts include 15,000 models monthly. Seats are charged upfront at the beginning of the month. If you add seats during the month, seats will be prorated and charged on the same day. Seats removed during the month will be reflected on the next invoice and are not eligible for refunds. You can change the credit card information and the number of seats from the billings section anytime. Accounts will receive one monthly invoice that includes the upfront charge for the seats and the usage charged in arrears from the previous month.

Usage is calculated and charged in arrears for the previous month. If you exceed 15,000 models in any month, you will be billed for additional usage on your next invoice. Additional use is billed at the rates on our [pricing page](https://www.getdbt.com/pricing). 


Included models that are not consumed do not roll over to future months. You can estimate your bill with a simple formula:

`($100 x number of developer seats) + ((models built - 15,000) x $0.01)`

All included successful models built numbers above reflect our most current pricing and packaging. Based on your usage terms when you signed up for the Team Plan, the included model entitlements may be different from what’s reflected above.

:::note Legacy pricing plans
 
Customers who purchased the dbt Cloud Team plan before August 8, 2023, may be on a legacy pricing plan that only includes seat-based charges. Legacy plan pricing will be supported through at least July 2024, although we may not release all new features to legacy plan subscribers. Any changes to your current plan pricing will be communicated in advance according to our Terms of Use. To ensure you have access to new features for each plan, you can upgrade now or [contact us](mailto:support@getdbt.com) with questions.

:::

### Enterprise plan billing

As an Enterprise customer, you pay annually via invoice, monthly in arrears for additional usage (if applicable), and may benefit from negotiated usage rates. Please refer to your order form or contract for your specific pricing details, or [contact the account team](https://www.getdbt.com/contact-demo) with any questions. 

## Managing usage

From anywhere in the dbt Cloud account, click the **gear icon** and click **Account settings**. The **Billing** option will be on the left side menu under the **Account Settings** heading. Here, you can view individual available plans and the features provided for each. 

### Usage notifications 

Every plan automatically sends email alerts when 75%, 90%, and 100% of usage estimates have been reached. In the Team plan, all users within the Owner group will receive alerts. In Enterprise plans, all users with the Account Admin and Billing Admin permission sets will receive alerts. Users cannot opt out of these emails. If you would like additional users to receive these alert emails, please provide them with the applicable permissions mentioned above. Note that your usage may already be higher than the percentage indicated in the alert due to your usage pattern and minor latency times. 

### How do I stop usage from accruing?

There are 2 options to disable models from being built and charged:

1. Open the **Job Settings** of every job and navigate to the **Triggers** section. Disable the **Run on Schedule** and set the **Continuous Integration** feature **Run on Pull Requests?**  to **No**. Check your workflows to ensure that you are not triggering any runs via the dbt Cloud API. This option will enable you to keep your dbt Cloud jobs without building more models. 
2. Alternatively, you can delete some or all of your dbt Cloud jobs. This will ensure that no runs are kicked off, but you will permanently lose your job(s). 


## FAQs

* What happens if I need more than 8 seats on the Team plan? 
_If you need more than 8 developer seats, select the Contact Sales option from the billing settings to talk to our sales team about an Enterprise plan._  

* What if I go significantly over my included free models on the Team or Developer plan?
_Consider upgrading to a Team or Enterprise plan. Team plans include more models and allow you to exceed the monthly usage limit. Enterprise accounts are supported by a dedicated account management team and offer annual plans, custom configurations, and negotiated usage rates._ 

* I want to upgrade my plan. Will all of my work carry over?
_Yes. Your dbt Cloud account will be upgraded without impacting your existing projects and account settings._

* How do I determine the right plan for me?
 _The best option is to consult with our sales team. They'll help you figure out what is right for your needs. We also offer a free two-week trial on the Team plan._
