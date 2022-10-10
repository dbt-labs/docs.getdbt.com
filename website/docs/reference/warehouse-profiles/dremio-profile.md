---
title: "Dremio Profile"
---


## Overview of dbt-dremio
**Maintained by:** Dremio      
**Source:** https://github.com/dremio/dbt-dremio  
**Core Version:** 1.1.2
**dbt Cloud:** Not Supported    
**Required Version of Python:** 

<!-- Who is the author going to be?
![dbt-dremio stars](https://img.shields.io/github/stars/fabrice-etanchaud/dbt-dremio?style=for-the-badge)
-->

## Prerequisites for Dremio Cloud
None.

## Prerequisites for Dremio Software

* Ensure that you are using version 22.0 or later.
* Enable these support keys in the Dremio cluster:
  * `dremio.iceberg.enabled`
  * `dremio.iceberg.ctas.enabled`
  * `dremio.execution.support_unlimited_splits`

  See <a target="_blank" href="https://docs.dremio.com/software/advanced-administration/support-settings/#support-keys">Support Keys</a> in the Dremio documentation for the steps.
* Configure full wire encryption in the Dremio cluster. For instructions, see <a target="_blank" href="https://docs.dremio.com/software/deployment/wire-encryption-config/">Configuring Wire Encryption</a>.

## Installing

Install this package from PyPi by running this command:

```
pip install dbt-dremio
```

## Profiles

The initialization of a dbt project generates one of these profiles:


### Profile for Dremio Cloud
```yaml
[project name]:
  outputs:
    dev:
      cloud_host: [cloud host]
      cloud_project_id: [project id]
      pat: [personal access token]
      threads: [integer >= 1]
      type: dremio
      use_ssl: true
      user: [user email address]
  target: dev
```

### Profile for Dremio Software with Username/Password Authentication
```yaml
[project name]:
  outputs:
    dev:
      password: [password]
      port: [port]
      software_host: [coordinator node]
      threads: 1
      type: dremio
      use_ssl: [true or false]
      user: [username]
  target: dev
```

### Profile for Dremio Software with Authentication Through a Personal Access Token
```yaml
[project name]:
  outputs:
    dev:
      pat: [personal access token]
      port: [port]
      software_host: [coordinator node]
      threads: 1
      type: dremio
      use_ssl: [true or false]
      user: [username]
  target: dev
```

## Configurations

## Configurations Common to Profiles for Dremio Cloud and Dremio Software

<table>
  <tr>
   <td><strong>Configuration</strong>
   </td>
   <td><strong>Required?</strong>
   </td>
   <td><strong>Default Value</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><code>type</code>
   </td>
   <td>Yes
   </td>
   <td><code>dremio</code>
   </td>
   <td>Auto-populated when creating a Dremio project. Value should not be changed.<br><br><b>Question:</b>What does the "auto-populating"?<br><br><b>Question:</b>When who or what creates a Dremio project?<br>
   </td>
  </tr>
  <tr>
   <td><code>threads</code>
   </td>
   <td>Yes
   </td>
   <td><code>1</code>
   </td>
   <td>The number of threads the dbt project runs on.<br><br><b>Question:</b>Can I create only 1 project per set of Dremio configuration parameters in my <code>profiles.yaml</code> file?<br><br><b>Question:</b>Can I change this number?<br><br><b>Question:</b>If I can change it, what effects should I expect?
   </td>
  </tr>
  </table>
  
  ### Configurations in Profiles for Dremio Cloud
  <table>
    <tr>
     <td><strong>Configuration</strong>
     </td>
     <td><strong>Required?</strong>
     </td>
     <td><strong>Default Value</strong>
     </td>
     <td><strong>Description</strong>
     </td>
    </tr>
  <tr>
   <td><code>host</code>
   </td>
   <td>Yes
   </td>
   <td>None
   </td>
   <td>Dremio Software: The hostname or IP address of coordinator node in the Dremio cluster.
<p>
Dremio Cloud:
<ul>
<li>US Control Plane
<p>
<code>https://api.dremio.cloud</code></li>
<li>
EU Control Plane
<p>
<code>https://api.eu.dremio.cloud</code></li>
</ul>
   </td>
  </tr>
  <tr>
   <td><code>port</code>
   </td>
   <td>Dremio Software: Yes
<p>
Dremio Cloud: Do not use this configuration.
   </td>
   <td><code>9047</code>
   </td>
   <td>Port for Dremio Software cluster API endpoints. (<strong>TODO: Can this be changed?</strong>
   </td>
  </tr>
  <tr>
   <td><code>user</code>
   </td>
   <td>Dremio Software: Yes, if you are not using the <code>pat</code> configuration.
<p>
Dremio Cloud: Do not use this configuration.
   </td>
   <td>None
   </td>
   <td>The username of the account to use when logging into the Dremio cluster.
   </td>
  </tr>
  <tr>
   <td><code>password</code>
   </td>
   <td>Dremio Software: Yes, if you are not using the <code>pat</code> configuration.
<p>
Dremio Cloud: Do not use this configuration.
   </td>
   <td>None
   </td>
   <td>The password of the account to use when logging into the Dremio cluster.
   </td>
  </tr>
  <tr>
   <td><code>pat</code>
   </td>
   <td>Dremio Software: Yes, if you are not using the <code>user</code> and <code>password</code> configurations.
<p>
Dremio Cloud: Yes
   </td>
   <td>None
   </td>
   <td>The personal access token to use for authenticating to Dremio.<br>Dremio Software: <ul><li>See <a target="_blank" href="https://docs.dremio.com/software/security/personal-access-tokens">Personal Access Tokens</a> for instructions about obtaining a token.</li><li>The use of a personal access token takes precedence if values for the three configurations <code>user</code>, <code>password</code> and <code>pat</code> are specified.</li></ul>Dremio Cloud: See <a target="_blank" href="https://docs.dremio.com/cloud/security/authentication/personal-access-token/">Personal Access Tokens</a> for instructions about obtaining a token.
   </td>
  </tr>
  <tr>
   <td><code>use_ssl</code>
   </td>
   <td>Yes
   </td>
   <td><code>true</code>
   </td>
   <td>Acceptable values are <code>true</code> and <code>false</code>.
<p>
Dremio Cloud: The value must be <code>true</code>.
   </td>
  </tr>
  <tr>
   <td><code>database</code>
   </td>
   <td>No
   </td>
   <td><code>@user</code>
   </td>
   <td><strong>TODO</strong>: Info in Fabrice’s README
   </td>
  </tr>
  <tr>
   <td><code>schema</code>
   </td>
   <td>No
   </td>
   <td><code>no_schema</code>
   </td>
   <td><strong>TODO</strong>: Info in Fabrice’s README. Can also use what Snowflake provides: <em>The schema to build models into by default. Can be overridden with<a href="https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-custom-schemas"> custom schemas</a></em>
   </td>
  </tr>
  <tr>
   <td><code>datalake</code>
   </td>
   <td>No
   </td>
   <td><code>$scratch</code>
   </td>
   <td><strong>TODO</strong>: Info in Fabrice’s README
   </td>
  </tr>
  <tr>
   <td><code>root_path</code>
   </td>
   <td>No
   </td>
   <td><code>no_schema</code>
   </td>
   <td><strong>TODO</strong>: Info in Fabrice’s README
   </td>
  </tr>
</table>