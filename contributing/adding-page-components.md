## Using warehouse components

You can use the following components to provide code snippets for each supported warehouse. For example, you can see this when you, "[Initialize your database](/guides/getting-started/getting-set-up/setting-up-databricks#initialize-your-dbt-project)."

The following code example uses only identify two warehouse, but you can use more. 

```js
    <WHCode>

    <div warehouse="BigQuery">

    ```sql
    select * from `dbt-tutorial.jaffle_shop.customers`
    ```

    </div>

    <div warehouse="Databricks">

    ```sql
    select * from default.jaffle_shop_customers
    ```

    </div>

    </WHCode>
```

## Using tabs for multiple resources

You can use the following components to provide code snippets in a tabbed view:

```js
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