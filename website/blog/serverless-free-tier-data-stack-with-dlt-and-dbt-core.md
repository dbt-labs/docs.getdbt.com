---
title: Serverless, free-tier data stack with dlt + dbt core."
description: "In this article, we explore how we can use dlt + dbt core in a serverless, free tier data stack by using Google Cloud Functions. I use this setup for a personal project where I try to get property prices to me and my partner make an informed purchase."
slug: product-analytics-pipeline-with-dbt-semantic-layer

authors: [euan_johnston]

hide_table_of_contents: false

date: 2023-12-14
is_featured: false
---

<aside>
💡 In this article, we explore how we can use dlt + dbt core in a serverless, free tier data stack by using Google Cloud Functions. I use this setup for a personal project where I try to get property prices to me and my partner make an informed purchase.

</aside>

## The problem, the builder and tooling

**The problem**: There is no reference data for the real estate market - how many houses are being sold, for what price? nobody knows except the property office and maybe the banks, and they don’t tell. A secondary goal for this analysis is to try dlt, a python library for data ingestion I have been looking to try.

**The builder:** I’m a data freelancer who deploys end to end solutions, so when I have a data problem, I cannot just let it go. 

**The tools:** I want to be able to run my project on `google cloud functions` due to the generous free tier. I will try `dlt` for ingestion, which I wanted to test for some time. And for transformation I will use `dbt core`.

## The starting point

My partner and are considering buying a property in Portugal. Unfortunately, the only data source we have is Idealista, which is a portal where real estate agencies post ads.

Unfortunately, there are way fewer properties than ads - it seems many real estate companies re-post the same ad that others do, with intentionally different data and often misleading bits of info. The real estate agencies do this so the interested parties reach out to them for clarification, and from there they can start a sales process. At the same time, the website with the ads is incentivised to allow this to continue as they get paid per ad, not per property.

So it seems if I want to collect some information I will need to 

- Grab the data and historize it
- Deduplicate existing listings
- Try to infer what listings sold for how much.

Once we have deduplicated listings with some online history, we can get an idea 

- How expensive which properties are
- How fast they get sold, hopefully a signal of whether they are “worth it” or not.

## Towards a solution

The solution has pretty standard components

- An EtL pipeline. The little t stands for normalisation, such as

Due to the complexity of deduplication, we needed to add a human element to confirm the deduplication. This is reflected in the diagram below:

<Lightbox src="/img/blog/serverless-free-tier-data-stack-with-dlt-and-dbt-core/architecture_diagram.png" width="70%" title="Project architecture" />

### Ingesting the data

For ingestion, we use a couple of sources

