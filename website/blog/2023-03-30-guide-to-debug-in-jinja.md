---
title: "The missing guide to debug() in dbt"
description: Jinja brings a lot of automation and joy to dbt—it also brings additional complexity and required skills to succeed with it. In this Developer Blog, Benoit walks through the useful debug() command in Jinja to make debugging macros more efficient and intuitive.
authors: [benoit_perigaud]
slug: guide-to-jinja-debug
tags: [analytics craft]
hide_table_of_contents: false
date: 2023-03-29
is_featured: true
---

*Editor's note—this post assumes intermediate knowledge of Jinja and macros development in dbt. For an introduction to Jinja in dbt check out [the documentation](https://docs.getdbt.com/docs/build/jinja-macros) and the free self-serve course on [Jinja, Macros, Pacakages](https://courses.getdbt.com/courses/jinja-macros-packages).*

Jinja brings a lot of power to dbt, allowing us to use `ref()`, `source()` , conditional code, and [macros](https://docs.getdbt.com/docs/build/jinja-macros). But, while Jinja brings flexibility, it also brings complexity, and like many times with code, things can run in expected ways.

The [`debug()`](https://docs.getdbt.com/reference/dbt-jinja-functions/debug-method) macro in dbt is a great tool to have in the toolkit for someone writing a lot of Jinja code, but it might be difficult to understand how to use it and what benefits it brings.

Let’s dive into the last time I used `debug()` and how it helped me solve bugs in my code.

<!--truncate-->

## Jinja in dbt

While working on a feature for [the dbt_project_evaluator package](https://github.com/dbt-labs/dbt-project-evaluator), my dbt runs started to fail consistently providing me the following message:

```plain text
16:49:26  Database error while running on-run-end
16:49:26  Encountered an error:
Runtime Error
  Parser Error:
```
That's it!?!?
<center>
<iframe src="https://giphy.com/embed/l4JyNPwLCWt6mSxlS" width="480" height="276" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/comedy-bbc-three-l4JyNPwLCWt6mSxlS">via GIPHY</a></p>
</center>

As my `on-run-end` configuration in `dbt_project.yml` was the following, I was at least comfortable with pinpointing that the issue was with my macro `print_dbt_project_evaluator_issues`:

```yaml
on-run-end: "{{ dbt_project_evaluator.print_dbt_project_evaluator_issues() }}"
```

But except for this insight, there was no mention of a specific line or downstream macro failing—so, the first step was trying to understand which part of my code was raising the error. My two options were:

1. Write a bunch of `print("Here")` or `log("there", info=true)` statements in my macros and see which ones get printed and which ones don’t
2. Use the `debug()` command to both find where my code is failing and look at my variables when the code is running

As you might have guessed, this guide is about option #2.

## Intro to `debug()` in Jinja

`debug()` is a command available in dbt used to set breakpoints in your Jinja code. Those breakpoints stop the execution of your code and provide the ability to inspect variables and to run the following part of your code step by step.

### How to use it

First of all, `debug()` is not available in dbt Cloud as it does not provide full access to the terminal, so, you will have to install and use `dbt-core` locally.

Then, to enter into the debug mode, you need to both:

- Write `{{ debug() }}` in your code—where you want to start the debugger—and
- set up the environment variable `DBT_MACRO_DEBUGGING` to any value. This can be done for the entire shell session by typing `export DBT_MACRO_DEBUGGING=1` in the command line or for each command, by prepending the whole command with the environment variable, like `DBT_MACRO_DEBUGGING=1 dbt build`. Without this variable set, the `debug()` command will not be evaluated and therefore you will not enter debug mode.

### Back to our original issue, let’s use `debug` to pinpoint where our code has bugs

If you put `{{ debug() }}` in one or multiple sections of your code, and while in debug mode you press `c` , the debugger will stop at each of your breakpoints, allowing you to find which part of the code is failing.

In my case,

```sql
{% set my_results = run_query(sql_statement) %}
{{ debug() }}
```
failed without entering the debug mode, but
```sql
{{ debug() }}
{% set my_results = run_query(sql_statement) %}
```
entered debug mode, telling me that there was something wrong with running my actual query. 

Now that we found where the issue is, can `debug()` help us fix it? Let’s look at the different commands available in the debugger.

## Using the full power of Jinja debugging

### debugging commands

With the code in debug mode, we get a fully functional Python interactive debugger showing us this information: `ipdb>` (technically, `ipdb` stands for [IPython debugger](https://github.com/gotcha/ipdb)).

The first command we can type is `h` to list the help and the available commands:

```plain text
Documented commands (type help <topic>):
========================================
EOF    clear      display  l         pfile    return           tbreak     where
a      commands   down     list      pinfo    retval           u
alias  condition  enable   ll        pinfo2   run              unalias
args   cont       exit     longlist  pp       rv               undisplay
b      context    h        n         psource  s                unt
break  continue   help     next      q        skip_hidden      until
bt     d          ignore   p         quit     skip_predicates  up
c      debug      j        pdef      r        source           w
cl     disable    jump     pdoc      restart  step             whatis

Miscellaneous help topics:
==========================
exec  pdb

Undocumented commands:
======================
interact
```

This guide won't describe all the `ipdb` commands available to us, there are various online guides about the topic, but we will focus on the most useful ones in the majority of Jinja debugging cases:

- `a`: Lists the current parameters for the functions you are in.
- `c`: Continue the execution of the code until the next breakpoint or the end of the program if there is no other breakpoint.
- `p` and `pp`: Print and pretty-print data.
    - `p` will often print data in a single string, wrapped over multiple lines.    
    - `pp` will print the same information but will add newlines to make it easier to have a quick glance at a variable;`pp` is especially useful to print lists and dictionaries.
    

### Using the interactive prompt to solve our problem

While in `ipdb`, you can also type some Python code to introspect your program and the current value of your variables. For example, typing `locals().keys()` or `p locals().keys()` returns the list of the current local variables (typing just `locals()` prints both the variable names and their values, which will most likely entirely fill your terminal).

`ipdb` in Jinja won't return the list of variables with the exact same name as in your code, but you will see variables with very similar names, with just a prefix like `l_1_<my_variable>`  or `l_2_<my_variable>` depending on the loops in your Jinja code.

In my case, the debugger returns the following (shortened) list:

```plain text
dict_keys(['l_1_schema_project_evaluator', 'l_1_db_project_evaluator', 't_2', ..., 'l_1_results', ..., 'l_2_graph', ..., 'l_2_sql_statement', 'environment', 'missing', 'resolve', 't_1', 'undefined'])
```

A tip recommend is to to look for variables with similar names to variables I either defined myself or read from in my code. Here, I can see a `l_2_sql_statement` as part of my variables list and can also print its value in my terminal by typing `p l_2_sql_statement`.

Typing `p l_2_sql_statement` returned the following to my terminal: 
```sql
`'\n select * from duck.main.model.dbt_project_evaluator.fct_documentation_coverage\n '`
```

We can directly see that there is an issue in the SQL generated as part of my macro as I am trying to read from `duck.main.model.dbt_project_evaluator.fct_documentation_coverage` (concatenating the database, schema and model unique id) instead of `duck.main.fct_documentation_coverage` (concatenating the database, schema and model table name). We found the issue.

To fix it, we can then leverage the ability to modify variables while in debug mode. We can first assign a new value to the variable by typing `l_2_sql_statement = '\n select * from duck.main.fct_documentation_coverage\n '` and then typing `c` in the debugger to let the macro execute until it finishes or reaches a new breakpoint. In my case, the statement worked after I modified `l_2_sql_statement` and I can go back to the logic in my code to see why its value is not what I expected.

### Using the debugger to analyze dbt Jinja variables

The debugger can also be used to inspect the [out of the box Jinja variables and function made available with dbt](https://docs.getdbt.com/reference/dbt-jinja-functions).

In my code, I was also looking at the [results object](https://docs.getdbt.com/reference/dbt-jinja-functions/on-run-end-context#results) available in the `on-run-end` context. We can actually see it in the previous list, called `l_1_results`.

In the debugger, if I type, `type(l_1_results)`, the program tells me that this is a `list`. I can then run a `type(l_1_results[0])` and dbt now tells me that the type of the variable is a `dbt.contracts.results.RunResult`.

My last step to analyze the results object is to type `pp l_1_results[0].to_dict()` and the CLI then returns a pretty-printed version of all the fields and values available in the first item of my `results` object.

## Parting thoughts

I hope that this short guide gave you an idea of how `debug()` could help you develop more efficiently Jinja code and investigate potential errors. And feel free to jump to [#advice-dbt-for-power-users](https://getdbt.slack.com/archives/C2JRRQDTL) in [the dbt Community Slack](https://www.getdbt.com/community/join-the-community/) if you want to discuss more in depth about debugging!

