---
title: "AI Evaluation in dbt"
description: "How to extend dbt quality testing to monitor AI Agentic Quality"
slug: ai-eval-in-dbt

authors: [kyle_dempsey, luis_leon]

tags: [analytics craft]
hide_table_of_contents: false

date: 2025-05-04
is_featured: true
---
**The AI revolution is here—but are we ready?**  
Across the world, the excitement around AI is undeniable.  Discussions on large language models, agentic workflows, and how AI is set to transform every industry abound, yet real-world use cases of AI in production remain few and far between.

A common issue blocking people from moving AI use cases to production is an ability to evaluate the validity of AI responses in a systematic and well governed way.
Moving AI workflows from prototype to production requires rigorous evaluation, and most organizations do not have a framework to ensure AI outputs remain high-quality, trustworthy, and actionable.

<!-- truncate -->

**Why AI Evaluation Matters**  
The more conversations we have with data teams, the clearer the problem becomes: Companies don’t want to move AI into production unless they can monitor and ensure its quality once it's there -- the fear of a ‘rogue AI’ still exceeds perceived benefits.

The core challenge isn’t just building AI use cases; it’s about continuously monitoring their performance and ensuring the same level of quality and reliability we’ve come to expect from other data assets.
To trust AI in production, we need structured workflows that:
- **Ensure data quality** before it’s fed into AI models
- **Evaluate AI-generated responses** against responses known to be true
- **Trigger alerts or corrective actions** when AI performance drifts below acceptable thresholds

Without these capabilities, AI workflows remain stuck in experimental phases, unable to meet the reliability requirements of production use cases.

**Using dbt to Build AI Evaluation Workflows**
Most organizations already use dbt to transform, test and validate their data.
As an already trusted framework for data quality, it seemed natural to use dbt’s testing capabilities to evaluate and monitor AI workflows as well.

Let’s walk through a simple example using **dbt and Snowflake Cortex** for AI evaluation.
- **Ingest Data** We start by uploading a dataset of IMDB movie reviews, along with human-labeled sentiment scores (positive or negative). This serves as our source of truth.
- **Run AI Workflow** As an simple example workflow, we use Snowflake Cortex’s sentiment analysis function, to classify each review.
- **Evaluate AI Output versus Human Review** We create an evaluation model in dbt that uses the Cortex Complete function to compare the AI-generated sentiment to the actual human-labeled sentiment.
- **Define Pass/Fail Criteria** We configure a custom dbt test to set an accuracy threshold (e.g., 75% accuracy). If AI sentiment predictions fall below this level, the test triggers a warning or error.
- **Store and Visualize Results** Native dbt functionality can easily store test failures in the warehouse providing traceability for further investigation, and data for reporting on AI accuracy.

**Scaling AI Evaluation with dbt**  
This workflow naturally extends dbt’s native testing capabilities and leverages the powerful ability to embed Snowflake Cortex calls in SQL models.
In this way users can combine the power of Snowflake Cortex with the established governance and quality framework of dbt to address the issues stated above.

By using dbt to evaluate AI, organizations can apply the same rigorous testing principles they already use for data pipelines to ensure their AI models are production-ready and maintain quality and governance of all data assets centrally.

**What we Built**
Let's walk through this example step by step to give you a sense of how it all works.
For this example, we start with a test data set which contains the input to our AI workflow, as well as a true measurement given by a human reviewer -- in this example our input is the text review of different movies and the `actual_sentiment` contains a -1 for negative reviews and 1 for positive reviews.
Finally we include a time stamp indicating when our AI provided the response. This time stamp will allow us to track our AI accuracy over time.

<Lightbox src="/img/blog/2025-04-04-ai-evaluation-and-how-dbt-can-help/ai_eval_blog_image_one.png" title="our input data set, including actual sentiment"width="85%" />

The next step is to create another output table containing both the true measurement from our dataset and the value returned by our AI.
Since we can embed the Snowflake Cortex call directly in a SQL model we can easily build this in dbt using a simple reference function.

<Lightbox src="/img/blog/2025-04-04-ai-evaluation-and-how-dbt-can-help/ai_eval_blog_image_two.png" title="results of our agentic workflow"width="85%" />

We also include the input to our AI workflow along with the AI calculated and human determined measurement for the data set.
Including all these data points, while not strictly necessary, allows for clear understanding of what was fed into the AI workflow and easy traceability of specific responses.
We will follow this same pattern again, using a dbt reference function to create one last dbt model where we build the evaluation prompt and use Cortex Complete to give this prompt to Cortex and store the results.
The lionshare of the work building this model was the prompt engineering for the evaluation prompt. We initially built the prompt directly in Snowflake Cortex to ensure it was returning the type of response needed before moving the prompt into dbt. 

<Lightbox src="/img/blog/2025-04-04-ai-evaluation-and-how-dbt-can-help/ai_eval_blog_image_three.png" title="AI generated results automatically evaluated by one or more models"width="85%" />

We chose to define our prompt as a jinja variable as opposed to listing it directly in each dbt model.
This has the upside of increasing model readability, but obscures the text of what the prompt is from someone reading the model.
To address this issue and provide full traceability, we materialize the prompt as a column in this table. This means that each output row contains not only the evaluation score but also the exact prompt given to produce it.
Regardless of where you define your evaluation prompt, by including it as part of your dbt project it will benefit from the same change management and version control processes as the rest of your dbt project, ensuring strong governance of your AI workflows.
Another great benefit of this approach and the flexibility provided by dbt and Snowflake Cortex is that you can easily toggle the model you are using to run the evaluation. In this example we use Snowflake Llama, but using any other [supported model](https://docs.snowflake.com/en/sql-reference/functions/complete-snowflake-cortex) is as easy as changing a function parameter.
You can even run multiple evaluations using different models to assess accuracy by simply adding additional columns to your dbt model.

<Lightbox src="/img/blog/2025-04-04-ai-evaluation-and-how-dbt-can-help/ai_eval_blog_image_four.png" title="dbt Testing evaluates AI accuracry along side data quality"width="85%" />

The final step here is writing a dbt [custom test](/best-practices/writing-custom-generic-tests) to find any responses failing to meet our accuracy threshold. By creating this dbt test we can ensure issues with AI accuracy are caught and flagged as part of our standard dbt runs and quality checks. 
We can also easily leverage dbt’s ability to [store test failures](/reference/resource-configs/store_failures) to record quality issues found in AI processes for further investigation and triage.

As a final benefit of capturing AI evaluations as part of your dbt project is just that - your AI quality information becomes part of your dbt project meaning quality results are available in all the same ways as any other dbt test result. 
You can view this information in <Constant name="explorer" />, feed it into your data catalog of choice, use the test results to trigger additional downstream processes or visualize the information as quality dashboards through BI.
As AI workflows become more commonplace, businesses need a systematic way to evaluate and monitor AI outputs, just as they do with traditional data products. Fortunately, the same principles and tools within dbt can be easily applied to AI evaluation as well.
With dbt, data teams can bridge the gap between AI experimentation and AI in production, by ensuring trust, reliability, and governance to AI workflows.

Ready to bring AI evaluation into your dbt workflow? Get started with the dbt MCP server—it makes it easy to connect your AI systems to trusted, governed data.
