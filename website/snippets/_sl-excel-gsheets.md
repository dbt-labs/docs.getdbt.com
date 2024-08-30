
<!-- using html in this doc so that the props work/render correctly as it's not working/rendering correctly with plain markdown :( -->

<p><span>When querying your data with {props.type}:</span></p>

<ul>
  <li>It returns the data to the cell you clicked on. </li>
  <li> {props.bullet_1}</li> 
  <li>{props.bullet_2}</li>
</ul>

## Query Builder functions

<p><span>The {props.type} <strong>Query Builder</strong> custom menu has the following capabilities:</span></p>

<table>
  <thead>
    <tr>
      <th>Menu items</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Metrics</td>
      <td>Search and select metrics.</td>
    </tr>
    <tr>
      <td>Group By</td>
      <td>Search and select dimensions or entities to group by. Dimensions are grouped by the entity of the semantic model they come from. You may choose dimensions on their own without metrics.</td>
    </tr>
    <tr>
      <td>Time Range</td>
      <td>Quickly select time ranges to look at the data, which applies to the main time series for the metrics (metric time), or do more advanced filter using the "Custom" selection.</td>
    </tr>
    <tr>
      <td>Where</td>
      <td>Filter your data. This includes categorical and time filters.</td>
    </tr>
    <tr>
      <td>Order By</td>
      <td>Return your data order.</td>
    </tr>
    <tr>
      <td>Limit</td>
      <td>Set a limit for the rows of your output.</td>
    </tr>
  </tbody>
</table>

<p>Note: Click the info button next to any metric or dimension to see its defined description from your dbt project.</p>

#### Modifying time granularity

<p>When you select time dimensions in the <strong>Group By</strong> menu, you'll see a list of available time granularities. The lowest granularity is selected by default. Metric time is the default time dimension for grouping your metrics.</p>

#### Filtering data

<p>To use the filter functionality, choose the <a href="/docs/build/dimensions">dimension</a> you want to filter by and select the operation you want to filter on.</p>

<ul>
  <li>For categorical dimensions, you can type a value into search or select from a populated list.</li>
  <li>For entities, you must type the value you are looking for as we do not load all of them given the large number of values.</li>
  <li>Continue adding additional filters as needed with AND and OR.</li>
  <li>For time dimensions, you can use the time range selector to filter on presets or custom options. The time range selector applies only to the primary time dimension (<code>metric_time</code>). For all other time dimensions that aren't <code>metric_time</code>, you can use the "Where" option to apply filters.</li>
</ul>

#### Other settings

<p>If you would like to just query the data values without the headers, you can optionally select the <strong>Exclude column names</strong> box.</p>
<p>To return your results and keep any previously selected data below it intact, un-select the <strong>Clear trailing rows</strong> box. By default, we'll clear all trailing rows if there's stale data.</p>

<Lightbox src={ props.queryBuilder } width="35%" title="Run a query in the Query Builder. Use the arrow next to the Query button to select additional settings." />

## Using saved selections

<p><span>Saved selections allow you to save the inputs you've created in the {props.type} <strong>Query Builder</strong> and easily access them again so you don't have to continuously build common queries from scratch. To create a saved selection:</span></p>

<ol>
  <li>Run a <span>query in the <strong>Query Builder</strong>.</span></li>
  <li>Save the selection by selecting the arrow next to the <strong>Query</strong> button and then select <strong>Query & Save Selection</strong>.</li>
  <li>The application saves these selections, allowing you to view and edit them from the hamburger menu under <strong>Saved Selections</strong>.</li>
</ol>

<p><span>{props.PrivateSelections}</span></p>

### Refreshing selections

<p>Set your saved selections to automatically refresh every time you load the addon. You can do this by selecting <strong>Refresh on Load</strong> when creating the saved selection. When you access the addon and have saved selections that should refresh, you'll see "Loading..." in the cells that are refreshing.</p>

<p>Public saved selections will refresh for anyone who edits the sheet.</p>

:::tip What's the difference between saved selections and saved queries?

- Saved selections are saved components that you can create only when using the application.
- Saved queries, explained in the next section, are code-defined sections of data you create in your dbt project that you can easily access and use for building selections. You can also use the results from a saved query to create a saved selection.
:::

## Using saved queries

<p>Access <a href="/docs/build/saved-queries">saved queries</a>, powered by MetricFlow, in {props.type} to quickly get results from pre-defined sets of data. To access the saved queries in {props.type}:</p>

<ol>
  <li>Open the hamburger menu in {props.type}.</li>
  <li>Navigate to <strong>Saved Queries</strong> to access the ones available to you.</li>
  <li>You can also select <strong>Build Selection</strong>, which allows you to explore the existing query. This won't change the original query defined in the code.</li>
    <ul>
      <li>If you use a <code>WHERE</code> filter in a saved query, {props.type} displays the advanced syntax for this filter.</li>
    </ul>
</ol>
