---
title: "Fix deprecation warnings"
description: "Learn how you can use the autofix tool in the Studio IDE to update project code."
sidebar_label: "Fix deprecations"
---


You can address deprecation warnings in the <Constant name="dbt_platform" /> by finding and fixing them using the autofix tool in the <Constant name="studio_ide" />. You can run the autofix tool on the [Compatible or Latest release track](/docs/dbt-versions/cloud-release-tracks) of <Constant name="core" /> before you upgrade to Fusion!

To find and fix deprecations:

1. Navigate to the <Constant name="studio_ide" /> by clicking **Studio** in the left menu.
2. Make sure to save and commit your work before proceeding. The autofix tool may overwrite any unsaved changes.
3. Click the three-dot menu located at the bottom right corner of the <Constant name="studio_ide" />.
4. Select **Check & fix deprecations**.
     <Lightbox src="/img/docs/dbt-platform/platform-ide/ide-options-menu-with-save.png" width="90%" title="Access the Studio IDE options menu to autofix deprecation warnings"/>
        The tool performs a `dbt parse —show-all-deprecations —no-partial-parse` to find the deprecations in your project.
5. If you don't see the deprecations and the **Autofix warnings** button, click the command history in the bottom left:
    <Lightbox src="/img/docs/dbt-platform/platform-ide/command-history.png" width="90%" title="Access recent commands to see the autofix button"/>
6. When the command history opens, click the **Autofix warnings** button:
    <Lightbox src="/img/docs/dbt-platform/platform-ide/autofix-button.png" width="90%" title="Learn what deprecations need to be auto fixed"/>
7. When the **Proceed with autofix** dialog opens, click **Continue** to begin resolving project deprecations and start a follow-up parse to show remaining deprecations.
    <Lightbox src="/img/docs/dbt-platform/platform-ide/proceed-with-autofix.png" width="90%" title="Proceed with autofix"/>
8. Once complete, a success message appears.

    <VersionBlock lastVersion="1.99">
    Click **Review changes** to verify the changes.
    <Lightbox src="/img/docs/dbt-platform/platform-ide/autofix-success.png" width="90%" title="Success"/>
    </VersionBlock>

    <VersionBlock firstVersion="2.0">
    After a successful `dbt parse` command, you'll see a **Compile** button to the right of the **Successfully resolved** result. Use **Compile** to compile your project from the results panel. 
    <Lightbox src="/img/docs/dbt-platform/platform-ide/autofix-success-fusion-compile.png" width="90%" title="Autofix success with Compile in the Fusion flow"/>

    If successful, you'll see a **Successfully compiled** result. If you see any errors, review them and make any necessary changes.
    </VersionBlock>

9. Click **Commit and sync** in the top left of <Constant name="studio_ide" /> to commit these changes to the project repository.
10. You are now ready to enable Fusion if you [meet the requirements](/docs/fusion/supported-features#requirements)!

## Related docs

- [Quickstart guide](/guides)
- [About <Constant name="dbt" />](/docs/platform/about-platform/dbt-cloud-features)
- [Develop in the Cloud](/docs/platform/studio-ide/develop-in-studio)
