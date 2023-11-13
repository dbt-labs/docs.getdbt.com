## Using warehouse components

You can use the following components to provide code snippets for each supported warehouse. You can see a real-life example in the docs page [Initialize your project](/guides/databricks?step=6).

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

## Using the card component

Use the `<Card` component in Docusaurus to organize and present information in a structured and visually appealing way. The `<card` component can be used to [group related information](https://docs.getdbt.com/docs/cloud/about-cloud/dbt-cloud-features), highlight important content on a page, or [create paths](https://docs.getdbt.com/docs/quickstarts/overview) in landing pages.

The `<Card` component includes:

- title prop &mdash; Title of the card
- body &mdash; Use apostrophes to display body content inside the card. This can be formatted using markdown or HTML. 
- link &mdash; Use this prop to link the entire card out. The link prop overrides any other link tags inside the body.
- icon &mdash; To add icons, add the icon file name sourced from the [icons](https://github.com/dbt-labs/docs.getdbt.com/tree/current/website/static/img/icons) folder.

For example, if you'd like to add two cards in a page:

```
div className="grid--2-col">

<Card
    title="Title of the card"
    body="The IDE is the easiest and most efficient way to develop dbt models, allowing you to build, test, run, and version control your dbt projects directly from your browser."
    link="/docs/cloud/develop-in-the-cloud"
    icon="pencil-paper"/>
    
<Card
    title="Title of the card"
    body="The IDE is the easiest and most efficient way to develop dbt models, allowing you to build, test, run, and version control your dbt projects directly from your browser."
    link="/docs/cloud/develop-in-the-cloud"
    icon="smiley-face"/>
</div>
```

You can structure cards to be in 2 or 3 column, anything more will return a one-card column. 

📌 **Link tags inside body** &mdash; You can create links for specific text by adding link tags to the content in the body prop. However, this won't work if you have a link prop because it will link out the entire card (see [loom](https://www.loom.com/share/c34967b5bd2945beb81061b43c4797be?t=80) for more history). To add link tags and have the text link out to specific links, you'll need to remove or disable the link prop. 

Here's an example where the link prop is removed:

```
div className="grid--2-col">

<Card
    title="Title of the card"
    body="The IDE is the easiest and <a href="www.getdbt.com">most efficient</a> way to develop dbt models, allowing you to build, test, run, and version control your dbt projects directly from your browser."
    icon="pencil-paper"/>
```
