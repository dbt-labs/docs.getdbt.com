# dbt-core’s API documentation

## How to invoke dbt commands in python runtime

Right now the best way to invoke a command from python runtime is to use the dbtRunner we exposed

You can also pass in pre constructed object into dbtRunner, and we will use those objects instead of loading up from the disk.

```python
# preload profile and project
profile = load_profile(project_dir, {}, 'testing-postgres')
project = load_project(project_dir, False, profile, {})

# initialize the runner with pre-loaded profile and project
dbt = dbtRunner(profile=profile, project=project)
# run the command, this will use the pre-loaded profile and project instead of loading
res, success = dbt.invoke(cli_args)
```

For the full example code, you can refer to core/dbt/cli/example.py

## API documentation

### Command: build

#### defer

Type: boolean

If set, defer to the state variable for resolving unselected nodes.

#### exclude

Type: string

Specify the nodes to exclude.

#### fail_fast

Type: boolean

Stop execution on first failure.

#### full_refresh

Type: boolean

If specified, dbt will drop incremental models and fully-recalculate the incremental table from the model definition.

#### indirect_selection

Type: choice: [‘eager’, ‘cautious’]

Select all tests that are adjacent to selected resources, even if they those resources have been explicitly selected.

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### select

Type: string

Specify the nodes to include.

#### selector

Type: string

The selector name to use, as defined in selectors.yml

#### show

Type: boolean

Show a sample of the loaded data in the terminal

#### state

Type: path

If set, use the given directory as the source for json files to compare with this project.

#### store_failures

Type: boolean

Store test results (failing rows) in the database

#### target

Type: string

Which target to load for the given profile

#### target_path

Type: path

Configure the ‘target-path’. Only applies this setting for the current run. Overrides the ‘DBT_TARGET_PATH’ if it is set.

#### threads

Type: int

Specify number of threads to use while executing models. Overrides settings in profiles.yml.

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### version_check

Type: boolean

Ensure dbt’s version matches the one specified in the dbt_project.yml file (‘require-dbt-version’)

### Command: clean

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### target

Type: string

Which target to load for the given profile

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

### Command: compile

#### defer

Type: boolean

If set, defer to the state variable for resolving unselected nodes.

#### exclude

Type: string

Specify the nodes to exclude.

#### full_refresh

Type: boolean

If specified, dbt will drop incremental models and fully-recalculate the incremental table from the model definition.

#### parse_only

Type: boolean

TODO:  No help text currently available

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### select

Type: string

Specify the nodes to include.

#### selector

Type: string

The selector name to use, as defined in selectors.yml

#### state

Type: path

If set, use the given directory as the source for json files to compare with this project.

#### target

Type: string

Which target to load for the given profile

#### target_path

Type: path

Configure the ‘target-path’. Only applies this setting for the current run. Overrides the ‘DBT_TARGET_PATH’ if it is set.

#### threads

Type: int

Specify number of threads to use while executing models. Overrides settings in profiles.yml.

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### version_check

Type: boolean

Ensure dbt’s version matches the one specified in the dbt_project.yml file (‘require-dbt-version’)

### Command: debug

#### config_dir

Type: string

If specified, DBT will show path information for this project

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### target

Type: string

Which target to load for the given profile

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### version_check

Type: boolean

Ensure dbt’s version matches the one specified in the dbt_project.yml file (‘require-dbt-version’)

### Command: deps

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### target

Type: string

Which target to load for the given profile

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

### Command: docs

### Command: init

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### skip_profile_setup

Type: boolean

Skip interative profile setup.

#### target

Type: string

Which target to load for the given profile

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

### Command: list

#### exclude

Type: string

Specify the nodes to exclude.

#### indirect_selection

Type: choice: [‘eager’, ‘cautious’]

Select all tests that are adjacent to selected resources, even if they those resources have been explicitly selected.

#### output

Type: choice: [‘json’, ‘name’, ‘path’, ‘selector’]

TODO: No current help text

#### output_keys

Type: string

TODO: No current help text

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### resource_type

Type: choice: [‘metric’, ‘source’, ‘analysis’, ‘model’, ‘test’, ‘exposure’, ‘snapshot’, ‘seed’, ‘default’, ‘all’]

TODO: No current help text

#### select

Type: string

Specify the nodes to include.

#### selector

Type: string

The selector name to use, as defined in selectors.yml

#### state

Type: path

If set, use the given directory as the source for json files to compare with this project.

#### target

Type: string

Which target to load for the given profile

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

### Command: parse

#### compile

Type: boolean

TODO: No help text currently available

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### target

Type: string

Which target to load for the given profile

#### target_path

