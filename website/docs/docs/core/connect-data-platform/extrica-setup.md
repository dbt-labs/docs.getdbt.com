### Connecting to Extrica

#### Example profiles.yml 
Here is a  example of a dbt-extrica profile parameters. At a minimum, you need to specify `type`, `method`, `username`, `password` `host`, `port`, `schema`, `catalog` and `threads`.
<File name='~/.dbt/profiles.yml'>

```yaml
<profile-name>:
  outputs:
    dev:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]

    prod:
      type: extrica
      method: jwt 
      username: [username for jwt auth]
      password: [password for jwt auth]  
      host: [extrica hostname]
      port: [port number]
      schema: [dev_schema]
      catalog: [catalog_name]
      threads: [1 or more]
  target: dev

```
</File>

#### Description of Profile Fields

| Parameter  | Type     | Description                              |
|------------|----------|------------------------------------------|
| type       | string  | Specifies the type of dbt adapter (Extrica). |
| method     | jwt      | Authentication method for JWT authentication. |
| username   | string   | Username for JWT authentication. The obtained JWT token is used to initialize a trino.auth.JWTAuthentication object.      |
| password   | string   | Password for JWT authentication. The obtained JWT token is used to initialize a trino.auth.JWTAuthentication object.      |
| host       | string   | The host parameter specifies the hostname or IP address of the Trino server.           |
| port       | integer  | The port parameter specifies the port number on which the Trino server is listening.        |
| schema     | string   | Schema or database name for the connection. |
| catalog    | string   | Name of the catalog representing the data source. |
| threads    | integer  | Number of threads for parallel execution of queries. (1 or more |
