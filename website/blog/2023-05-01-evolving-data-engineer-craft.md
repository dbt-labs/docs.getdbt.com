---
title: "Data engineers + dbt v1.5: Evolving the craft for scale"
description: "Where have we been? Where are we going? What does the future hold for data engineers? How can dbt help you get there?"
slug: evolving-data-engineer-craft

authors: [sung_chung, kira_furuichi]

hide_table_of_contents: false

date: 2023-05-01
is_featured: true
---

# Data Engineers + dbt 1.5: Evolving the Craft for Scale

I, Sung, entered the data industry by chance in Fall 2014. I was using this thing called audit command language (ACL) to automate debits equal credits for accounting analytics (yes, it’s as tedious as it sounds). I remember working my butt off in a hotel room in Des Moines, Iowa where the most interesting thing there was a Panda Express. It was late in the AM. I’m thinking about 2 am. And I took a step back and thought to myself, “Why am I working so hard for something that I just don’t care about with tools that hurt more than help?”
<!--truncate-->

I did lots of soul searching and deduced I loved analytics, but not the job and subject matter. My next gig was in consulting where I bootstrapped my way into data engineering and had to learn the whole gamut below.

| Tech skills | Place in tech stack | Why it mattered at the time |
| --- | --- | --- |
| Airflow | Orchestrator | The industry standard to run data pipelines |
| SQL | Lingua franca of data transformation | My business logic codified (think: revenue by month) |
| Python | Lingua franca of data engineering | It’s how you use Airflow |
| Terraform | Get infra ready for airflow Kubernetes cluster | Infrastructure automation |
| Google Cloud | Cloud | Big customer footprint |
| Amazon Web Services | Cloud | Big customer footprint |
| dbt | The T in ELT | The reason people finally test their data with SQL |
| BigQuery | Cloud data warehouse | A lot of my clients used this |

These are still great skills to learn and maintain even six years after I learned them in 2017. Armed with them, I finally saw the magic of the modern data stack and what problems it could solve. It took my questionable little pipelines back in 2014 and made them gleam with a new shine (and reliability). I felt like what the cool kids call a **[10x data engineer](https://knowyourmeme.com/memes/10x-engineer)**. 

However, as my skills grew, so did the problems. Big Data eventually turned into data swamps, the charm of using these great tools lost its shine, and my excitement gradually gave way to exhaustion. Not because they’re bad tools, but because the problem space of managing giant mounds of data required something data tools are still wrestling with today: scale and control. I kept looking for goldilocks projects to save/make money for companies. I wanted to build prestige in my career. But in practice, I was babysitting brittle data pipelines. To enable dozens of people was mind-numbing, much less hundreds of data analysts to all work elegantly together.

I’m still juggling my messy data pipelines and wondering what’s signal vs. noise in how to evolve my skills. I feel like a .5x data engineer. It’s like taking 2 steps forward and 1 big step back. So my question becomes:

> Why am I working so hard for data pipelines no one uses and **scale** that hurts more than helps?
> 

I take a step back and realize my job is playing more defense than offense. My KPIs are less about revenue and cost impact, and more about how many times I get yelled at this week and making that number go down and to the right. This was/is my story, and I have a strong feeling it’s yours too.

And I know there isn’t a silver bullet to solve all the above, but I do want to see momentum in the right direction. Where have tools like dbt met me and how exactly does it need to meet me going forward?

## Where dbt is meeting data engineers, and where it’s going

The joys and pains of data engineering and analytics engineering are real; the win you get when a stakeholder eventually contributes to a dbt model; the loss when a pipeline breaks, and the onslaught of Slack notifications that come hurling your way. dbt transformed ;) the way data teams interact with their data, and the people that depend on them. When dbt was first developed, it aimed to bring the best practices in software engineering to the field of analytics—this meant version-controlled, rigorously tested, and collaborative data transformations. dbt brought code-based tests, integrated CI, efficient development with packages, and global docs. These features have been foundational to the way data teams work, and have allowed data engineers to focus on the most important part of their job: building data pipelines that power the business.

### Building the future: Where data engineers are going with dbt

