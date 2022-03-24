---
title: "Testing a new adapter"
id: "testing-a-new-adapter"
---

:::info

Previously, we offered a packaged suite of tests for dbt adapter functionality: [`pytest-dbt-adapter`](https://github.com/dbt-labs/dbt-adapter-tests). We are deprecating that suite, in favor of the newer testing framework outlined in this document. The rest of this document assumes that your plugin is compatible with dbt-core v1.1 or newer.

:::

dbt-core offers a standard framework for running pre-built functional tests, and for defining new ones.

The core testing framework is built using `pytest`, a mature and standard library for testing Python projects. It assumes a basic level of familiarity with the foundational concepts in `pytest`, such as fixtures. If this is your first time using `pytest`, we recommend you read the documentation: https://docs.pytest.org/

The [`tests` module](https://github.com/dbt-labs/dbt-core/tree/HEAD/core/dbt/tests) within `dbt-core` includes basic utilities for setting up `pytest` + `dbt`. These are built into `dbt-core`, and used by all functional tests. These also make it possible to write your own tests, using the same utilities.

Building on top of that foundation, we have a package of [adapter tests](https://github.com/dbt-labs/dbt-core/tree/HEAD/tests/adapter)—also located within the `dbt-core` repository, but separate from the `dbt-core` Python package. This package includes a set of basic fixtures and test cases, for use when testing 

## Types of tests

1. **Basic tests** that every adapter plugin is expected to pass. Given differences across data platforms, these may require slightly modification or reimplementation. Significantly overriding or disabling these tests should be with good reason, since each represents basic functionality that dbt users are accustomed to having. For example, if your adapter does not support incremental models, you should disable the test _and_ note that limitation in documentation, READMEs, and usage guides that accompany your adapter.

2. **Optional tests**, for second-order functionality that is common across plugins, but not required for basic use. Your plugin can opt into these test cases by inheriting existing ones, or reimplementing them with adjustments. More tests will be added as we convert older tests defined on dbt-core and mature plugins to use the standard framework.

3. **Custom tests**, for behavior that is specific to your adapter / data platform. Each data warehouse has its own specialties and idiosyncracies. We encourage you to use the same `pytest`-based framework, utilities, and fixtures to write your own custom tests for functionality that is unique to your adapter.

If you run into an issue with the core framework, or the basic/optional test cases—or if you've written a custom test that you believe would be relevant and useful for other adapter plugin developers—please open an issue or PR in the `dbt-core` repository on GitHub.

## Steps to get started

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

<File name="pytest.ini">

```python
import pytest
import os

# Import the standard functional fixtures as a plugin
# Note: fixtures with session scope need to be local
pytest_plugins = ["dbt.tests.fixtures.project"]

# The profile dictionary, used to write out profiles.yml
@pytest.fixture(scope="class")
def dbt_profile_target(unique_schema):
    return {
        'type': '<myadapter>',
        'threads': 1,
        'host': os.getenv('HOST_ENV_VAR_NAME'),
        'user': os.getenv('USER_ENV_VAR_NAME'),
        ...
        'schema': unique_schema  # this will be passed in by the testing framework
                                 # and different for each test, to avoid collisions
    }
```

</File>

### Define test cases

Each individual test case is defined as a class. To get started, you'll want to import all basic test cases and try running them.

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

See [docs on invoking `pytest`](https://docs.pytest.org/how-to/usage.html) for guidance and full command reference. It can be particularly helpful to use the `-s` flag (or `--capture=no`) to print output from the dbt test, and to step into an interactive debugger if you've added one.

#### Reimplementing test cases

You may find you need to override a specific test case to get it passing. For instance, on Redshift, we need to explicitly cast a column in the fixture input seed to use data type `varchar(64)`:

<File name="tests/functional/adapter/test_basic.py">

```python
from dbt.tests.adapter.basic.files import seeds_base_csv, seeds_added_csv, seeds_newcolumns_csv

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
