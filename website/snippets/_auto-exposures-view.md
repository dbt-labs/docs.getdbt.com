## View downstream exposures

After setting up downstream exposures in <Constant name="dbt" />, you can view them in [<Constant name="catalog" />](/docs/explore/explore-projects) for a richer experience.

Navigate to <Constant name="catalog" /> by selecting **Catalog** from the top-level navigation. You can view downstream exposures from a couple of places:

<!-- no toc -->
- [Exposures menu](#exposures-menu)
- [Exposure detail page](#exposure-detail-page)
- [Project lineage](#project-lineage)

### Exposures menu

View all downstream exposures for a project from the Catalog sidebar:

1. In the sidebar, select your project.
2. Under the project, select **Exposure**. You will only see this option if you set up downstream exposures in [Tableau](/docs/platform-integrations/downstream-exposures-tableau?#set-up-in-tableau) and [dbt](/docs/platform-integrations/downstream-exposures-tableau?#set-up-in-dbt-cloud).

The **Exposures** table lists every exposure in the project so you can quickly access and manage them: 

   - **Name**: The name of the exposure.
   - **Health**: The [data health signal](/docs/explore/data-health-signals) of the exposure.
   - **Type**: The type of exposure, such as `dashboard` or `notebook`.
   - **Owner**: The owner of the exposure.
   - **Owner email**: The email address of the owner of the exposure.
   - **Integration**: The BI tool that the exposure is integrated with.
   - **Exposure mode**: The type of exposure defined: **Auto** or **Manual**. Auto exposures from Tableau appear alongside manual exposures

<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-view-resources.png" width="120%" title="View the Exposures table from the Catalog sidebar."/>

### Exposure detail page

After you open the **Exposures** table ([previous section](#exposures-menu)), select an exposure name to open its detail page.

On the exposure detail page, you can review metadata, [data health signals](/docs/explore/data-health-signals), description, and lineage. For Tableau auto exposures, use **Open in Dashboard** to open the workbook in Tableau, or **Modify integration** to update your Tableau connection settings.

<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-view-exposure-detail.png" width="120%" title="View an exposure detail page in Catalog."/>

### Project lineage

You can also view exposures from the **Project lineage** view, separate from the **Exposures** table:

1. In the sidebar, select your project.
2. Click **View lineage**.
3. Select an exposure node with the Tableau icon to view its details in the side panel.

This view visualizes the dependencies and relationships in your project. For Tableau auto exposures, use **View in Tableau** or **Modify integration** from the side panel.

<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-lineage2.png" width="95%" title="View from the dbt Catalog in your Project lineage view, displayed with the Tableau icon."/>
<Lightbox src="/img/docs/platform-integrations/auto-exposures/explorer-lineage.png" width="95%" title="View from the dbt Catalog in your Project lineage view, displayed with the Tableau icon."/>
</DocCarousel>
