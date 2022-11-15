You can now delete the files that dbt created when you initialized the project:

1. Delete the `models/example/` directory.
2. Delete the `example:` key from your `dbt_project.yml` file, and any configurations that are listed under it.

    <File name='dbt_project.yml'>

    ```yaml
    # before
    models:
      jaffle_shop:
        +materialized: table
        example:
          +materialized: view
    ```

    </File>

    <File name='dbt_project.yml'>

    ```yaml
    # after
    models:
      jaffle_shop:
        +materialized: table
    ```

    </File>

3. Save your changes.

## Here is More Info.
Commodo anim ea aliqua consequat sit et anim minim. Magna ipsum velit minim consectetur sint proident dolore deserunt do esse nostrud ea ad consectetur. Esse dolor sit aliqua ea excepteur qui dolor aliquip ex. Proident voluptate aliquip proident sunt sit ex qui minim dolor nisi aute dolore amet.

Ullamco sit officia esse consectetur laborum irure minim non. Anim officia non adipisicing veniam dolor ipsum aliquip sunt. Cupidatat minim ipsum aute proident sit aliqua ea sint. Magna sit ad do labore excepteur dolor ex officia. Irure eu dolor eu dolor commodo id cupidatat sint sit qui veniam fugiat sint occaecat.

#### FAQs

<FAQ src="Models/removing-deleted-models" />
<FAQ src="Troubleshooting/unused-model-configurations" />
