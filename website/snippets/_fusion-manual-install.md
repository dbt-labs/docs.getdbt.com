If you already have the <Constant name="fusion_engine" /> installed, you can skip this step. If you don't have it installed, you can follow these steps to install it:

1. Open a new command-line window and run the following command to install the <Constant name="fusion_engine" />:

    <Tabs queryString="installation">
    <TabItem value="mac-linux" label="macOS & Linux">

    Run the following command in the terminal:

    ```shell
    curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
    ```

    To use `dbtf` immediately after installation, reload your shell so that the new `$PATH` is recognized:

    ```shell
    exec $SHELL
    ```

    Or, close and reopen your Terminal window. This will load the updated environment settings into the new session.

    </TabItem>
    <TabItem value="windows" label="Windows (PowerShell)">

    Run the following command in PowerShell:

    ```powershell
    irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
    ```

    To use `dbtf` immediately after installation, reload your shell so that the new `Path` is recognized:

    ```powershell
    Start-Process powershell
    ```

    Or, close and reopen PowerShell. This will load the updated environment settings into the new session.

    </TabItem>
    </Tabs>

2. Run the following command to verify you've installed <Constant name="fusion" />:
    ```bash
    dbtf --version
    ```
    You can use `dbt` or its <Constant name="fusion" /> alias `dbtf` (handy if you already have another dbt CLI installed). Default install path:

       - macOS/Linux: `$HOME/.local/bin/dbt`
       - Windows: `C:\Users\<username>\.local\bin\dbt.exe`

    The installer adds this path automatically, but you may need to reload your shell for the `dbtf` command to work.