Type: path

Configure the ‘target-path’. Only applies this setting for the current run. Overrides the ‘DBT_TARGET_PATH’ if it is set.

#### threads

Type: int

Specify number of threads to use while executing models. Overrides settings in profiles.yml.

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### version_check

Type: boolean

Ensure dbt’s version matches the one specified in the dbt_project.yml file (‘require-dbt-version’)

#### write_manifest

Type: boolean

TODO: No help text currently available

### Command: run

#### defer

Type: boolean

If set, defer to the state variable for resolving unselected nodes.

#### exclude

Type: string

Specify the nodes to exclude.

#### fail_fast

Type: boolean

Stop execution on first failure.

#### full_refresh

Type: boolean

If specified, dbt will drop incremental models and fully-recalculate the incremental table from the model definition.

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### select

Type: string

Specify the nodes to include.

#### selector

Type: string

The selector name to use, as defined in selectors.yml

#### state

Type: path

If set, use the given directory as the source for json files to compare with this project.

#### target

Type: string

Which target to load for the given profile

#### target_path

Type: path

Configure the ‘target-path’. Only applies this setting for the current run. Overrides the ‘DBT_TARGET_PATH’ if it is set.

#### threads

Type: int

Specify number of threads to use while executing models. Overrides settings in profiles.yml.

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### version_check

Type: boolean

Ensure dbt’s version matches the one specified in the dbt_project.yml file (‘require-dbt-version’)

### Command: run_operation

#### args

Type: YAML

Supply arguments to the macro. This dictionary will be mapped to the keyword arguments defined in the selected macro. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### target

Type: string

Which target to load for the given profile

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

### Command: seed

#### exclude

Type: string

Specify the nodes to exclude.

#### full_refresh

Type: boolean

If specified, dbt will drop incremental models and fully-recalculate the incremental table from the model definition.

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### select

Type: string

Specify the nodes to include.

#### selector

Type: string

The selector name to use, as defined in selectors.yml

#### show

Type: boolean

Show a sample of the loaded data in the terminal

#### state

Type: path

If set, use the given directory as the source for json files to compare with this project.

#### target

Type: string

Which target to load for the given profile

#### target_path

Type: path

Configure the ‘target-path’. Only applies this setting for the current run. Overrides the ‘DBT_TARGET_PATH’ if it is set.

#### threads

Type: int

Specify number of threads to use while executing models. Overrides settings in profiles.yml.

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### version_check

Type: boolean

Ensure dbt’s version matches the one specified in the dbt_project.yml file (‘require-dbt-version’)

### Command: snapshot

#### defer

Type: boolean

If set, defer to the state variable for resolving unselected nodes.

#### exclude

Type: string

Specify the nodes to exclude.

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### select

Type: string

Specify the nodes to include.

#### selector

Type: string

The selector name to use, as defined in selectors.yml

#### state

Type: path

If set, use the given directory as the source for json files to compare with this project.

#### target

Type: string

Which target to load for the given profile

#### threads

Type: int

Specify number of threads to use while executing models. Overrides settings in profiles.yml.

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

### Command: source

### Command: test

#### defer

Type: boolean

If set, defer to the state variable for resolving unselected nodes.

#### exclude

Type: string

Specify the nodes to exclude.

#### fail_fast

Type: boolean

Stop execution on first failure.

#### indirect_selection

Type: choice: [‘eager’, ‘cautious’]

Select all tests that are adjacent to selected resources, even if they those resources have been explicitly selected.

#### profile

Type: string

Which profile to load. Overrides setting in dbt_project.yml.

#### profiles_dir

Type: path

Which directory to look in for the profiles.yml file. If not set, dbt will look in the current working directory first, then HOME/.dbt/

#### project_dir

Type: path

Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.

#### select

Type: string

Specify the nodes to include.

#### selector

Type: string

The selector name to use, as defined in selectors.yml

#### state

Type: path

If set, use the given directory as the source for json files to compare with this project.

#### store_failures

Type: boolean

Store test results (failing rows) in the database

#### target

Type: string

Which target to load for the given profile

#### target_path

Type: path

Configure the ‘target-path’. Only applies this setting for the current run. Overrides the ‘DBT_TARGET_PATH’ if it is set.

#### threads

Type: int

Specify number of threads to use while executing models. Overrides settings in profiles.yml.

#### vars

Type: YAML

Supply variables to the project. This argument overrides variables defined in your dbt_project.yml file. This argument should be a YAML string, eg. ‘{my_variable: my_value}’

#### version_check

Type: boolean

Ensure dbt’s version matches the one specified in the dbt_project.yml file (‘require-dbt-version’)
