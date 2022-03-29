---
title: "Testing a new adapter"
id: "testing-a-new-adapter"
---

:::info

Previously, we offered a packaged suite of tests for dbt adapter functionality: [`pytest-dbt-adapter`](https://github.com/dbt-labs/dbt-adapter-tests). We are deprecating that suite, in favor of the newer testing framework outlined in this document. The rest of this document assumes that your plugin is compatible with dbt-core v1.1 or newer.

:::

## Foundation

dbt-core offers a standard framework for running pre-built functional tests, and for defining new ones.

The core testing framework is built using `pytest`, a mature and standard library for testing Python projects. It assumes a basic level of familiarity with the foundational concepts in `pytest`, such as fixtures. If this is your first time using `pytest`, we recommend you read the documentation: https://docs.pytest.org/

The **[`tests` module](https://github.com/dbt-labs/dbt-core/tree/HEAD/core/dbt/tests)** within `dbt-core` includes basic utilities for setting up `pytest` + `dbt`. These are used by all "pre-built" functional tests, and make it possible to quickly write your own tests.

### Example

In this example, we'll set up a basic dbt project using `pytest` fixtures, run some simple commands, and ensure they succeed (or fail) as we expect. To that end, we'll be using the `run_dbt` utility defined within the `tests` module of `dbt-core`.

First, let's define our project, using Python strings to stand in for file contents. The appeal of defining these in a separate file is that we can reuse the same "project" across test cases.

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
          - not_null  # will not pass
"""
```

</File>

Next, we'll use these "fixtures" to define our test cases. Following the default `pytest` configurations:
- The file name must begin with `test_`
- The class must begin with `Test`
- All test functions must begin with `test_`

<File name="tests/functional/example/test_example.py">

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
    """Methods below are of two types:
        - fixtures defining the setup for this test case
          (scoped to the class, and reused for all tests in the class)
        - actual tests, whose names begin with 'test_'
    """
    
    # configuration in dbt_project.yml
    @pytest.fixture(scope="class")
    def project_config_update(self):
        return {"name": "example"}

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
    
    # the method defines the actual sequence of steps to execute
    # pytest will take care of all "setup" + "teardown"
    def test_run_seed_test(self, project):
        """Seed, then run, then test. We expect one of the tests to fail
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

    @pytest.mark.xfail
    def test_build(self, project):
        """Expect a failing test"""
        # do it all
        results = run_dbt(["build"])
```

Then, we invoke `pytest`:

```bash
$ python3 -m pytest tests/functional/test_example.py
=========================== test session starts ============================
platform ... -- Python ..., pytest-..., pluggy-...
rootdir: ...
plugins: ...

tests/functional/test_example.py .X                                  [100%]

======================= 1 passed, 1 xpassed in 1.38s =======================
```

</File>

The [pytest usage docs](https://docs.pytest.org/how-to/usage.html) offer guidance and a full command reference. In our experience, it can be particularly helpful to use the `-s` flag (or `--capture=no`) to print output from the dbt test, and to step into an interactive debugger if you've added one. You can also use environment variables to set [global dbt configs](global-configs), such as `DBT_DEBUG` (to show debug-level logs).

## Testing your adapter

The framework presented above is available for use by anyone who installs `dbt-core`, and who wishes to define their own test cases.

Building on top of that foundation, we have also built and made available a [package of reusable adapter test cases](https://github.com/dbt-labs/dbt-core/tree/HEAD/tests/adapter), for creators and maintainers of adapter plugins. These test cases cover basic expected functionality, as well as functionality that frequently requires different implementations across databases.

For the time being, this package is also located within the `dbt-core` repository, but separate from the `dbt-core` Python package.

### Categories of tests

In the course of creating and maintaining your adapter, it's likely that you will end up implementing tests that fall into three broad categories:

1. **Basic tests** that every adapter plugin is expected to pass, defined in `tests.adapter.basic`. Given differences across data platforms, these may require slight modification or reimplementation. Significantly overriding or disabling these tests should be with good reason, since each represents basic functionality that dbt users are accustomed to having. For example, if your adapter does not support incremental models, you should disable the test _and_ note that limitation in documentation, READMEs, and usage guides that accompany your adapter.

2. **Optional tests**, for second-order functionality that is common across plugins, but not required for basic use. Your plugin can opt into these test cases by inheriting existing ones, or reimplementing them with adjustments. More tests will be added as we convert older tests defined on dbt-core and mature plugins to use the standard framework.

3. **Custom tests**, for behavior that is specific to your adapter / data platform. Each data warehouse has its own specialties and idiosyncracies. We encourage you to use the same `pytest`-based framework, utilities, and fixtures to write your own custom tests for functionality that is unique to your adapter.

If you run into an issue with the core framework, or the basic/optional test cases—or if you've written a custom test that you believe would be relevant and useful for other adapter plugin developers—please open an issue or PR in the `dbt-core` repository on GitHub.

## Getting started: basic tests

In this section, we'll walk through the three steps to start running our basic test cases on your adapter plugin:

1. Install dependencies
2. Set up and configure pytest
3. Define test cases

### Install dependencies

You should already have a virtual environment with `dbt-core` and your adapter plugin installed. You'll also need to install:
- `pytest`
- `dbt-tests-adapter`, the set of basic test cases

During initial development, the `dbt-tests-adapter` package is not yet on PyPi, so please install it directly from GitHub:
```bash
pip install "git+https://github.com/dbt-labs/dbt-core.git#egg=dbt-tests-adapter&subdirectory=tests/adapter"
```

Or specify it in a requirements file like:
<File name="dev_requirements.txt">

```txt
git+https://github.com/dbt-labs/dbt-core.git#egg=dbt-tests-adapter&subdirectory=tests/adapter
```
</File>

### Set up and configure pytest

First, set yourself up to run `pytest` by creating a file named `pytest.ini` at the root of your repository:

<File name="pytest.ini">

```python
[pytest]
filterwarnings =
    ignore:.*'soft_unicode' has been renamed to 'soft_str'*:DeprecationWarning
    ignore:unclosed file .*:ResourceWarning
env_files =
    test.env  # this allows you to use env vars from a file named test.env
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

As in the example above, each test case is defined as a class, and has its own "project" setup. To get started, you can import all basic test cases and try running them without changes:

<File name="tests/functional/adapter/test_basic.py">

```python
import pytest

from dbt.tests.adapter.basic.test_base import BaseSimpleMaterializations
from dbt.tests.adapter.basic.test_singular_tests import BaseSingularTests
from dbt.tests.adapter.basic.test_singular_tests_ephemeral importBaseSingularTestsEphemeral
from dbt.tests.adapter.basic.test_empty import BaseEmpty
from dbt.tests.adapter.basic.test_ephemeral import BaseEphemeral
from dbt.tests.adapter.basic.test_incremental import BaseIncremental
from dbt.tests.adapter.basic.test_generic_tests import BaseGenericTests
from dbt.tests.adapter.basic.test_snapshot_check_cols import BaseSnapshotCheckCols
from dbt.tests.adapter.basic.test_snapshot_timestamp import BaseSnapshotTimestamp

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
```

</File>


Finally, run pytest:
```bash
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

As another example, the `dbt-bigquery` adapter asks users to "authorize" replacing a table with a view by supplying the `--full-refresh` flag. The reason: In the table materialization logic, a view by the same name must first be dropped; if the table query fails, the model will be missing.

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
