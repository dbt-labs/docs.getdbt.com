A [docusaurus](https://docusaurus.io/en/) site that powers [docs.getdbt.com](https://docs.getdbt.com/)

To run this yourself:
1. `brew install node`
2. Clone this repo
3. `cd` into the `website` subdirectory
4. `npm install`
5. `npm start`


## Notes
* When using markdown links, you can use file paths relative to the current file, or, relative to the `website/docs/` directory, e.g. `[my link text](faqs/available-configurations.md)`.
    * For FAQs: use the file path relative to the `docs` directory (since it may have to be resolved from different paths).
    * Otherwise: use the relative filepath (less changes required if we rename a directory)
