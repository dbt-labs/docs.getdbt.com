This section will explain how you can test and run MetricFlow commands with dbt Cloud or dbt Core (dbt Cloud IDE support coming soon). Before you begin, you'll need to make sure you run at least one model.

:::important Testing and querying metrics in the dbt Cloud IDE not yet supported

Support for running [MetricFlow commands](/docs/build/metricflow-cloud) in the dbt Cloud IDE is not available but is coming soon. 

You can use the **Preview** or **Compile** buttons in the IDE to run semantic validations and make sure your metrics are defined. Alternatively, you can run commands with the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) or with SQL client tools like DataGrip, DBeaver, or RazorSQL. 

:::

<Tabs>


<TabItem value="cloud" label="dbt Cloud">


import InstallMFCloud from '/snippets/_sl-install-mf-cloud.md';

<InstallMFCloud />


</TabItem>

<TabItem value="core" label="dbt Core">


import InstallMetricFlow from '/snippets/_sl-install-metricflow.md';

<InstallMetricFlow />



</TabItem>

</Tabs>

