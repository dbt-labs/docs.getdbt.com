---
title: "Fix deprecation warnings"
description: "Learn how you can use the autofix tool in the Studio IDE to update project code."
sidebar_label: "Fix deprecations"
---


You can address deprecation warnings in the <Constant name="dbt_platform" /> by finding and fixing them using the autofix tool in the <Constant name="cloud_ide" />. You can run the autofix tool on the [Compatible or Latest release track](/docs/dbt-versions/cloud-release-tracks) of <Constant name="core" /> before you upgrade to Fusion!

To find and fix deprecations:

1. Navigate to the <Constant name="cloud_ide" /> by clicking **Studio** in the left menu.
2. Make sure to save and commit your work before proceeding. The autofix tool may overwrite any unsaved changes.
3. Click the three-dot menu located at the bottom right corner of the <Constant name="cloud_ide" />.
4. Select **Check & fix deprecations**.
     <Lightbox src="/img/docs/dbt-cloud/cloud-ide/ide-options-menu-with-save.png" width="90%" title="Access the Studio IDE options menu to autofix deprecation warnings"/>
        The tool performs a `dbt parse —show-all-deprecations —no-partial-parse` to find the deprecations in your project.
5. If you don't see the deprecations and the **Autofix warnings** button, click the command history in the bottom left:
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/command-history.png" width="90%" title="Access recent commands to see the autofix button"/>
6. When the command history opens, click the **Autofix warnings** button:
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/autofix-button.png" width="90%" title="Learn what deprecations need to be auto fixed"/>
7. When the **Proceed with autofix** dialog opens, click **Continue** to begin resolving project deprecations and start a follow-up parse to show remaining deprecations.
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/proceed-with-autofix.png" width="90%" title="Proceed with autofix"/> 
8. Once complete, a success message appears. Click **Review changes** to verify the changes.
    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/autofix-success.png" width="90%" title="Success"/>
9. Click **Commit and sync** in the top left of <Constant name="cloud_ide" /> to commit these changes to the project repository.
10. You are now ready to enable Fusion if you [meet the requirements](/docs/fusion/supported-features#requirements)!

## Related docs

- [Quickstart guide](/guides)
- [About <Constant name="cloud" />](/docs/cloud/about-cloud/dbt-cloud-features)
- [Develop in the Cloud](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)
