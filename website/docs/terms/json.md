---
id: json
title: JSON
description: JSON (JavaScript Object Notation) is a minimal format for semi-structured data used to capture relationships between fields and values.
displayText: JSON
hoverSnippet: JSON (JavaScript Object Notation) is a minimal format for semi-structured data used to capture relationships between fields and values.
---

JSON stands for JavaScript Object Notation. JSON is a minimal format which is great for processing data for applications. It can capture many types of relationships in a concise format and is a commonly used format for semi-structured data. The <Term id="table">tables</Term> in your <Term id="data-warehouse" /> contain structured data (as opposed to semi-structured) where for each row, each field typically contains one value. Structured data, or tabular data, is intuitive and easy to read, but semi-structured data offers more flexibility.

Let’s talk through what that looks like in practice so you can get a better sense of what we mean.

## JSON syntax example

When looking at data formatted in JSON, we say that the data is stored in **JSON objects**. These are composed of key-value pairs. JSON objects are enclosed in curly brackets (`{ }`) and each key-value pair is separated by a comma. Here’s an example:

```json
order = {"customer_id":2947, "order_id":4923, "order_items":"cheesecake"}
```

`order` is the JSON object. `"customer_id":2947` is one of the key-value pairs within this JSON object.

If I wanted to find the `customer_id`, I could return that value with `order["customer_id"]` or `order.customer_id`. It’s easy for us to simply read the `customer_id` just by looking at the JSON object in this example, but what if your JSON object contains hundreds of key-value pairs or complex nesting? Being aware of how to pull information out of JSON is essential if you’re working with it in the wild.

A key feature of JSON is that it can contain data types that aren’t normally found in relational databases, namely **dictionaries** and **arrays**. Let’s break down what that means and then we’ll look at an example to pull everything together.

### Dictionaries and arrays in JSON

JSON inherits its syntax from JavaScript (JS) so dictionaries and arrays are formatted in the same way as they are in JS. Dictionaries are formatted just like JSON objects and consist of key-value pairs. Arrays are lists of values and  they’re enclosed in square brackets (`[ ]`) and each value is separated by a comma, like so:

```json
menu_items = ["cheesecake", "danish", "coffee"]
```

Individual values from an array can be called by referencing the location of a value within the array. Arrays are zero-indexed which means that the first item is at position 0 and we count up from there. 

- `menu_items[0]` will return “cheesecake”
- `menu_items[1]` will return “danish”
- `menu_items[2]` will return “coffee”

Dictionaries and arrays can be nested in JSON objects as well as nested in each other. **Dictionaries and arrays can only be values. They can never be keys.**

Here’s an example of a JSON object describing a tweet from [Twitter’s developer platform](https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/overview).

```json
tweet = 
{
  "created_at": "Thu Apr 06 15:24:15 +0000 2017",
  "id_str": "850006245121695744",
  "text": "1\/ Today we\u2019re sharing our vision for the future of the Twitter API platform!\nhttps:\/\/t.co\/XweGngmxlP",
  "user": {
    "id": 2244994945,
    "name": "Twitter Dev",
    "screen_name": "TwitterDev",
    "location": "Internet",
    "url": "https:\/\/dev.twitter.com\/",
    "description": "Your official source for Twitter Platform news, updates & events. Need technical help? Visit https:\/\/twittercommunity.com\/ \u2328\ufe0f #TapIntoTwitter"
  },
  "place": {   
  },
  "entities": {
    "hashtags": [      
    ],
    "urls": [
      {
        "url": "https:\/\/t.co\/XweGngmxlP",
        "unwound": {
          "url": "https:\/\/cards.twitter.com\/cards\/18ce53wgo4h\/3xo1c",
          "title": "Building the Future of the Twitter API Platform"
        }
      }
    ],
    "user_mentions": [     
    ]
  }
}
```

Here's a quick quiz to see if you're understanding the file's structure:

<details>
<summary>How would you call the user ID?</summary>
tweet['user']['id']
</details>

<details>
<summary>How would you call the unwound url?</summary>
tweet['entities']['urls'][0]['unwound']['url']
</details>

As you can see, JSON objects can get complex pretty quickly.

## Why is JSON important in modern analytics?

Semi-structured data offers flexibility with the trade-off of being more complex. JSON doesn’t require a pre-defined schema. It allows nesting, values can be different data types, and it lends itself well to changes in the shape of the incoming data. As you can imagine, the above Tweet object would look very different if we tried to restructure it so it could fit into a table. It would be hard to read or we would lose information or both. 

## Use cases for JSON

JSON is lightweight and often used to transfer data over a network connection. As we’ve seen, data from social media sites are often stored as JSON objects. JSON is also commonly how data from IoT sensors is formatted and you’ll often see JSON when using an API.

## Conclusion

The greatest strength of JSON also acts as its weakness—the data it contains informs the shape the object takes, rather than the other way around. Structured data is the bread and butter of analytics work, but a semi-structured format is an alternative option when a tabular format becomes too rigid to describe the relationships between different entities. 