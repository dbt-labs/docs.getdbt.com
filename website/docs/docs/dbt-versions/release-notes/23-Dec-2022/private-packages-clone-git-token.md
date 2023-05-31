---
title: "Private packages must be cloned using access tokens provided by environment variables"
description: "Private GitHub packages must be cloned using access tokens provided by environment variables."
sidebar_label: "Deprecation: Private packages must be cloned using access tokens"
tags: [Dec-2022]
---

The supported method for cloning private GitHub packages is the [git token method](/docs/build/packages#git-token-method), where an appropriate access token is passed into the package repository URL with an environment variable. 

A small number of people have been able to clone private packages using dbt's native GitHub application without explicitly providing an access token. This functionality is being deprecated as it’s limited in flexibility. 

If you have been using a package hosted in a private repository on GitHub, you must start passing an access token into the URL. 

An example of passing an access token:

<File name='packages.yml'>

```yaml

packages:
- git: "https://{{env_var('DBT_ENV_SECRET_GIT_CREDENTIAL')}}@github.com/dbt-labs/awesome_repo.git"

```

</File>
