# Content types

These content types can all form articles. Some content types can form sections within a larger article.

# TOC

* [Conceptual](#conceptual)
* [Referential](#referential)
* [Procedural](#procedural)
* [Guide](#guide)
* [Quickstart](#quickstart-guide)


## Conceptual

Conceptual content provides a clear, high-level overview of a feature or topic. Conceptual content should be clear enough for a novice audience but also include relevant information for advanced users. Conceptual content should contextualize a task within the reader’s workflow, such as including use cases or examples.

Conceptual content can be found in a standalone article or in a conceptual section within another article.
Most major features or parts of the product will get their own conceptual article.
For smaller or more specific conceptual sections that accompany one or more procedures, we instead place conceptual content within guides. 

### Contents of a conceptual article or header

Describe in plain language what the feature, product, or topic is
Describe its purpose and why it’s useful to the reader (value proposition)
If relevant, describe how the feature or topic works without getting into too much irrelevant technical detail
Highlight any details the reader needs to know to use the feature
Include next steps for getting started with the feature (whether through further reading links or content within the article itself)

### Titles for conceptual content

Conceptual articles or headers of conceptual sections should always start with “About [topic]”
Always use a noun in the place of the topic, not a gerund

### Examples of conceptual content

* Conceptual articles
TBD
* Conceptual sections within other articles
TBD

## Referential

Referential content provides detailed information that customers need to access or select from to use a specific part of the product.

Referential content can be found in a standalone article or in a referential section within another article.

* Some major subjects may require their own referential article, especially if there is a large amount of referential content, such as for search syntax or YAML syntax.
* For smaller or more specific referential sections that accompany conceptual or procedural information, like a list of a feature’s supported languages or hardware requirements, we’ll add referential sections in context within procedural or conceptual content.  

### Contents of a referential article or header

* Use an introductory sentence or an entire conceptual section to introduce relevant information about the referential content. This should be general enough to apply to all of the following content.

* Present the actual referential content clearly and consistently.
* For subjects with a single element to explain, use a list.
  * Example: TBD
* For subjects with multiple elements, use a table
  * Example: TBD
* For longer referential content, such as YAML syntax for workflows, use headers consistently:
  * H3 headers for each distinct section
  * H4 headers for subsections, such as examples
  * Example: TBD

Formatting API reference documentation (TBD)

### Title guidelines for referential content
Referential articles or headers of referential sections should clearly describe the contents of the section, and generally begin with nouns
Titles should include enough information to be accessible to novice users and fully describe the contents of each section
Titles should avoid stacked nouns - use prepositions to break up long strings of nouns

### Examples of referential content

* Referential articles
TBD
* Referential sections within other articles
TBD 
* Placeholder: Referential REST content
* Placeholder: Referential GraphQL content

## Procedural

Procedural articles tell users how to complete a single task from start to finish, most often using numbered steps. Procedural content should contextualize a task within the reader’s workflow, such as including use cases or examples.

Procedural content can be found in a standalone article or in a procedural section within another article. If an article contains a procedure, it’s always considered either a procedural article (single procedure) or a guide (multiple procedures). For details on creating articles with multiple procedural sections, see the section on guides below.

When creating multiple related procedures, or when describing how to both do and undo a setting or action, you should consider gathering all of the procedures into a guide rather than creating multiple individual articles.
* If disabling or undoing a procedure requires the same steps and has no detailed implications, then you do not need to write a separate procedure for undoing the setting.
* If disabling or undoing a procedure requires different steps or has important or detailed implications, create a guide with an agnostic title (unless there are significant reasons to create separate individual procedural articles for both doing and undoing a task).

Procedural content should include troubleshooting tips as frequently as possible. See the troubleshooting section below for more information. 
### Title guidelines for procedural articles
* Procedural articles or procedural sections within articles should be task-based and begin with a gerund
* Use active and specific verbs (occasionally this takes some brainstorming or hitting a thesaurus)
* Titles should specifically describe the task contained within the article or header
* Article title length: maximum 80 characters, 60 if possible

#### Examples of procedural articles:
* Adding information to your account
* Setting up metrics in dbt Projects
* Setting up continuous integration

## Guide

Guides are highly-approachable articles that group information in context to help readers complete a complex task or set of related tasks. Guides eliminate duplication and ensure people find contextual content in the right place.  Guides may be a set of tasks within the reader’s larger workflow, such as including use cases.

Guides combine the content types within a single article to illustrate an entire workflow within a single page, rather than splitting the workflow out into separate pieces. Guides containing multiple procedures help us scale as more options are added to the product. Users may need to complete different procedures within the guide at different times, or refer back to the guide for conceptual content or to complete a followup task. 
Example usage: If there is a large number of the same type of setting, use a guide that gathers all of the tasks in context. 

Guides must include a table of contents. 
You can replicate the guide’s title in a header if needed.

### Contents of guides

* Guides contain multiple headers.
* Guides contain at least one procedural section, plus at least one additional conceptual, referential, or procedural section.
* Content within guides follows the content order used throughout the site.
* Guides should include troubleshooting sections as frequently as possible. See the troubleshooting section below for more information.

### Title guidelines for guides

* Titles of guides should be task-based and begin with a gerund
* Titles should be general enough to describe the range of information and tasks contained within the article
* Titles should describe the setting being toggled and should be agnostic about what setting the reader chooses, e.g., “Setting repository visibility” instead of “Making a private repository public”

### Examples of guides
TBD

## Quickstart guide

Quickstart guides are a type of article that enable the user to complete a discrete, focused task in a single sitting, illustrating an entire workflow in a single page. Quickstart guides follow the guide model, with a few exceptions noted here - see the guides section above for anything not covered here.

Quickstart guides are generally more conversational in tone than our other documentation.

### Contents of quickstart guides

* Table of contents
* Introduction:
  * Clarifies audience
  * Clearly states prerequisites and prior knowledge needed
  * States what the user will accomplish or build
  * Includes an example of a successful project
  * Does not include the expected amount of time that it may take users to complete the task, as this is highly dependent on the experience level of the user and can be demoralizing for beginners
* Procedural sections  
  * Based on the audience for the guide, the steps can be less explicit and formal than those used in procedural content. You do not have to use existing reusables to form these steps if the audience doesn’t require that level of detail.
    * Use: “From your profile, click **Settings, and then click **Developer settings**.”
    * Avoid: In the upper-right corner of any page, click your profile photo, then click **Settings**. In the left sidebar, click **Developer settings**.
  * Link out to other articles or resources rather than replicating them, to avoid interrupting the flow of information in the quickstart.
  * Give visual cues. Use code blocks and screenshots heavily to help reassure users that they're performing the correct actions.
  * Provide real examples. For example, don't tell a user to "Enter a commit message," give them an appropriate example commit message that matches the previous steps.
* Troubleshooting
  * Acknowledge what may go wrong in the task and list a few common problems readers might run into with solutions.
* Conclusion
  * Review what the user has accomplished or built. Refer back to the project provided in the introduction as an example of a successful project.
* Next steps
  * Include 2-3 actionable next steps that the user take after completing the guide. Link off to other related information like:
    * Projects that illustrate the introduced concepts
    * Relevant information 
    * Relevant Learning courses
    * Relevant published talks, blog posts, or Community posts

### Title guidelines for quickstart guides
* Follow the title guidelines for guides
* Don’t use “quickstart” or “guide” in the title

Examples
TBD
