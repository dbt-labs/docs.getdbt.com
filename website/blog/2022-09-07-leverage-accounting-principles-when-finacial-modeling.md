---
title: "Leverage Accounting Principles when Modeling Financial Data"
description: "Modeling financial data is rarely ever easy (or fun). Thankfully, there are accounting principles that can be leveraged to ensure your financial models are complete and accurate."
slug: financial-modeling-accounting-principles
authors: [joe_markiewicz]
tags: [analytics craft]
hide_table_of_contents: false

date: 2022-09-07
is_featured: true
---

Analyzing financial data is rarely ever “fun.” In particular, generating and analyzing financial statement data can be extremely difficult and leaves little room for error. If you've ever had the misfortune of having to generate financial reports for multiple systems, then you will understand how incredibly frustrating it is to reinvent the wheel each time. 

This process can include a number of variations, but usually involves spending hours, days, or weeks working with Finance to: 
- Understand what needs to go into the reports
- Model said reports
- Validate said reports
- Make adjustments within your model
- Question your existence
- Validate said reports again

You can imagine how extremely time consuming this process can be. Thankfully, you can leverage core accounting principles and other tools to more easily and effectively generate actionable financial reports. This way, you can spend more time diving into deeper financial analyses.

<!--truncate-->

I will detail how you are able to leverage these principles, but before I dive in I would be remiss not to mention the dbt packages that are available for popular financial data sources that you can leverage! If you are using Fivetran and currently utilize either Netsuite, QuickBooks, Xero, or Sage Intacct, then you are able to skip the line and use the pre-built reports right out of the box. See below for links to the relevant packages:
- [Netsuite dbt package](https://github.com/fivetran/dbt_netsuite)
- [QuickBooks dbt package](https://github.com/fivetran/dbt_quickbooks)
- [Xero dbt package](https://github.com/fivetran/dbt_xero)
- [Sage Intacct dbt package](https://github.com/fivetran/dbt_sage_intacct)

These packages generate the three basic financial statement reports (plus a few bonus models) your Finance team will need: 
- General Ledger/Transaction Detail: a ledger of all posted transactions within an organization.
- Balance Sheet: a summary of the financial balances within an organization. The quintessential accounting calculation (Assets = Liabilities + Equity).
- Profit and Loss/Income Statement: a report detailing the revenues and expenses within an organization.

By simply installing the package you can get those reports in your <Term id="data-warehouse" /> in a matter of minutes, allowing you to bypass the cycle outlined prior. However, if you do not utilize one of these sources with Fivetran, there is nothing to fear! I will detail the modeling principles used in each of these packages.

Below are the modeling principles I leverage whenever I begin a new financial data modeling adventure. These steps are in order and should be followed as such.

## Step 1: Understanding the Source Schema
Each normalized financial data source I have worked with is structured in either one of two ways: a single <Term id="table" /> that contains all transactions for the company **OR** a header and line item detail table for each transaction type. Both schema designs have their pros and cons. 

The single transaction table makes it easier to get started with your financial modeling and generating your end reports. However, it doesn’t give you a good view of what type of transactions are included within the table. In order to gain an understanding of the transaction types, you will need to spend some time querying the table to identify what transactions are (and are not) included. See the [Fivetran Netsuite ERD](https://fivetran.com/docs/applications/netsuite-suiteanalytics#schemainformation) as an example of the single transaction table schema.

Similarly, the header and line item detail table schema version is great for understanding what types of transactions have taken place across the company. However, this schema structure is quite difficult when needing to do downstream analyses. For example, you are required to join the header and line item tables together before unioning them with the other transaction objects in order to holistically view all transactions together. See the [Fivetran QuickBooks ERD](https://fivetran.com/docs/applications/quickbooks#schemainformation) as an example of the header and line item table schema. 

Regardless of which scenario you find your financial data in, it is best to take some time to gain an understanding of the schema design. The next step is going to involve using the raw table(s) to begin the financial modeling journey.

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/hobbit-adventure.gif)

## Step 2: Generating the General Ledger/Transaction Detail Report
The General Ledger/Transaction Detail report rests at the core of every company's financial story. This report will contain every verifiable transaction (cash coming in, cash going out, etc.) that has taken place within the company, but with a fun accounting twist!

Okay, it may not be fun, or a twist, but this report will include an important piece of the accounting puzzle for each transaction. Yes, I am going to be talking about debits and credits (aka double entry accounting). 

Each transaction will detail how the entry impacts the bottom line as either a debit or a credit to a relevant account. This is invaluable to us for downstream modeling of the Balance Sheet in particular. The debit and credit method of accounting is critical to the matching principle where each item of revenue should match to an item of expense. Think of it like there should always be an offsetting action for each transaction. If you purchase coffee beans to sell to customers, you will debit the coffee beans and credit cash. This has an impact by increasing your asset (coffee beans) and also decreasing your asset (cash). Perfectly balanced, as all things should be.

I highly recommend finding a cozy spot on your couch and reading up on [double entry accounting](https://www.fool.com/the-ascent/small-business/accounting/articles/double-entry-accounting/) before modeling your General Ledger/Transaction Detail model. Luckily, I have found the majority of financial data sources that leverage the single transaction detail table also handle the double entry accounting for you within the table (see Sage Intacct as an example). However, if your source resembles the header and line item schema design, then you will likely need to ensure you are accounting for the double entries within your models before rolling up all your transactions into a single table. 

I highly recommend taking a look at how this was modeled for each transaction type within the dbt_quickbooks [double entry transaction models](https://github.com/fivetran/dbt_quickbooks/tree/main/models/double_entry_transactions). Below is a great snippet from the double entry folder which shows how the double entry method is accounted for within the model by using a union (notice the account_id changing to reflect the impact of the transaction on the different accounts).
```sql
select
    transaction_id,
    transaction_date,
    customer_id,
    vendor_id,
    amount,
    payed_to_account_id as account_id,
    'debit' as transaction_type,
    'bill' as transaction_source
from bill_join
 
union all

select
    transaction_id,
    transaction_date,
    customer_id,
    vendor_id,
    amount,
    payable_account_id as account_id,
    'credit' as transaction_type,
    'bill' as transaction_source
from bill_join
```

Once you ensure you’re properly accounting for the double entry method in the individual transaction type models, you can union all the transaction type models together to create a single table with all transaction types. 

At this point, regardless of which schema design you began with, you should be at the same place with a single table that contains all your transactions (and their offsetting entry) across the company! Now you can start joining in your <Term id="dimensional-modeling">dimensional fields</Term> such as vendor name, account name, account type, and account classification to name a few. Okay, now that I mention account classification, it is a crucial component for building your end financial models and I should talk more about it.

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/top-gun-classified.gif)

## Step 3: Verify the Account Classifications
All financial data sources will have some variation of the company chart of accounts. Typically this is in the form of the accounts table. This table is able to be joined to the General Ledger to enrich your transactions with the corresponding account information. This is an extremely important piece of the equation as you want to make sure the transactions are impacting the right accounts and are being classified correctly. The account classification allows you to identify if the account is either an Asset, Liability, Equity, Expense or Revenue account. In turn, this then serves as the key component in generating the Balance Sheet and Income Statement reports.

Sometimes you will get lucky and the account classification will be provided within the accounts table (like in [dbt_xero](https://github.com/fivetran/dbt_xero_source/blob/0d1d2c02dbb8e1f8371e703651a704127181c88f/models/stg_xero__account.sql#L30)). If it is not, then you will need to add some logic to your accounts model to accurately set the classification. Typically, the logic involves referencing the account type to determine the classification (for example, an Accounts Payable account type should map to a Liability classification). Thankfully, this has been applied to a number of open source projects and can be leveraged by your team! I recommend taking a look at how the [dbt_quickbooks](https://github.com/fivetran/dbt_quickbooks/blob/43282a8cf77670f6e2ac657167dd19c1014ba111/models/intermediate/int_quickbooks__account_classifications.sql#L23-L35) packages map classifications. Likewise, the [dbt_sage_intacct](https://github.com/fivetran/dbt_sage_intacct/blob/4feec47da41fcc28325913dbae5597132ddccd66/models/intermediate/int_sage_intacct__account_classifications.sql#L12-L22) implementation follows the same logic, but instead allows for more flexibility in the form of variables that can be modified and edited if the Chart of Accounts on the finance side changes.

Once you verify, or create, the account classification field, you are safe to join the account (and other dimensional) tables with your General Ledger table. Now that everything is joined together, you will start to see the tapestry of the financial history unfolding before your eyes. Beautiful, isn’t it. Time really flies when you are having fun. Actually, now that I am on the topic of time, I can’t wait to talk about the next step. Aggregating your General Ledger data by a date period!

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/office-its-a-date.gif)

## Step 4: General Ledger by Period and the Date Spine
As of right now, your Finance team is probably ecstatic that they currently have a fully functional (and, most importantly, accurate) General Ledger available. While this is great, it can be quite difficult to generate the final financial statements with the data in this format. It will be much easier to wrangle the data if it is aggregated into date periods by account. While you can aggregate by whichever period you like, I suggest aggregating by month, as it allows you and your Finance team to slice and dice by month/quarter/annual to your liking. In order to achieve this, you are going to use our best friend - the date spine.

Using a combination of jinja and the date spine macros, you will be able to create a table that contains each month from the beginning of the company’s financial history. While it may be daunting, I recommend taking a look at how the date spine is generated within the dbt_quickbooks [general_ledger_date_spine](https://github.com/fivetran/dbt_quickbooks/blob/main/models/intermediate/int_quickbooks__general_ledger_date_spine.sql) model. You can see how the date spine references the General Ledger model and finds the minimum and maximum date to generate the complete spine. This ensures you are not generating any less or more data than is needed for our downstream analyses.

Once the date spine is created, you should generate a new model to aggregate your General Ledger data by month. In addition to simply aggregating your General Ledger data by month, you will want to make sure you consider the accounts beginning, ending, and net change balance month over month. Calculating these extra fields makes for a seamless Balance Sheet and Income Statement reporting down the line.

Before generating the beginning, ending, and net change balances for each month, it is important to know that not all classifications will have the same behavior for these fields. Asset, Liability, and Equity accounts will always have a beginning, ending, and net change balance as the accounts have rolling totals that change over time. Conversely, Revenue and Expense accounts only have a net change balance. Calculating these fields can be a multi-<Term id="cte" />/model process. The process should look something along the lines of the following:

- Aggregate your General Ledger data by month
- Create a cumulative balance for balance sheet accounts
- Generate a beginning and ending balance for balance sheet accounts using the cumulative balance
- Join the General Ledger data with your date spine
- Fill in the empty month records with relevant data showing 0 in net change

I recommend referencing the dbt_quickbooks [general_ledger_balances](https://github.com/fivetran/dbt_quickbooks/blob/main/models/intermediate/int_quickbooks__general_ledger_balances.sql) model as an example of how to best follow the above steps. Once these steps are completed, you should have a model that includes an entry for every month and every account with the beginning, ending, and net change balances. 

There has been a lot to retain up to this point, but you are almost ready to finish the process and generate the final financial statements without any additional adjustments. Before you get there, you need to capture the Retained Earnings/Adjusted Income entries!

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/crown-adjustment.gif)

## Step 5: Retained Earnings / Adjusted Income

A piece that is commonly forgotten is the need to account for retained earnings/adjusted income within your balance sheet calculation. In a nutshell, this calculation is your net income/loss for a given period. Since you decided to take the approach of generating the report by month, you will simply need to calculate the Revenue minus Expenses for each given period and express this as unique entries. 

Thankfully, the bulk of the heavy lifting has already been completed in Step 4 and you can leverage this work to generate the Retained Earnings/Adjusted Income records. By first taking the Revenue records and then subtracting those by the Expense records, you can arrive at the desired outcome. One thing to call out is that you will need to create unique field names for these records as you are essentially generating new data. See the [quickbooks_retained_earnings](https://github.com/fivetran/dbt_quickbooks/blob/main/models/intermediate/int_quickbooks__retained_earnings.sql) model for how this was calculated. 

With that, you are finally at the last piece of aggregating the General Ledger by Period! Combining the Retained Earnings/Adjusted Income model with the General Ledger by Period model.

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/captain-planet-combine.gif)

## Step 6: Finish the General Ledger by Period Model

Union the General Ledger by Period model with your Retained Earnings/Adjusted Income model. Just like that, you finished the hardest part of this equation! You now have a fully usable table that contains every single month across your financial history and can see the respective account entry for that month. Bonus points as well for not forgetting about the Retained Earnings/Adjusted Income entries that will be invaluable during the Balance Sheet calculations. 

Now you can finally move into the last steps and generate the Balance Sheet and Income Statement/Profit and Loss statements.

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/devil-prada-glacial-pace.gif)

## Step 7: Generate the Balance Sheet Report

To create the Balance Sheet, you can now simply reference your General Ledger by Period and filter for balance sheet account classifications. Bada Bing... you have your Balance Sheet and can slice and dice by period to your heart's content! ❤️ ⚖️

Wow that was easy. It can’t be that simple to generate the Income Statement/Profit and Loss report, right?

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/supranos-bada-bing.gif)

## Step 8: Generate the Income Statement / Profit and Loss Report

To create the Income Statement/Profit and Loss report you can now simply reference your General Ledger by Period and filter for income statement account classifications. Bada Boom... you have your Income Statement/Profit and Loss report and can slice and dice by period to your heart's content! ❤️ 💸

Geez, I wasn't kidding. It really is that easy!

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/supranos-boom.gif)

# That’s a wrap!
You just walked through a _quick_ 8 step process to take your financial data from raw to comprehensive financial statements. I have little doubts you are currently being given a calzone party by your entire Finance team for generating the perfect financial reports!

![](/img/blog/2022-09-07-leverage-accounting-principles-when-financial-modeling/parks-and-rec-ben-wyatt.gif)

This is by no means a simple process, but the silver lining is that this is similarly performed by countless other analysts. You now have the knowledge to go forth and wrangle your own financial data with the same principles other analysts have used. Additionally, with the advent of dbt packages you can directly leverage the past work of other analysts by using the pre-built financial models without any modifications on your end! 

It is important to note that each business may differ greatly from one another. The above principles may not translate 1-to-1 exactly, but they may be slightly modified to fit your business use case. Additionally, the dbt packages may also encounter a similar “one size does not fit all” scenario. That being said, the dbt packages are maintained by passionate individuals who are always excited and willing to grow the package. If you use a dbt package solution and notice your numbers do not tie out, I would encourage opening an Issue to engage in a discourse with the maintainers and community. There may just be an update that can be applied to enhance the package and tie out your financial statements. The dbt packages are a great example of a community of analysts working together to develop pre-built data models for others to leverage.

In the end, these outlined core principles and packages are intended to be leveraged by your present and future selves. I hope they have been helpful and I look forward to hearing your thoughts. Until next time, I’ll calc-you-later!
