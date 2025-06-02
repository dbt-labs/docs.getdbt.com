## Using warehouse components

You can use the following components to provide code snippets for each supported warehouse. You can see a real-life example in the docs page [Initialize your project](/guides/databricks?step=6).

Identify code by labeling with the warehouse names:

```sql
        <WHCode>

        <div warehouse="warehouse#1">

        ```
        select * from `dbt-tutorial.jaffle_shop.customers`
        ```

        </div>

        <div warehouse="warehouse#2">

        ```
        select * from default.jaffle_shop_customers
        ```

        </div>

        </WHCode>
```

## Using tabs for multiple resources

You can use the following components to provide code snippets in a tabbed view. You can see a real-life example in the docs page, "[Building models](https://docs.getdbt.com/docs/building-a-dbt-project/building-models#building-dependencies-between-models)."

Identify code and code files by labeling with the component they are describing:

```sql
        <Tabs
        defaultValue="models"
        values={[
            { label: 'Models', value: 'models', },
            { label: 'Sources', value:'sources', },
        ]
        }>

        <TabItem value="models">

        <File name='models/<modelname>.sql'>

        ```

        \{\{ config(

        ) \}\}

        select ...


        ```

        </File>

        <File name='dbt_project.yml'>

        ```
        models:
        [resource-path](/reference/resource-configs/resource-path):


        ```

        </File>

        </TabItem>

        <TabItem value="sources">

        <File name='dbt_project.yml'>

        ```
        sources:
        [resource-path](/reference/resource-configs/resource-path):


        ```

        </File>

        </TabItem>

        </Tabs>
```

### Link to tabbed content

You can use the [queryString](https://docusaurus.io/docs/next/markdown-features/tabs?current-os=ios#query-string) prop in the `<Tabs>` tag. This allows you to share a link to a page with a pre-selected tab so that clicking on a tab creates a unique hyperlink for that tab. However, this feature doesn't provide an anchor link, which means the browser won't scroll to the tab. Additionally, you can define the search parameter name to use. If the tabs content is under a header, you can alternatively link to the header itself, instead of the `queryString` prop.

In the following example, clicking a tab adds a search parameter to the end of the URL: `?current-os=android or ?current-os=ios`.

```sql
<Tabs queryString="current-os">
  <TabItem value="android" label="Android">
    Android
  </TabItem>
  <TabItem value="ios" label="iOS">
    iOS
  </TabItem>
</Tabs>
```

## Markdown Links

Refer to the <a href="https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-style-guide.md#Links" target="_blank" rel="noreferrer">Links section</a> of the Content Style Guide to read about how you can use links in the dbt product documentation.

## Collapsible header

<Collapsible header="The header info">
    <div>
        <p>Shows and hides children elements</p>
    </div>
</Collapsible>

```markdown
<Collapsible header="The header info">
<div>
<p>Shows and hides children elements</p>
</div>
</Collapsible>
</div>
```

## File component

```yml
<File name="~/.dbt/profiles.yml">

```yaml
password: hunter2
```
</File>
```

## LoomVideo component
 
<pre>{`<LoomVideo id="09919ddb02e44015878c9e93e15fe792" />`}</pre>

<LoomVideo id="09919ddb02e44015878c9e93e15fe792" />

## YoutubeVideo component

<pre>{`<YoutubeVideo id="5yyGT1k2xzY" />`}</pre>

<YoutubeVideo id="5yyGT1k2xzY" />

