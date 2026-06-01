If you already have the <Constant name="fusion_engine" /> installed, you can skip this step. If you don't have it installed, you can follow these steps to install it:

1. Open a new command-line window and run the following commands to install the <Constant name="fusion_engine" />:

    ```shell
    pip install dbt==2.0.0rc178
    dbtf system update
    ```

2. Run the following command to verify you've installed <Constant name="fusion" />:
    ```bash
    dbtf --version
    ```
    You can use `dbt` or its <Constant name="fusion" /> alias `dbtf` (handy if you already have the Core or platform CLI installed). Default install path:

       - macOS/Linux: `$HOME/.local/bin/dbt`
       - Windows: `C:\Users\<username>\.local\bin\dbt.exe`

    The installer adds this path automatically, but you may need to reload your shell for the `dbtf` command to work.

