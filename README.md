We use [docusaurus](https://v2.docusaurus.io/) to power [docs.getdbt.com](https://docs.getdbt.com/).

## Contributing

We welcome contributions from community members to this repo:
- **Fixes**: If you notice an error (there are likely many), use the `Edit this page` button at the bottom of each page to suggest a change. We recommend you contribute small changes directly from the GitHub interface.
- **New documentation**: If you contributed code in [dbt-core](https://github.com/dbt-labs/dbt-core), we encourage you to also write the docs here!
- **Refactors**: At this time, we are unable to support community members who wish to re-write sections of docs.getdbt.com. We hope to change this in the future!

## Using the style guide

[TBD] a style guide to help you write along the dbt style guidelines. 

## Versioning

We now provide dynamic versioning in the dbt Labs product documentation. To learn more about how to version the docs for dbt Core, see [Managing available versions](/contributing/versioningdocs.md).

## Adding to the glossary 

[TBD] a how-to guide on the programming behind glossary entries. 

## Running the Docs site locally

You can click a link available in a netlify bot PR comment to see and review your changes rendered on a staging server. You are also able to see and review your proposed modifications locally on your computer. Our setup instructions use [homebrew](https://brew.sh/):

0. If applicable, install [Xcode Command Line Tools](https://developer.apple.com/download/more/); you'll likely need an AppleID for this. You will also need [homebrew](https://brew.sh/). 
2. Install `node`: `brew install node`
3. Clone this repo: `git clone git@github.com:fishtown-analytics/docs.getdbt.com.git`
4. `cd` into the repo: `cd docs.getdbt.com`
5. `cd` into the `website` subdirectory: `cd website`
6. Install the required node packages: `npm install`
7. Build the website: `npm start`
8. Before pushing your changes to a branch, check that all links work by using the `make build` script.

Advisory: 
- Currently an `npm install` produces a number of dependency warnings, in particular several claiming that `docusaurus/core` is missing. Rest assured, this message is a red herring. As of writing this, no 2.0.0 package exists, so you won't have much luck trying to install it. Feel free to ignore those warnings.
- If you run into an `fatal error: 'vips/vips8' file not found` error when you run `npm install`, you may need to run `brew install vips`. Warning: this one will take a while -- go ahead and grab some coffee!

You can also check out [this Loom video](https://www.loom.com/share/7037780b86eb4f16953664b8f15f1e21) that I recorded for co-workers — it covers setting up docs.getdbt.com locally, and adding a page with links and images. Heads up — this was very much something I did on the fly, so is not super polished!

## Custom components

Check out [docs.getdbt.com/styles](https://docs.getdbt.com/styles) for examples of different components that can be used in these docs.

You can also use components directly from the [docusaurus library](https://v2.docusaurus.io/docs/markdown-features/).
