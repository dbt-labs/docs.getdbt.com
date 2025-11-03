If you've never had a `.dbt` directory, you should perform the following recommended steps to create one. If you already have a `.dbt` directory, move the `dbt_cloud.yml` file into it. Some information about the `.dbt` directory:

- A `.dbt` directory is a hidden folder in the root of your filesystem. It's used to store your dbt configuration files. The `.` prefix is used to create a hidden folder, which means it's not visible in Finder or File Explorer by default. 
- To view hidden files and folders, press Command + Shift + G on macOS or Ctrl + Shift + G on Windows. This opens the "Go to Folder" dialog where you can search for the `.dbt` directory.


<Tabs>
<TabItem value="Create a .dbt directory">

  1. Clone your dbt project repository locally.
  2. Use the `mkdir` command followed by the name of the folder you want to create. 
    - If using macOS, add the `~` prefix to create a `.dbt` folder in the root of your filesystem:

     ```bash
     mkdir ~/.dbt # macOS
     mkdir %USERPROFILE%\.dbt # Windows
     ```
</TabItem>

<TabItem value="Move the dbt_cloud.yml file">

You can move the `dbt_cloud.yml` file into the `.dbt` directory using the `mv` command or by dragging and dropping the file into the `.dbt` directory by opening the Downloads folder using the "Go to Folder" dialog and then using drag-and-drop in the UI.

To move the file using the terminal, use the `mv/move` command. This command moves the `dbt_cloud.yml` from the `Downloads` folder to the `.dbt` folder. If your `dbt_cloud.yml` file is located elsewhere, adjust the path accordingly.


#### Mac or Linux
In your command line, use the `mv` command to move your `dbt_cloud.yml` file into the `.dbt` directory. If you've just downloaded the `dbt_cloud.yml` file and it's in your Downloads folder, the command might look something like this:

```bash
mv ~/Downloads/dbt_cloud.yml ~/.dbt/dbt_cloud.yml
```

#### Windows
In your command line, use the move command. Assuming your file is in the Downloads folder, the command might look like this:

```bash
move %USERPROFILE%\Downloads\dbt_cloud.yml %USERPROFILE%\.dbt\dbt_cloud.yml
```

</TabItem>
</Tabs>

