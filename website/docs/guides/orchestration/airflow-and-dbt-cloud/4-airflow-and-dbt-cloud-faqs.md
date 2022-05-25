---
title: Airflow and dbt Cloud FAQs
id: 4-airflow-and-dbt-cloud-faqs
---

The questions to the Professional Services team aren’t centered around the setup of Airflow - it’s more about how dbt processes can be managed with Airflow and best practices around that implementation. The following are a short list of questions similar to those that have been asked in the past by our clients:

## 1. How can we run specific subsections of the dbt DAG in Airflow?

Because of the way we configured the dbt Cloud job to run in Airflow, you can leave this job to your analytics engineers to define in the job configurations from dbt Cloud. If, for example, we need to run hourly-tagged models every hour and daily-tagged models daily, we can create jobs like `Hourly Run` or `Daily Run` and utilize the commands `dbt run -s tag:hourly` and `dbt run -s tag:daily` within each, respectively. We only need to grab our dbt Cloud `account` and `job id`, configure it in an Airflow DAG with the code provided, and then we can be on your way. See more node selection options: [here](https://docs.getdbt.com/reference/node-selection/syntax)

## 2. I want to be able to re-run models from the point of failure - does dbt have a way to do that in conjunction with Airflow, or do I need to make a task per model to make this work how I want it to in Airflow?

1. You can’t do this natively in dbt Cloud today (feature coming!), but you can use this custom rerun parser. Watch the video below to see how it works!

2. The main reason you want to parse the DAG in airflow is to solve for rerun from point of failure. But when you have hundreds of models in your DAG expanded out, it becomes useless for diagnosis and rerunning from point of failure(think: zooming in and out of the airflow DAG to click on the tasks to rerun)

3. Using a simple python script coupled with the dbt Cloud provider, you can:
   - Avoid managing artifacts in a separate storage bucket(dbt Cloud does this for you)
   - Avoid building your own parsing logic
   - Get clear logs on what models you're rerunning in dbt Cloud (without hard coding step override commands)

<LoomVideo id="a8f3724ee3884414a96943a3d0752b96" />

## 3. Do you have any best practice recommendations for dbt orchestration with Airflow?

1. Should Airflow run one big dbt job or many dbt jobs?
   1. One dbt job as dbt manages the dependencies between all the tables/views to be created in order
2. We want to kick off our dbt jobs after our ingestion tool (such as Fivetran) / data pipelines are done loading data. Any best practices around that?
   1. Our friends at Astronomer answer this question with this example: [here](https://registry.astronomer.io/dags/fivetran-dbt-cloud-census)

## 4. How do you set up a CI/CD workflow with Airflow?

1. Our friends at Astronomer answer this question: [here](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

2. For CI/CD for dbt Cloud jobs, check out the docs: [here](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration#overview)

## 5. Can dbt dynamically create tasks in the DAG like Airflow can?

1. Related: How do we dynamically create tasks in the Airflow DAG for our dbt models, so that way we don’t have to manage adding new tasks for new models?

2. Our friends at Astronomer answer this question: [here](https://www.astronomer.io/blog/airflow-dbt-1/)
  
   1. You can go this route, but if you have hundreds of dbt models, it’s more effective to let dbt Cloud job bundle up all the dbt models vs. unbundling it yourself. What matters is clear observability when things go wrong. If you see hundreds of unbundled models, I have not seen people successful combing through all the task nodes to rerun things elegantly(think: zooming in and out of your DAG to make sense of what failed vs. not)

## 6. Can you trigger notifications if a dbt job fails with Airflow? Is there any way to access the status of the dbt Job to do that?

1. Yes, either through [airflow email/slack](https://www.astronomer.io/guides/error-notifications-in-airflow/) functionality AND/OR [dbt Cloud notifications](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-notifications) which supports email and slack notifications

## 7. Are there decision criteria for how to best work with dbt Cloud and airflow?

1. Check out this talk: [here](https://www.youtube.com/watch?v=n7IIThR8hGk)
