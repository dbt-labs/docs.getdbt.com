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

When writing content, you should refer to the [style guide](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-style-guide.md) and [content types](/contributing/content-types.md) to help you understand our writing standards and how we break down information in the product documentation.

## Versioning content

We now provide dynamic versioning in the dbt Labs product documentation. To learn more about how to version the docs for dbt Core, see [Managing available versions](/contributing/versioningdocs.md).

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
