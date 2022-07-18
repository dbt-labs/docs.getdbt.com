_We use [docusaurus](https://v2.docusaurus.io/) to power [docs.getdbt.com](https://docs.getdbt.com/)._

#### Table of Contents
* [Contributing](#contributing)  
* [Writing content](#writing-content)
* [Running the docs site locally](#running-the-docs-site-locally)

# Contributing

We welcome contributions from community members to this repo:
- **Fixes**: When you notice an error, you can use the `Edit this page` button at the bottom of each page to suggest a change. 
- **New documentation**: If you contributed code in [dbt-core](https://github.com/dbt-labs/dbt-core), we encourage you to also write the docs here! Please reach out in the dbt community if you need help finding a place for these docs.
- **Major rewrites**: You can [file an issue](https://github.com/dbt-labs/docs.getdbt.com/issues/new?assignees=&labels=content%2Cimprovement&template=improve-docs.yml) or [start a discussion](https://github.com/dbt-labs/docs.getdbt.com/discussions) to propose ideas for a content area that requires attention.

You can use components documented in the [docusaurus library](https://v2.docusaurus.io/docs/markdown-features/). 

# Writing content

When writing content, you should refer to the style guide (TBD) and [content types](/contributing/content-types.md) to help you understand our writing standards and how we break down information in the product documentaion. 

## Using the content style guide

[TBD] a style guide to help you write in a consistent, accessible, and inclusive style. 

## Versioning content

We now provide dynamic versioning in the dbt Labs product documentation. To learn more about how to version the docs for dbt Core, see [Managing available versions](/contributing/versioningdocs.md).

## Adding content to the glossary 

[TBD] a how-to guide on the programming behind glossary entries. 

# Running the Docs site locally

You can click a link available in a netlify bot PR comment to see and review your changes rendered on a staging server. You are also able to see and review your proposed modifications locally on your computer. Our setup instructions use [homebrew](https://brew.sh/):

## prerequisites
* Install [Xcode Command Line Tools](https://developer.apple.com/download/more/); you'll likely need an AppleID for this. 
* Install [homebrew](https://brew.sh/). 

1. Install `node`: `brew install node`
2. Clone this repo: `git clone git@github.com:fishtown-analytics/docs.getdbt.com.git`
3. `cd` into the repo: `cd docs.getdbt.com`
4. `cd` into the `website` subdirectory: `cd website`
5. Install the required node packages: `npm install`
6. Build the website: `npm start`
7. Before pushing your changes to a branch, check that all links work by using the `make build` script.

Advisory: 
- Currently an `npm install` produces a number of dependency warnings, in particular several claiming that `docusaurus/core` is missing. Rest assured, this message is a red herring. As of writing this, no 2.0.0 package exists, so you won't have much luck trying to install it. Feel free to ignore those warnings.
- If you run into an `fatal error: 'vips/vips8' file not found` error when you run `npm install`, you may need to run `brew install vips`. Warning: this one will take a while -- go ahead and grab some coffee!

## Running the Cypress tests locally

Method 1: Utilizing the Cypress GUI
1. Install `node`: `brew install node`
2. Clone this repo: `git clone git@github.com:fishtown-analytics/docs.getdbt.com.git`
3. `cd` into the repo: `cd docs.getdbt.com`
4. `cd` into the `website` subdirectory: `cd website`
5. Install the required node packages: `npm install`
6. Run `npx cypress open` to open the Cypress GUI, and choose `E2E Testing` as the Testing Type, before finally selecting your browser and clicking `Start E2E testing in {broswer}`
7. Click on a test and watch it run!

Method 2: Running the Cypress E2E tests headlessly
1. Install `node`: `brew install node`
2. Clone this repo: `git clone git@github.com:fishtown-analytics/docs.getdbt.com.git`
3. `cd` into the repo: `cd docs.getdbt.com`
4. `cd` into the `website` subdirectory: `cd website`
5. Install the required node packages: `npm install`
6. Run `npx cypress run` 