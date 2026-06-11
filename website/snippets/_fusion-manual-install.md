Choose your preferred installation method:

<Expandable alt_header="Pip installation for Windows, macOS, and Linux">

```shell
python -m pip install --pre dbt
```

To upgrade to a newer version:

```shell
python -m pip install --upgrade --pre dbt
```

</Expandable>

<Expandable alt_header="CDN installation for macOS and Linux">

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

To use `dbt` immediately after installation, close and reopen or reload your shell so that the new `$PATH` is recognized:

```shell
exec $SHELL
```

</Expandable>

<Expandable alt_header="CDN installation for Windows">

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

To use `dbt` immediately after installation, close and reopen or reload your shell so that the new `Path` is recognized:

```powershell
Start-Process powershell
```

</Expandable>

<Expandable alt_header="Homebrew installation for macOS">

```shell
brew install dbt
```

To upgrade to a newer version:

```shell
brew upgrade dbt
```

</Expandable>

<Expandable alt_header="Winget installation for Windows">

```shell
winget install --id dbtLabs.dbt --exact
```

To upgrade to a specific version:

```shell
winget install --id dbtLabs.dbt --exact --version <version>
```

</Expandable>


Run the following command to verify your installation:

```bash
dbt --version
```

You can use `dbt` or its <Constant name="fusion" /> alias `dbtf` (handy if you already have the Core or platform CLI installed). Default install path:

- macOS/Linux: `$HOME/.local/bin/dbt`
- Windows: `C:\Users\<username>\.local\bin\dbt.exe`

The installer adds this path automatically, but you may need to reload your shell for the `dbtf` command to work.
