Adding [documentation](/docs/build/documentation) to your project allows you to describe your models in rich detail, and share that information with your team. Here, we're going to add some basic documentation to our project.

Update your `models/schema.yml` file to include some descriptions, such as those below.

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: customers
        description: One record per customer
        columns:
          - name: customer_id
            description: Primary key
            data_tests:
              - unique
              - not_null
          - name: first_order_date
            description: NULL when a customer has not yet placed an order.

      - name: stg_customers
        description: This model cleans up customer data
        columns:
          - name: customer_id
            description: Primary key
            data_tests:
              - unique
              - not_null

      - name: stg_orders
        description: This model cleans up order data
        columns:
          - name: order_id
            description: Primary key
            data_tests:
              - unique
              - not_null
          - name: status
            data_tests:
              - accepted_values:
                  arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                    values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            data_tests:
              - not_null
              - relationships:
                  arguments:
                    to: ref('stg_customers')
                    field: customer_id
    ```

    </File>

<Tabs>

<TabItem value="View in Catalog" >

[<Constant name="catalog" />](/docs/explore/explore-projects) provides powerful tools to interact with your dbt projects, including documentation:

1. Run one of the following commands:
   - `dbt docs generate` if you're on <Constant name="core" />
   - `dbt build` if you're on the <Constant name="fusion_engine" />
2. Click **<Constant name="catalog" />** in the navigation menu to launch <Constant name="catalog" />.
3. <Constant name="catalog" /> reflects **Production** by default. If your account has additional environments (for example, **Staging**), you can select them from the environment dropdown.

  <Lightbox src="/img/docs/collaborate/dbt-explorer/catalog-nav-dropdown.png" width="85%" title="Select an environment in Catalog." />

4. Select your project from the file tree.
5. Use the search bar or browse the resource list to find the `customers` model.
6. Click the model to view its details, including the descriptions you added.

  <Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-details.png" width="85%" title="View your model's documentation and lineage in Catalog." />

<Constant name="catalog" /> displays your model's description, column documentation, data tests, and lineage graph. You can also see which columns are missing documentation and track test coverage across your project.

</TabItem>

<TabItem value="View in Studio IDE" >

You can view docs directly from the IDE if you're on `Latest` or another version of <Constant name="core" />. Keep in mind that this is a legacy view and doesn't offer the same level of interactivity as <Constant name="catalog" />.

1. In the IDE, run `dbt docs generate`.
2. From the navigation bar, click the **View docs** icon located to the right of the **branch name**.
   <Lightbox src="/img/docs/collaborate/dbt-explorer/docs-icon.png" width="30%" title="The View docs icon in the Studio IDE." />
3. From **Projects**, select your project name and expand the folders.
4. Click **models** > **marts** > **customers**.
  <Lightbox src="/img/docs/collaborate/dbt-explorer/legacy-docs-view.png" width="85%" title="View your model's documentation in the legacy docs view." />

</TabItem>

</Tabs>
