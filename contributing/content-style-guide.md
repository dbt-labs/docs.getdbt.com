# Content style guide

Welcome to the content style guide for docs.getdbt.com! We aim to provide docs that help readers accomplish their goals. To this end, we should focus on clarity and meaning in our sentences, and follow up with consistency and grammatical correctness when we can.

This guide includes standards we want to emphasize, likely because we've made deliberate decisions about them. You can refer to [_The Microsoft Writing Style Guide_](https://docs.microsoft.com/en-us/style-guide/welcome/) and the [_Chicago Manual of Style_](https://www.chicagomanualofstyle.org/home.html) for those nagging questions like, "[Should I use an Em dash, En dash or hyphen?](https://docs.microsoft.com/en-us/style-guide/punctuation/dashes-hyphens/)"

### Table of Contents
* [Folder Structure and TOC](#folder-structure-and-toc)
* [Filenaming](#filenaming)
* [Using Markdown](#using-markdown)
* [Callouts](#callouts)
* [Text formatting](#Text-formatting)
* [UI elements](#UI-elements)
* [Titles](#Titles)
* [Placeholder text](#Placeholder-text)
* [Oxford comma](#Oxford-comma)
* [Lists](#Lists)
* [Tables](#Tables)
* [Cards](#Cards)
* [Word choice & terminology](#word-choice--terminology)
* [Links](#Links)
* [Images](#Images)
* [Talk to us](#Talk-to-us)

## Folder Structure and TOC

The folder structure for the [docs.getdbt.com](https://github.com/dbt-labs/docs.getdbt.com) repository is organized into several high-level categories under the main `website` folder such as `blog`, `cypress`, `docs`, `functions`, `plugins`, `snippets`, `src`, `static`, and so on.

The left sidebar (leftbar) is managed in the `sidebar.js` file. You only need to edit the `sidebar.js` file when you are adding a new page or deleting an existing page. Editing the `sidebar.js` file can cause merge conflicts as it's updated often because content is being worked on daily. You will need to accept the changes from other contributors if you are committing a PR.

Don't worry if you're not sure where in the leftbar a new topic belongs. Do your best and when you submit your PR, the dbt Labs Documentation team will edit it and help to find the right placement.

The right sidebar (rightbar), also known as the page TOC, is created automatically for all the H2 and H3 headings on a page. For details, see [Headings and Table of contents](https://docusaurus.io/docs/markdown-features/toc) in Docusaurus. 

## Filenaming

If you're adding a new file in the [docs.getdbt.com](https://github.com/dbt-labs/docs.getdbt.com) repository, review the following file name guidance and examples: 

- Keep the file name as short as possible since it becomes part of the URL and leave out any unnecessary words. Long URLs are hard to read and prone to errors.
- Think about where you want to locate the file in the leftbar. This will help catch and avoid redundancy. Remain consistent with the surrounding leftbar items.
- Be as descriptive as possible so readers have an idea as to what they’re about to read.

| ✅ Use | ❌ Avoid|
|:-------:|:-------:|
|`/docs/cloud/about-cloud/architecture` | `/docs/deploy/how-we-think-about-architecture`|


## Using Markdown

docs.getdbt.com uses its own CSS, and Docusaurus supports its own specific Markdown syntax. Review the basic Markdown syntax [document](https://www.markdownguide.org/basic-syntax/) for the supported syntax elements. For custom syntaxes, review the following table: 

| Element                                     | Syntax                                                |
|---------------------------------------------|-------------------------------------------------------|
| Link - external site                        | `[Title](https://www.example.com)`                    |
| Link - topic in same folder                 | `[Title](/folder/file-name) without file extension`*   |
| Link - topic in different folder            | `[Title](/folder/file-name) without file extension`*   |
| Link - section in topic in same folder      | `[Title](/folder/file-name#section-name)`*             |
| Link - section in topic in different folder | `[Title](/folder/file-name#section-name)`*            |
| Image                                       | `<Lightbox src="/img/docs/<image-name>.jpg" title="Concise description of image"/>`|

*docs.getdbt.com uses specific folders when linking to topics or sections. A successful link syntax begins with one of the following folder paths:

- `/docs` 
- `/guides` 
- `/references`

**Example**

:white_check_mark: `[Title](/guides/file-name)` 

:x: `[Title](/blog/file-name)` 

## Callouts

Callouts highlight important or high-value information that readers need to know. We want callouts to stand out, so we should keep their content to a minimum, avoiding general information, permissions, or prerequisites. Too much information can make it difficult to absorb. Imagine driving down one block with five stop signs!?!

If you add text after the first code, like this `:::note This is a note title`, it shows up as a title for the note.

Callout formats include:

| Types of callouts | Callout formats |
| ---- | ------ |
| Note callouts are used for notices| ```:::note``` <br /> <br /> ```text``` <br /> <br /> ```:::``` |
| Info callouts are used to highlight info |```:::info``` <br /> <br /> ```text``` <br /> <br /> ```:::``` |
| Tip callouts are used for tips |```:::tip``` <br /> <br /> ```text``` <br /> <br /> ```:::``` |
| Caution callouts are used for warnings/considerations |```:::caution``` <br /> <br /> ```text``` <br /> <br /> ```:::``` |


## Text formatting
You consider many elements when designing technical docs, and the way you format text can help you achieve a well-articulated design. With consistency of use, well-formatted text creates a single voice when there are multiple authors/contributors, increases the readability of the content, and further establishes an organization's branding.

### Italics
Use italics to decorate text for emphasis.

:white_check_mark: Do _not_ leave any personal belongings on the bus.

### Bold
Don't use bold for emphasis. It's reserved for titles, headers, and UI elements.

:white_check_mark: Click **Pay** to complete your purchase.

:x: **DO NOT** lock the door.

### Code
Use code font to decorate text for:

|Text |Example |
|-----|--------|
| source code (like SQL, YAML, and JavaScript) | `select * from customers` |
| [placeholder text](#placeholder-text) | `CUSTOMER_ID` |
| directory paths | `/opt/homebrew/bin/` |
| directory names | The file is in the `etc` directory. |
| filenames | Update your `dbt_project.yml` to configure this |
| git branch names | When done, merge your PR to `main` |
| commands | To check the status of a running cluster, use the `ghe-cluster-status` command |
| arguments, parameters, keys | Update the `name` in your YAML file |

Use [code blocks](#code-blocks) for longer or more complex commands. Do _not_ use multiple font decorations on text as it can cause it to be visually busy and so harder to read; for example, avoid inline links in command names.

### Code blocks

Keep lines in code samples to about 60 characters, to avoid requiring readers to scroll horizontally in the code block. Locate explanatory text before the code block, rather than using comments inside the code block.

You can look at the different [languages you can use in code blocks](https://markdown.land/markdown-code-block#markdown-code-block-language-list), which will change how the code example is formatted (like highlighting). For example, `yaml` or `shell` are commonly used in the dbt product documentation. 

Within code blocks:

* Avoid using markup before the command output.
* Only use $ before the command itself if you’re showing the command’s output in the same block.

#### Code block examples

Provide context for code examples referring to a larger file by showing the relevant section of the file, so that users understand how to edit their own code.

:white_check_mark: Use:

```yaml
name: my_dbt_project
version: 1.0.0

config-version: 2

vars:
  # The `start_date` variable will be accessible in all resources
  start_date: '2021-06-01'
```

:x: Avoid:
```yaml
config-version: 2

vars:
  # The `start_date` variable will be accessible in all resources
  start_date: '2021-06-01'
```

## UI elements

Similar to [text formatting](#text-formatting), consistent use of how we refer to the user interface (UI) elements can help increase the scannability and readability of the docs for our readers.

The following sections describe the guidelines for documenting UI elements.

### Buttons

Bold the button name and use the term click.

:white_check_mark: Click **Submit** to create a new branch.

:x: Click the **Submit** button to create a new branch.

### Checkboxes

Bold the name of the checkbox. You can use the terms select, choose, or clear.

:white_check_mark:  Select the **New** option.

:white_check_mark:  Clear the **New** option.

:x: Check the **New** option.

:x: Uncheck the **New** option.

### Dropdown menus

Bold the name of the dropdown menu and also the names of its list items. You can use the terms select or choose.

:white_check_mark: In the **Create** menu, select the **From a template** option.

:white_check_mark: Choose **Create** > **From a template** to create a new page.

### Radio buttons

Bold the name of the radio button. You can use the terms select, choose, or clear.

:white_check_mark: Choose the **Small size** option.

:white_check_mark: Clear the **Small size** option.

:x: Click the **Small size** radio button.

### Text fields

Bold the name of the text field and use the term enter for user input.

:white_check_mark: In the **Address** field, enter your company's address.

### Location of UI elements

When referring to UI elements, describe its position in the software application to help users locate it easily. You can use upper, lower, center, left, and right to do this.

:white_check_mark: Use the search box in the upper left corner to explore more topics.

:white_check_mark: You can view alerts in the lower right corner of the tool.

:white_check_mark: You can manage your projects in the file explorer on the left side of the page.

:white_check_mark: Access all guides from the Guides menu at the top of the page.


### UI text

When referring to different sections of the IDE, use the name of the section and bold it. Avoid using the terms panel and pane.

:white_check_mark: In the **Settings** section, choose the default address for your account.

:x: You can review all your past orders from the **History** pane.

## Titles

People make use of titles in many places like table headers, section headings (such as an H2, H3, or H4), page titles, sidebars, and so much more.

When generating titles or updating them, use sentence case. It sets a more conversational tone to the docs&mdash; making the content more approachable and creating a friendly feel.

We've defined five content types you can use when contributing to the docs (as in, writing or authoring). Learn more about title guidelines for [each content type](https://github.com/dbt-labs/docs.getdbt.com/blob/current/contributing/content-types.md).

## Placeholder text

Placeholder text is something that the user should replace with their own text. For example, their website domain name.

Use all capital letters([screaming snake case](https://fission.codes/blog/screaming-snake-case/)) to indicate text that changes in the user interface or that the user needs to supply in a command or code snippet. Avoid surrounding it in brackets or braces, which someone might copy and use, producing an error.

Identify what the user should replace the placeholder text within the paragraph preceding the code snippet or command.

:white_check_mark: The following is an example of configuring a connection to a Redshift database. In your YAML file, you must replace `CLUSTER_ID` with the ID assigned to you during setup:

```yaml
my-redshift-db:
  target: dev
  outputs:
    dev:
      type: redshift
      method: iam
      cluster_id: CLUSTER_ID

```

## Oxford comma

Use an Oxford comma (serial comma) when you have a series with three or more terms.

The sentence below could mean my parents are Maria and Lin or it could mean they are people I love in addition to my parents.

:x: I love my parents, Maria and Lin.

Removing this ambiguity by using Oxford commas makes content easier to translate.  

:white_check_mark: I love my parents, Maria, and Lin.

## Lists

People often scan technical documentation until they find the information they’re looking for, instead of reading it line by line. Lists are a great way to present content in a scannable format.

There are bulleted (unordered) lists and numbered (ordered) lists. If the list items can be in any order, use a bulleted list. For a prioritized list or a set of steps, use a numbered list.

Guidelines for making lists are:
- There are at least two items.
- All list items follow a consistent, grammatical structure (like each item starts with a verb, each item begins with a capitalized word, each item is a sentence fragment).
- Lists items don't end in commas, semicolons, or conjunctions (like "and", "or"). However, you can use periods if they’re complete sentences.
- Introduce the list with a heading or, if it's within the text, as a complete sentence or as a sentence fragment followed by a colon.

If the list starts getting lengthy and dense, consider presenting the same content in a different format such as a table, as separate subsections, or a new guide.

### Examples of lists

A bulleted list with introductory text:    

> A dbt project is a directory of `.sql` and .yml` files. The directory must contain at a minimum:
>
> - Models: A model is a single `.sql` file. Each model contains a single `select` statement that either transforms raw data into a dataset that is ready for analytics or, more often, is an intermediate step in such a transformation.
> - A project file: A `dbt_project.yml` file, which configures and defines your dbt project.

A bulleted list with sentence fragments:

> Supported languages:
> - Python
> - Java
> - C++

A numbered list following an H2 heading:    

> ## Check out a new git branch
>
> 1. Make sure you're in the Develop interface. If you're not, click the hamburger menu, then click `Develop`. The main branch is now set as read-only mode so you'll need to create a new branch.
>
> 2. Click **+ create new branch** and enter `add-customers-model` for the branch name.

## Tables
Tables provide a great way to present complex information and can help the content be more scannable for users, too.

There are many ways to construct a table, such as row spanning and cell splitting. The content should be clear, concise, and presented well on the web page (for example, avoid awkward word wrapping).

Guidelines for making tables are:
- Introduce the table with a heading or, if it's within the text, as a complete sentence or as a sentence fragment followed by a colon.
- Use a header row
- Use sentence case for all content, including the header row
- Content can be complete sentences, sentence fragments, or single words (like `Currency`)

If the table starts getting cumbersome and hard to read (that is, bad UX), consider presenting the same content in a different format such as a definition list. Consider your design of the content, too (like using flag icons instead of country names as it takes up less space on a page). Or, you could split the content so they’re in separate subsections, separate tabs, or separate pages (like by data warehouse or programming language).

### Examples of tables

A table with introductory text:

> You can use **custom schemas** in dbt to build models in a schema other than your target schema. By default, dbt generates a model's schema name by concatenating the custom schema to the target schema, as follows: `<target_schema>_<custom_schema>;`.
>
> | Target schema | Custom schema | Resulting schema |
> | ------------- | ------------- | ---------------- |
> | &lt;target_schema&gt; | None | &lt;target_schema&gt; |
> | analytics | None | analytics |
> | dbt_alice | None | dbt_alice |
> | &lt;target_schema&gt; | &lt;custom_schema&gt; | &lt;target_schema&gt;\_&lt;custom_schema&gt; |
> | analytics | marketing | analytics_marketing |
> | dbt_alice | marketing | dbt_alice_marketing |

A table following an H3 heading:

> ### Arguments
> | Name | Description | Values |
> | -----| ----------- | ------ |
> | `-help` | Displays information on how to use the command. | Doesn't take any values. |
> | `-readable` | Print output in human-readable format. | <ul><li>`true`</li><li>`false`</li></ul> |
> | `-file` | Print output to file instead of stdout. | Name of the file. |

## Cards

Use the `<Card` component to display content and actions on a single topic. Users should cards easy to scan for relevant and actionable information. Elements, like text, icons, and links can be used inside a card. 
  
You can configure a card in 2, 3, 4, or 5-column grids. To maintain a good user experience, be mindful of how the cards are displayed. Cards with multiple paragraphs may not work because the text and cards will appear too squished, making them hard to read and a bad user experience. 

There won't be many instances where you need to display 4 or 5 cards on the docs site. While we recommend you use 2 or 3-column grids, you can use 4 or 5-column grids in the following scenarios:

- For cards that contain little text and are limited to 15 words or less. This is to make sure the text isn't squished.
- Always have the `hide_table_of_contents:` frontmatter set to `true` (This hides the right table of contents). 

Otherwise, the text will appear squished and provide users with a bad experience.

- `<divclassName="grid--2-col">`: creates 2 column cards
- `<divclassName="grid--3-col">`: creates 3 columns cards
- `<divclassName="grid--4-col">`: creates 4 columns cards (use sparingly)
- `<divclassName="grid--5-col">`: creates 5 columns cards (use sparingly)
- You can't create cards with 6 or more columns as that would provide users a poor experience.

Refer to [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features) and [Quickstarts](/docs/quickstarts/overview) as examples. 

### Create cards

To create cards in markdown, you need to:

- Start off by using the appropriate `<divclassName="grid--column_num-col">` for your use case 
- Create a `<Card` component (which is wrapped within the div)
- Add the props within the card component, including `title`,`body`,`link`,`icon`.
- Close out the div by using `</div>`

Refer to the following prop list for detailed explanations and examples:

| Prop | Type | Info | Example |
| ---- | ---- | ---- | ------- |
| `title` | required | The title should be clear and explain an action the user should take or a product/feature. | `title: dbt Cloud IDE`
| `body` | required | The body contains the actionable or informative text for the user. You can include `<a href="` link within the body of the text. However, if you do this, you must not include the `link` prop set as that'll override any `<a href's` within the body text.  | `body="The IDE is the easiest and most efficient way to develop dbt models`
| `link` | optional | Add a link to the entire card component so when users click on the card, it'll trigger the link. Adding a link prop means it'll override any links within the body and if users click on the card, they'll be directed to the link set by the link prop. | `link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud`
| `icon` | optional but recommended | You can add an icon to the card component by using any icons found in the [icons](https://github.com/dbt-labs/docs.getdbt.com/tree/current/website/static/img/icons) directory. <br /> * Icons are added in .svg format and you must add icons in two locations: website/static/img/icons and website/static/img/icons/white. This is so users can view the icons in dark or light mode on the docs.getdbt.com site. | ` icon="pencil-paper"/>` |

The following is an example of a 4-card column:

```
<div className="grid--4-col">

<Card
    title="dbt Cloud IDE" 
    body="The IDE is the easiest and most efficient way to develop dbt models." 
    link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud" 
    icon="pencil-paper"/> 
    
<Card  ## this card component has an <a href link within the body. Notice how there's no link prop set as it'll override any a href's within the body. 
    title="New title"
    body="more <a href='www.getdbt.com'>text text</a>"
    icon="pencil-paper"/>

<Card
    title="New title"
    body="more text text"
    link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud" 
    icon="pencil-paper"/>

<Card
    title="New title"
    body="more text text"
    link="/docs/cloud/dbt-cloud-ide/develop-in-the-cloud" 
    icon="pencil-paper"/>

</div>
```

## Word choice & terminology
Use active voice instead of passive. Active voice is clearer and more direct, making it easier to translate. 

✅ Use: The contributor writes the documentation.

❌ Avoid: The documentation is written by contributors.

### Active voice

Use the active voice most of the time. Use the passive voice sparingly. 

- Passive voice: _Files are added by developers._
- Active voice: _Developers add files._

Active voice provides the following advantages:

- Active voice is generally shorter than passive voice.
- Active voice is easier for users to understand and often results in shorter content.
- Most readers mentally convert passive voice to active voice. Why subjects readers to extra processing time? By sticking to active voice, you enable readers to skip the preprocessor stage and go straight to compilation.
- Passive voice confuses your ideas and reports action indirectly.
- Some passive voice sentences omit an actor altogether, which forces the reader to guess the actor's identity.


Sometimes, using passive voice is appropriate. Make sure it’s an intentional choice that communicates the idea clearer than active voice would. For example, when the system is the actor, rather than a person.


✅ Use |	❌ Avoid
--- | ---|
(Active voice) Ask someone with access to dbt Cloud to transform the data. | This data transformation can be done by someone with access to dbt Cloud. |
(Passive voice &mdash; exceptions) The open-sourced rpc plugin is used by the Cloud IDE to recompile changes made in your project. |  We are using the open-sourced rpc plugin for the Cloud IDE to recompile changes made in your project. |

### Spelling

In general, when the spelling of English words varies by locale &mdash; use the US spelling. For example:

✅ Use | ❌ Avoid
-- | --
standardize  | standardise 
license | licence
color | colour
</div></b>

Avoid regional idiomatic phrases as well.  For example, a common saying amongst English speakers in India is "do the needful," but this phrase may be unrecognizable to English speakers from other regions. 

### Abbreviations

According to The American Heritage Dictionary, an abbreviation is "[a] shortened form of a word or phrase used chiefly in writing to represent the complete form" but, unlike the acronym, it's letters aren't pronounced together as one full word.

### Acronyms

Spell out acronyms the first time they’re used in an article, except in titles or headers. If an uncommon abbreviation appears in the title, define it in the first couple of lines of the body text.

_Do_ provide the full word or phrase being abbreviated before the abbreviation itself and encapsulate within parentheses. <br />
 * *Example: Integrated Development Environment (IDE)*

**DO NOT** use an acronym if its only used once. Please use the full word or phrase for its one-time use.

### Latin abbreviations

Avoid using Latin abbreviations. These terms are harder to localize/translate.

Some common Latin abbreviations and other words to use instead:

| Avoid | Use | Example |
|--------------------|------------|---------|
| i.e.               |  that is    | Use incremental models when your dbt runs are becoming too slow (that is, don't start with incremental models) |
| e.g.               | <ul><li>for example</li><li>like</li></ul> | <ul><li>Join both the dedicated #adapter-ecosystem channel in dbt Slack and the channel for your adapter's data store (for example, #db-sqlserver and #db-athena)</li><li>Using Jinja in SQL provides a way to use control structures (like `if` statements and `for` loops) in your queries </li></ul> |
| etc.               | <ul><li>and more</li><li>and so forth</li></ul> | <ul><li>A continuous integration environment running pull requests in GitHub, GitLab, and more</li><li>While reasonable defaults are provided for many such operations (like `create_schema`, `drop_schema`, `create_table`, and so forth), you might need to override one or more macros when building a new adapter</li></ul> |

### Prepositions

Avoid ending a sentence with a preposition unless the rewritten sentence would sound awkward or too formal.

### Product names

Product names, trademarks, services, and tools should be written as proper nouns, unless otherwise specified by the company or trademark owner.

As of October 2023, avoid using "dbt CLI" or "CLI" terminology. dbt officially provides two command line tools for running dbt commands:

- [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) &mdash; This tool allows you to develop locally and execute dbt commands against your dbt Cloud development environment from your local command line.
- [dbt Core](https://github.com/dbt-labs/dbt-core) &mdash; This open-source tool is designed for local installation, enabling you to use dbt Core on the command line and communicate with databases through adapters.

### Terms to use or avoid

Use industry-specific terms and research new/improved terminology. Also, refer to the Inclusive Language section of this style guide for inclusive and accessible language and style. 

**DO NOT** use jargon or language familiar to a small subset of readers or assume that your readers understand ALL technical terms.

Use | Avoid
-- | --
type (in the user interface) | enter (in the user interface)
enter (in the command line) | type (in the command line)
email | e-mail
on dbt | on a remote server
person, human | client, customer
press (a key) | hit, tap
recommended limit | soft limit
sign in | log in, login
sign up | signup
terminal | shell
username | login
dbt Cloud CLI | CLI, dbt CLI
dbt Core | CLI, dbt CLI
</div></b>

## Links

Links embedded in the documentation are about trust. Users trust that we will lead them to sites or pages related to their reading content. In order to maintain that trust, it's important that links are transparent, up-to-date, and lead to legitimate resources.

### Internal links

All internal links should use relative and not absolute paths. We construct these paths in relation to the content root, which is`[_docs.getdbt.com repository_/website/docs](https://github.com/dbt-labs/docs.getdbt.com/tree/current/website/docs)`.

We require  either _file_ paths relative to the content root (these include the file extension, such as `.md`) or _URL_ paths relative to the content root (these don't include `.md`). We avoid paths relative to the document (for example, one directory above a document `../LinkedDocument`) because they won't work during local development and testing, and moving a document won't break the links it contains.  

Markdown links in Docusaurus open in the same window rather than creating a new browser tab, but you can use HTML or full URLs to open a link in a new tab.

The file or URL paths begin with:
- /docs/
- /guides/
- /reference/
- /community/

Let's use the Regions & IP Addresses URL as an example: https://docs.getdbt.com/docs/cloud/about-cloud/regions-ip-addresses
If we need to reference this on another page, we can remove the domain entirely:

`For more information about server availability, please refer to our [Regions & IP Addresses page](/docs/cloud/about-cloud/regions-ip-addresses)`

The reader will see:

For more information about server availability, please refer to our [Regions & IP Addresses page](/docs/cloud/about-cloud/regions-ip-addresses)

You can link to a specific section of the doc with a `#` at the end of the path. Enter the section’s title after the `#`, with individual words separated by hyphens. Let's use the incremental models page, https://docs.getdbt.com/docs/build/incremental-models, as an example:

`To better understand this model type, read our [incremental models page](/docs/build/incremental-models#understanding-incremental-models).`

This will appear to the reader as follows:

To better understand this model type, read our [incremental models page](/docs/build/incremental-models#understanding-incremental-models).

When you click on the link, it automatically takes you to the section defined at the end of the path. If the path syntax is incorrect(or does not exist), the link will take the reader to the top of the page specified in the path. 

There are different methods for handling this based on page location (and other nuances), so please reference the [Docusaurus docs site](https://docusaurus.io/docs/markdown-features/links) for more detailed information. 

### Link format

Hyperlinks should be text only, please avoid image-based links. The text should clearly state the destination.

  :x: For more information, visit https://docs.getdbt.com

  :x: For more information, [_Click Here_](https://docs.getdbt.com/)

  ✅ For more information, visit the [_dbt Labs doc site_](https://docs.getdbt.com/).
  
  ✅ For more information, read the [_dbt Labs doc site_](https://docs.getdbt.com/).
  
  ✅ For more information, refer to the [_dbt Labs doc site_](https://docs.getdbt.com/).


### Link destinations

The link destination should be directly related to the topic of the document. There are many valid destinations, including educational material, third-party product instructions, explanations of a limitation, FAQs, and other pages on the dbt Labs site.

Some destination types should be avoided entirely:
* Sales or promotional material.
* General landing pages - link to specific information.
* Content that is hidden behind paywalls or that requires credentials to access.
* Untrusted or otherwise questionable sites that might contain dubious information, malware, or suspicious behavior.
* Personal sites such as file sharing folders or blogs.
* Instant downloads (the user clicks the link and the download begins immediately). If you need to host a file, please contact dbt Labs for a solution.


## Images

### Alt text

In order to include people using screen readers, remember to add alternate text for images. Every image should include an alt attribute that provides a complete description of the image for the user. For more information, see “Images, image maps, and multimedia” in Microsoft’s Style Guide.

### Icons
When describing icons that appear on-screen, use the [_Google Material Icons_](https://fonts.google.com/icons?selected=Material+Icons) reference page as a guide.

:x:Click on the hamburger menu icon

:white_check_mark:Click on the menu icon

### Image names

Two words that are either adjectives or nouns describing the name of a file separated by an underscore `_` (known as `snake_case`). The two words can also be separated by a hyphen (`kebab-case`).
* Types and Examples
  * `snake_case`
    * *gitlab_setup.jpg*
  * `kebab-case`
    * *sso-setup.jpg*

### Screenshots

There are scenarios where a visual aid may be beneficial, especially when creating a document highlighting navigation. Screenshots provide a lightweight alternative to videos and are much easier to produce, edit, and insert into documents. Due to their limitations, they should be used sparingly.

It is important to remember that all of dbt Labs documentation is currently in English only. Users might require screen readers or translation programs to read content and these will not pick up the text within screenshots.

#### How to take a screenshot

Both macOS and Windows include tools that allow you to capture and manipulate screenshots. You can use alternatives based on your preferences, but avoid programs that place a watermark over the content.

* [How to take screenshots in MacOS](https://support.apple.com/en-us/HT201361#:~:text=How%20to%20take%20a%20screenshot,to%20save%20to%20your%20desktop.)
* [How to take screenshots with the Snipping Tool in Windows](https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b#:~:text=Press%20Ctrl%20%2B%20PrtScn%20keys.,that%20you%20want%20to%20capture.)

#### Screenshot guidelines

Once you have determined that a screenshot will add value to the document where words alone can't, use the [Lightbox component](/contributing/lightbox) and the following guidelines to capture the information:

* Use screenshots to highlight navigation, on-screen elements, and other noteworthy product visuals.
* Avoid using screenshots to demonstrate inputs and outputs. All code snippets and sample results should be in the documents as text fields.
* Add images are under the `static` -> `img` folder.
* Use concise filenames that are relevant to the content contained within. Enumerate them if they are part of a sequence.
* Use JPEG format, which renders a better quality and lossless compression. JPEG format has a white background and is accessible in light and dark mode. 
* Add *title=""* for all images to write a concise title of the image. For accessibility, it's important to use succinct text that is clear and complete. 

For more information about image-formatting, review the [Lightbox guidance](/contributing/lightbox), and the following examples:

  :x: screenshot-august0822.jpg

  :white_check_mark: viewing-admins-01.jpg

* Redact all sensitive information from the screenshot &mdash; names, email addresses, phone numbers, or anything that could be considered personally identifiable information (PII) should be obfuscated.
* Avoid URL and bookmark bars in the screenshot and limit the scope to the product and page being documented.

## Talk to us
Your feedback helps drive us forward. At dbt Labs, we want you to get involved if you see areas in the documentation that need improvement. That might include becoming a docs contributor or simply filing a GitHub issue so we know where to look. We have an incredible community of contributors, and our documents reflect that.

dbt Labs is growing, and a team of technical writers is now handling reviews and requests. This style guide will continue to grow as we identify more ways to make the documents easily accessible to all users.
