If you already have the <Constant name="fusion_engine" /> installed, you can skip this step. If you don't have it installed, choose your preferred installation method:

<Tabs queryString="installation">

<TabItem value="cdn" label="macOS & Linux (CDN)">

Run the following command in the terminal:

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

To use `dbt` immediately after installation, reload your shell so that the new `$PATH` is recognized:

```shell
exec $SHELL
```

Or, close and reopen your terminal window. This will load the updated environment settings into the new session.

</TabItem>

<TabItem value="windows-cdn" label="Windows (CDN)">

Run the following command in PowerShell:

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

To use `dbt` immediately after installation, reload your shell so that the new `Path` is recognized:

```powershell
Start-Process powershell
```

Or, close and reopen PowerShell. This will load the updated environment settings into the new session.

</TabItem>

<TabItem value="homebrew" label="Homebrew (macOS)">

If you have [Homebrew](https://brew.sh/) installed, run:

```shell
brew install dbt
```

To upgrade to a newer version:

```shell
brew upgrade dbt
```

</TabItem>

<TabItem value="winget" label="winget (Windows)">

If you have [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) installed, run:

```shell
winget install --id dbtLabs.dbt --exact
```

To upgrade to a specific version:

```shell
winget install --id dbtLabs.dbt --exact --version <version>
```

</TabItem>

<TabItem value="pip" label="pip">

You can install <Constant name="fusion" /> using `pip`. We recommend installing into a Python virtual environment to avoid dependency conflicts.

### Set up a virtual environment (recommended)

<Tabs>
  <TabItem value="unix-macos-venv" label="macOS & Linux">

  ```shell
  python3 -m venv .venv
  source .venv/bin/activate
  ```

  </TabItem>
  <TabItem value="windows-venv" label="Windows">

  ```shell
  py -m venv .venv
  .venv\Scripts\activate
  ```

  </TabItem>
</Tabs>

### Install dbt

Run the following commands to install the preview version and update to the latest.

```shell
python -m pip install --pre dbt
```

The `python -m pip install --pre dbt` command installs the latest <Constant name="fusion" /> release.


### Deactivate the virtual environment

When you're done, deactivate the environment:

```shell
deactivate
```

</TabItem>

</Tabs>

Run the following command to verify your installation:

```bash
dbt --version
```

You can use `dbt` or its <Constant name="fusion" /> alias `dbtf` (handy if you already have the Core or platform CLI installed). Default install path:

- macOS/Linux: `$HOME/.local/bin/dbt`
- Windows: `C:\Users\<username>\.local\bin\dbt.exe`

The installer adds this path automatically, but you may need to reload your shell for the `dbtf` command to work.
