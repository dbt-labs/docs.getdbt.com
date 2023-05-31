## Using warehouse components

You can use the following components to provide code snippets for each supported warehouse. You can see a real-life example in the docs page [Initialize your project](/quickstarts/databricks?step=6).

Identify code by labeling with the warehouse names:

```js
        <WHCode>

        <div warehouse="warehouse#1">

        ```sql
        select * from `dbt-tutorial.jaffle_shop.customers`
        ```

        </div>

        <div warehouse="warehouse#2">

        ```sql
        select * from default.jaffle_shop_customers
        ```

        </div>

        </WHCode>
```

## Using tabs for multiple resources

You can use the following components to provide code snippets in a tabbed view. You can see a real-life example in the docs page, "[Building models](https://docs.getdbt.com/docs/building-a-dbt-project/building-models#building-dependencies-between-models)."

Identify code and code files by labeling with the component they are describing:

```code
        <Tabs
        defaultValue="models"
        values={[
            { label: 'Models', value: 'models', },
            { label: 'Sources', value:'sources', },
        ]
        }>

        <TabItem value="models">

        <File name='models/<modelname>.sql'>

        ```sql

        {{ config(

        ) }}

        select ...


        ```

        </File>

        <File name='dbt_project.yml'>

        ```yml
        models:
        [<resource-path>](/reference/resource-configs/resource-path):


        ```

        </File>

        </TabItem>

        <TabItem value="sources">

        <File name='dbt_project.yml'>

        ```yml
        sources:
        [<resource-path>](/reference/resource-configs/resource-path):


        ```

        </File>

        </TabItem>

        </Tabs>
```

### Link to tabbed content

You can use the [queryString](https://docusaurus.io/docs/next/markdown-features/tabs?current-os=ios#query-string) prop in the `<Tabs>` tag. This allows you to share a link to a page with a pre-selected tab so that clicking on a tab creates a unique hyperlink for that tab. However, this feature doesn't provide an anchor link, which means the browser won't scroll to the tab. Additionally, you can define the search parameter name to use. If the tabs content is under a header, you can alternatively link to the header itself, instaed of the `queryString` prop.

In the following example, clicking a tab adds a search parameter to the end of the URL: `?current-os=android or ?current-os=ios`.

```
<Tabs queryString="current-os">
  <TabItem value="android" label="Android">
    Android
  </TabItem>
  <TabItem value="ios" label="iOS">
    iOS
  </TabItem>
</Tabs>
```