As dbt has grown, so has the complexity of dbt projects. Tristan has [written extensively about this](https://www.getdbt.com/blog/analytics-engineering-next-step-forwards/), but a few years ago, a *big* dbt project was ~500 models. Today, there are many organizations with *thousands* of dbt models. This level of complexity and organization has changed the landscape of interesting problems in the analytics engineering space; dependency graphs become increasingly large, identifying ownership becomes murky, and the barrier to contribution is raised. You can see how larger, complex data teams approach this today in this public GitHub discussion: [https://github.com/dbt-labs/dbt-core/discussions/5244](https://github.com/dbt-labs/dbt-core/discussions/5244).

v1.5 features aim to support the growth of those type of dbt projects by going back to the roots of software engineering best practices—dbt v1.5 is bringing service oriented architectures to a dbt project near you. dbt’s v1.5 features of contracts, model versions, and group permissions—alongside all of the foundational “dbtonic” things—culminate in a toolkit that will allow data engineers, alongside analysts, to build long-term, scalable, and efficient dbt projects.

Below, we’ll breakdown where dbt v1.5 is evolving scale and control in your work, and how it’ll elevate your daily practice of data engineering (and remove some of those panicked Slack messages 😉).

[**Model Contracts**](https://docs.getdbt.com/docs/collaborate/publish/model-contracts)

- **Problems you’re living through**: I can’t guarantee the shape of my data (think: column names, data types, no blank values) without triple checking my work and running `dbt build` a couple times and eyeballing my data. I get tired of doing this everyday, so I end up not doing it in the long-term.
- **Solution**: Model contracts allow you to define how a model should conform—which columns will never be `null`, which columns will always be a certain type, and more—all within a `YAML` file. These contracts are meant to be binding artifacts that create levels of accountability between the folks that create a model with a contract, and the downstream consumers of that model.
- **How it will change your daily work**: The lingering doubt—*”can I trust this table?”*—is removed with a model contract. These contracts create systems of accountability, governance, and reliability, ultimately allowing people to feel confident in the models they reference. With a contract, you shouldn’t have to test if the primary key from an upstream reference is null, the contract stated as so—and that contract is law.

```yaml
# snowflake contract example
models:
  - name: dim_customers
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: integer
        description: hello
        constraints:
          - type: not_null
          - type: primary_key # not enforced  -- will warn & include in DDL
          - type: check       # not supported -- will warn & exclude from DDL
            expression: "id > 0"
        tests:
          - unique            # primary_key constraint is not enforced
      - name: customer_name
        data_type: text
      - name: first_transaction_date
        data_type: date
```

```sql
--SQL run against database
create or replace transient table <database>.<schema>.dim_customers        
(
    id integer not null primary key,
    customer_name text,
    first_transaction_date date  
)
as
(
select 
  1 as id, 
  'My Favorite Customer' as customer_name, 
  cast('2019-01-01' as date) as first_transaction_date
);
```

[**Model Versions**](https://docs.getdbt.com/docs/collaborate/publish/model-versions)

- **Problems you’re living through**: I change my vital model `fct_orders.sql` every week, and many people rely on this for their work. However, I keep getting doubtful questions on what’s changed since my last update, and I don’t have great way to instill confidence that this will/won’t break the way they rely on it.
- **What it is**: Model versions in v1.5 allow you to create, specify, and reference versions of models. Core reporting models can now be updated and deprecated following software engineering practices and create systems of accountability between data creators and data consumers.
- **How it will change your daily work**: Not every model is going to need to be versioned, but for core models that power your business intelligence, *power your data team*, you will now have the option to create multiple versions of a model and implement breaking changes in a more realistic and accountable way. Say I’m the primary owner of Core Data Team dbt `Project A`, and inside that project contains a core `dim_customers` model that powers the way finance, customer success, and marketing analyze customer data and CLV (customer lifetime value). I need to make a breaking change to `dim_customers`—CLV is going to be removed in favor of a more complex ROI value. Finance team uses the existing CLV value for cohort analysis and other reports, but understands that the new ROI column may be more favorable over time. However, it takes time to transition those reports and systems to conform to the ROI values, so `Project A` can develop a `dim_customers_v2` that drops LTV in favor for the new ROI.

```yaml
models:
  - name: dim_customers
    latest_version: 2
    config:
      contract:
        enforced: true
    columns:
      - name: id
        data_type: integer
        description: hello
        constraints:
          - type: not_null
          - type: primary_key # not enforced  -- will warn & include in DDL
          - type: check       # not supported -- will warn & exclude from DDL
            expression: "id > 0"
        tests:
          - unique            # primary_key constraint is not enforced, so also verify with a dbt test
      - name: customer_name
        data_type: text
      - name: first_transaction_date
        data_type: date
    versions:
      - v: 2
        columns: 
          - include: '*'
            exclude: ['first_transaction_date']
      - v: 1
        columns:
          - include: '*'
        defined_in: dim_customers
```

```sql
select * from {{ ref('dim_customers', v=2) }}
```

[**Model Access**](https://docs.getdbt.com/docs/collaborate/govern/model-access)

- **Problems you’re living through**: I split out my dbt project subdirectories in sales, marketing, and finance, and have a large team referencing dbt models across those folders everyday. However, I notice a lot of the references use staging tables that are incomplete and shouldn’t be referenced. I don’t have a good way to prevent inappropriate references.
- **What it is**: You can now define public, private, and protected models within dbt project subdirectories and models so your teammates only touch what they’re supposed to!
- **How it will change your daily work**: The exhaustive sighs of telling your teammates, “you’re not supposed to use that model” is now gone. dbt practices energetic boundaries between multiple files and subfolders and tells your teammates why they can’t reference a specific dbt model.

```yaml
models:
  - name: finance_model
    access: private
    group: finance
  - name: marketing_model
    group: marketing
```

```sql
--models/marketing/marketing_model.sql

select * from {{ ref('finance_model') }}
```

```bash
$ dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```

## What does winning with v1.5 look like for you, the data engineer?
This is great and all, but how do we know if these features are working to make your work more streamlined, intuitive, or easier? Because you’re probably wondering, “Are we trying to inflate v1.5 as this silver bullet to solve all data transformation problems?” Short answer: “No”. We just want to have less headaches when it comes to governing and scaling your data work, and bring back the joy working with data.

If it’s anything like the imagined future we have for you below, then we all win:

| 😊 Emotional Victory |  📝 Future Resume Bullet Points |
| --- | --- |
| Invite people into the magic of working with and in data | - Scaled from 10 to 500 users in dbt Cloud and, on average, onboarded new users in 1 week |
| Getting one step closer to self-service without the eye-rolling | - Established uptime of 99.99% with core metrics like revenue, marketing, churn with model contracts and dbt Semantic Layer and reduced data validation efforts by the business by 5 hours per week |
| The tedious admin work melts away and you get that breath of relief knowing people aren’t “moving fast and breaking things”…as much | - Reduced 5% of all transform spend with less code implementing data model contracts with 10% more quality. Removed 4 hours per person per week in teams across finance, marketing, sales by reducing duplicative development by 20% and reduced basic context gathering |
| Get the taste of being offensive vs. defensive with your work | - Used dbt to drive revenue (think: embedded data products) and added a new SKU earning $500,000 per year |

## So, what’s next?

- Try out v1.5! Let us know how the ergonomics and functionality of model contracts, versions, and group permissions feel to you. Open up an issue if you notice any bugs.
- Watch the [Community recording on contracts](https://www.loom.com/share/375dee38aa9448deaed860a06487f8ff)—a great way to see them live in action—or [watch the recording from Staging](https://www.getdbt.com/resources/staging-april-2023/) to see dbt v1.5 features come to life!
- Comment directly in this post on thoughts of v1.5 or this article!
- Join the [#multi-project channel](https://getdbt.slack.com/archives/C04FP5LQA15) in the [dbt Community Slack](https://www.getdbt.com/community/join-the-community/)—start sparking up conversations with people like myself around the pains and gains of multi-deployment dbt projects. Validate if the constructs in v1.5 translate well to a multi-project future.