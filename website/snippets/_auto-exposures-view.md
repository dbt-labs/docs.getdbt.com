## View auto-exposures in dbt Explorer

After setting up auto-exposures in dbt Cloud, you can view them in dbt Explorer for a richer experience:
1. Navigate to dbt Explorer by clicking on the **Explore** link in the navigation.
2. From the **Overview** page, you can view auto-exposures from a couple of places:
   - From the **Exposures** menu item under **Resources**. This menu provides a comprehensive list of all the exposures so you can quickly access and manage them.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-resources.jpg" width="120%" title="View from the dbt Explorer under the 'Resources' menu."/>

   - Locate directly from within the **File tree** under the **imported_from_tableau** sub-folder. This view integrates exposures seamlessly with your project files, making it easy to find and reference them from your project's structure.
   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-view-file-tree.jpg" width="120%" title="View from the dbt Explorer under the 'File tree' menu."/>

   - From the **Project lineage** view, which visualizes the dependencies and relationships in your project. Exposures are represented with the Tableau icon, offering an intuitive way to see how they fit into your project's overall data flow.

   <DocCarousel slidesPerView={1}>

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage2.jpg" width="95%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

   <Lightbox src="/img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg" width="95%" title="View from the dbt Explorer in your Project lineage view, displayed with the Tableau icon."/>

   </DocCarousel>
