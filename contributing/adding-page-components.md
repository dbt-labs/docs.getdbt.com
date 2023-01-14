## Using warehouse components

You can use the following components to provide code snippets for each supported warehouse. You can see a real-life example in the docs page, "[Initialize your database](/docs/get-started/getting-started/getting-set-up/setting-up-databricks#initialize-your-dbt-project)."

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
        [<resource-path>](resource-path):


        ```

        </File>

        </TabItem>

        <TabItem value="sources">

        <File name='dbt_project.yml'>

        ```yml
        sources:
        [<resource-path>](resource-path):


        ```

        </File>

        </TabItem>

        </Tabs>
```