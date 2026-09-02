---
title: dbt platform CLI migration
id: platform-cli-migration
description: "Starting September 14, 2026, pip install dbt will install dbt v2 instead of the dbt platform CLI. Learn what to change to keep using the dbt platform CLI without interruption."
unlisted: true
---

Starting September 14, 2026, `pip install dbt` will install dbt v2 instead of the <Constant name="platform_cli" />. If you install the <Constant name="platform_cli" /> with pip, you need to take action to keep using it without interruption.

## What's changing

Starting September 14, 2026, `pip install dbt` will install dbt v2, dbt's next-generation Rust-based engine, instead of the <Constant name="platform_cli" />. This is a one-time change to what the `dbt` package on PyPI contains, not a <Constant name="platform_cli" /> upgrade.

If you install the <Constant name="platform_cli" /> using pip today and don't pin a version, your next `pip install dbt` or `pip install --upgrade dbt` installs dbt v2 instead. dbt v2 is a different engine: it runs locally against a warehouse connection you configure yourself, instead of running your commands against your <Constant name="dbt_platform" /> development environment. Commands like `dbt cancel`, `dbt reattach`, `dbt environment`, `dbt sl export`, and `dbt sqlfluff` don't exist in dbt v2.

## What to do

If you use the <Constant name="platform_cli" /> and want to keep using it, reinstall it using the current method for your operating system &mdash; Homebrew on macOS, or the native executable on Windows or Linux. Refer to [Install the <Constant name="platform_cli" />](/docs/platform/dbt-cli-installation) for full instructions.

If you can't reinstall right now (for example, a Docker image that only has pip available), pin your version instead:

```bash
pip install dbt==1.0.0.40.20
```

This keeps working indefinitely, but won't receive further <Constant name="platform_cli" /> updates through pip. Reinstalling with a currently supported method is the long-term path.

## General areas of impact

- **Dockerfiles / CI pipelines**: any unpinned `pip install dbt` step. Search your repos for `pip install dbt` without a `==` version pin.
- **Airflow**: `BashOperator`/`KubernetesPodOperator` tasks that install the CLI into the worker image at build time.
- **`requirements.txt` / `Pipfile` / `pyproject.toml`**: any unpinned `dbt` entry.
- **dbt Power User (VS Code extension)**: it shells out to the <Constant name="platform_cli" /> internally. Pin your version the same way; the extension itself doesn't need any separate action.

## FAQ

- **Why is dbt Labs doing this?** dbt v2 is the new default `dbt` engine going forward. Publishing it under the `dbt` name on PyPI means new users get dbt v2 by default, matching how `dbt` already behaves everywhere else (Homebrew, standalone install).

- **Will my pinned <Constant name="platform_cli" /> version stop working?** No. Pinned installs keep working. They just won't get new <Constant name="platform_cli" /> releases through pip after September 14. For that, reinstall using a currently supported method.

- **How do I tell which one I have installed?** `dbt --version`. The <Constant name="platform_cli" /> prints a version like `0.40.20`; the corresponding version on PyPI is `1.0.0.40.20`. dbt v2's version string needs reconfirming post-update. At the time this article was published, dbt v2's binary still internally identifies as `dbt-fusion X.Y.Z`, which may change.
