# Single-sourcing content

* [About versioning](#adding-a-new-version)
  * [Using end-of-life dates](#using-end-of-life-dates)
  * [Versioning entire pages](#versioning-entire-pages)
  * [Versioning blocks of content](#versioning-blocks-of-content)
* [Using global variables](#using-global-variables)
* [Reusing snippets of content](#reusing-snippets-of-content)

## About versioning

Versions are managed in the `versions` array located in the `website/dbt-versions.js` file. This array holds all versions which are selectable from the versions dropdown in the navigation.

**The first version in the array is the latest version.** This is the default version when a visitor loads the page.

### Adding a new version

To add a new version to the site, a new object must be added to the `versions` array in the same format as existing versions. This object holds two properties: **version** and **EOLDate (See End of Life Dates below)**. 

Example Version: 

```jsx
exports.versions = [
	{
		version: "1.2",
		EOLDate: "2023-01-01"
	}
]
```

The **version** property is the value which shows in the nav dropdown. This value is compared to the VersionBlock component on a docs page to determine whether that section should be visible for the current active version (See the **Versioning the Sidebar** section on using the VersionBlock component).

### Using end-of-life dates

The **EOLDate** property determines when a version is no longer supported. A version is supported up until 1 year after its release.

When a documentation page is viewed, the **EOLDate** property for the active version is compared to today’s date. If the current version has reached, or is nearing the end of support, a banner will show atop the page, notifying the visitor of the end-of-life status.

Two different versions of the banner will show depending on the end-of-life date: 

- When the version is within 3 months of the **EOLDate.**
- When the version has passed the **EOLDate.**

#### Updating EOL date banner language

The content for these two EOLDate banners are located in the `website/src/theme/DocPage/index.js` file, in the `EOLBannerText` property.

### Versioning entire pages

If a Docs page should not be available for the selected version, it is possible to version the entire page. This is managed in the `versionedPages` array within the `website/dbt-versions.js` file.

Two things occur when a page is not available for the selected version:

- A banner will appear atop the page, noting this page covers a new feature which isn’t available for the selected version.
- The page is removed from the sidebar


Example of how to version a page in the `dbt-versions.js` file:

```jsx
exports.versionedPages = [
    {
      "page": "docs/supported-data-platforms",
      "firstVersion": "0.21",
    }
]
```

### Properties for versioning an entire page

**page** (mandatory): The path of the Docs page to version. This string must match the string for the page in the `sidebars.js` file.

**firstVersion** (optional): Sets the first version which this page is available.

**lastVersion** (optional): Sets the last version which this page is available.

## Versioning blocks of content

The **VersionBlock** component provides the ability to version a specific piece of content on a docs page. 

This component can be added directly to a markdown file in a similar way as other components (FAQ, File, Lightbox).

### Versioning properties

- **firstVersion** (optional): Sets the first version this piece of content is available for.
    - Defaults to **0** if not set.
- **lastVersion** (optional): Sets the last version this piece of content is available for.
    - If **lastVersion** prop not set, it will be available from the **firstVersion,** up to the latest version.

Both properties can be used together to set a range where the content should show. In the example below, this content will only show if the selected version is between **0.21** and **1.0**:

```markdown
<VersionBlock firstVersion="0.21" lastVersion="1.0">

	Versioned content here

</VersionBlock>
```

### Example for versioning entire pages

On the [Docs Defer page](https://docs.getdbt.com/reference/node-selection/defer), tabs are used to show different versions of a piece of code. **v0.21.0 and later** shows `--select`, while **v-.20.x and earlier** changes this to `--models`. 

![oldway](https://user-images.githubusercontent.com/3880403/163254165-dea23266-2eea-4e65-b3f0-c7b6d3e51fc3.png)

Below is how we can implement the same versioning using the new **VersionBlock** component:

You see this block when the selected version is >= 0.21:

```markdown

<VersionBlock firstVersion="0.21">

```shell
$ dbt run --select [...] --defer --state path/to/artifacts
$ dbt test --select [...] --defer --state path/to/artifacts
\```

</VersionBlock>
```

You see this version block when the selected version is <= 0.20

```markdown
<VersionBlock lastVersion="0.20">

```shell
$ dbt run --models [...] --defer --state path/to/artifacts
$ dbt test --models [...] --defer --state path/to/artifacts
\```

</VersionBlock>
```

## Using global variables

---

Global variables can be configured for use throughout the docs.

Using a global variable requires two steps:

1. Set the variable in the `website/dbt-global-variables.js` file.
2. Use the **Var** component to add the global variable to a page.

```jsx
// The dbtCore property is the identifer for the variable,
// while the name property is the value shown on the page.

exports.dbtVariables = {
  dbtCore: {
    name: "dbt Core"
  } 
}
```

```markdown
// <Var name="dbtCore" /> is converted to dbt Core

You can install <Var name="dbtCore" /> on the command line by using one of these recommended methods:
```

### Versioning global variables

It is possible to version global variables as well. This creates the ability to show different variations of a string based off the current version a visitor has selected.

To extend our `dbt-global-variables.js` file above, we can add a new variable: *note - these versions are not accurate and only shown for this example.*

```jsx
// A new variable called dbtCloud is added below
// This variable includes a versions array
// "Sinter" will replace "dbt Cloud" for versions 0.21 or lower

exports.dbtVariables = {
  dbtCore: {
    name: "dbt Core"
  },
	dbtCloud: {
		name: "dbt Cloud",
		versions: [
      {
        "name": "Sinter",
        "version": "0.21"
      }
    ]
	}
}
```

```markdown
You can get started with <Var name="dbtCloud" /> by [Signing up](https://www.getdbt.com/signup/).
```

In the above example, the **dbtCloud** property has a default name of “dbt Cloud”. The naming for variables cascade down, meaning “dbt Cloud” will show for all versions, until version **0.21** or lower is selected. At that point “Sinter” will replace “dbt Cloud”.

### Global variables properties

**name** (required): Expects the identifier for a global variable.

### Global variables example

The global `<Var />` component can be used inline, for example: 

```markdown
This piece of markdown content explains why <Var name="dbt" /> is awesome.
```

However, a Var component cannot start a new line of content. Fortunately, a workaround exists to use the Var component at the beginning of a line of content. 

To use the component at the beginning of a sentence, add a non-breaking space character before the component:

```markdown
// When starting a new line with a global variable,
// a non-breaking space is required

// Works
&nbsp;<Var name="dbt" /> is awesome!

// Does not work
<Var name="dbt" /> is awesome!
```

## Reusing snippets of content

The Snippet component allows for content to be reusable throughout the Docs. This is very similar to the existing FAQ component.

Creating and using a snippet requires two steps:

1. Create a new markdown snippet file in the `website/snippets` directory.
2. Use the `<Snippet src="filename" />` component within a Docs file.

### Snippet properties

**src:** Expects the file name of the snippet which lives in the snippets directory

### Snippet example

To create a new snippet to use throughout the site, first we will create a new markdown snippet within the snippets directory:

```markdown
## Header 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum porttitor dui, id scelerisque enim scelerisque at.
```

Now, we can add this snippet to a Docs file with the Snippet component:

```markdown
Docs content here.

<Snippet src="lorem-ipsum" />

Docs content here.
```
