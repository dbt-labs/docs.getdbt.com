
You can use the Lightbox component to add an image or screenshot to your page. It supports clickable images that expand when clicked.

## Available Props:

- ******src****** - The path to the image
    - Required
    - Type: string
    - Example: `"/img/hamburger-icon.png"`
- ******alt****** - Set the alt text for the image. This will not show text underneath the image.
    - Optional
    - Type: string
- **********title********** - This sets the text displayed underneath the image.
    - Optional
    - Type: string
    - If the `alt` prop is not set, but `title` is, the title will be used as the alt text as well.
- ********************collapsed******************** - Set the images to be inline, rather than stacked. This is useful for when displaying two images side by side ([example](https://docs.getdbt.com/docs/collaborate/manage-access/set-up-sso-azure-active-directory)), or when displaying the image inline with a sentence.
    - Optional
    - Type: boolean (true/false)
- **********width********** - Set a custom width for the image.
    - Optional (Defaults to max width of 400px)
    - Accepts `px` and `%` values. For example: `600px` , `100%`
- **************alignment************** - Determine if image should be left, center, or right aligned
    - Optional (Defaults to center)
    - Accepts `left`, `right`, `center`. If any other value is entered, it defaults to `center`

## Example usage

<code><Lightbox</code><br>
<code>src="/img/hamburger-icon.jpg"</code><br>
<code>lt="Alt text"</code><br>
<code>title="This text is visible"</code><br> 
<code>collapsed={true}</code><br>
<code>width="600px"</code><br>
<code>alignment="left"</code><br>
<code>/></code>


<LoomVideo id="2b64dbd47a2d46dbafa5b43ed52a91e0" />   
