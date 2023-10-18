---
title: "Testing a new adapter"
id: "4-testing-a-new-adapter"
---

:::info

Previously, we offered a packaged suite of tests for dbt adapter functionality: [`pytest-dbt-adapter`](https://github.com/dbt-labs/dbt-adapter-tests). We are deprecating that suite, in favor of the newer testing framework outlined in this document.

:::

This document has two sections:

1. "[About the testing framework](#about-the-testing-framework)" describes the standard framework that we maintain for using pytest together with dbt. It includes an example that shows the anatomy of a simple test case.
2. "[Testing your adapter](#testing-your-adapter)" offers a step-by-step guide for using our out-of-the-box suite of "basic" tests, which will validate that your adapter meets a baseline of dbt functionality.

## Prerequisites

- Your adapter must be compatible with dbt-core **v1.1** or newer
- You should be familiar with **pytest**: https://docs.pytest.org/

## About the testing framework

dbt-core offers a standard framework for running pre-built functional tests, and for defining your own tests. The core testing framework is built using `pytest`, a mature and standard library for testing Python projects.

The **[`tests` module](https://github.com/dbt-labs/dbt-core/tree/HEAD/core/dbt/tests)** within `dbt-core` includes basic utilities for setting up pytest + dbt. These are used by all "pre-built" functional tests, and make it possible to quickly write your own tests.

Those utilities allow you to do three basic things:
1. **Quickly set up a dbt "project."** Define project resources via methods such as `models()` and `seeds()`. Use `project_config_update()` to pass configurations into `dbt_project.yml`.
2. **Define a sequence of dbt commands.** The most important utility  is `run_dbt()`, which returns the [results](/reference/dbt-classes#result-objects) of each dbt command. It takes a list of CLI specifiers (subcommand + flags), as well as an optional second argument, `expect_pass=False`, for cases where you expect the command to fail.
3. **Validate the results of those dbt commands.** For example, `check_relations_equal()` asserts that two database objects have the same structure and content. You can also write your own `assert` statements, by inspecting the results of a dbt command, or querying arbitrary database objects with `project.run_sql()`.

You can see the full suite of utilities, with arguments and annotations, in [`util.py`](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/tests/util.py). You'll also see them crop up across a number of test cases. While all utilities are intended to be reusable, you won't need all of them for every test. In the example below, we'll show a simple test case that uses only a few utilities.

### Example: a simple test case

This example will show you the anatomy of a test case using dbt + pytest. We will create reusable components, combine them to form a dbt "project", and define a sequence of dbt commands. Then, we'll use Python `assert` statements to ensure those commands succeed (or fail) as we expect.

In ["Getting started running basic tests,"](#getting-started-running-basic-tests) we'll offer step-by-step instructions for installing and configuring `pytest`, so that you can run it on your own machine. For now, it's more important to see how the pieces of a test case fit together.

This example includes a seed, a model, and two tests—one of which will fail.

1. Define Python strings that will represent the file contents in your dbt project. Defining these in a separate file enables you to reuse the same components across different test cases. The pytest name for this type of reusable component is "fixture."

<File name="tests/functional/example/fixtures.py">

```python
# seeds/my_seed.csv
my_seed_csv = """
id,name,some_date
1,Easton,1981-05-20T06:46:51
2,Lillian,1978-09-03T18:10:33
3,Jeremiah,1982-03-11T03:59:51
4,Nolan,1976-05-06T20:21:35
""".lstrip()

# models/my_model.sql
my_model_sql = """
select * from {{ ref('my_seed') }}
union all
select null as id, null as name, null as some_date
"""

# models/my_model.yml
my_model_yml = """
version: 2
models:
  - name: my_model
    columns:
      - name: id
        tests:
          - unique
          - not_null  # this test will fail
"""
```

</File>

2. Use the "fixtures" to define the project for your test case. These fixtures are always scoped to the **class**, where the class represents one test case—that is, one dbt project or scenario. (The same test case can be used for one or more actual tests, which we'll see in step 3.) Following the default pytest configurations, the file name must begin with `test_`, and the class name must begin with `Test`.

<File name="tests/functional/example/test_example_failing_test.py">

```python
import pytest
from dbt.tests.util import run_dbt

# our file contents
from tests.functional.example.fixtures import (
    my_seed_csv,
    my_model_sql,
    my_model_yml,
)

# class must begin with 'Test'
class TestExample:
    """
    Methods in this class will be of two types:
    1. Fixtures defining the dbt "project" for this test case.
       These are scoped to the class, and reused for all tests in the class.
    2. Actual tests, whose names begin with 'test_'.
       These define sequences of dbt commands and 'assert' statements.
    """
    
    # configuration in dbt_project.yml
    @pytest.fixture(scope="class")
    def project_config_update(self):
        return {
          "name": "example",
          "models": {"+materialized": "view"}
        }

    # everything that goes in the "seeds" directory
    @pytest.fixture(scope="class")
    def seeds(self):
        return {
            "my_seed.csv": my_seed_csv,
        }

    # everything that goes in the "models" directory
    @pytest.fixture(scope="class")
    def models(self):
        return {
            "my_model.sql": my_model_sql,
            "my_model.yml": my_model_yml,
        }
        
    # continues below
```

</File>

3. Now that we've set up our project, it's time to define a sequence of dbt commands and assertions. We define one or more methods in the same file, on the same class (`TestExampleFailingTest`), whose names begin with `test_`. These methods share the same setup (project scenario) from above, but they can be run independently by pytest—so they shouldn't depend on each other in any way.

<File name="tests/functional/example/test_example_failing_test.py">

```python
    # continued from above

    # The actual sequence of dbt commands and assertions
    # pytest will take care of all "setup" + "teardown"
    def test_run_seed_test(self, project):
        """
        Seed, then run, then test. We expect one of the tests to fail
        An alternative pattern is to use pytest "xfail" (see below)
        """
        # seed seeds
        results = run_dbt(["seed"])
        assert len(results) == 1
        # run models
        results = run_dbt(["run"])
        assert len(results) == 1
        # test tests
        results = run_dbt(["test"], expect_pass = False) # expect failing test
        assert len(results) == 2
        # validate that the results include one pass and one failure
        result_statuses = sorted(r.status for r in results)
        assert result_statuses == ["fail", "pass"]

    @pytest.mark.xfail
    def test_build(self, project):
        """Expect a failing test"""
        # do it all
        results = run_dbt(["build"])
```

</File>

3. Our test is ready to run! The last step is to invoke `pytest` from your command line. We'll walk through the actual setup and configuration of `pytest` in the next section.

<File name="terminal">

```sh
$ python3 -m pytest tests/functional/test_example.py
=========================== test session starts ============================
platform ... -- Python ..., pytest-..., pluggy-...
rootdir: ...
plugins: ...

tests/functional/test_example.py .X                                  [100%]

======================= 1 passed, 1 xpassed in 1.38s =======================
```

</File>

You can find more ways to run tests, along with a full command reference, in the [pytest usage docs](https://docs.pytest.org/how-to/usage.html).

We've found the `-s` flag (or `--capture=no`) helpful to print logs from the underlying dbt invocations, and to step into an interactive debugger if you've added one. You can also use environment variables to set [global dbt configs](/reference/global-configs/about-global-configs), such as `DBT_DEBUG` (to show debug-level logs).

## Testing your adapter

Anyone who installs `dbt-core`, and wishes to define their own test cases, can use the framework presented in the first section. The framework is especially useful for testing standard dbt behavior across different databases.

To that end, we have built and made available a [package of reusable adapter test cases](https://github.com/dbt-labs/dbt-core/tree/HEAD/tests/adapter), for creators and maintainers of adapter plugins. These test cases cover basic expected functionality, as well as functionality that frequently requires different implementations across databases.

For the time being, this package is also located within the `dbt-core` repository, but separate from the `dbt-core` Python package.

### Categories of tests

In the course of creating and maintaining your adapter, it's likely that you will end up implementing tests that fall into three broad categories:

1. **Basic tests** that every adapter plugin is expected to pass. These are defined in `tests.adapter.basic`. Given differences across data platforms, these may require slight modification or reimplementation. Significantly overriding or disabling these tests should be with good reason, since each represents basic functionality expected by dbt users. For example, if your adapter does not support incremental models, you should disable the test, [by marking it with `skip` or `xfail`](https://docs.pytest.org/en/latest/how-to/skipping.html), as well as noting that limitation in any documentation, READMEs, and usage guides that accompany your adapter.

2. **Optional tests**, for second-order functionality that is common across plugins, but not required for basic use. Your plugin can opt into these test cases by inheriting existing ones, or reimplementing them with adjustments. For now, this category includes all tests located outside the `basic` subdirectory. More tests will be added as we convert older tests defined on dbt-core and mature plugins to use the standard framework.

3. **Custom tests**, for behavior that is specific to your adapter / data platform. Each <Term id="data-warehouse" /> has its own specialties and idiosyncracies. We encourage you to use the same `pytest`-based framework, utilities, and fixtures to write your own custom tests for functionality that is unique to your adapter.

If you run into an issue with the core framework, or the basic/optional test cases—or if you've written a custom test that you believe would be relevant and useful for other adapter plugin developers—please open an issue or PR in the `dbt-core` repository on GitHub.

## Getting started running basic tests

In this section, we'll walk through the three steps to start running our basic test cases on your adapter plugin:

1. Install dependencies
2. Set up and configure pytest
3. Define test cases

### Install dependencies

You should already have a virtual environment with `dbt-core` and your adapter plugin installed. You'll also need to install:
- [`pytest`](https://pypi.org/project/pytest/)
- [`dbt-tests-adapter`](https://pypi.org/project/dbt-tests-adapter/), the set of common test cases
- (optional) [`pytest` plugins](https://docs.pytest.org/en/7.0.x/reference/plugin_list.html)--we'll use `pytest-dotenv` below

Or specify all dependencies in a requirements file like:
<File name="dev_requirements.txt">

```txt
pytest
pytest-dotenv
dbt-tests-adapter
```
</File>

```sh
pip install -r dev_requirements.txt
```

### Set up and configure pytest

First, set yourself up to run `pytest` by creating a file named `pytest.ini` at the root of your repository:

<File name="pytest.ini">

```python
[pytest]
filterwarnings =
    ignore:.*'soft_unicode' has been renamed to 'soft_str'*:DeprecationWarning
    ignore:unclosed file .*:ResourceWarning
env_files =
    test.env  # uses pytest-dotenv plugin
              # this allows you to store env vars for database connection in a file named test.env
              # rather than passing them in every CLI command, or setting in `PYTEST_ADDOPTS`
              # be sure to add "test.env" to .gitignore as well!
testpaths =
    tests/functional  # name per convention
```

</File>

Then, create a configuration file within your tests directory. In it, you'll want to define all necessary profile configuration for connecting to your data platform in local development and continuous integration. We recommend setting these values with environment variables, since this file will be checked into version control.

<File name="tests/conftest.py">

```python
import pytest
import os

# Import the standard functional fixtures as a plugin
# Note: fixtures with session scope need to be local
pytest_plugins = ["dbt.tests.fixtures.project"]

# The profile dictionary, used to write out profiles.yml
# dbt will supply a unique schema per test, so we do not specify 'schema' here
@pytest.fixture(scope="class")
def dbt_profile_target():
    return {
        'type': '<myadapter>',
        'threads': 1,
        'host': os.getenv('HOST_ENV_VAR_NAME'),
        'user': os.getenv('USER_ENV_VAR_NAME'),
        ...
    }
```

</File>

### Define test cases

As in the example above, each test case is defined as a class, and has its own "project" setup. To get started, you can import all basic test cases and try running them without changes.

<File name="tests/functional/adapter/test_basic.py">

```python
import pytest

from dbt.tests.adapter.basic.test_base import BaseSimpleMaterializations
from dbt.tests.adapter.basic.test_singular_tests import BaseSingularTests
from dbt.tests.adapter.basic.test_singular_tests_ephemeral import BaseSingularTestsEphemeral
from dbt.tests.adapter.basic.test_empty import BaseEmpty
from dbt.tests.adapter.basic.test_ephemeral import BaseEphemeral
from dbt.tests.adapter.basic.test_incremental import BaseIncremental
from dbt.tests.adapter.basic.test_generic_tests import BaseGenericTests
from dbt.tests.adapter.basic.test_snapshot_check_cols import BaseSnapshotCheckCols
from dbt.tests.adapter.basic.test_snapshot_timestamp import BaseSnapshotTimestamp
from dbt.tests.adapter.basic.test_adapter_methods import BaseAdapterMethod

class TestSimpleMaterializationsMyAdapter(BaseSimpleMaterializations):
    pass


class TestSingularTestsMyAdapter(BaseSingularTests):
    pass


class TestSingularTestsEphemeralMyAdapter(BaseSingularTestsEphemeral):
    pass


class TestEmptyMyAdapter(BaseEmpty):
    pass


class TestEphemeralMyAdapter(BaseEphemeral):
    pass


class TestIncrementalMyAdapter(BaseIncremental):
    pass


class TestGenericTestsMyAdapter(BaseGenericTests):
    pass


class TestSnapshotCheckColsMyAdapter(BaseSnapshotCheckCols):
    pass


class TestSnapshotTimestampMyAdapter(BaseSnapshotTimestamp):
    pass


class TestBaseAdapterMethod(BaseAdapterMethod):
    pass
```

</File>


Finally, run pytest:
```sh
python3 -m pytest tests/functional
```

### Modifying test cases

You may need to make slight modifications in a specific test case to get it passing on your adapter. The mechanism to do this is simple: rather than simply inheriting the "base" test with `pass`, you can redefine any of its fixtures or test methods.

For instance, on Redshift, we need to explicitly cast a column in the fixture input seed to use data type `varchar(64)`:

<File name="tests/functional/adapter/test_basic.py">

```python
import pytest
from dbt.tests.adapter.basic.files import seeds_base_csv, seeds_added_csv, seeds_newcolumns_csv
from dbt.tests.adapter.basic.test_snapshot_check_cols import BaseSnapshotCheckCols

# set the datatype of the name column in the 'added' seed so it
# can hold the '_update' that's added
schema_seed_added_yml = """
version: 2
seeds:
  - name: added
    config:
      column_types:
        name: varchar(64)
"""

class TestSnapshotCheckColsRedshift(BaseSnapshotCheckCols):
    # Redshift defines the 'name' column such that it's not big enough
    # to hold the '_update' added in the test.
    @pytest.fixture(scope="class")
    def models(self):
        return {
            "base.csv": seeds_base_csv,
            "added.csv": seeds_added_csv,
            "seeds.yml": schema_seed_added_yml,
        }
```

</File>

As another example, the `dbt-bigquery` adapter asks users to "authorize" replacing a <Term id="table" /> with a <Term id="view" /> by supplying the `--full-refresh` flag. The reason: In the table <Term id="materialization" /> logic, a view by the same name must first be dropped; if the table query fails, the model will be missing.

Knowing this possibility, the "base" test case offers a `require_full_refresh` switch on the `test_config` fixture class. For BigQuery, we'll switch it on:

<File name="tests/functional/adapter/test_basic.py">

```python
import pytest
from dbt.tests.adapter.basic.test_base import BaseSimpleMaterializations

class TestSimpleMaterializationsBigQuery(BaseSimpleMaterializations):
    @pytest.fixture(scope="class")
    def test_config(self):
        # effect: add '--full-refresh' flag in requisite 'dbt run' step
        return {"require_full_refresh": True}
```

</File>

It's always worth asking whether the required modifications represent gaps in perceived or expected dbt functionality. Are these simple implementation details, which any user of this database would understand? Are they limitations worth documenting?

If, on the other hand, they represent poor assumptions in the "basic" test cases, which fail to account for a common pattern in other types of databases-—please open an issue or PR in the `dbt-core` repository on GitHub.

### Running with multiple profiles

Some databases support multiple connection methods, which map to actually different functionality behind the scenes. For instance, the `dbt-spark` adapter supports connections to Apache Spark clusters _and_ Databricks runtimes, which supports additional functionality out of the box, enabled by the Delta file format.

<File name="tests/conftest.py">

```python
def pytest_addoption(parser):
    parser.addoption("--profile", action="store", default="apache_spark", type=str)


# Using @pytest.mark.skip_profile('apache_spark') uses the 'skip_by_profile_type'
# autouse fixture below
def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "skip_profile(profile): skip test for the given profile",
    )

@pytest.fixture(scope="session")
def dbt_profile_target(request):
    profile_type = request.config.getoption("--profile")
    elif profile_type == "databricks_sql_endpoint":
        target = databricks_sql_endpoint_target()
    elif profile_type == "apache_spark":
        target = apache_spark_target()
    else:
        raise ValueError(f"Invalid profile type '{profile_type}'")
    return target

def apache_spark_target():
    return {
        "type": "spark",
        "host": "localhost",
        ...
    }

def databricks_sql_endpoint_target():
    return {
        "type": "spark",
        "host": os.getenv("DBT_DATABRICKS_HOST_NAME"),
        ...
    }

@pytest.fixture(autouse=True)
def skip_by_profile_type(request):
    profile_type = request.config.getoption("--profile")
    if request.node.get_closest_marker("skip_profile"):
        for skip_profile_type in request.node.get_closest_marker("skip_profile").args:
            if skip_profile_type == profile_type:
                pytest.skip("skipped on '{profile_type}' profile")
```

</File>

If there are tests that _shouldn't_ run for a given profile:

<File name="tests/functional/adapter/basic.py">

```python
# Snapshots require access to the Delta file format, available on our Databricks connection,
# so let's skip on Apache Spark
@pytest.mark.skip_profile('apache_spark')
class TestSnapshotCheckColsSpark(BaseSnapshotCheckCols):
    @pytest.fixture(scope="class")
    def project_config_update(self):
        return {
            "seeds": {
                "+file_format": "delta",
            },
            "snapshots": {
                "+file_format": "delta",
            }
        }
```

</File>

Finally:
```sh
python3 -m pytest tests/functional --profile apache_spark
python3 -m pytest tests/functional --profile databricks_sql_endpoint
```
