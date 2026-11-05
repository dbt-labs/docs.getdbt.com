---
title: "Glossary"
id: 8-glossary
description: Plain-language definitions of the terms used in the context engineering guide.
displayText: Glossary
hoverSnippet: Look up the terms used in the context engineering guide.
---

New to a term? Look it up here. The terms are in alphabetical order.

| Term | What it means |
|------|---------------|
| Canary | A few frozen probe texts you re-embed on every build and compare to a reviewed baseline, to catch a model that quietly changed |
| Chunk | A piece of text small enough to embed and retrieve |
| Classification | Giving each chunk one label from a fixed set |
| Context window | How much text a model can read in one go |
| Cosine similarity | A score from 1.0 (same direction) to -1.0 (opposite) for how close two vectors are in meaning |
| Deferral | Letting a CI job read models from another environment, such as production, instead of rebuilding them. See [defer](/reference/node-selection/defer). |
| Embedding | A list of numbers that captures what a piece of text means |
| Enum | A fixed list of allowed values, such as the labels a classifier may return |
| Event sourcing | Recording a change by appending a new row instead of editing an old one |
| Golden set | A small, hand-labeled dataset of known-correct answers that you score AI output against |
| Hallucination | When a model states something, such as a quote or a fact, that isn't in the source |
| Hook | SQL that dbt runs before (pre-hook) or after (post-hook) a model builds |
| Knowledge base | One table where every source lands in the same shape, so one search covers all of them |
| Lineage | The trail from a piece of context back to the source row it came from |
| Precision and recall | Recall is whether search finds the right chunk at all. Precision is whether the right chunk ranks near the top. |
| Taxonomy | Your fixed list of labels for classification |
| Token | The sub-word piece a model reads and bills by, roughly four characters of English |
| Unit | The smallest piece of text you never split, such as a speaker turn or a sentence |
| Vector | The list of numbers an embedding is stored as. Only comparable to vectors from the same model. |
