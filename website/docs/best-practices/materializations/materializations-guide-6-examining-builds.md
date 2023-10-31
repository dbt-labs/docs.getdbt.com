---
title: "Examining our builds"
id: materializations-guide-6-examining-builds
slug: 6-examining-builds
description: Read this guide to understand how to examine your builds in dbt.
displayText: Materializations best practices
hoverSnippet: Read this guide to understand how to examine your builds in dbt.
---

## Examining our builds

- ⌚ dbt keeps track of how **long each model took to build**, when it started, when it finished, its completion status (error, warn, or success), its materialization type, and _much_ more.
- 🖼️ This information is stored in a couple files which dbt calls **artifacts**.
- 📊 Artifacts contain a ton of information in JSON format, so aren’t easy to read, but **dbt Cloud** packages the most useful bits of information into a tidy **visualization** for you.
- ☁️ If you’re not using Cloud, we can still use the output of the **dbt Core CLI to understand our runs**.

### Model Timing

That’s where dbt Cloud’s Model Timing visualization comes in extremely handy. If we’ve set up a [Job](/guides/bigquery) in dbt Cloud to run our models, we can use the Model Timing tab to pinpoint our longest-running models.

![dbt Cloud's Model Timing diagram](/img/best-practices/materializations/model-timing-diagram.png)

- 🧵 This view lets us see our **mapped out in threads** (up to 64 threads, we’re currently running with 4, so we get 4 tracks) over time. You can think of **each thread as a lane on a highway**.
- ⌛ We can see above that `customer_status_histories` is **taking by far the most time**, so we may want to go ahead and **make that incremental**.

If you aren’t using dbt Cloud, that’s okay! We don’t get a fancy visualization out of the box, but we can use the output from the dbt Core CLI to check our model times, and it’s a great opportunity to become familiar with that output.

### dbt Core CLI output

If you’ve ever run dbt, whether `build`, `test`, `run` or something else, you’ve seen some output like below. Let’s take a closer look at how to read this.

![CLI output from a dbt build command](/img/best-practices/materializations/dbt-build-output.png)

- There are two entries per model, the **start** of a model’s build and the **completion**, which will include **how long** the model took to run. The **type** of model is included as well. For example:

```shell
20:24:51  5 of 10 START sql view model main.stg_products ......... [RUN]
20:24:51  5 of 10 OK created sql view model main.stg_products .... [OK in 0.13s]
```

- 5️⃣  On **both rows** we can see that our `stg_products` model is the 5th of 10 objects being built, the timestamp it started at, that it was defined in SQL (as opposed to python), and that it was a view.
- 🆕  On the **first row** we can see the timestamp of when the model **started**.
- ✅  On the **second row** — which does _not_ necessarily come right after, thanks to threads other models can be starting and finishing as this model runs — we see the **completion** entry which adds the **status**, in this case `OK` , and the **time to build**, a lightning-fast 0.13s. That’s not unexpected considering what we know about views.
- 🏎️  **Views should typically take less than a second or two,** it’s tables and incremental models you’ll want to keep a closer eye on with these tools.

### dbt Artifacts package

- 🎨  Lastly, when it comes to examining your dbt runs, you’re **not stuck without fancy visuals** if you’re using dbt Core. It’s not set up out-of-the-box, but if you want to introspect your project more deeply, you can use the [dbt Artifacts package](https://github.com/brooklyn-data/dbt_artifacts).
- 👩‍🎨  This provides models you can **visualize for every aspect of your project** at a very granular level.
- ⌚  You can use it to **create your own model timing visualization** in your BI tool, and any other reports you need to keep an eye on your materialization strategy.
