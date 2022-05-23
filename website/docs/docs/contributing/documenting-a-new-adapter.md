---
title: "Documenting a new adapter"
id: "documenting-a-new-adapter"
---

If you've already [built an adapter](/website/docs/docs/contributing/building-a-new-adapter.md), and [tested your adapter]((/website/docs/docs/contributing/testing-a-new-adapter.md)), it's time to document it so the dbt community will know that it exists and how to use it!

## General Guidelines

### Docusaurus conventions

Each `.md` file you create needs a header that looks like the below. The document id given below will also be need to be added to the config file: `website/sidebars.js`

```
---
title: "Documenting a new adapter"
id: "documenting-a-new-adapter"
---
```

### Single Source of Truth

We asked our adapter maintainers to use the [docs.getdbt.com repo](https://github.com/dbt-labs/docs.getdbt.com) (i.e. this site) as the single-source-of-truth for documentation rather than having to maintain the same set of information in three different places. The adapter repo's `README.md` and the data platform's documentation pages should simply link to the corresponding page on this docs site.

### Assumed Knowledge

To simplify things, assume the reader of this documentation already knows how both dbt and your data platform works. There's already great material for how to learn dbt and ostensibly for the adapter's back end data platform.


## Topics and Pages to Cover

The following subjects need to be addressed across three pages of this docs site to have your data platform be listed on our documentation. After the corresponding pull request is merged, we ask that you link to these pages from your adapter repo's `REAMDE` as well as from your product documentation


| How To...            | File to change within `/website/docs/`                       | Action | Info to Include                                                                                                                                                                                      |
|----------------------|--------------------------------------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Connect              | `reference/warehouse-profiles/{MY-DATA-PLATOFRM}-profile.md` | Create | Give all information needed to define a target in `~/.dbt/profiles.yml` and get `dbt debug` to connect to the database successfully. All possible configurations should be mentioned.                |
| Configure            | `reference/resource-configs/{MY-DATA-PLATOFRM}-configs.md`   | Create | What options and configuration specific to your data platform do users need to know? e.g. table distribution and indexing options, column_quoting policy, which incremental strategies are supported |
| Discover and Install | `docs/available-adapters.md`                                 | Modify | Is adapter vendor- or community- supported? How to install Python adapter package? Ideally with pip and PyPI hosted package, but can also use `git+` link to GitHub Repo                             |
| Add link to sidebar  | `website/sidebars.js`                                        | Modify | Add the document id to the correct location in the sidebar menu                                                                                                                                      |


## Example PRs to add new adapter documentation

Below are some recent pull requests made by partners to document their data platform's adapter:

- [TiDB](https://github.com/dbt-labs/docs.getdbt.com/pull/1309)
- [SingleStore](https://github.com/dbt-labs/docs.getdbt.com/pull/1044)
- [Firebolt](https://github.com/dbt-labs/docs.getdbt.com/pull/941)