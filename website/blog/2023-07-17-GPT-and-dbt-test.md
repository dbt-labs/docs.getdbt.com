---
title: "Create dbt Documentation and Tests 10x faster with ChatGPT"
description: "You can use ChatGPT to infer the context of verbosely named fields from database table schemas."
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

As a one-person Analytics team at [Sage](http://www.hellosage.com/) I had to create our dbt pipelines from the ground up. This meant 30+ tables of internal facts and dimensions + external data into a Staging Layer, plus all of the following layers of augmented models and Mart tables. After the fact, we are talking about 3500+ lines of YAML that I was NOT excited to get started on. Fortunately for me, this was February 2023 and ChatGPT had just come out. And boy, was I glad to have it. After a good dose of “prompt engineering” I managed to get most of my documentation and tests written out, only needing a few extra tweaks.

Writing this article as of July 2023, and now powered by GPT-4 and not GPT 3.5, it is already easier to get the same results I did, so here are my learnings that I hope everyone can replicate.

## Use verbose tables with verbose fields

ChatGPT can only infer so much, so tables with names and fields that resemble encryption keys are unlikely to be good for this approach. In this example we are going to use this table:

```sql
create or replace TRANSIENT TABLE STAGING.BASE.STG_STAFF_MEMBER (
      ID NUMBER(38,0),
      CREATEDATETIME TIMESTAMP_NTZ(9),
      UPDATEDATETIME TIMESTAMP_NTZ(9),
      VERSION NUMBER(38,0),
      FIRSTNAME VARCHAR(16777216),
      JOBTITLE VARCHAR(16777216),
      LASTNAME VARCHAR(16777216),
      MIDDLENAME VARCHAR(16777216),
      ISCAREADMIN BOOLEAN,
      ISARCHIVED BOOLEAN,
      ADDRESSID VARCHAR(16777216),
      ENTERPRISEID VARCHAR(16777216),
      ISDELETED BOOLEAN
);

```

---

I copied this definition from Snowflake, and I would recommend that you always include both the name and type of the fields to get better results. This is especially helpful if you want to make sure ChatGPT correctly distinguishes between text, number, boolean or array fields, which may not be clear from the name alone.

## Start out with simple prompts

We all know how ChatGPT can digest very complex prompts, but as this is a tool for you to get the best results for your use case, I would recommend starting with simple, but specific, prompts.

Opening ChatGPT with GPT4, my first prompt is usually along these lines:

<Lightbox src="/img/blog/2023-07-17-GPT-and-dbt-test/image1.png" title="ChatGPT request for YAML file" />

And the output of this simple prompt is nothing short of amazing:

```yaml
version: 2

models:
  - name: STAFF_MEMBER
    description: This table contains information about the staff members.
    columns:
      - name: ID
        description: The unique identifier for the staff member.
        tests:
          - unique
          - not_null
      - name: CREATEDATETIME
        description: The timestamp when the record was created.
        tests:
          - not_null
      - name: UPDATEDATETIME
        description: The timestamp when the record was last updated.
      - name: VERSION
        description: Version number of the record.
      - name: FIRSTNAME
        description: The first name of the staff member.
        tests:
          - not_null
      - name: JOBTITLE
        description: The job title of the staff member.
        tests:
          - not_null
      - name: LASTNAME
        description: The last name of the staff member.
        tests:
          - not_null
      - name: MIDDLENAME
        description: The middle name of the staff member.
      - name: ISCARADMIN
        description: Boolean value indicating if the staff member is a care administrator.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: ISARCHIVED
        description: Boolean value indicating if the staff member record is archived.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: COMMUNITYID
        description: Identifier for the community of the staff member.
      - name: ENTERPRISEID
        description: Identifier for the enterprise of the staff member.
      - name: ISDELETED
        description: Boolean value indicating if the staff member record is deleted.
        tests:
          - accepted_values:
              values: ['true', 'false']
```

Back in my day (5 months ago), ChatGPT with GPT 3.5 didn’t have much context on what a dbt-style YAML file was, so the result was a funky, non-dbt YAML format. If you are using GPT 3.5 and the results you get from the first prompt don’t compile in dbt, I would recommend an extra step I took which is to pass your understanding of what a dbt-style YAML file is. You can do this simply by copy-pasting a piece of a publicly available YAML file like [this one from the Jaffle Shop example](https://github.com/dbt-labs/jaffle_shop/blob/main/models/schema.yml), or a piece of YAML from your own code base.

A prompt for it would look something like:

<Lightbox src="/img/blog/2023-07-17-GPT-and-dbt-test/image2.png" title="ChatGPT request to memorize dbt-style YAML" />

## Specify details on generic tests in your prompts

dbt has four built-in generic tests: unique, not_null, accepted_values and relationships. My approach to adding details on these to the prompts is one of ‘more is better’, as in it’s faster to just delete tests that I don’t need in certain fields than having to add them manually.

ChatGPT will throw unique and not_null tests for mostly all columns that have ‘id’ in their name, and in my experience it adds them to a few more columns than it should, which is usually quick to fix.

Accepted_values and relationships are slightly trickier but the model can be adjusted to account for these in fairly simple ways. My tips are:

- accepted_values: add extra detail to the schema like an extra keyword like ‘CATEGORICAL’ after the data type
- relationships: bind the relationships to fields with specific names. For better results, pass on a list of valid table names from your schema that it can refer to.

One way of doing this is with a prompt like this:

<Lightbox src="/img/blog/2023-07-17-GPT-and-dbt-test/image3.png" title="ChatGPT request to write dbt-style YAML with generic tests" />

Which results in the following output:

```yaml
version: 2

models:
  - name: STAFF_MEMBER
    description: This table contains information about the staff members.
    columns:
      - name: ID
        description: The unique identifier for the staff member.
        tests:
          - unique
          - not_null
      - name: CREATEDATETIME
        description: The timestamp when the record was created.
        tests:
          - not_null
      - name: UPDATEDATETIME
        description: The timestamp when the record was last updated.
      - name: VERSION
        description: Version number of the record.
      - name: FIRSTNAME
        description: The first name of the staff member.
        tests:
          - not_null
      - name: JOBTITLE
        description: The job title of the staff member. This is a categorical field.
        tests:
          - not_null
          - accepted_values:
              values: ['Job Title 1', 'Job Title 2', 'Job Title 3'] # replace these with actual job titles
      - name: LASTNAME
        description: The last name of the staff member.
        tests:
          - not_null
      - name: MIDDLENAME
        description: The middle name of the staff member.
      - name: ISCARADMIN
        description: Boolean value indicating if the staff member is a care administrator.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: ISARCHIVED
        description: Boolean value indicating if the staff member record is archived.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: COMMUNITYID
        description: Identifier for the community of the staff member.
        tests:
          - relationships:
              to: STAGING.COMMUNITY.ID # replace with actual reference table
              field: ID
      - name: ENTERPRISEID
        description: Identifier for the enterprise of the staff member.
        tests:
          - relationships:
              to: STAGING.ENTERPRISE.ID # replace with actual reference table
              field: ID
      - name: ISDELETED
        description: Boolean value indicating if the staff member record is deleted.
        tests:
          - accepted_values:
              values: ['true', 'false']
```

Even though it doesn’t magically guess the categories of your variables or your relationships, it is definitely helpful to have some placeholders in the right places.

As an add-on, giving the model a short description of the data models and the tables you are working with will help it fine tune your results.

## Wrap-Up

Creating documentation is still a very manual job, and this approach only works for one table at a time (maybe you can be the one leveraging the OpenAI API and creating a webapp that processes multiple tables at once?). However, ChatGPT can clearly cut a lot of time in these tasks.

I hope that these simple tips help you be more motivated and efficient in creating documentation and tests for your data models. And remember: verbosity in - verbosity out!
