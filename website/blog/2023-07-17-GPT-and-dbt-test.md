---
title: "Create dbt Documentation and Tests 10x faster with ChatGPT"
description: "You cangit s use ChatGPT to infer the context of verbosely named fields from database table schemas."
slug: create-dbt-documentation-10x-faster-with-ChatGPT

authors: [pedro_brito_de_sa]

tags: [analytics craft, data ecosystem]
hide_table_of_contents: true

date: 2023-07-18
is_featured: true
---

Whether you are creating your pipelines into dbt for the first time or just adding a new model once in a while, **good documentation and testing should always be a priority** for you and your team. Why do we avoid it like the plague then? Because it’s a hassle having to write down each individual field, its description in layman terms and figure out what tests should be performed to ensure the data is fine and dandy. How can we make this process faster and less painful?

By now, everyone knows the wonders of the GPT models for code generation and pair programming so this shouldn’t come as a surprise. But **ChatGPT really shines** at inferring the context of verbosely named fields from database table schemas. So in this post I am going to help you 10x your documentation and testing speed by using ChatGPT to do most of the leg work for you.

<!--truncate-->

As a one-person Analytics team at [Sage](http://www.hellosage.com/) I had to create our dbt pipelines from the ground up. This meant 30+ of facts and dimensions into a Staging Layer, plus all of the following layers of augmented models and Mart tables. After the fact, we are talking about 3500+ lines of YAML that I was NOT excited to get started on. Fortunately for me, this was February 2023 and ChatGPT had just come out and boy, was I glad to use it. After a good dose of “prompt engineering” I managed to get most of my documentation and tests written out, only needing a few extra tweaks.

Writing this article as of July 2023, and now powered by GPT-4 and not GPT 3.5, it is already easier to get the same results I did, so here are my learnings that I hope everyone can replicate.

## Use verbose tables with verbose fields

ChatGPT can only infer so much, so tables with names and fields that resemble encryption keys are unlikely to be good for this approach. In this example we are going to use this table:

```sql
create or replace TRANSIENT TABLE STAGING.BASE.STG_STAFF_MEMBER (

CREATEDATETIME TIMESTAMP_NTZ(9),

NEXT_UPDATEDATETIME TIMESTAMP_NTZ(9),

LATEST_VERSION BOOLEAN,

FIRSTNAME VARCHAR(16777216),

LASTNAME VARCHAR(16777216),

PHONENUMBER VARCHAR(16777216),

SHOULDRECEIVEALLCAREMESSAGES BOOLEAN,

ISARCHIVED BOOLEAN,

ADDRESSRID VARCHAR(16777216),

RID VARCHAR(16777216)

);

```

---

I copied this definition from Snowflake, and I would recommend that you always include both the name and type of the fields to get better results. This is especially helpful if you want to make sure ChatGPT correctly distinguishes between text, number, boolean or array fields, which may not be clear from the name alone.

## Start out with simple prompts

We all know how ChatGPT can digest very complex prompts, but as this is a tool for you to get the best results for your use case, I would recommend starting with simple, but specific, prompts.

Opening ChatGPT with GPT4, my first prompt is usually along these lines:

![Alt text](../static/img/blog/2023-07-17-GPT-and-dbt-test/image3.png)
And the output of this simple prompt is nothing short of amazing:

```yaml
version: 2

models:
  - name: stg_staff_member
    description: This is a staging table for staff member data.
    columns:
      - name: ID
        description: Unique identifier for the staff member
        tests:
          - not_null
          - unique
      - name: CREATEDATETIME
        description: The date and time the staff member record was created
        tests:
          - not_null
      - name: UPDATEDATETIME
        description: The date and time the staff member record was last updated
      - name: NEXT_UPDATEDATETIME
        description: The next date and time the staff member record will be updated
      - name: VERSION
        description: Version number of the staff member record
        tests:
          - not_null
      - name: LATEST_VERSION
        description: Flag to indicate if the record is the latest version
        tests:
          - not_null
      - name: EMAIL
        description: Email address of the staff member
        tests:
          - not_null
      - name: FIRSTNAME
        description: First name of the staff member
        tests:
          - not_null | - name: JOBTITLE
        description: Job title of the staff member
      - name: LASTNAME
        description: Last name of the staff member
        tests:
          - not_null - name: MIDDLENAME
        description: Middle name of the staff member
      - name: PHONENUMBER
        description: Phone number of the staff member
      - name: PROFILEPICTUREURL
        description: URL of the staff member's profile picture
      - name: SHOULDRECEIVEALLCAREMESSAGES
        description: Flag to indicate if the staff member should receive all care messages
      - name: ISARCHIVED
        description: Flag to indicate if the staff member is archived
      - name: ISCAREADMIN
        description: Flag to indicate if the staff member is a care admin
      - name: ISAGENCYSTAFF
        description: Flag to indicate if the staff member is a agency staff
      - name: ADDRESSRID
        description: Address RID of the staff member
      - name: ENTERPRISERID
        description: Enterprise RID of the staff member
      - name: RID
        description: RID of the staff member
      - name: ISDELETED
        description: Flag to indicate if the staff member record is deleted
```

Back in my day (5 months ago), ChatGPT with GPT 3.5 didn’t have much context on what a dbt-style YAML file was, so the result was a funky, non-dbt YAML format. If you are using GPT 3.5 and the results you get from the first prompt don’t compile in dbt, I would recommend an extra step I took which is to pass your understanding of what a dbt-style YAML file is. You can do this simply by copy-pasting a piece of a publicly available YAML file like [this one from the Jaffle Shop example](https://github.com/dbt-labs/jaffle_shop/blob/main/models/schema.yml), or a piece of YAML from your own code base.

A prompt for it would look something like:

![example prompt](../static/img/blog/2023-07-17-GPT-and-dbt-test/image5.png)

## Specify details on generic tests in your prompts

dbt has four built-in generic tests: unique, not_null, accepted_values and relationships. My approach to adding details on these to the prompts is one of ‘more is better’, as in it’s faster to just delete tests that I don’t need in certain fields than having to add them manually.

ChatGPT will throw unique and not_null tests for mostly all columns that have ‘id’ in their name, and in my experience it adds them to a few more columns than it should, which is usually quick to fix.

Accepted_values and relationships are slightly trickier but the model can be adjusted to account for these in fairly simple ways. My tips are:

- accepted_values: add extra detail to the schema like an extra keyword like ‘CATEGORICAL’ after the data type
- relationships: bind the relationships to fields with specific names. For better results, pass on a list of valid table names from your schema that it can refer to.

One way of doing this is with a prompt like this:

![example prompt](../static/img/blog/2023-07-17-GPT-and-dbt-test/image4.png)

Which results in the following output:

```yaml
version: 2

models:
  - name: stg_staff_member
    description: "This is the staging table for staff members."
    columns:
      - name: id
        description: "Unique Identifier for each staff member."
        tests:
          - unique
          - not_null
      - name: createdatetime
        description: "Timestamp when the staff member record was created."
      - name: updatedatetime
        description: "Timestamp when the staff member record was last updated."
      - name: next_updatedatetime
        description: "Timestamp for the next scheduled update for the staff member record."
      - name: version
        description: "Version number for the staff member record."
        tests:
          - not_null
      - name: latest_version
        description: "Boolean indicating if this is the latest version of the staff member record."
        tests:
          - not_null
      - name: email
        description: "Email address of the staff member."
        tests:
          - not_null
          - unique
      - name: firstname
        description: "First name of the staff member."
        tests:
          - not_null
      - name: jobtitle
        description: "Job title of the staff member."
        tests:
          - not_null
          - accepted_values:
              values: ['Job Title 1', 'Job Title 2', 'Job Title 3']  # Update this with your categorical job titles
      - name: lastname
        description: "Last name of the staff member."
        tests:
          - not_null
      - name: middlename
        description: "Middle name of the staff member."
      - name: phonenumber
        description: "Phone number of the staff member."
      - name: profilepictureurl
        description: "URL of the staff member's profile picture."
      - name: shouldreceiveallcaremessages
        description: "Boolean indicating if the staff member should receive all care messages."
        tests:
          - not_null
      - name: iscareadmin
        description: "Boolean indicating if the staff member is a care admin."
        tests:
          - not_null
      - name: isarchived
        description: "Boolean indicating if the staff member is archived."
        tests:
          - not_null
      - name: isagencystaff
        description: "Boolean indicating if the staff member is an agency staff member."
        tests:
          - not_null
      - name: addressrid
        description: "Foreign key referencing the address of the staff member."
        tests:
          - relationships:
              to: staging.base.stg_address  # Update this with your staging address table
              field: rid
      - name: enterpriserid
        description: "Foreign key referencing the enterprise of the staff member."
        tests:
          - relationships:
              to: staging.base.stg_enterprise  # Update this with your staging enterprise table
              field: rid
      - name: rid
        description: "Unique Identifier for the record."
        tests:
          - unique
          - not_null
      - name: isdeleted
        description: "Boolean indicating if the staff member record is deleted."
        tests:
          - not_null
```

Even though it doesn’t magically guess the categories of your variables or your relationships, it is definitely helpful to have some placeholders in the right places.

As an add-on, giving the model a short description of the data models and the tables you are working with will help it fine tune your results.

## Bonus points: add custom tests to the mix

This is where things get fun. If you don’t know it already, you can [create custom generic tests](https://docs.getdbt.com/docs/build/tests#generic-tests) in dbt. I got mixed results here but I am sure you will be able to make the most out of it.

For example, while asking ChatGPT to help me write a test called ‘is_boolean’, the results are slightly underwhelming but still helpful as a starting point.

![example prompt](../static/img/blog/2023-07-17-GPT-and-dbt-test/image1.png)
However, once you have your custom tests designed, if you have named them in an equally verbose way, you can actually add them to your prompt and ChatGPT will make some fairly accurate attributions.  In my case, I designed tests like is_boolean, is_integer, and string_max_length that takes a length input.

So, a fully grown prompt for both documentation and testing could like this:

![Example prompt](../static/img/blog/2023-07-17-GPT-and-dbt-test/image2.png)
And the results of this query were:

```yaml
| version: 2

models:
  - name: stg_staff_member
    description: "This is the staging table for staff members."
    columns:
      - name: id
        description: "Unique Identifier for each staff member."
        tests:
          - unique
          - not_null
          - is_integer
      - name: createdatetime
        description: "Timestamp when the staff member record was created."
      - name: updatedatetime
        description: "Timestamp when the staff member record was last updated."
      - name: next_updatedatetime
        description: "Timestamp for the next scheduled update for the staff member record."
      - name: version
        description: "Version number for the staff member record."
        tests:
          - not_null
          - is_integer
      - name: latest_version
        description: "Boolean indicating if this is the latest version of the staff member record."
        tests:
          - not_null
          - is_boolean
      - name: email
        description: "Email address of the staff member."
        tests:
          - not_null
          - unique
          - string_max_length:
              max_length: 16777216
      - name: firstname
        description: "First name of the staff member."
        tests:
          - not_null
          - string_max_length:
              max_length: 16777216
      - name: jobtitle
        description: "Job title of the staff member."
        tests:
          - not_null
          - accepted_values:
              values: ['Job Title 1', 'Job Title 2', 'Job Title 3']  # Update this with your categorical job titles
          - string_max_length:
              max_length: 16777216
      - name: lastname
        description: "Last name of the staff member."
        tests:
          - not_null
          - string_max_length:
              max_length: 16777216
      - name: middlename
        description: "Middle name of the staff member."
        tests:
          - string_max_length:
              max_length: 16777216
      - name: phonenumber
        description: "Phone number of the staff member."
        tests:
          - string_max_length:
              max_length: 16777216
      - name: profilepictureurl
        description: "URL of the staff member's profile picture."
        tests:
          - string_max_length:
              max_length: 16777216
      - name: shouldreceiveallcaremessages
        description: "Boolean indicating if the staff member should receive all care messages."
        tests:
          - not_null
          - is_boolean
     - name: iscareadmin
        description: "Boolean indicating if the staff member is a care admin."
        tests:
          - not_null
          - is_boolean
      - name: isarchived
        description: "Boolean indicating if the staff member is archived."
        tests:
          - not_null
          - is_boolean
      - name: isagencystaff
        description: "Boolean indicating if the staff member is an agency staff member."
        tests:
          - not_null
          - is_boolean
      - name: addressrid
        description: "Foreign key referencing the address of the staff member."
        tests:
          - relationships:
              to: staging.base.stg_address  # Update this with your staging address table
              field: rid
          - string_max_length:
              max_length: 16777216
      - name: enterpriserid
        description: "Foreign key referencing the enterprise of the staff member."
        tests:
          - relationships:
              to: staging.base.stg_enterprise  # Update this with your staging enterprise table
              field: rid
          - string_max_length:
              max_length: 16777216
      - name: rid
        description: "Unique Identifier for the record."
        tests:
          - unique
          - not_null
          - string_max_length:
              max_length: 16777216
      - name: isdeleted
        description: "Boolean indicating if the staff member record is deleted."
        tests:
          - not_null
          - is_boolean
```

## Wrap-Up

Creating documentation is still a very manual job, and this approach only works for one table at a time (maybe you can be the one leveraging the OpenAI API and creating a webapp that processes multiple tables at once?). However, ChatGPT can clearly cut a lot of time in these tasks.

I hope that these simple tips help you be more motivated and efficient in creating documentation and tests for your data models. And remember: verbosity in - verbosity out!
