## View downstream exposures

After setting up downstream exposures in <Constant name="cloud" />, you can view them in [<Constant name="explorer" />](/docs/explore/explore-projects) for a richer experience.

Navigate to <Constant name="explorer" /> by clicking on the **Explore** link in the navigation. From the **Overview** page, you can view downstream exposures from a couple of places:

<!-- no toc -->
- [Exposures menu](#exposures-menu)
- [File tree](#file-tree)
- [Project lineage](#project-lineage)

### Exposures menu
View downstream exposures from the **Exposures** menu item under **Resources**. This menu provides a comprehensive list of all the exposures so you can quickly access and manage them. The menu displays the following information:
   - **Name**: The name of the exposure.
   - **Health**: The [data health signal](/docs/explore/data-health-signals) of the exposure.
   - **Type**: The type of exposure, such as `dashboard` or `notebook`.
   - **Owner**: The owner of the exposure.
   - **Owner email**: The email address of the owner of the exposure.
   - **Integration**: The BI tool that the exposure is integrated with.
   - **Exposure mode**: The type of exposure defined: **Auto** or **Manual**.
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-resources.jpg" width="120%" title="View from the dbt Catalog under the 'Resources' menu."/>

### File tree
Locate directly from within the **File tree** under the **imported_from_tableau** sub-folder. This view integrates exposures seamlessly with your project files, making it easy to find and reference them from your project's structure.
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-file-tree.jpg" width="120%" title="View from the dbt Catalog under the 'File tree' menu."/>
### Project lineage
From the **Project lineage** view, which visualizes the dependencies and relationships in your project. Exposures are represented with the Tableau icon, offering an intuitive way to see how they fit into your project's overall data flow.
<DocCarousel slidesPerView={1}>
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="View from the dbt Catalog in your Project lineage view, displayed with the Tableau icon."/>
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg" width="95%" title="View from the dbt Catalog in your Project lineage view, displayed with the Tableau icon."/>
</DocCarousel>
