dbt State setup depends on your account access and local settings. After you run `dbt login`, follow the CLI prompt to complete the next step:

- If dbt State is available for your account but not enabled locally, dbt can enable it in `~/.dbt/user_settings.yml`.
- If dbt State is not available for your account, dbt prompts you to set up access before you can use dbt State locally.
- If dbt State is already enabled for your account and on your machine, no additional setup is required.
