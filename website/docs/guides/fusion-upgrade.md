---
title: "Upgrade to Fusion part 2: Making the move"
id: "upgrade-to-fusion"
# time_to_complete: '30 minutes' commenting out until we test
level: 'Intermediate'
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine', 'dbt platform','Upgrade']
recently_updated: true
intro_text: This guide helps you implement an in-place upgrade from the latest version of dbt Core to the dbt Fusion engine in the dbt platform.
---

import FusionAdapters from '/snippets/_fusion-dwh.md';

## Introduction <Lifecycle status="private_preview" />

The <Constant name="fusion_engine" /> represents the next evolution of data transformation. dbt has been rebuilt from the ground up but at its most basic, <Constant name="fusion" /> is a new version, and moving to it is the same as upgrading between <Constant name="core" /> versions in the <Constant name="dbt_platform" />. Once your project is <Constant name="fusion" /> ready, it's only a matter of pulling a few levers to make the move, but you have some flexibility in how you do so, especially in your development environments. 

Once you complete the <Constant name="fusion" /> migration, your team will benefit from:

- ⚡ Up to 30x faster parsing and compilation
- 💰 30%+ reduction in warehouse costs (with state-aware orchestration)
- 🔍 Enhanced SQL validation and error messages
- 🚀 [State-aware orchestration](/docs/deploy/state-aware-about) for intelligent model rebuilding
- 🛠️ Modern development tools

:::info Fusion availability

<Constant name="fusion" /> on the <Constant name="dbt_platform" /> is currently in `Private preview`. Enabling it for your account depends on your plan:

- **Enteprise and Enterprise+ plans:** Contact your account manager to enable <Constant name="fusion" /> for your environment.
- **Developer and Starter plans:** Complete the steps in the [Part 1: Prepare for upgrade](/guides/prepare-fusion-upgrade) guide to become <Constant name="fusion" /> eligible, and it will be enabled for your account automatically so you can start the upgrade processes.

:::

## Prerequisites

Before upgrading your development environment, confirm:

- Your project is on the `Latest` release track (completed in [Part 1: Preparing to upgrade](/guides/prepare-fusion-upgrade))
- Your project must be using a supported adapter and auth method.    
    <FusionAdapters/>
