---
title: "Private packages must be cloned using tokens provided by environment variables"
description: "Private packages must be cloned using tokens provided by environment variables."
sidebar_label: "Deprecation: Private packages must be cloned using tokens provided by environment variables"
tags: [Dec-23-2022]
---

The supported way for cloning private packages is using the [git clone method](/docs/build/packages#git-token-method), in which an appropriate token is passed into the package repository URL via an environment variable. 

There is a small user base that has been able to clone private GitHub packages using our native GitHub application without explicitly providing an access token. We are deprecating this functionality, as it’s limited in flexibility. 

If you have been using a package hosted in a private repository on GitHub, you must explicitly pass as access token into the URL going forward. See below for sample usage.

```yaml

packages:
- git: "https://{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git"

```