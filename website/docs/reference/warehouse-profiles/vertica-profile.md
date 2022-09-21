---
title: "Vertica Profile"
meta:
  maintained_by: Community
  authors: Matthew Carter, Andy Regan, Andrew Hedengren
  github_repo: 'https://github.com/mpcarter/dbt-vertica'
  link_text: 'dbt-vertica'
  core_version: 'v0.21.0 and newer'
  cloud_support: Not Supported
  supported_version: Vertica 10.0+

---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-vertica

- **Maintained by** : <p>{frontMatter.meta.maintained_by}</p>
- **Authors**: <p>{frontMatter.meta.authors}</p>|
- **Github Repo**: <p>{frontMatter.meta.github_repo}</p>
- **Supported dbt Core version**: <p>{frontMatter.meta.core_version}</p>
- **dbt Cloud support**: <p>{frontMatter.meta.cloud_support}</p>
- **Supported data platform version**: <p>{frontMatter.meta.supported_version}</p>

<table>
  <thead>
    <tr>
      <th>Attribute</th><th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Maintained by</strong></td>
      <td><p>{frontMatter.meta.maintained_by}</p></td>
    </tr>
    <tr>
      <td><strong>Authors</strong></td>
      <td><p>{frontMatter.meta.authors}</p></td>
    </tr>
    <tr>
      <td><strong>Github Repo</strong></td>
      <td><p><a href={frontMatter.meta.github_repo}>{frontMatter.meta.link_text}</a></p></td>
    </tr>
    <tr>
      <td><strong>Supported dbt Core version</strong></td>
      <td><p>{frontMatter.meta.core_version}</p></td>
    </tr>
      <tr><td><strong>dbt Cloud support</strong></td>
      <td><p>{frontMatter.meta.cloud_support}</p></td>
    </tr>
    <tr>
      <td><strong>Supported data platform version</strong></td>
      <td><p>{frontMatter.meta.supported_version}</p></td>
    </tr>
  </tbody>
</table>


![dbt-vertica stars](https://img.shields.io/github/stars/mpcarter/dbt-vertica)

Easiest install is to use pip:

    pip install dbt-vertica

You don't need to install dbt separately. Installing `dbt-vertica` will also install `dbt-core` and `vertica-python`.

### Connecting to Vertica with **dbt-vertica**

#### Username / password authentication

Configure your dbt profile for using Vertica:

##### Vertica connection information

<File name='profiles.yml'>

```yaml
your-profile:
  outputs:
    dev:
      type: vertica # Don't change this!
      host: vertica-host-name
      port: 5433 # or your custom port (optional)
      username: your-username
      password: your-password
      database: vertica-database-name
      schema: your-default-schema
  target: dev
```

</File>

By default, `dbt-vertica` will request `ConnectionLoadBalance=true` (which is generally a good thing), and set a session label of `dbt_your-username`.

There are three options for SSL: `ssl`, `ssl_env_cafile`, and `ssl_uri`.
See their use in the code [here](https://github.com/mpcarter/dbt-vertica/blob/d15f925049dabd2833b4d88304edd216e3f654ed/dbt/adapters/vertica/connections.py#L72-L87).
