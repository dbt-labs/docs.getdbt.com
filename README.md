_We use [docusaurus](https://v2.docusaurus.io/) to power [docs.getdbt.com](https://docs.getdbt.com/)._

#### Table of Contents

* [Code of Conduct](#Code-of-conduct)
* [Contributing](#contributing)  
* [Writing content](#writing-content)
* [Running the docs site locally](#running-the-docs-site-locally)

# Code of conduct

Please review the dbt docs contributors [code of conduct](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/contributor-code-of-conduct.md).
Creating an inclusive and equitable environment for our documents is more important than any other aspect.  Syntax errors can be corrected, but trust, once lost, is difficult to gain back.

# Contributing

We welcome contributions from community members to this repo:
- **Fixes**: When you notice an error, you can use the `Edit this page` button at the bottom of each page to suggest a change.
- **New documentation**: If you contributed code in [dbt-core](https://github.com/dbt-labs/dbt-core), we encourage you to also write the docs here! Please reach out in the dbt community if you need help finding a place for these docs.
- **Major rewrites**: You can [file an issue](https://github.com/dbt-labs/docs.getdbt.com/issues/new?assignees=&labels=content%2Cimprovement&template=improve-docs.yml) or [start a discussion](https://github.com/dbt-labs/docs.getdbt.com/discussions) to propose ideas for a content area that requires attention.

You can use components documented in the [docusaurus library](https://v2.docusaurus.io/docs/markdown-features/).

# Writing content

We author content using Markdown and sometimes HTML. When writing content, you should refer to the [style guide](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-style-guide.md) and [content types](/contributing/content-types.md) to help you understand our writing standards and how we break down information in the product documentation.

## Versioning and single-sourcing content

We now enable you to reuse content between different docs pages, version pages, and establish product variables in the dbt Labs product documentation. To learn more about how to single source content between versions, product variables, and other content, see [Single-sourcing content](/contributing/single-sourcing-content.md).

## Adding tabbed components to a page

You can add code snippets and other content in a tabbed view. To learn more about adding tabbed components, see [Adding page components](/contributing/adding-page-components.md).

# Running the Docs site locally

You can click a link available in a netlify bot PR comment to see and review your changes rendered on a staging server. You are also able to see and review your proposed modifications locally on your computer. Our setup instructions use [homebrew](https://brew.sh/):

## Prerequisites

* (Mac Terminal) Install [Xcode Command Line Tools](https://developer.apple.com/download/more/)
  - Open a terminal window, run `xcode-select --install`, and follow the on-screen prompts in the pop-up window.
* (Mac and Linux) Install [homebrew](https://brew.sh/)
  - Copy and paste `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` in to a terminal window and follow the prompts.  Once the installation has completed, follow the **Next Steps** instructions listed in terminal.
* (Windows) Install [Node.js](https://nodejs.org/en/download/)

1. (Mac and Linux only) Install `node`: `brew install node`
2. Clone this repo: `git clone https://github.com/dbt-labs/docs.getdbt.com.git`
3. `cd` into the repo: `cd docs.getdbt.com`
4. `cd` into the `website` subdirectory: `cd website`
5. Install the required node packages: `npm install` (optional &mdash; install any updates)
6. Build the website: `npm start`
7. Before pushing your changes to a branch, check that all links work by using the `make build` script.

Advisory:
- If you run into an `fatal error: 'vips/vips8' file not found` error when you run `npm install`, you may need to run `brew install vips`. Warning: this one will take a while -- go ahead and grab some coffee!

## Running the Cypress tests locally

Method 1: Utilizing the Cypress GUI
1. `cd` into the repo: `cd docs.getdbt.com`
2. `cd` into the `website` subdirectory: `cd website`
3. Install the required node packages: `npm install`
4. Run `npx cypress open` to open the Cypress GUI, and choose `E2E Testing` as the Testing Type, before finally selecting your browser and clicking `Start E2E testing in {broswer}`
5. Click on a test and watch it run!

Method 2: Running the Cypress E2E tests headlessly
1. `cd` into the repo: `cd docs.getdbt.com`
2. `cd` into the `website` subdirectory: `cd website`
3. Install the required node packages: `npm install`
4. Run `npx cypress run`

## Folder Structure and TOC

The folder structure is broken into several high-level categories under the main `website` folder: blog, cypress, docs, functions, plugins, snippets, src, static.

Images are under the `static` > `img` folder.

The TOC is managed in the `sidebar.js` file. You only need to edit the `sidebar.js` file when you are adding a new page or deleting an existing page. The `sidebar.js` file is the one that causes most of the merge conflicts because many technical writers are working on content daily. You will need to accept the changes from other contributors if you are committing a PR.

Don't worry if you're not sure where in the TOC a new topic belongs. Do your best and when you submit your PR, the dbt Labs Documentation team will edit it and help to find the right placement.

The right-hand TOC is created automatically when you add headings to a page.

## Filenaming

If you are adding a new file, it must be named following our naming conventions. MORE TO ADD

## Images

- Screenshots are use sparingly to minimize the maintenance of out-of-date content. However, we do include some screenshots to provide context.
- Use a focused area of the UI, unless the entire screen is truly needed for context. 
- We only use PNG format, which renders a better quality and lossless compression.
- For privacy and legal purposes, do your best to not reveal personal information, IP addresses, domain information, login credentials and so on in screenshots, code blocks, or text.
- Add *title=""* for all images to write a consice title of the image. For accessibility, it's important to use succinct text that is clear and complete. For more information about images formatting, see the following section.
- For images that are difficult to see, you can click on the image to enlarge it on the same page.

## Using Markdown with our Docusaurus CSS

docs.getdbt.com uses its own CSS, and Docusaurus supports its own specific Markdown syntax. The following table provides an overview of the supported syntax elements.

| Element                                     | Syntax                                                |
|---------------------------------------------|-------------------------------------------------------|
| Headings                                    | `# H1`, `## H2`, `### H3`                             |
| Bold                                        | `**bold text**`                                       |
| Italic                                      | `_italicized text_`                                    |
| Ordered List                                | `1.` First item (use `1.` for each item)              |
| Unordered List                              | `-` or `*` (for each item)                            |
| Code or command in a sentence               | ``code``                                              |
| Link - external site                        | `[Title](https://www.example.com)`                    |
| Link - topic in same folder                 | `[Title](/folder/file-name) without file extension`            |
| Link - topic in different folder            | `[Title](/folder/file-name) without file extension` |
| Link - section in topic in same folder      | `[Title](/folder/file-name#section-name)`                     |
| Link - section in topic in different folder | `[Title](/folder/file-name#section-name)`           |
| Image                                       | `<Lightbox src="/img/docs/<image-name>.png" title="Concise description of image"/>`      |


### Callouts
Callouts highlight important or high-value information that readers need to know and we [use them sparingly](https://github.com/dbt-labs/product-docs-team/blob/main/content-style-guide.md#callouts). Below are the typical callout formats we use:


Note callouts are formatted as follows:

```
:::note

text

:::

```

Info callouts are formatted as follows:

```
:::info

text

:::

```

Tip callouts, typically used for tips, are formatted as follows:

```
:::tip

text

:::

```

Caution callouts, typically used for warnings/considerations, are formatted as follows:

```
:::caution

text

:::

```

### Tables

We use traditional markdown for tables, which can be a useful way of presenting complex or comparative information. 

For more guidelines on markdown tables, review the [docs.getdbt.com style guide](https://github.com/dbt-labs/product-docs-team/tree/main).

## Style Guidelines

The docs.getdbt.com product documentation has in-house style guidelines that the Docs team uses when reviewing your PR. Feel free to just add the content you need or make change, knowing that our team will be there to help with editorial reviews and information architecture, such as TOC placement, and so on. The Docs team will actively edit or write content, not just give editorial reviews and we highly encourage your contributions in the true open-source spirit.

## SME and Editorial Reviews

All PRs that are submitted are reviewed by the dbt Labs Docs team for editorial review.

Content that is submitted by our users, and the open-source community are also reviewed by our dbt Labs subject matter experts (SMEs) to help ensure technical accuracy.
