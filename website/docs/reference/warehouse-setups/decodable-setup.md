---
title: "Decodable setup"
id: "decodable-setup"
meta:
  maintained_by: Decodable
  authors: Robert Metzger
  github_repo: 'https://github.com/decodableco/dbt-decodable'
  pypi_package: 'dbt-decodable'
  min_core_version: ''
  core_version: ''
  cloud_support: 
  min_supported_version: 'n/a'
  slack_channel_name: ''
  slack_channel_link: ''
  platform_name: 'Decodable'
  config_page: 'no-configs'
---


<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/decodableco/dbt-decodable}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

dbt-decodable is also available on PyPI. pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


## Connecting to Decodable with **dbt-decodable**
To connect to Decodable with dbt, you'll need to add a Decodable profile to your `profiles.yml` file. A Decodable profile has the following fields. 
<File name='profiles.yml'>

```yaml
dbt-decodable:       
  target: dev         
  outputs:           
    dev:              
      type: decodable
      database: None  
      schema: None    
      account_name: [your account]          
      profile_name: [name of the profile]   
      materialize_tests: [true | false]     
      timeout: [ms]                         
      preview_start: [earliest | latest]    
      local_namespace: [namespace prefix]   

```

</File>

#### Description of Profile Fields

| Option   | Description                                          | Required? | Example             |
|----------|------------------------------------------------------|-----------|---------------------|
| type     | The specific adapter to use                          | Required  | `decodable`              |
| database | Required but unused by this adapter.                 | Required  |    |
| schema   | Required but unused by this adapter.                                   | Required  | `4000`              |
| account_name | The name of your Decodable account.        | Required  | `my_awesome_decodable_account`         |
| profile_name | The name of your Decodable profile. | Required  | `my_awesome_decodable_profile`  |
| materialize_tests  | Specify whether to materialize tests as a pipeline/stream pair. Defaults to false.     | Optional  | `false`         |
| timeout  | The amount of time, in milliseconds, that a preview request runs. Defaults to 60000.   | Optional  | `60000`         |
| preview_start  | Specify where preview should start reading data from. If set to `earliest`, then preview will start reading from the earliest record possible. If set to `latest`, preview will start reading from the latest record. Defaults to `earliest`     | Optional  | `latest`         |
| local_namespace  | Specify a prefix to add to all entities created on Decodable. Defaults to `none`, meaning that no prefix is added.    | Optional  | `none`         |


## Supported features

| Name | Supported | Notes |
|---|---|---|
| Table materialization | Yes | Only table materialization are supported. A dbt table model translates to a pipeline/stream pair in Decodable, both sharing the same name. Pipelines for models are automatically activated upon materialization.   To materialize your models, run the `dbt run` command which does the following:  <ol> <li>Create a stream with the model's name and schema inferred by Decodable from the model's SQL. </li> <li>Create a pipeline that inserts the SQL's results into the newly created stream. </li> <li>Activate the pipeline.</li> </ol> By default, the adapter does not tear down and recreate the model on Decodable if no changes to the model have been detected. Invoking dbt with the `--full-refresh` flag or setting that configuration option for a specific model causes the corresponding resources on Decodable to be destroyed and built from scratch. See the ...< |
| View materialization | No |  |
| Incremental materialization | No |  |
| Ephemeral materialization | No |  |
| Seeds | Yes | Running the `dbt seed` command performs the following steps for each specified seed:   <ol> <li> Create a REST connection and an associated stream with the same name as the seed. </li> <li> Activate the connection. </li> <li> Send the data stored in the seed’s `.csv` file to the connection as events.</li> <li> Deactivate the connection. </li> </ol> After the `dbt seed` command has finished running, you can access the seed's data on the newly created stream.  |
| Tests | Yes | The `dbt test` command behaves differently depending on the `materialize_tests` option set for the specified target.  <br><br> If `materialize_tests = false`, then tests are only run after the preview job has completed and returned results. How long a preview job takes as well as what records are returned are defined by the `timeout` and `preview_start` configurations respectively.  <br><br> If `materialize_tests = true`, then dbt persists the specified tests as pipeline/stream pairs in Decodable. Use this configuration to allow for continuous testing of your models. You can run a preview on the created stream with the Decodable CLI or web interface to monitor the results.  |
| Sources | No | Sources in dbt correspond to Decodable source connections. However, the `dbt source` command is not supported.  |
| Docs generate | No | For details about your models, check your Decodable account.  |
| Snapshots | No | Snapshots and the `dbt snapshot` command are not supported.  |

