---
id: idempotent
title: Idempotent
description: Idempotent is an adjective to describe a process that gives you the same result no matter how many times you run it.
displayText: idempotent
hoverSnippet: Idempotent describes a process that gives you the same result no matter how many times you run it.
---

<head>
    <title>What is idempotency and why is the concept important in data?</title>
</head>

Idempotent is an adjective to describe a process that gives you the same result no matter how many times you run it.

For a mathematical example, adding 1 changes the results, but multiplying by 1 is idempotent. When you add 1 to a number and then add 1 again, you get different results. If you multiply a number by 1 and multiply by 1 again, you do get the same result.

A more real-world example of idempotency is the process of saving a file in a word processor. Given the same inputs (i.e. the same document contents), clicking "_Save_" one time will leave your system in the exact same state as clicking "_Save_" five times in a row.

A non-idempotent version of the "_Save_" button might do something like "Append the paragraph I just wrote to the end of the file". Doing _that_ five times in a row will _not_ leave you in the same state as doing it one time; your most recent paragraph would have duplicates.

If word processors only gave us non-idempotent "Append paragraph" / "Update paragraph" / "Delete paragraph" operations, then saving our document changes would be a lot more difficult! We'd have to keep track of which paragraphs we previously saved, and either make sure to not save them again or have a process in place to regularly clean up duplicate paragraphs. The implementation of the "_Save_" button in word processors takes the collection of low-level non-idempotent filesystem operations (read/append/overwrite/delete), and systematically runs them in a certain order so that the _user_ doesn't have to deal with the non-idempotency. The user can just focus on writing -- choosing words, editing for clarity, ensuring paragraphs aren't too long, etc. -- and the word processor deals with making sure the words get persisted properly to disk.

This word processing analogy is very similar to what dbt does for [data transformation](https://www.getdbt.com/analytics-engineering/transformation/): it takes the collection of low-level non-idempotent database operations (`SELECT`/`INSERT`/`UPDATE`/`DELETE` -- collectively known as <Term id="dml">DML</Term> statements), and systematically runs them in a certain order so that analytics engineers don't have to deal with non-idempotency. We can just focus on the data -- [choosing good model and column names](https://docs.getdbt.com/blog/on-the-importance-of-naming), [documenting them](/community/resources/viewpoint#documentation), [ensuring data consumers can understand them](https://docs.getdbt.com/docs/guides/best-practices#consider-the-information-architecture-of-your-data-warehouse), etc. -- and [`dbt run`](https://docs.getdbt.com/reference/commands/run) will make sure the database ends up in the right state.
