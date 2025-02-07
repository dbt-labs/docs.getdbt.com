## View auto-exposures

After setting up auto-exposures in dbt Cloud, you can view them in dbt Explorer for a richer experience.

Navigate to dbt Explorer by clicking on the **Explore** link in the navigation. From the **Overview** page, you can view auto-exposures from a couple of places:
- [Exposures menu](#exposures-menu)
- [File tree](#file-tree)
- [Project lineage](#project-lineage)

### Exposures menu
View auto exposures from the **Exposures** menu item under **Resources**. This menu provides a comprehensive list of all the exposures so you can quickly access and manage them. The menu displays the following information:
   - **Name**: The name of the exposure.
   - **Health**: The [data health signal](/docs/collaborate/data-health-signals) of the exposure.
   - **Type**: The type of exposure, such as `dashboard` or `notebook`.
   - **Owner**: The owner of the exposure.
   - **Owner email**: The email address of the owner of the exposure.
   - **Integration**: The BI tool that the exposure is integrated with.
   - **Exposure mode**: The type of exposure defined: **Auto** or **Manual**. Exposures in dbt can be configured in two ways:
     - **Manual** &mdash; [Defined](/docs/build/exposures) manually and explicitly in your project’s YAML files.
     - **Auto** &mdash; Pulled automatically from your BI tool as long as your BI tool integrates with dbt Cloud and you have access to auto-exposures.
     - dbt Cloud automatically creates auto exposures for users with access, removing the need for manual YAML definitions. These auto exposures are stored in dbt’s metadata system, appear in dbt Explorer, and behave like manual exposures, however they don’t exist in YAML files.
<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-resources.jpg" width="120%" title="View from the dbt Explorer under the 'Resources' menu."/>

### File tree
Locate directly from within the **File tree** under the **imported_from_tableau** sub-folder. This view integrates exposures seamlessly with your project files, making it easy to find and reference them from your project's structure.

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-file-tree.jpg" width="120%" title="View from the dbt Explorer under the 'File tree' menu."/>

### Project lineage
From the **Project lineage** view, which visualizes the dependencies and relationships in your project. Exposures are represented with the Tableau icon, offering an intuitive way to see how they fit into your project's overall data flow.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

<Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg" width="95%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

</DocCarousel>
