
<expandable alt_header="📌 Tidy your macros with whitespace control">

When you're changing macros, like the `generate_schema_name`, in your project &mdash; you might notice extra white space in your code in the `target/compiled` folder. 

You can remove unwanted spaces and lines with Jinja's [whitespace control](/faqs/Jinja/jinja-whitespace) by using a minus sign. For example, use `{{- ... -}}` or `{%- ... %}` around your macro definitions (such as `{%- macro generate_schema_name(...) -%} ... {%- endmacro -%}`).
</expandable>