- You have a developer license in <Constant name="dbt_platform" />
- <Constant name="fusion" /> has been enabled for your account
- You have appropriate permissions to modify environments (see [Assign upgrade access](/guides/upgrade-to-fusion?step=3#assign-upgrade-access-optional) if restricted)


## Upgrade your development environment

With your project prepared and tested on the `Latest` release track, you're ready to upgrade your development environment to <Constant name="fusion" />. The <Constant name="dbt_platform" /> provides a guided upgrade assistant that walks you through the process and helps validate your project is <Constant name="fusion" /> ready.

:::tip Start with development

Always upgrade your development environment first before moving to production. This lets you and your team test <Constant name="fusion" /> in a safe environment and address any issues before they affect production workflows.

:::

### Assign upgrade access (optional)

By default, the <Constant name="fusion" /> upgrade assistant is visible to all users, but account admins can restrict access using the **Fusion admin** [permission set](/docs/cloud/manage-access/enterprise-permissions#fusion-admin)

To limit access to the upgrade workflow:

1. Navigate to **Account settings** in <Constant name="dbt_platform" />.
2. Select **Groups** and choose the group to grant access.
3. Click **Edit** and scroll to **Access and permissions**.
4. Click **Add permission** and select **Fusion admin** from the dropdown.
5. Select the project(s) users should access.
6. Click **Save**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/assign-fusion-admin.png" width="60%" title="Assign Fusion admin permissions to groups"/>

For more details on access control, see [Assign access to upgrade](/docs/dbt-versions/upgrade-dbt-version-in-cloud#assign-access-to-upgrade).

### Step 1: Start the upgrade assistant

Launch the <Constant name="fusion" /> upgrade workflow from your project:

1. Log into <Constant name="dbt_platform" /> and navigate to your project.
2. From the project homepage or sidebar, click **Start Fusion upgrade** or **Get started**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/start-upgrade.png" width="60%" title="Start the Fusion upgrade from the project homepage"/>

You'll be redirected to the <Constant name="cloud_ide" /> with the upgrade assistant visible at the top.

### Step 2: Check for deprecation warnings

Even if you resolved deprecations in Part 1, run a final check to ensure nothing was missed:

1. At the top of the <Constant name="cloud_ide" />, click **Check deprecation warnings**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/check-deprecations.png" width="60%" title="Check for deprecation warnings in your project"/>

2. Wait for the parse to complete (this may take a few moments depending on project size).
3. Review the results:
   - **No warnings found**: Skip to Step 4 to continue upgrading.
   - **Warnings found**: Continue to Step 3 to resolve them.

:::info Inconsistent Fusion warnings and `dbt-autofix` logs

You may see <Constant name="fusion" /> deprecation warnings about packages not being compatible with <Constant name="fusion" />, while `dbt autofix` indicates they are compatible. Use `dbt autofix` as the source of truth because it has additional context that <Constant name="fusion" /> warnings don't have yet. This conflict is temporary and will be resolved as soon as we implement and roll out `dbt-autofix`'s enhanced compatibility detection to <Constant name="fusion" /> warnings. 

:::

### Step 3: Resolve remaining deprecations

If you find deprecation warnings, use the autofix tool to resolve them:

1. In the deprecation warnings list, click **Autofix warnings**.
2. Review the proposed changes in the dialog.
3. Click **Continue** to apply the fixes automatically.
4. Wait for the autofix tool to complete and run a follow-up parse.
5. Review the modified files in the **Version control** panel.
6. If all warnings are resolved, you'll see a success message.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/autofix-success.png" width="60%" title="Success message when deprecations are resolved"/>

For detailed information about the autofix process, see [Fix deprecation warnings](/docs/cloud/studio-ide/autofix-deprecations).

:::info Manual fixes required?

If the autofix tool can't resolve all deprecations automatically, you'll need to fix them manually. Review the warning messages for specific guidance, make the necessary changes in your code, then run **Check deprecation warnings** again.

:::

### Step 4: Enable Fusion

After you resolve all deprecations, upgrade your development environment:

1. Click the **Enable Fusion** button at the top of the <Constant name="cloud_ide" />.
2. Confirm the upgrade when prompted.
3. Wait for the environment to update (this typically takes just a few seconds).

Your development environment is now running on <Constant name="fusion" />!

### Step 5: Restart the IDE

After upgrading, all users need to restart their IDE to connect to the new <Constant name="fusion" />-powered environment:

1. If you're currently in the <Constant name="cloud_ide" />, refresh your browser window.
2. Notify your team members that they also need to restart their IDEs.

### Step 6: Verify the upgrade

Confirm your development environment is running <Constant name="fusion" />:

1. Open or create a dbt model file in the <Constant name="cloud_ide" />.
2. Look for <Constant name="fusion" />-powered [features](/docs/fusion/supported-features#features-and-capabilities):
   - Faster parsing and compilation times
   - Enhanced SQL validation and error messages
   - Improved autocomplete functionality
3. Run a simple command to test functionality:
   ```bash
   dbt compile
   ```
4. Check the command output for significantly faster performance.

### Step 7: Test your workflows

Before declaring victory, test your typical development workflows:

1. Make changes to a model and compile it by running `dbt compile`.
2. Run a subset of models: `dbt run --select model_name`.
3. Execute tests.
4. Preview results in the integrated query tool.
5. Verify Git operations (commit, push, pull) work as expected.

:::tip Share feedback

If you encounter any unexpected behavior or have feedback about the <Constant name="fusion" /> experience, share it with your account team or [dbt Support](/docs/dbt-support).

:::

### What about production?

Your development environment is now on <Constant name="fusion" />, but your production environment and deployment jobs are still running on <Constant name="core" />. This is intentional as it gives you and your team time to:

- Test <Constant name="fusion" /> thoroughly in development.
- Build confidence in the new engine.
- Identify and resolve any project-specific issues.
- Train team members on any workflow changes.

When you're ready to upgrade production, you'll update your deployment environments and jobs to use the `Latest Fusion` release track. We'll cover that in the next section.

## Upgrade staging and intermediate environments

After successfully upgrading and testing your development environment, the next step is upgrading your staging or other intermediate deployment environments. These environments serve as a critical validation layer before promoting <Constant name="fusion" /> to production, allowing you to test with production-like data and workflows while limiting risk.

:::tip Why upgrade staging first?

Staging environments provide:
- A final validation layer for <Constant name="fusion" /> with production-scale data
- The ability to test scheduled jobs and deployment workflows
- An opportunity to verify integrations and downstream dependencies
- A safe environment to identify performance characteristics before production

:::

### What is a staging environment?

A [staging environment](/docs/deploy/deploy-environments#staging-environment) is a deployment environment that mirrors your production setup but uses non-production data or limited access credentials. It enables your team to test deployment workflows, scheduled jobs, and data transformations without affecting production systems.

If you don't have a staging environment yet, consider creating one before upgrading production to <Constant name="fusion" />. It provides an invaluable testing ground.

### Step 1: Navigate to environment settings

Access the settings for your staging or intermediate environment:

1. Log into <Constant name="dbt_platform" /> and navigate to your project.
2. Click **Orchestration** in the left sidebar.
3. Select **Environments** from the dropdown.
4. Click on your staging environment name to open its settings.
5. Click the **Edit** button in the top right.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Navigate to environment settings"/>

### Step 2: Update the dbt version

Change your staging environment to use the <Constant name="fusion" /> release track:

1. In the environment settings, scroll to the **dbt version** section.
2. Click the **dbt version** dropdown menu.
3. Select **Latest Fusion** from the list.
4. Scroll to the top and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-fusion.png" width="90%" title="Select Latest Fusion from the dbt version dropdown"/>

Your staging environment is now configured to use <Constant name="fusion" />! Any jobs associated with this environment will use <Constant name="fusion" /> on their next run.

### Step 3: Run a test job

Validate that <Constant name="fusion" /> works correctly in your staging environment by running a job:

1. From the **Environments** page, click on your staging environment.
2. Select an existing job or click **Create job** to make a new one.
3. Click **Run now** to execute the job immediately.
4. Monitor the job run in real-time by clicking into the run details.

### Step 4: Monitor scheduled jobs

If you have scheduled jobs in your staging environment, monitor their next scheduled runs:

1. Navigate to **Deploy** → **Jobs** and filter to your staging environment.
2. Wait for scheduled jobs to run automatically (or trigger them manually).
3. Review job run history for any unexpected failures or warnings.
4. Compare run times to previous <Constant name="core" /> runs. You should see significant improvements.

### Step 5: Validate integrations and dependencies

Test any integrations or dependencies that rely on your staging environment:

1. **Cross-project references**: If using [dbt Mesh](/docs/mesh/govern/project-dependencies), verify downstream projects can still reference your staging models.
2. **BI tools**: Check that any BI tools or dashboards connected to staging still function correctly.
3. **Downstream consumers**: Notify teams that consume staging data to verify their processes still work.
4. **CI/CD workflows**: Run any CI jobs that target staging to ensure they execute properly.

Repeat for other intermediate environments

:::caution Found an issue?

If you encounter problems in staging:
- Review the [Fusion limitations](/docs/fusion/supported-features#limitations) to see if it's a known issue.
- Check job logs for specific error messages.
- Test the same models in your development environment to isolate the problem.
- Contact [dbt Support](/docs/dbt-support) or your account team for assistance.

You can revert the staging environment to `Latest` release track while investigating.

:::

### How long should I test in staging?

The recommended testing period depends on your organization:

- **Minimum**: Run all critical jobs at least once successfully.
- **Recommended**: Monitor scheduled jobs for 3-7 days to catch any time-based or data-dependent issues.
- **Enterprise/Complex projects**: Consider 1-2 weeks of testing, especially if you have many downstream dependencies.

Don't rush this phase. Thorough testing in staging prevents production disruptions.

---

## Upgrade your production environment

Congratulations! You've successfully upgraded development and staging environments and you're now ready for the final step: upgrading your production environment to the <Constant name="fusion_engine" />.

:::caution Production environment upgrade considerations

Upgrading production is a critical operation. While <Constant name="fusion" /> is production ready and has been thoroughly tested in your dev and staging environments, follow these best practices:
- Plan the upgrade during a low-traffic window to minimize impact.
- Notify stakeholders about the maintenance window.
- Have a rollback plan ready (reverting to `Latest` release track).
- Monitor closely for the first few job runs after upgrading.

:::


### Step 1: Plan your maintenance window

Choose an optimal time to upgrade production:

- **Review your job schedule:** Identify periods with minimal job activity.
- **Check downstream dependencies:** Ensure dependent systems can tolerate brief interruptions.
- **Notify stakeholders:** Inform BI tool users, data consumers, and team members.
- **Document the plan:** Note which jobs to monitor and success criteria.

### Step 2: Navigate to production environment settings

Access your production environment configuration:

1. Log into <Constant name="dbt_platform" /> and navigate to your project.
2. Click **Orchestration** in the left sidebar.
3. Select **Environments** from the dropdown.
4. Click on your production environment (typically marked with a **Production** badge).
5. Click the **Edit** button in the top right.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Access production environment settings"/>

### Step 3: Upgrade to Latest Fusion

Update your production environment to use <Constant name="fusion" />:

1. In the environment settings, scroll to the **dbt version** section.
2. Click the **dbt version** dropdown menu.
3. Select **Latest Fusion** from the list.
4. Review your settings one final time to ensure everything is correct.
5. Scroll to the top and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-fusion.png" width="90%" title="Select Latest Fusion for production"/>

Your production environment is now running on <Constant name="fusion" />!

### Step 4: Run an immediate test job

Validate the upgrade by running a job:

1. From the **Environments** page, click on your production environment.
2. Select a critical job that covers a good subset of your models.
3. Click **Run now** to execute the job immediately.
4. Monitor the job run closely:
   - Check the **parse** and **compile** steps.
   - Verify all models build successfully.
   - Confirm tests pass as expected.
   - Review the logs for any unexpected warnings.

If the job succeeds, your production upgrade is successful!

### Step 5: Enable state-aware orchestration (optional but recommended) <Lifecycle status="Enterprise, Enterprise+"/>

One of <Constant name="fusion" />'s most powerful features is [state-aware orchestration](/docs/deploy/state-aware-about), which automatically determines which models need rebuilding based on code or data changes. This can reduce warehouse costs by 30% or more.

New jobs automatically have state-aware orchestration enabled in <Constant name="fusion" /> environments.

To enable it for existing jobs:

1. Navigate to **Deploy** → **Jobs**.
2. Click on a production job to open its settings.
3. Click **Edit** in the top right.
4. Scroll to **Execution settings**.
5. Check the box for **Enable Fusion cost optimization features**.
6. Expand **More options** to see additional settings:
   - **State-aware orchestration**
   - **Efficient testing**
7. Click **Save**.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Enable Fusion cost optimization features"/>

Repeat this for all production jobs to maximize cost savings. For more details, see [Setting up state-aware orchestration](/docs/deploy/state-aware-setup).

:::tip Dropped tables and views

If using state-aware orchestration, dbt doesn’t detect a change if a table or view is dropped outside of dbt, as the cache is unique to each dbt platform environment. This means state-aware orchestration will not rebuild that model until either there is new data or a change in the code that the model uses.

To circumvent this limitation: 
- Use the **Clear cache** button on the target Environment page to force a full rebuild (acts like a reset), or
- Temporarily disable State-aware orchestration for the job and rerun it.


:::

### Step 6: Monitor production jobs

Watch your production jobs closely for the first 24-48 hours:

- **Check scheduled job runs:** Navigate to **Deploy** → **Jobs** → **Run history**
- **Monitor run times:** Compare to historical averages. You should see significant improvements.
- **Review the state-aware interface**: Check the [Models built and reused chart](/docs/deploy/state-aware-interface) to see cost savings in action.
- **Watch for warnings**: Review logs for any unexpected messages.

:::tip State-aware monitoring

With state-aware orchestration enabled, you'll see models marked as **Reused** in the job logs when they don't need rebuilding. This is expected behavior and indicates cost savings!

:::

### Step 7: Validate downstream integrations

Ensure all systems dependent on your production data still function correctly:

1. **BI tools:** Verify dashboards and reports refresh properly.
2. **Data consumers:** Confirm downstream teams can access and query data.
3. **APIs and integrations:** Test any applications that consume dbt outputs.
4. **Semantic Layer:** If using the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), verify metrics queries work.
5. **Alerts and monitoring**: Check that data quality alerts and monitors function correctly.

### Step 8: Update any remaining jobs with version overrides

Some jobs might have [version overrides](/docs/dbt-versions/upgrade-dbt-version-in-cloud#override-dbt-version) set from earlier testing. Now that production is on <Constant name="fusion" />, remove these overrides:

1. Navigate to **Orchestration** → **Jobs**.
2. Review each job's settings.
3. If a job has a version override (showing in the **dbt version** section), click **Edit**.
4. Remove the override to let the job inherit the environment's <Constant name="fusion" /> setting.
5. Click **Save**.

### Rollback procedure

If you encounter critical issues in production, you can revert your dbt version:

1. Navigate to **Orchestration** → **Environments** → **Production**.
2. Click **Edit**.
3. Change **dbt version** from **Latest Fusion** back to **Latest**.
4. Click **Save**.
5. Jobs will use <Constant name="core" /> on their next run.

:::info Rollback impact

Rolling back to `Latest` will disable <Constant name="fusion" />-specific features like state-aware orchestration. Only rollback if you're experiencing production-critical issues.

:::

## Next steps

🎉 Congratulations!

You've successfully upgraded your entire dbt platform project to <Constant name="fusion" />!

For your next steps:

- **Optimize further**: Explore [advanced state-aware configurations](/docs/deploy/state-aware-setup#advanced-configurations) to fine-tune refresh intervals.
- **Monitor savings**: Use the [state-aware interface](/docs/deploy/state-aware-interface) to track models built vs. reused.
- **Train your team**: Share <Constant name="fusion" /> features and best practices with your team.
- **Explore new features**: Check out column-level lineage, live CTE previews, and other <Constant name="fusion" />-powered capabilities.
- **Stay informed**: Follow the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements) for updates on new features.

:::tip Share your success

We'd love to hear about your <Constant name="fusion" /> upgrade experience! Share feedback with your account team or join the [dbt Community Slack](https://www.getdbt.com/community/join-the-community/) to discuss <Constant name="fusion" /> with other users.

:::
