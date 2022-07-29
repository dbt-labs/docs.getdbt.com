---
title: "The dbt IDE"
id: "the-dbt-ide"
---

**What is the dbt Cloud IDE?** 

The dbt Cloud IDE is an integrated development environment (IDE) where you can build, test, run and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project -- no command line use required. 

To develop in the dbt Cloud IDE, you’ll want to meet the below requirements: 

- The dbt IDE is powered by the [dbt-rpc](reference/commands/rpc) which was overhauled in dbt v0.15.0. In order to use the IDE, your dbt project must be compatible with dbt v0.15.0.
- To use the IDE, you must have a [Developer License](docs/dbt-cloud/access-control/cloud-seats-and-users).
- Write access must be enabled for your dbt repository in dbt Cloud. See [Connecting your GitHub Account](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-installing-the-github-application) and [Importing a project by git URL](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-import-a-project-by-git-url) for detailed setup instructions.

**Why use the dbt Cloud IDE?**

The IDE is a single interface for building, testing, running, and version controlling dbt projects from your browser. The IDE can be used by everyone - from new dbt developers to the most seasoned practitioners. 

To access and develop in the dbt Cloud IDE, you need to create/log in with a dbt Cloud account and click the ‘**Develop**’ button found in the header. 

You might find it helpful to read our [Getting Started with dbt Cloud](guides/getting-started) guide to set up dbt Cloud and perform some key tasks. For more information, see the following articles.

- [What is dbt?](https://docs.getdbt.com/docs/introduction)
- [Getting Started with dbt Cloud](guides/getting-started/getting-set-up)
- [Building your first project](guides/getting-started/building-your-first-project)
- [dbt Learn courses](https://courses.getdbt.com/collections)
- [Using Git](https://docs.github.com/en/github/getting-started-with-github/using-git)

**Is there a cost of using the dbt Cloud IDE cost?** 

Not at all! You can enjoy dbt Cloud and sign up for our Free [Developer plan](https://www.getdbt.com/pricing/), which comes with one developer seat. If you’d like to access more features or have more developer seats, you can upgrade your account to our Team or Enterprise plan. Our dedicated [pricing page](https://www.getdbt.com/pricing/) has more details on our plans and features!

**How can I contribute to dbt Cloud?** 

We’d love for you to contribute! And whether it's a dbt package, a plugin, `dbt-core`, or this very documentation site, contributing to the open source code that supports the dbt ecosystem is a great way to level yourself up as a developer, and give back to the community. Our [Contributing](docs/contributing/oss-expectations) page provides more detail on what to expect when contributing to dbt open source software (OSS). 

**What is the difference between developing on the dbt Cloud IDE and on the CLI?**

That’s a great question! There are two main ways of working with dbt -- using the web-based IDE in dbt Cloud, or using the Command Line Interface (CLI)

**dbt Cloud IDE** - dbt Cloud is an application that allows you to develop dbt projects with the IDE, includes a purpose-built scheduler, and is an easy way to share dbt documentation with your team. You can build, test, run and version control your dbt projects directly from your browser. The IDE is the fastest and most reliable way to deploy dbt, and provides a real-time editing and execution environment for your dbt project

**CLI** - The CLI uses [dbt Core](docs/introduction), an [open-source](https://github.com/dbt-labs/dbt) software that’s free to use. You can build your dbt project in a code editor, like Atom or VSCode, and execute dbt commands using a terminal program. 

**What type of support is provided?** 

The global dbt Support team is happy to help and available to dbt Cloud customers by email or in-product live chat. Developer and Team accounts offer 24x5 support, while Enterprise customers have priority access and options for custom coverage.

Additionally, Enterprise plan customers receive implementation assistance, dedicated account management, and a dbt Labs Security and Legal review.

If you have project-related or modeling questions, our dedicated [GitHub Discussions](docs/contributing/long-lived-discussions-guidelines) or [dbt Community Slack](http://getdbt.slack.com) are great resources to use as well.
