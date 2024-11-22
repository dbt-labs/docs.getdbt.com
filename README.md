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
- **Major rewrites**: You can [file an issue](https://github.com/dbt-labs/docs.getdbt.com/issues/new/choose) to propose ideas for a content area that requires attention.

You can use components documented in the [docusaurus library](https://v2.docusaurus.io/docs/markdown-features/).

# Writing content

The dbt Labs docs are written in Markdown and sometimes HTML. When writing content, refer to the [style guide](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-style-guide.md) and [content types](/contributing/content-types.md) to help you understand our writing standards and how we break down information in the product documentation. 

## SME and editorial reviews

All PRs that are submitted will be reviewed by the dbt Labs Docs team for editorial review.

Content that is submitted by our users and the open-source community are also reviewed by our dbt Labs subject matter experts (SMEs) to help ensure technical accuracy.


## Versioning and single-sourcing content

We now enable you to reuse content between different docs pages, version pages, and establish product variables in the dbt Labs product documentation. To learn more about how to single source content between versions, product variables, and other content, see [Single-sourcing content](/contributing/single-sourcing-content.md).

## Adding tabbed components to a page

You can add code snippets and other content in a tabbed view. To learn more about adding tabbed components, see [Adding page components](/contributing/adding-page-components.md).

# Running the Docs site locally

You can click a link available in a Vercel bot PR comment to see and review your changes rendered on a staging server. You are also able to see and review your proposed modifications locally on your computer. Our setup instructions use [homebrew](https://brew.sh/):

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
5. Install the required node packages: `make install` or `npm install` (optional &mdash; install any updates)
6. Build the website: `make run` or `npm start`
7. Before pushing your changes to a branch, run `make build` or `npm run build` and check that all links work

Advisory:
- If you run into an `fatal error: 'vips/vips8' file not found` error when you run `npm install`, you may need to run `brew install vips`. Warning: this one will take a while -- go ahead and grab some coffee!
