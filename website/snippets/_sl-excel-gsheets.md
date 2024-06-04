
<span>The dbt Semantic Layer offers a seamless integration with {props.type} through a custom menu. This add-on allows you to build dbt Semantic Layer queries and return data on your metrics directly within {props.type}.</span>

## Prerequisites

- You have [configured the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl) and are using dbt v1.6 or higher.
- You need a <span>Google account with access to {props.type} and the ability to install Google add-ons.</span>
- You have a [dbt Cloud Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) and a [service token](/docs/dbt-cloud-apis/service-tokens) to authenticate with from a dbt Cloud account.
- You must have a dbt Cloud Team or Enterprise [account](https://www.getdbt.com/pricing). Suitable for both Multi-tenant and Single-tenant deployment.
  - Single-tenant accounts should contact their account representative for necessary setup and enablement.

If you're using [IP restrictions](/docs/cloud/secure/ip-restrictions), ensure you've added [Google’s IP addresses](https://www.gstatic.com/ipranges/goog.txt) to your IP allowlist. <span>Otherwise, the {props.type} connection will fail.</span>

<!--
import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>
-->

## Installing the add-on

1. Navigate to the [dbt Semantic Layer for Sheets App](https://gsuite.google.com/marketplace/app/foo/392263010968) to install the add-on. <span>You can also find it in {props.type} by going to [**Extensions -> Add-on -> Get add-ons**](https://support.google.com/docs/answer/2942256?hl=en&co=GENIE.Platform%3DDesktop&oco=0#zippy=%2Cinstall-add-ons%2Cinstall-an-add-on) and searching for it there.</span>
2. After installing, open the **Extensions** menu and select **dbt Semantic Layer for Sheets**. This will open a custom menu on the right-hand side of your screen.
3. [Find your](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) **Host** and **Environment ID** in dbt Cloud.
   - Navigate to **Account Settings** and select **Projects** on the left sidebar.
   - Select your project and then navigate to the **Semantic Layer** settings.  <span>You'll need this to authenticate in {props.type} in the following step.</span>
   - You can [generate your service token](/docs/dbt-cloud-apis/service-tokens) by clicking **Generate Service Token** within the Semantic Layer configuration page or navigating to **API tokens** in dbt Cloud.
4. In <span>{props.type}, authenticate with your host, dbt Cloud environment ID, and service token.</span>
   <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-and-gsheets.jpg" width="70%" title="Access your Environment ID, Host, and URLs in your dbt Cloud Semantic Layer settings. Generate a service token in the Semantic Layer settings or API tokens settings" />

5. Start querying your metrics using the **Query Builder**. For more info on the menu functions, refer to [Query Builder functions](#query-builder-functions). To cancel a query while running, press the "Cancel" button.

<span>When querying your data with {props.type}:</span>

- It returns the data to the cell you have clicked on, and each cell where data is requested will have a note attached to it, indicating what has been queried and the timestamp.
- The custom menu operation has a timeout limit of six (6) minutes.
- If you're using this extension, make sure you're signed into Chrome with the same Google profile you used to set up the Add-On. Log in with one Google profile at a time as using multiple Google profiles at once might cause issues.

## Query Builder functions

<span>The {props.type} **Query Builder** custom menu has the following capabilities:</span>


| Menu items    | Description                                           |
|---------------|-------------------------------------------------------|
| Metrics       | Search and select metrics.                             |
| Group By      | Search and select dimensions or entities to group by. Dimensions are grouped by the entity of the semantic model they come from. You may choose dimensions on their own without metrics. |
| Time Range    | Quickly select time ranges to look at the data, which applies to the main time series for the metrics (metric time), or do more advanced filter using the "Custom" selection|
| Where         | Filter your data. This includes categorical and time filters. |
| Order By      | Return your data order.                              |
| Limit         | Set a limit for the rows of your output.               |

Note: Click the info button next to any metric or dimension to see its defined description from your dbt project.

#### Modifying time granularity

When you select time dimensions in the **Group By** menu, you'll see a list of available time granularities. The lowest granularity is selected by default. Metric time is the default time dimension for grouping your metrics.

**Filtering data**

To use the filter functionality, choose the [dimension](docs/build/dimensions) you want to filter by and select the operation you want to filter on.
- For categorical dimensions, you can type a value into search or select from a populated list. For entities, you must type the value you are looking for as we do not load all of them given the large number of values.
- Continue adding additional filters as needed with AND and OR.

For time dimensions, you can use the time range selector to filter on presets or custom options. The time range selector applies only to the primary time dimension (`metric_time`). For all other time dimensions that aren't `metric_time`, you can use the "Where" option to apply filters.

**Querying without headers or columns**

If you would like to just query the data values without the headers, you can optionally select the **Exclude Column Names** box.

## Using saved selections
<span>Saved selections allow you to save the inputs you've created in the {props.type} **Query Builder** and easily access them again so you don't have to continuously build common queries from scratch. To create a saved selection:</span>

1. Run a <span>query in the {props.type} **Query Builder**.</span>
2. Save the selection by selecting the arrow next to the **Query** button and then select **Query & Save Selection**.
3. The application saves these selections, allowing you to view and edit them from the hamburger menu under **Saved Selections**. 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/gsheets-query-builder.jpg" width="25%" title="Query and save selections in the Query Builder using the arrow next to the Query button." />

You can also make these selections private or public:
- **Public selections** mean your inputs are available in the menu to everyone on the sheet.
- **Private selections** mean your inputs are only visible to you. Note that anyone added to the sheet can still see the data from these private selections, but they won't be able to interact with the selection in the menu or benefit from the automatic refresh.

### Refreshing selections

Set your saved selections to automatically refresh every time you load the addon. You can do this by selecting **Refresh on Load** when creating the saved selection. When you access the addon and have saved selections that should refresh, you'll see "Loading..." in the cells that are refreshing. 

Public saved selections will refresh for anyone who edits the sheet while private selections will only update for the user who created it.

:::tip What's the difference between saved queries and saved selections?

- Saved selections are saved components that <span>you can create only when using the {props.type} application.</span>
- Saved queries, explained in the next section, are code-defined sections of data you create in your dbt project that you can easily access and use for building selections. You can also use the results from a saved query to create a saved selection.
:::
