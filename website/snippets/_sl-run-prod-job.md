Once you’ve defined metrics in your dbt project, you can perform a job run in your deployment environment in dbt Cloud to materialize your metrics. The deployment environment is only supported for the dbt Semantic Layer currently. 

1. Select **Deploy** from the top navigation bar.
2. Select **Jobs** to rerun the job with the most recent code in the deployment environment.
3. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" width="85%" title="DAG with metrics appearing as a red node" />
