--- 
title: "Copilot style guide" 
sidebar_label: Copilot style guide 
id: copilot-styleguide 
description: "Use the Copilot `dbt-styleguide.md` file for best practices and naming conventions in dbt projects." 
---

<IntroText>
This guide provides an overview of the <Constant name="copilot" /> `dbt-styleguide.md` file, outlining its structure, recommended usage, and best practices for effective implementation in your dbt projects. 
</IntroText>

The `dbt-styleguide.md` is a template for creating a style guide for dbt projects. It includes:

- SQL style guidelines (for example, using lowercase keywords and trailing commas)
- Model organization and naming conventions
- Model configurations and testing practices
- Recommendations for using pre-commit hooks to enforce style rules

This guide helps ensure consistency and clarity in dbt projects.

## `dbt-styleguide.md` for Copilot

Using <Constant name="copilot" /> in the <Constant name="cloud_ide" />, you can automatically generate a style guide template called `dbt-styleguide.md`. If the style guide is manually added or edited, it must also follow this naming convention. Any other file name cannot be used with <Constant name="copilot" />.

Add the `dbt-styleguide.md` file to the root of your project. <Constant name="copilot" /> will use it as context for the large language model (LLM) when generating [tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), [semantic models](/docs/build/semantic-models), and [documentation](/docs/build/documentation).

Note, by creating a `dbt-styleguide.md` for <Constant name="copilot" />, you are overriding dbt's default style guide.

## Creating `dbt-styleguide.md` in the Studio IDE

1. Open a file in the <Constant name="cloud_ide" />.
2. Click **<Constant name="copilot" />** in the toolbar.
3. Select **Generate ... Style guide** from the menu.
<Lightbox src="/img/docs/dbt-cloud/generate-styleguide.png" title="Generate styleguide in Copilot" /> 
4. The style guide template appears in the <Constant name="cloud_ide" />. Click **Save**. 
      `dbt-styleguide.md` is added at the root level of your project.

If you haven't previously generated a style guide file, the latest version will be automatically sourced from <Constant name="dbt_platform" />.

## If `dbt-styleguide.md` already exists

If there is an existing `dbt-styleguide.md` file and you attempt to generate a new style guide, a modal appears with the following options:

- **Cancel** &mdash; Exit without making changes.
- **Restore** &mdash; Revert to the latest version from <Constant name="dbt_platform" />.
- **Edit** &mdash; Modify the existing style guide manually.

<Lightbox src="/img/docs/dbt-cloud/styleguide-exists.png" title="Styleguide exists" />

## Further reading

- [About dbt Copilot](/docs/cloud/dbt-copilot)
- [How we style our dbt projects](/best-practices/how-we-style/0-how-we-style-our-dbt-projects)