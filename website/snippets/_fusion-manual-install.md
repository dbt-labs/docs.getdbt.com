Choose the install method for your operating system:

- **Windows:** CDN installation (PowerShell), Winget, or Pip
- **macOS:** CDN installation, Homebrew, or Pip
- **Linux:** CDN installation or Pip

<Tabs groupId="fusion-install-os">
<TabItem value="windows" label="Windows" default>

### Pip

```shell
python -m pip install --pre dbt
```

To upgrade to a newer version:

```shell
python -m pip install --upgrade --pre dbt
```

### CDN (PowerShell)

Run the following in PowerShell:

```powershell
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
```

To use `dbt` immediately after installation, close and reopen or reload your shell so that the new `Path` is recognized:

```powershell
Start-Process powershell
```

To upgrade to a newer version:

```shell
dbt system update
```

### Winget

```shell
winget install --id dbtLabs.dbt --exact
```

To upgrade to a specific version:

```shell
winget install --id dbtLabs.dbt --exact --version <version>
```

</TabItem>
<TabItem value="macos-linux" label="macOS/Linux">

### Pip

```shell
python -m pip install --pre dbt
```

To upgrade to a newer version:

```shell
python -m pip install --upgrade --pre dbt
```

### CDN

```shell
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
```

To use `dbt` immediately after installation, close and reopen your terminal or reload your shell so that the new `$PATH` is recognized:

```shell
exec $SHELL
```

To upgrade to a newer version:

```shell
dbt system update
```

### Homebrew (macOS)

```shell
brew install dbt
```

To upgrade to a newer version:

```shell
brew upgrade dbt
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
