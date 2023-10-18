---
title: "Install with Docker"
description: "You can use Docker to install dbt and adapter plugins from the command line."
---

dbt Core and all adapter plugins maintained by dbt Labs are available as [Docker](https://docs.docker.com/) images, and distributed via [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages) in a [public registry](https://github.com/dbt-labs/dbt-core/pkgs/container/dbt-core).

Using a prebuilt Docker image to install dbt Core in production has a few benefits: it already includes dbt-core, one or more database adapters, and pinned versions of all their dependencies. By contrast, `pip install dbt-core dbt-<adapter>` takes longer to run, and will always install the latest compatible versions of every dependency.

You might also be able to use Docker to install and develop locally if you don't have a Python environment set up. Note that running dbt in this manner can be significantly slower if your operating system differs from the system that built the Docker image. If you're a frequent local developer, we recommend that you install dbt Core via [Homebrew](/docs/core/homebrew-install) or [pip](/docs/core/pip-install) instead.

### Prerequisites
* You've installed Docker. For more information, see the [Docker](https://docs.docker.com/) site.
* You understand which database adapter(s) you need. For more information, see [About dbt adapters](/docs/core/installation#about-dbt-adapters).
* You understand how dbt Core is versioned. For more information, see [About dbt Core versions](/docs/dbt-versions/core).
* You have a general understanding of the dbt, dbt workflow, developing locally in the command line interface (CLI). For more information, see [About dbt](/docs/introduction#how-do-i-use-dbt).

### Install a dbt Docker image from Github Packages

Offical dbt docker images are hosted as [packages in the `dbt-labs` GitHub organization](https://github.com/orgs/dbt-labs/packages?visibility=public). We maintain images and tags for every version of every database adapter, as well as two tags that update as new versions as released:
- `latest`: Latest overall version of dbt-core + this adapter
- `<Major>.<Minor>.latest`: Latest patch of dbt-core + this adapter for `<Major>.<Minor>` version family. For example, `1.1.latest` includes the latest patches for dbt Core v1.1.

Install an image using the `docker pull` command:
```
docker pull ghcr.io/dbt-labs/<db_adapter_name>:<version_tag>
```

### Running a dbt Docker image in a container

The `ENTRYPOINT` for dbt Docker images is the command `dbt`. You can bind-mount your project to `/usr/app` and use dbt as normal:
```
docker run \
--network=host \
--mount type=bind,source=path/to/project,target=/usr/app \
--mount type=bind,source=path/to/profiles.yml,target=/root/.dbt/ \
<dbt_image_name> \
ls
```

Notes:
* Bind-mount sources _must_ be an absolute path
* You may need to make adjustments to the docker networking setting depending on the specifics of your data warehouse or database host.

### Building your own dbt Docker image

If the pre-made images don't fit your use case, we also provide a [`Dockerfile`](https://github.com/dbt-labs/dbt-core/blob/main/docker/Dockerfile) and [`README`](https://github.com/dbt-labs/dbt-core/blob/main/docker/README.md) that can be used to build custom images in a variety of ways.

In particular, the Dockerfile supports building images:
- Images that all adapters maintained by dbt Labs
- Images that install one or more third-party adapters
- Images against another system architecture

Please note that, if you go the route of building your own Docker images, we are unable to offer dedicated support for custom use cases. If you run into problems, you are welcome to [ask the community for help](/community/resources/getting-help) or [open an issue](/community/resources/oss-expectations#issues) in the `dbt-core` repository. If many users are requesting the same enhancement, we will tag the issue `help_wanted` and invite community contribution.