- A freemium api wrapper for Idealista found at: https://rapidapi.com/apidojo/api/idealista2
- A google sheet for manually confirming the deduplication. To make this work, we first load the data to BigQuery then access it via the sheet client. We then do manual annotation before re-loading this data back to BigQuery. For this we will use the [ready-made dlt sheets source connector](https://dlthub.com/docs/dlt-ecosystem/verified-sources/google_sheets).

Since these steps run sequentially, I chose to separate them into their own repositories:

- Idealista pipeline: https://github.com/euanjohnston92-berlin/Idealista_pipeline
- gsheets deduplication pipeline https://github.com/euanjohnston92-berlin/gsheets_check_pipeline

### Transforming the data

For transforming I use my favorite solution, dbt core. For running and orchestrating dbt core on cloud functions, I am using dlt’s dbt core runner. The benefit of the runner in this context is that I can re-use the same credential setup

This is the package I created: https://github.com/euanjohnston92-berlin/idealista_dbt_pipeline

### Production-readying the pipeline

To make our pipeline more “production ready”, we could make some improvements:

- Be notified when it runs and what the outcome is. For this we will send data to slack. To do this, I asked GPT to write me a decorator that will send the error on failure or the metadata on success.

```python
from dlt.common.runtime.slack import send_slack_message

def notify_on_completion(hook):
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                load_info = func(*args, **kwargs)
                message = f"Function {func.__name__} completed successfully. Load info: {load_info}"
                send_slack_message(hook, message)
                return load_info
            except Exception as e:
                message = f"Function {func.__name__} failed. Error: {str(e)}"
                send_slack_message(hook, message)
                raise
        return wrapper
    return decorator
```

- Use credentials from a credential store, in this case google secrets.


## The outcome

The outcome was first and foremost a visualisation highlighting the unique properties available in my specific area of search. The map shown on the left of the page gives a live overview of location, number of duplicates (bubble size) and price (bubble colour) which can amongst other features be filtered using the sliders on the right. This represents a much better decluttered solution from which to observe the actual inventory available.


<Lightbox src="/img/blog/serverless-free-tier-data-stack-with-dlt-and-dbt-core/map_screenshot.png" width="70%" title="Dashboard mapping overview" />

Further charts highlight additional metrics which can now (given de-duplication has taken place)  accurately be measured including most importantly, the development over time of “average price/square metre” and those properties which have been inferred to have been sold.

### Next steps

This version was very much about getting a base from which to analyze the properties for my own personal use case.

In terms of further development which could take place, I have had interest from people to run the solution on their own specific target area. 

For this to work at scale I would need a more robust method to deal with duplicate attribution, which is a difficult problem as real estate agencies intentionally change details like number of rooms or surface area.

Perhaps this is a problem ML or GPT could solve equally well as a human, given the limited options available.

## Learnings and conclusion

The data problem itself was an eye opener into the real-estate market. It’s a messy market full of unknowns and noise, which adds a significant purchase risk to first time buyers.

Tooling wise, it was surprising how quick it was to set everything up. dlt integrates well with dbt and enables fast and simple data ingestion, making this project simpler than I thought it would be.

## dlt

Good:

- As a big fan of dbt I love how seamlessly the two solutions complement one another. dlt handles the data cleaning and normalisation automatically so I can focus on curating and modelling it in dbt. While the automatic unpacking leaves some small adjustments for the analytics engineer, it’s much better than cleaning and typing json in the database or in custom python code.
- When creating my first dummy pipeline I used duckdb. It felt like a great introduction into how simple it is to get started and provided a solid starting block before developing something for the cloud.

Bad:

- I did have a small hiccup with the google sheets connector assuming an oauth authentication over my desired sdk but this was relatively easy to rectify.
- Using both a verified source in the gsheets connector and building my own from Rapid API endpoints seemed equally intuitive. However I would have wanted more documentation on how to run these 2 pipelines in the same script with the dbt pipeline.

## dbt

No surprises there. I developed the package locally, and to deploy to cloud functions I injected credentials to dbt via the dlt runner. This meant I could re-use the setup I did for the other dlt pipelines.

```python
def dbt_run():
		# make an authenticated connection with dlt
    pipeline = dlt.pipeline(
        pipeline_name='dbt_pipeline',
        destination='bigquery', # credentials read from env
        dataset_name='dbt'
    )
		# make a venv in case we have lib conflicts between dlt and current env
    venv = dlt.dbt.get_venv(pipeline)
		# package the pipeline, dbt package and env
    dbt = dlt.dbt.package(pipeline, "dbt/property_analytics", venv=venv)
		# and run it
    models = dbt.run_all()
    # show outcome
    for m in models:
        print(f"Model {m.model_name} materialized in {m.time} with status {m.status} and message {m.message}"
```

### Cloud functions

While I had used cloud functions before, I had never previously set them up for dbt and I was able to easily follow dlt’s docs to run the pipelines there. Cloud functions is a great solution to cheaply run small scale pipelines and my running cost of the project is a few cents a month. If the insights drawn from the project help us save even 1% of a house price, the project will have been a success. 

### To sum up

DLT feels like the perfect solution for anyone who has scratched the surface of python development. To be able to have schema’s ready for transformation in such a short space of time is truly… transformatory. As a freelancer, being able to accelerate the development of pipelines is a huge benefit for getting to results within companies often frustrated with the period of time it takes to start ‘showing value’.

I’d welcome the chance to discuss what’s been built to date or discuss any potential further development.
