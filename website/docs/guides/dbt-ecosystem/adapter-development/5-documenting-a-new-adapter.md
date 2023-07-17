---
title: "Documenting a new adapter"
id: "5-documenting-a-new-adapter"
---

If you've already [built](3-building-a-new-adapter), and [tested](4-testing-a-new-adapter) your adapter, it's time to document it so the dbt community will know that it exists and how to use it.

## Making your adapter available

Many community members maintain their adapter plugins under open source licenses. If you're interested in doing this, we recommend:

- Hosting on a public git provider (for example, GitHub or Gitlab)
- Publishing to [PyPI](https://pypi.org/)
- Adding to the list of ["Supported Data Platforms"](/docs/supported-data-platforms#community-supported) (more info below)

## General Guidelines

To best inform the dbt community of the new adapter, you should contribute to the dbt's open-source documentation site, which uses the [Docusaurus project](https://docusaurus.io/). This is the site you're currently on!

### Conventions

Each `.md` file you create needs a header as shown below. The document id will also need to be added to the config file: `website/sidebars.js`.

```md
---
title: "Documenting a new adapter"
id: "documenting-a-new-adapter"
---
```

### Single Source of Truth

We ask our adapter maintainers to use the [docs.getdbt.com repo](https://github.com/dbt-labs/docs.getdbt.com) (i.e. this site) as the single-source-of-truth for documentation rather than having to maintain the same set of information in three different places. The adapter repo's `README.md` and the data platform's documentation pages should simply link to the corresponding page on this docs site. Keep reading for more information on what should and shouldn't be included on the dbt docs site.

### Assumed Knowledge

To simplify things, assume the reader of this documentation already knows how both dbt and your data platform works. There's already great material for how to learn dbt and the data platform out there. The documentation we're asking you to add should be what a user who is already profiecient in both dbt and your data platform would need to know in order to use both. Effectively that boils down to two things: how to connect, and how to configure.

## Topics and Pages to Cover

The following subjects need to be addressed across three pages of this docs site to have your data platform be listed on our documentation. After the corresponding pull request is merged, we ask that you link to these pages from your adapter repo's `REAMDE` as well as from your product documentation.

 To contribute, all you will have to do make the changes listed in the table below.

| How To...            | File to change within `/website/docs/`                       | Action | Info to Include                                                                                                                                                                                      |
|----------------------|--------------------------------------------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Connect              | `/docs/core/connect-data-platform/{MY-DATA-PLATFORM}-setup.md` | Create | Give all information needed to define a target in `~/.dbt/profiles.yml` and get `dbt debug` to connect to the database successfully. All possible configurations should be mentioned.                |
| Configure            | `reference/resource-configs/{MY-DATA-PLATFORM}-configs.md`   | Create | What options and configuration specific to your data platform do users need to know? e.g. table distribution and indexing options, column_quoting policy, which incremental strategies are supported |
| Discover and Install | `docs/supported-data-platforms.md`                                 | Modify | Is it a vendor- or community- supported adapter? How to install Python adapter package? Ideally with pip and PyPI hosted package, but can also use `git+` link to GitHub Repo                             |
| Add link to sidebar  | `website/sidebars.js`                                        | Modify | Add the document id to the correct location in the sidebar menu                                                                                                                                      |

For example say I want to document my new adapter: `dbt-ders`. For the "Connect" page, I will make a new Markdown file, `ders-setup.md` and add it to the `/website/docs/core/connect-data-platform/` directory.

## Example PRs to add new adapter documentation

Below are some recent pull requests made by partners to document their data platform's adapter:

- [TiDB](https://github.com/dbt-labs/docs.getdbt.com/pull/1309)
- [SingleStore](https://github.com/dbt-labs/docs.getdbt.com/pull/1044)
- [Firebolt](https://github.com/dbt-labs/docs.getdbt.com/pull/941)
