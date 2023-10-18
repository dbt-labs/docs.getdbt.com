As a best practice in SQL, you should separate logic that cleans up your data from logic that transforms your data. You have already started doing this in the existing query by using common table expressions (CTEs).

Now you can experiment by separating the logic out into separate models and using the [ref](/reference/dbt-jinja-functions/ref) function to build models on top of other models:

<Lightbox src="/img/dbt-dag.png" title="The DAG we want for our dbt project" />
