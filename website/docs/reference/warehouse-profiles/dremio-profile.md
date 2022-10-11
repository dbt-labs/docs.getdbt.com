---
title: "Dremio Profile"
---


## Overview of dbt-dremio
**Maintained by:** Dremio      
**Source:** https://github.com/dremio/dbt-dremio  
**Core Version:** 1.2.0

**dbt Cloud:** Not Supported    
**Required Version of Python:** (<b>QUESTION:</b> What is the required version?)

<!-- Who is the author going to be?
![dbt-dremio stars](https://img.shields.io/github/stars/fabrice-etanchaud/dbt-dremio?style=for-the-badge)
-->

## Prerequisites for Dremio Cloud
Before connecting from project to Dremio Cloud, follow these prerequisite steps:
* Ensure that you have the ID of the Sonar project that you want to use. See [Obtaining the ID of a Project](https://docs.dremio.com/cloud/cloud-entities/projects/#obtaining-the-id-of-a-project).
* Ensure that you have a personal access token (PAT) for authenticating to Dremio Cloud. See [Creating a Token](https://docs.dremio.com/cloud/security/authentication/personal-access-token/#creating-a-token).
* In the `dbt_project.yml` file at the root of your Dremio Cloud dbt project directory, append these lines:
    ```
    vars:
        dremio:reflections_enabled: false
    ```

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

Running the command `dbt init <project_name>` to initialize a Dremio project lets you choose to generate one of these three profiles:


### Profile for Dremio Cloud
```yaml
[project name]:
  outputs:
    dev:
      cloud_host: https://api.dremio.cloud
      cloud_project_id: [project ID]
      pat: [personal access token]
      threads: [integer >= 1]
      type: dremio
      use_ssl: true
      user: [email address]
  target: dev
```

### Profile for Dremio Software with Username/Password Authentication
```yaml
[project name]:
  outputs:
    dev:
      password: [password]
      port: [port]
      software_host: [hostname or IP address]
      threads: 1
      type: dremio
      use_ssl: [true|false]
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
      software_host: [hostname or IP address]
      threads: 1
      type: dremio
      use_ssl: [true|false]
      user: [username]
  target: dev
```

## Configurations

### Configurations Common to Profiles for Dremio Cloud and Dremio Software

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
 <td>Auto-populated when creating a Dremio project. Do not change this value.
 </td>
</tr>
<tr>
 <td><code>threads</code>
 </td>
 <td>Yes
 </td>
 <td><code>1</code>
 </td>
 <td>The number of threads the dbt project runs on.<br><br><b>QUESTION:</b>Why does the sample profile for Dremio Cloud say the value can be >=1, while the other two samples use 1?
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
<td><code>cloud_host</code>
</td>
<td>Yes
</td>
<td><code>https://api.dremio.cloud</code>
</td>
<td>
<p>US Control Plane<br>
<code>https://api.dremio.cloud</code>
<p>
EU Control Plane<br>
<code>https://api.eu.dremio.cloud</code>
   </td>
  </tr>
  <tr>
  <td><code>user</code></td>
  <td>Yes</td>
  <td>None</td>
  <td>Email address used as a username in Dremio Cloud
  </tr>
  <tr>
  <td><code>pat</code></td>
  <td>Yes</td>
  <td>None</td>
  <td>Personal Access Token<br>See <a target="_blank" href="https://docs.dremio.com/cloud/security/authentication/personal-access-token/">Personal Access Tokens</a> for instructions about obtaining a token.</td>
  </tr>
  <tr>
  <td><code>cloud_project_id</code></td>
  <td>Yes</td>
  <td>None</td>
  <td>The ID of the Sonar project in which to run transformations.</td>
  </tr>
  <tr>
   <td><code>use_ssl</code>
   </td>
   <td>Yes
   </td>
   <td><code>true</code>
   </td>
   <td>The value must be <code>true</code>.</td>
  </tr>
  </table>
    
### Configurations in Profiles for Dremio Software
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
   <td><code>software_host</code>
   </td>
   <td>Yes</td>
   <td>None</td>
   <td>The hostname or IP address of the coordinator node of the Dremio cluster.</strong>
   </td>
  </tr>
  <tr>
   <td><code>port</code>
   </td>
   <td>Yes</td>
   <td><code>9047</code></td>
   <td>Port for Dremio Software cluster API endpoints. (<strong>QUESTION: Can this be changed?</strong>)
   </td>
  </tr>
  <tr>
   <td><code>user</code>
   </td>
   <td>Yes</td>
   <td>None
   </td>
   <td>The username of the account to use when logging into the Dremio cluster.
   </td>
  </tr>
  <tr>
   <td><code>password</code>
   </td>
   <td>Yes, if you are not using the <code>pat</code> configuration.</td>
   <td>None
   </td>
   <td>The password of the account to use when logging into the Dremio cluster.
   </td>
  </tr>
  <tr>
   <td><code>pat</code>
   </td>
   <td>Yes, if you are not using the <code>user</code> and <code>password</code> configurations.</td>
   <td>None
   </td>
   <td>The personal access token to use for authenticating to Dremio.<br><ul><li>See <a target="_blank" href="https://docs.dremio.com/software/security/personal-access-tokens">Personal Access Tokens</a> for instructions about obtaining a token.</li><li>The use of a personal access token takes precedence if values for the three configurations <code>user</code>, <code>password</code> and <code>pat</code> are specified.</li></ul>
   </td>
  </tr>
  <tr>
   <td><code>use_ssl</code>
   </td>
   <td>Yes
   </td>
   <td><code>true</code>
   </td>
   <td>Acceptable values are <code>true</code> and <code>false</code>. If the value is set to <code>true</code>, (<strong>QUESTION: What is the requirement on the cluster? What is covered in the third bullet point of the prereqs?</strong>)
   </td>
  </tr>
</table>