---
title: "Autofix deprecation warnings"
description: "Learn how you can use the Autofix tool in the Studio IDE to update project code."
sidebar_label: "Autofix deprecations"
---


You can address deprecation warnings by finding and fixing them using the autofix tool in the <Constant name="cloud_ide" />. 

To find and fix deprecations:

1. Navigate to the <Constant name="cloud_ide" /> by clicking **Studio** in the left menu.
2. Make sure to save and commit your work before proceeding. The autofix tool may overwrite any unsaved changes.
3. Click the three-dot menu located at the bottom right corner of the <Constant name="cloud_ide" />.
4. Select **Check & fix deprecations**.
     <Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.png" width="90%" title="Access the Studio IDE options menu to autofix depreation warnings"/>
5. The tool performs a `dbt parse —show-all-deprecations —no-partial-parse` and to find the deprecations in your project.
6. If you don't see the deprecations and *Autofix warnings* button then click the command history in the bottom left:
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/command-history.png" width="90%" title="Access recent commands to see the autofix button"/>
7. When the command history opens, click the Autofix warnings button:
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/autofix-button.png" width="90%" title="Access recent commands to see the autofix button"/>
8. When the proceed with autofix dialog opens, click *Continue*.

## Related docs

- [Quickstart guide](/guides)
- [About <Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features)
- [Develop in the Cloud](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)
