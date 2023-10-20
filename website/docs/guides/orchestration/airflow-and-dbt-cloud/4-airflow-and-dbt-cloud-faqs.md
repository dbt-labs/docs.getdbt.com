---
title: Airflow and dbt Cloud FAQs
id: 4-airflow-and-dbt-cloud-faqs
---
## 1. How can we run specific subsections of the dbt DAG in Airflow?

Because of the way we configured the dbt Cloud job to run in Airflow, you can leave this job to your analytics engineers to define in the job configurations from dbt Cloud. If, for example, we need to run hourly-tagged models every hour and daily-tagged models daily, we can create jobs like `Hourly Run` or `Daily Run` and utilize the commands `dbt run -s tag:hourly` and `dbt run -s tag:daily` within each, respectively. We only need to grab our dbt Cloud `account` and `job id`, configure it in an Airflow DAG with the code provided, and then we can be on your way. See more node selection options: [here](/reference/node-selection/syntax)

## 2. How can I re-run models from the point of failure?  

You may want to parse the dbt DAG in Airflow to get the benefit of re-running from the point of failure. However, when you have hundreds of models in your DAG expanded out, it becomes useless for diagnosis and rerunning due to the overhead that comes along with creating an expansive Airflow DAG.

You can’t re-run from failure natively in dbt Cloud today (feature coming!), but you can use a custom rerun parser.

Using a simple python script coupled with the dbt Cloud provider, you can:

- Avoid managing artifacts in a separate storage bucket(dbt Cloud does this for you)
- Avoid building your own parsing logic
- Get clear logs on what models you're rerunning in dbt Cloud (without hard coding step override commands)

Watch the video below to see how it works!

<WistiaVideo id="fn3ib5ew8y" />

## 3. Should Airflow run one big dbt job or many dbt jobs?

Overall we recommend being as purposeful and minimalistic as you can. This is because dbt manages all of the dependencies between models and the orchestration of running those dependencies in order, which in turn has benefits in terms of warehouse processing efforts.

## 4. We want to kick off our dbt jobs after our ingestion tool (such as Fivetran) / data pipelines are done loading data. Any best practices around that?

Our friends at Astronomer answer this question with this example: [here](https://registry.astronomer.io/dags/fivetran-dbt-cloud-census)
  
## 5. How do you set up a CI/CD workflow with Airflow?

Check out these two resources for accomplishing your own CI/CD pipeline:

- [Continuous Integration with dbt Cloud](/docs/deploy/continuous-integration)
- [Astronomer's CI/CD Example](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

## 6. Can dbt dynamically create tasks in the DAG like Airflow can?

We prefer to keep models bundled vs. unbundled. You can go this route, but if you have hundreds of dbt models, it’s more effective to let the dbt Cloud job handle the models and dependencies. Bundling provides the solution to clear observability when things go wrong -  we've seen more success in having the ability to clearly see issues in a bundled dbt Cloud job than combing through the nodes of an expansive Airflow DAG. If you still have a use case for this level of control though, our friends at Astronomer answer this question [here](https://www.astronomer.io/blog/airflow-dbt-1/)!

## 7. Can you trigger notifications if a dbt job fails with Airflow? Is there any way to access the status of the dbt Job to do that?

Yes, either through [Airflow's email/slack](https://www.astronomer.io/guides/error-notifications-in-airflow/) functionality by itself or combined with [dbt Cloud's notifications](/docs/deploy/job-notifications), which support email and slack notifications.

## 8. Are there decision criteria for how to best work with dbt Cloud and airflow?

Check out this deep dive into planning your dbt Cloud + Airflow implementation [here](https://www.youtube.com/watch?v=n7IIThR8hGk)!
