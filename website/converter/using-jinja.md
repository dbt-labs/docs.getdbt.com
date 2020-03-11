---
title: "Tutorial: Using Jinja"
slug: my-file
hidden: false
createdAt: "2019-11-11T19:13:13.819Z"
updatedAt: "2019-11-21T18:41:41.485Z"
---

In this tutorial, we're going to take a common pattern used in SQL, and then use Jinja to improve our code.

View the full list of supported databases [here](doc:supported-databases2).

If you'd like to work through this query, add [this CSV](https://github.com/fishtown-analytics/jaffle_shop/blob/master/data/raw_payments.csv) to the `data/` folder of your dbt project, and then execute `dbt seed`.

While working through the steps of this model, we recommend that you have your compiled SQL open as well, to check what your Jinja compiles to. To do this:
* **Using dbt Cloud:** Click the compile button to see the compiled SQL in the right hand pane
* **Using the dbt CLI:** Run `dbt compile` from the command line. Then open the compiled SQL file in the `target/compiled/{project name}/` directory. Use a split screen in your code editor to keep both files open at once.

# Write the SQL without Jinja
Consider a data model in which an `order` can have many `payments`. Each `payment` may have a `payment_method` of `bank_transfer`, `credit_card` or `gift_card`, and therefore each `order` can have multiple `payment_methods`

From an analytics perspective, it's important to know how much of each `order` was paid for with each `payment_method`. In your dbt project, you can create a model, named `order_payment_method_amounts`, with the following SQL:

[block:html]
{
  "html": "<div style=\"position: relative; padding-bottom: 63.94316163410302%; height: 0;\"><iframe src=\"https://www.loom.com/embed/3f247c8ee0c7414b88eb64ac75b8918d\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%;\"></iframe></div>"
}
[/block]

[block:embed]
{
  "html": "<iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F5yyGT1k2xzY%3Ffeature%3Doembed&url=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D5yyGT1k2xzY&image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F5yyGT1k2xzY%2Fhqdefault.jpg&key=f2aa6fc3595946d0afc3d76cbbd25dc3&type=text%2Fhtml&schema=youtube\" width=\"854\" height=\"480\" scrolling=\"no\" frameborder=\"0\" allow=\"autoplay; fullscreen\" allowfullscreen=\"true\"></iframe>",
  "url": "https://www.youtube.com/watch?v=5yyGT1k2xzY",
  "title": "dbt setup & usage tutorial",
  "favicon": "https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico",
  "image": "https://i.ytimg.com/vi/5yyGT1k2xzY/hqdefault.jpg"
}
[/block]


[block:code]
{
  "codes": [
    {
      "code": "select\norder_id,\nsum(case when payment_method = 'bank_transfer' then amount end) as bank_transfer_amount,\nsum(case when payment_method = 'credit_card' then amount end) as credit_card_amount,\nsum(case when payment_method = 'gift_card' then amount end) as gift_card_amount,\nsum(amount) as total_amount\nfrom {{ ref('raw_payments') }}\ngroup by 1",
      "language": "sql",
      "name": "models/order_payment_method_amounts.sql"
    }
  ]
}
[/block]
The SQL for each payment method amount is repetitive, which can be difficult to maintain for a number of reasons:
* If the logic or field name were to change, the code would need to be updated in three places.
* Often this code is created by copying and pasting, which may lead to mistakes.
* Other analysts that review the code are less likely to notice errors as its common to only scan through repeated code.


[block:parameters]
{
  "data": {
    "h-0": "Model",
    "h-1": "Config",
    "h-2": "Database Identifier",
    "0-0": "ga_sessions.sql",
    "0-1": "None",
    "0-2": "\"analytics\".\"ga_sessions\"",
    "1-0": "ga_sessions.sql",
    "1-1": "{{ config(alias='sessions') }}",
    "1-2": "\"analytics\".\"sessions\""
  },
  "cols": 3,
  "rows": 2
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "\n-- This model will be created in the database with the identifier `sessions`\n-- Note that in this example, `alias` is used along with a custom schema\n{{ config(alias='sessions', schema='google_analytics') }}\n\nselect * from ...",
      "language": "sql",
      "name": "models/google_analytics/ga_sessions.sql"
    }
  ]
}
[/block]

[block:image]
{
  "images": [
    {
      "image": [
        "https://files.readme.io/63cf3d2-Screen_Shot_2019-01-31_at_4.39.52_PM.png",
        "Screen Shot 2019-01-31 at 4.39.52 PM.png",
        2664,
        2114,
        "#f3f5f5"
      ],
      "caption": "Click the green button to connect dbt Cloud to your GitHub account"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "danger",
  "body": "dbt actively builds the `graph` variable during the [parsing phase](doc:execute) of running dbt projects, so some properties of the `graph` context variable will be missing or incorrect during parsing. Please read the information below carefully to understand how to effectively use this variable.",
  "title": "Heads up"
}
[/block]

