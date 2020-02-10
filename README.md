A [docusaurus](https://docusaurus.io/en/) site that powers the dbt Getting Started tutorial, and maybe one day, the docs too.

To run this yourself:
1. `brew install node`
2. Clone this repo
3. `cd` into the `website` subdirectory
4. `npm install`
5. `npm start`


## Notes
* When using markdown links, you can use file paths relative to the current file, or, relative to the `docs` directory. For FAQs, use the file path relative to the `docs` directory (since it may have to be resolved from different paths). For other content, use the relative filepath (less changes required if we rename a directory)
