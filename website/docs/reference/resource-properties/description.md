#### descriptions
The `description` field can be used to describe both models, and the columns contained within a model. You can either supply a simple string here (as shown above), or you can reference long-form markdown using a `docs` block. More information on `docs` blocks can be found in the [Documenting Models](documentation) guide.

Be mindful of yaml semantics when providing a description. If your description contains special yaml characters like curly brackets, colons, or square brackets, you may need to quote your description. An example of a quoted description is shown in the description field for `event_time` above.
