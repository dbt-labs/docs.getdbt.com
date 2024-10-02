
You can use the Lightbox component to add an image or screenshot to your page. It supports clickable images that expand when clicked.

## Available Props:

| **Prop** | **Info** | **Required?** | **Type** |
|--------|--------|-------------|--------|
| **src**  | The path to the image. For example, `"/img/hamburger-icon.png" | Required | string |
| **alt**  | Set the alt text for the image. This will not show text underneath the image. | Optional | string | 
| **title**  | This sets the text displayed underneath the image.<br /><br /> If the `alt` prop is not set, but `title` is, the title will be used as the alt text as well.| Optional | string | 
| **collapsed**  | Set the images to be inline, rather than stacked. <br /><br />This is useful for when displaying two images side by side ([example](/docs/cloud/manage-access/set-up-sso-azure-active-directory)), or when displaying the image inline with a sentence. | Optional | boolean (true/false) | 
| **width**  | Set a custom width for the image. <br /><br /> Accepts `px` and `%` values. For example: `600px` , `100%`  | Optional (Defaults to max width of 400px) | | 
| **alignment**  | Determine if image should be left, center, or right aligned. <br /> <br />Accepts `left`, `right`, `center`. If any other value is entered, it defaults to `center`| Optional (Defaults to center) |    |  

## Example usage

```mdx
<Lightbox
  src="/img/hamburger-icon.jpg"
  lt="Alt text"
  title="This text is visible" 
  collapsed={true}
  width="600px"
  alignment="left"
/>
```

Note that if you're using icons to document things  like third party vendors, etc, &mdash;  you need to add the icon file in the following locations to ensure the icons render correctly in light and dark mode:

- `website/static/img/icons`
- `website/static/img/icons/white`

<LoomVideo id="2b64dbd47a2d46dbafa5b43ed52a91e0" />   
