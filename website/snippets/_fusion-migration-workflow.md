If you have access to [<Constant name="dev_agent"/>](/docs/dbt-ai/developer-agent) and [<Constant name="copilot"/>](/docs/platform/studio-ide/develop-copilot) with [AI features](/docs/platform/enable-dbt-copilot?version=2.0#enable-dbt-copilot) enabled, you can use the [<Constant name="fusion"/> migration workflow](/docs/dbt-ai/developer-agent#fusion-migration-workflow) skill. This skill can help you fix compatibility errors directly from the <Constant name="studio_ide" /> using <Constant name="copilot" /> &mdash; no manual log investigation needed. It classifies every error, applies validated fixes automatically, and surfaces what's blocked.

:::info
The <Constant name="fusion" /> migration workflow is accessible through the <Constant name="dev_agent" /> in the <Constant name="studio_ide" />. If you're using VS Code or the <Constant name="platform_cli" />, use the [autofix tool](https://docs.getdbt.com/guides/fusion-package-compat?step=4) instead.
:::

1. From the job list, click the **Review job** button for a job with a successful run.
   - If you don't see the **Review job** button, enable the **Show Fusion eligibility** toggle in the job list.
2. In the **<Constant name="fusion"/> eligibility unknown for this job** pop-up, click **Debug in Studio with Copilot**.
3. dbt redirects you to the <Constant name="studio_ide" /> and sets your personal development environment to <Constant name="fusion" />.
4. <Constant name="copilot" /> opens and automatically triggers the <Constant name="fusion" /> migration skill with this prompt:
    ```
    I need help fixing Fusion compatibility issues in this project. Please investigate and resolve any deprecation warnings or incompatibilities. Please use the migrating-dbt-core-to-fusion skill to guide this.
    ```
5. Review and approve <Constant name="copilot" />'s permission requests so it can run the commands it needs.
6. The <Constant name="dev_agent" /> iteratively runs `dbt compile`, reads the results, and applies fixes until it reaches a successful compile or encounters an error it can't resolve. If it gets blocked, it exits cleanly, explains what it could not fix, and creates and links to a markdown file summarizing all changes made. 
7. When the project compiles with no warnings or errors, commit and publish your changes.
8. After you merge the changes, wait for the job to run again or run it manually on <Constant name="fusion"/>.

<Lightbox src="/img/docs/dbt-platform/fusion-migration-workflow.gif" width="95%" title="The Developer Agent's fusion migration workflow triaging and fixing Fusion compatibility errors in the Studio IDE." />
