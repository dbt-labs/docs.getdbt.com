---
title: "Making dbt Cloud API calls using dbt-cloud-cli"
description: "Simo Tumelius shares how to use his dbt-cloud-cli to make more readable and streamlined dbt Cloud API calls."
slug: making-dbt-cloud-api-calls-using-dbt-cloud-cli

authors: [simo_tumelius]

tags: [data ecosystem]
hide_table_of_contents: false

date: 2022-05-03
is_featured: true
---

:::info Different from dbt Cloud CLI
This is blog explains how to use the Python library, `dbt-cloud-cli` and create a data catalog app with dbt Cloud artifacts. This is different from the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation), a dbt Cloud-powered tool that allows you to run dbt commands against your dbt Cloud development environment from your local command line.
:::

dbt Cloud is a hosted service that many organizations use for their dbt deployments. Among other things, it provides an interface for creating and managing deployment jobs. When triggered (e.g., cron schedule, API trigger), the jobs generate various artifacts that contain valuable metadata related to the dbt project and the run results.

dbt Cloud provides a REST API for managing jobs, run artifacts and other dbt Cloud resources. Data/analytics engineers would often write custom scripts for issuing automated calls to the API using tools [cURL](https://curl.se/) or [Python Requests](https://requests.readthedocs.io/en/latest/).  In some cases, the engineers would go on and copy/rewrite them between projects that need to interact with the API. Now, they have a bunch of scripts on their hands that they need to maintain and develop further if business requirements change. If only there was a dedicated tool for interacting with the dbt Cloud API that abstracts away the complexities of the API calls behind an easy-to-use interface… Oh wait, there is: [the dbt-cloud-cli](https://github.com/data-mie/dbt-cloud-cli)!

<!--truncate-->

In this blog post I’ll shine some light on how the dbt-cloud-cli project came to be and how it can make a data/analytics engineer’s work easier. I’ll also walk you through an example use case where we download a dbt Cloud job run catalog.json artifact and implement a simple data catalog app using the same tools that were used in creating dbt-cloud-cli.

## What is dbt-cloud-cli and why should you use it?

What kicked off this project came from the fact that there is currently no easy-to-use interface for the dbt Cloud API. In order to make calls to the API you’d need to write custom scripts that use tools like cURL or Python Requests. There’s nothing inherently wrong with custom scripts but there is an overhead in writing and maintaining those scripts.

Readability is also a factor the importance of which cannot be overstated. With most programming languages, [the ratio of time reading vs writing code is well over 10:1](https://app.works/the-importance-of-code-readability/#:~:text=What%20is%20code%20readability%3F,or%20add%20a%20new%20feature.). Good code is easily readable and understandable by ourselves and other developers and it minimizes the cognitive load of deciphering what was the original intention of the author.

dbt-cloud-cli is a command line interface (CLI) that abstracts dbt Cloud API calls behind a user-friendly and elegant interface. The CLI is written in Python using [pydantic](https://pydantic-docs.helpmanual.io/) and [click](https://click.palletsprojects.com/en/8.0.x/). Let me demonstrate the difference in complexity and readability between cURL vs dbt-cloud-cli for triggering a dbt Cloud job run:

<Tabs
  defaultValue="cURL"
  values={[
    { label: 'cURL triggered job run', value: 'cURL', },
    { label: 'dbt-cloud-cli triggered job run', value: 'dbt-cloud-cli', },
  ]
}>
<TabItem value="cURL">

```bash
curl -H "Authorization:Token $DBT_CLOUD_API_TOKEN" -H "Content-Type:application/json" -d '{"cause":"Triggered using cURL"}' https://cloud.getdbt.com/api/v2/accounts/$DBT_CLOUD_ACCOUNT_ID/jobs/43167/run/
```

</TabItem>
<TabItem value="dbt-cloud-cli">

```
dbt-cloud job run --job-id 43167
```

</TabItem>
</Tabs>

You probably agree that the latter example is definitely more elegant and easier to read. `dbt-cloud` handles the request boilerplate (e.g., api token in the header, endpoint URL) so that you don’t need to worry about authentication or remember which endpoint to use. Also, the CLI implements additional functionality (e.g., `--wait`) for some endpoints; for example, `dbt cloud job run --wait` will issue the job trigger, wait until the job finishes, fails or is cancelled and then prints out the job status response.

In addition to CLI commands that interact with a single dbt Cloud API endpoint there are composite helper commands that call one or more API endpoints and perform more complex operations. One example of composite commands are `dbt-cloud job export` and `dbt-cloud job import` where, under the hood, the export command performs a `dbt-cloud job get` and writes the job metadata to a <Term id="json" /> file and the import command reads job parameters from a JSON file and calls `dbt-cloud job create`. The export and import commands can be used in tandem to move dbt Cloud jobs between projects. Another example is the `dbt-cloud job delete-all` which fetches a list of all jobs using `dbt-cloud job list` and then iterates over the list prompting the user if they want to delete the job. For each job that the user agrees to delete  a `dbt-cloud job delete` is performed.

To install the CLI in your Python environment run `pip install dbt-cloud-cli` and you’re all set. You can use it locally in your development environment or e.g. in a GitHub actions workflow.

## How the project came to be

I’m a freelance data and analytics engineer and almost all of the projects I work with involve dbt Cloud one way or another. In a typical project, we’d set up a simple “run and test” job in dbt Cloud that is scheduled to run once or twice a day. Often there’d also be a [continuous integration job](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration) that runs on Pull Requests in GitHub.

These two job triggering methods (i.e., cron and PR trigger) are sufficient in most projects, but there are some cases where additional control over when a job is run or what else is executed in the job’s context is needed. For example, you may need to load data to your database before a job is run or download artifacts after the run is finished.

In my case, we didn’t yet have an EL pipeline for an external data source. So, we hacked together a simple Python script for loading the data and ran the script as part of our CI workflow in GitHub Actions before triggering a dbt Cloud job. This would ensure that the data in our database was up-to-date before the job ran.

Initially, we issued the dbt Cloud API requests to trigger job runs using cURL and it worked perfectly fine until we needed to implement a waiting loop that periodically checked the job status and returned when the job was finished. Luckily I found a Python script by Sean McIntyre ([see the dbt Discourse post](https://discourse.getdbt.com/t/triggering-a-dbt-cloud-job-in-your-automated-workflow-with-python/2573)) that does exactly this.

I modified the script according to our needs and wrapped it in a `dbt-cloud job run` CLI command using click (actually the entry point wasn’t `dbt-cloud` at that time but you get the idea). Click (“Command Line Interface Creation Kit”) is a Python library for creating CLIs with as little code as necessary. Implementing a simple CLI using click only requires adding a few decorators (e.g., `group`, `command` and `option`) to the functions in your code and you’re good to go.

Now we had exactly what we wanted and our CI workflow in GitHub actions looked slick:

```
- name: Trigger dbt Cloud job run
  run: |
    ./cool_script_bro.sh
    dbt-cloud job run --job-id $DBT_CLOUD_JOB_ID
```

Fast forward a month or two and there was another client that needed something similar. I felt that this was an opportunity to open source the project not just to benefit me and my clients but also [the broader dbt community](https://www.getdbt.com/community/) (❤️). So, I moved the project to a public github repository with a goal of eventually covering all of the dbt Cloud API endpoints.

While working with the initial 0.1.0 release that included only the `dbt-cloud job run` command I decided to have some fun and try how well pydantic (Python dataclasses on steroids!) and `click` worked together. I’m a big fan of `pydantic`, and I’ve used it in a wide variety of projects including machine learning models and automated testing software for a medical device. Even though Python has had built-in dataclasses since version 3.7, they fall short when it comes to data validation and general developer ergonomics (IMO) and that’s where `pydantic` comes in; among other things, `pydantic` implements a validator decorator that is used to define custom validations for model fields (e.g., CLI arguments).

I refactored the `dbt-cloud-cli` code so that the CLI commands were now implemented as pydantic models where the model fields are the dbt Cloud API endpoint arguments. The `pydantic` model fields could now be translated to `click` arguments which resulted in the following CLI command implementation pattern:

```python
import click
from dbt_cloud.command import DbtCloudJobGetCommand

@click.group()
def dbt_cloud():
    pass

@dbt_cloud.group()
def job():
    pass

@job.command(help=DbtCloudJobGetCommand.get_description())
@DbtCloudJobGetCommand.click_options
def get(**kwargs):
    command = DbtCloudJobGetCommand.from_click_options(**kwargs)
    execute_and_print(command)
```

After the initial release I started to expand to cover the rest of the dbt Cloud API endpoints. For a list of all the covered API endpoints and implemented CLI commands, see https://github.com/data-mie/dbt-cloud-cli.

## Creating a data catalog app using dbt Cloud artifacts

In this example we’ll download a `catalog.json` artifact from the latest run of a dbt Cloud job using `dbt-cloud run list` and `dbt-cloud get-artifact` and then write a simple Data Catalog CLI application using the same tools that are used in `dbt-cloud-cli` (i.e., `click` and `pydantic`). Let’s dive right in!

The first command we need is the `dbt-cloud run list` which uses an [API endpoint](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#/operations/List%20Runs) that returns runs sorted by creation date, with the most recent run appearing first. The command returns a JSON response that has one top-level attribute `data` that contains a list of runs. We’ll need to extract the `id` attribute of the first one and to do that we use [jq](https://stedolan.github.io/jq/):

```
latest_run_id=$(dbt-cloud run list --job-id $DBT_CLOUD_JOB_ID | jq .data[0].id -r)
```

Next, we use the `dbt-cloud get-artifact` command to download the `catalog.json` artifact:

```
dbt-cloud run get-artifact --run-id $latest_run_id --path catalog.json -f catalog.json
```

To explore the downloaded catalog file we’ll write a simple CLI application. The [catalog.json](https://schemas.getdbt.com/dbt/catalog/v1.json) has four top level properties: metadata, nodes, sources and errors. In this example we explore the nodes and sources only and leave the metadata and errors out.

First, we need a `Catalog` abstraction that reflects the catalog JSON schema:

```py
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class Stats(BaseModel):
    """Represent node stats in the Catalog."""

    id: str
    label: str
    value: Any
    include: bool
    description: str

    def __str__(self):
        return f"{self.label}: {self.value}"


class Column(BaseModel):
    """Represents a column in the Catalog."""

    type: str
    index: int
    name: str
    comment: Optional[str]

    def __str__(self):
        return f"{self.name} (type: {self.type}, index: {self.index}, comment: {self.comment})"


class Node(BaseModel):
    """Represents a node in the Catalog."""

    unique_id: str
    metadata: Dict[str, Optional[str]]
    columns: Dict[str, Column]
    stats: Dict[str, Stats]

    @property
    def name(self):
        return self.metadata["name"]

    @property
    def database(self):
        return self.metadata["database"]

    @property
    def schema(self):
        return self.metadata["schema"]

    @property
    def type(self):
        return self.metadata["type"]

    def __gt__(self, other):
        return self.name > other.name

    def __lt__(self, other):
        return self.name < other.name

    def __str__(self):
        return f"{self.name} (type: {self.type}, schema: {self.schema}, database: {self.database})"


class Catalog(BaseModel):
    """Represents a dbt catalog.json artifact."""

    metadata: Dict
    nodes: Dict[str, Node]
    sources: Dict[str, Node]
    errors: Optional[Dict]
```

The four abstractions (`Stats`,`Column`, `Node `and `Catalog`) all inherit [the pydantic BaseModel](https://pydantic-docs.helpmanual.io/usage/models/) which implements various methods for parsing files and other python objects into model instances. We’ll leave the parsing to pydantic (i.e., `BaseModel.parse_file` classmethod) so that we can focus solely on the app logic.

The `CatalogExploreCommand` abstraction implements the CLI app which is then wrapped in a `click.command` that implements the CLI entry point. The `CatalogExploreCommand` class inherits `ClickBaseModel` that implements a `click_options` classmethod which we’ll use to decorate the entry point. This method is where the pydantic to click translation magic happens (i.e., pydantic model fields are translated [into click options](https://click.palletsprojects.com/en/8.0.x/options/)). Note that the app [uses inquirer](https://github.com/magmax/python-inquirer) in addition to `click` to create interactive “select option from a list” CLI prompts.

```py
import click
from enum import Enum
from pathlib import Path
from pydantic import Field
from dbt_cloud.command.command import ClickBaseModel

class NodeType(Enum):
    SOURCE = "source"
    NODE = "node"


class CatalogExploreCommand(ClickBaseModel):
    """An inteactive application for exploring catalog artifacts."""

    file: Path = Field(default="catalog.json", description="Catalog file path.")
    title: str = Field(
        default="Data Catalog", description="ASCII art title for the app."
    )
    title_font: str = Field(
        default="rand-large",
        description="ASCII art title font (see https://github.com/sepandhaghighi/art#try-art-in-your-browser for a list of available fonts)",
    )

    def get_catalog(self) -> Catalog:
        return Catalog.parse_file(self.file)

    def print_title(self):
        from art import tprint

        tprint(self.title, font=self.title_font)

    def execute(self):
        import inquirer

        self.print_title()

        while True:
            node_type_options = [
                inquirer.List(
                    "node_type",
                    message="Select node type to explore",
                    choices=[node_type.value for node_type in NodeType],
                )
            ]
            node_type = NodeType(inquirer.prompt(node_type_options)["node_type"])
            self.explore(node_type=node_type)
            if not click.confirm("Explore another node type?"):
                break

    def explore(self, node_type: NodeType):
        """Interactive exploration of nodes to explore and display their metadata"""
        import inquirer

        catalog = self.get_catalog()
        if node_type == NodeType.SOURCE:
            nodes = list(catalog.sources.values())
        else:
            nodes = list(catalog.nodes.values())

        while True:
            databases = sorted(set(map(lambda x: x.database, nodes)))
            database_options = [
                inquirer.List("database", message="Select database", choices=databases)
            ]
            database = inquirer.prompt(database_options)["database"]
            nodes_filtered = list(filter(lambda x: x.database == database, nodes))

            schemas = sorted(set(map(lambda x: x.schema, nodes_filtered)))
            schema_options = [
                inquirer.List("schema", message="Select schema", choices=schemas)
            ]
            schema = inquirer.prompt(schema_options)["schema"]
            nodes_filtered = list(filter(lambda x: x.schema == schema, nodes_filtered))

            node_options = [
                inquirer.List(
                    "node", message="Select node", choices=sorted(nodes_filtered)
                )
            ]
            node = inquirer.prompt(node_options)["node"]
            click.echo(f"{node.name} columns:")
            for column in node.columns.values():
                click.echo(f"- {column}")
            click.echo("")
            for stats in node.stats.values():
                if stats.id == "has_stats":
                    continue
                click.echo(stats)
            if not click.confirm(f"Explore another {node_type.value}?"):
                break


@click.command(help=CatalogExploreCommand.get_description())
@CatalogExploreCommand.click_options
def data_catalog(**kwargs):
    command = CatalogExploreCommand.from_click_options(**kwargs)
    command.execute()
```

The `CatalogExploreCommand.execute` method implements the interactive exploration logic. First the app prompts to select a node type to explore (`source` or `node`) and then it asks the user to select a database, a schema in the selected database and finally a model in the selected schema. The app then prints out the model columns and stats (if there are any). All this is wrapped in a loop with “Explore another node? [y/N]” and “Explore another node type? [y/N]” prompts for either continuing the loop or breaking out of it.

I’ve included the app in the latest version of dbt-cloud-cli so you can test it out yourself! To use the app you need install dbt-cloud-cli with extra dependencies:

```bash
pip install dbt-cloud-cli[demo]
```

Now you can the run app:

```bash
dbt-cloud demo data-catalog --file catalog.json
```

## Parting thoughts

To summarize, the `dbt-cloud-cli`I implements an easy-to-use command line interface for the dbt Cloud API which abstracts away the complexities of the API calls. The CLI has interfaces to many of the API endpoints and covering all of the endpoints is on the project’s roadmap. For a list of all the covered API endpoints and implemented CLI commands, see https://github.com/data-mie/dbt-cloud-cli.

In addition to commands that interact with a single dbt Cloud API endpoint there are composite helper commands that call one or more API endpoints and perform more complex operations (e.g., `dbt-cloud job export` and `dbt-cloud job import`).

The `dbt-cloud-cli` makes interacting with the dbt Cloud API a breeze compared to using and maintaining custom cURL/ Python Requests scripts. Furthermore, `dbt-cloud-cli` commands handle all the API call boilerplate under the hood so that you don’t need to google or memorize how to interact with the API. And when in doubt, just add a `--help` flag to a `dbt-cloud-cli` command and you’ll get a list of all the available commands or arguments.


PS. There are still API endpoints that haven’t been implemented in the CLI. If there’s an endpoint you’d like a CLI command for you can open an issue in the GitHub repository. All contributions to the project (be it documentation in README or new CLI commands) are welcome! If you have any questions on the project or how to contribute, feel free to drop me a DM in dbt Slack.
