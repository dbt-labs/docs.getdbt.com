---

title: "Embracing dbt Cloud: A journey from local development to proficiency in dbt Cloud"
description: "One person's evolution from local development in dbt Core to embracing the dbt Cloud IDE and finding that doing the work in the Cloud IDE makes the experience faster and less complicated, so she can spend more time on the code she's changing and less on the mechanics of local development environment upkeep."
slug: paige-journey-local-dev-to-cloud

authors: [paige_berry]

tags: [dbt Cloud, dbt Core]
hide_table_of_contents: false

date: 2023-12-14
is_featured: false

---

 I knew from the moment I heard about dbt that it was a game-changer, and how it would solve so many of the problems I’d encountered in nearly 20 years of data and programming work.

I was familiar with software engineering practices because I’d worked as a software engineer for about 8 months. It was a detour in my career path. I’d been looking for a data job, but the manager I wanted to work with didn’t have headcount to expand his data function yet. There was an open role on his department’s software engineering team, so I applied for that role instead. I’d had some programming experience - I’d written code in Java, C, Oracle PLSQL, and had once created a data pipeline in PERL - so it wasn’t a huge leap.

I taught myself the basics of Ruby over a weekend, well enough to do the take home assignment and pass the technical screen, and got the job. Performing the job duties required learning how to use git and GitHub, how to collaborate on building software, write tests, review and merge code, etc. The reasoning behind these practices made sense to me, and I felt proud of how quickly I learned the workflow and how to use the tools.

When the new data role finally opened up I moved over into it, having found that even as a software engineer the thing I most wanted to do was play with the data in the production database!

We didn’t use dbt at that time - this was in 2018, and I hadn’t heard of the tool yet - and I quickly began missing the collaboration workflows that I’d gotten accustomed to on the engineering team.

I taught my fellow data analysts how to use git and GitHub with the idea that we could version-control our most valuable SQL scripts, but the results were mixed. I kept at it though, because I didn’t want my hard-won git skills to rust; they earned me “street cred” with the more technical members of my department, and that was valuable to me.

We were a small “spoke” data team in a larger company, and when the central “hub” data team started using dbt, and I learned about what it was, I was jealous of them. When it came time for me to move on to my next workplace, I looked for a data team that was already using dbt. I wanted to experience that collaborative workflow, but for data work, myself.

We all did local development on our project, and used dbt Cloud only to administer our scheduled job runs. In the nearly two years I worked there I only logged in a few times, exclusively to look at the details of a failed CI run.

But, there were barriers to developing using the Cloud IDE.

For one, it just wasn’t the norm for the team. dbt Core was decided on and set up before I got there, and everyone was comfortable doing development locally. When new folks would join the data team, often they wouldn’t have dbt or git experience, but we were all available and encouraging when it came to helping someone get used to the local development workflow.

For another, I personally was very attached to the local development workflow for a number of reasons:

* I was, and still am, **deeply proud** of the skills I developed to get comfortable with things like using the command line, administering multiple local python environments, performing advanced git actions like rebasing and cherry-picking commits, etc., and I know **how quickly those skills can atrophy with disuse**.
* When developing locally, I felt I had **total control** over what I was doing and what impact it would have. This is a level of control that, if it exists in the Cloud IDE, it isn’t as readily apparent there.

    For example, I would comment out the entry for “Prod” in my local profiles.yml when I would run dbt commands locally, to make absolutely sure I wasn’t running commands that would impact Production models before I was ready to.

    Also, I could do all sorts of dumb things as I developed, with no concern that anyone else would ever see it, and could be really confident by the time I pushed up a branch or commit to the main project repo that I was ready for another human to see the code.

    I’m not as sure, when using the Cloud IDE, how to guarantee that I’m not impacting the main repo, or what my development flow should be, what clicking the buttons to do git-like actions (refresh the code, push to a branch) actually is doing in the background, and how to save my work midway without pushing a bunch of half-baked crud up to a branch that people could go look at if they got curious. It’s a **weirdly vulnerable situation** for someone who experiences imposter syndrome around technical ability.

When I realized that my dream was to come and work for dbt Labs, that I wanted to apply everything I’d learned so far in my career to helping this company be successful, I knew I needed to get a better understanding of dbt Cloud as a product and what it felt like to use it.

For the technical assessment I completed for my application here, I decided to use dbt Cloud to do the work of modeling the data, and specifically to do all of the development in the Cloud IDE. This was in June of 2022.

I started by following along with a Getting Started tutorial that evolved into [this Quickstart guide](/docs/guides/bigquery?step=1)!, which walked me through setting up a connection to BigQuery (where I had uploaded the assignment data), connecting to a repo (I created a private one in my personal GitHub account), and creating my project structure. You can also find more set up informaiton in [About dbt Cloud setup](/docs/cloud/about-cloud-setup).

I found the experience really straightforward, in fact the dbt Cloud IDE was a pleasure to use. It’s true that my project was very small and simple, really only one source and maybe a handful of models, and the size and simplicity might be part of the ease I experienced. But I followed the recommendation for project structure that was available at the time, creating staging and intermediate and mart versions of my models, and got more comfortable with pushing the buttons that do git actions and seeing the results in the repo on GitHub.

Having a **personal playground**, a place where I couldn’t accidentally bungle something used by someone else, and that no one could peek into until I was ready to show them, was **instrumental** in my experience of getting comfortable with dbt Cloud.

When I got the job at dbt, I committed to developing only in dbt Cloud as a way to be supportive of the Product team I’m embedded with. It’s gone well so far, though my opportunities to develop against our internal project have been few; I’m mostly doing ad-hoc and explorative work in other tools.

Though the work I’ve done in our project has been limited to things like renaming files, restructuring directory contents, and small code changes to existing models, I believe I’ve been able to complete these tasks much faster than if I were doing them locally. Using the Cloud IDE for this work means I don’t need to do a bunch of updates to my locally-installed packages, start up a python virtual environment, futz with git in the command line to get the latest changes pulled down, make sure my VPN Client is connecting to the data warehouse properly, all before I can get started on making my code change.

These may seem like small annoyances, and I willingly jumped through these hoops at my previous workplace. But it’s really nice to not have to! Doing the work in the Cloud IDE makes the experience faster and less complicated, so I can spend more of my brain cycles on the code I’m changing and less on the mechanics of local development environment upkeep.

Telling this anecdotal story of my Core and Cloud experience is another way I hope to be of use to this company. It’s only one person’s perspective, but hopefully there’s value in it.

**Update 4 months later**: I’ve done way more development using the Cloud IDE since I originally wrote this, and have loved using it so much. It’s seriously sped up my development process. I can’t imagine doing this job without it ❤️
