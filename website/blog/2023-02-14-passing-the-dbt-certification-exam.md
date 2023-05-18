---
title: Tips and advice to study for, and pass, the dbt Certification exam
description: So you want to make it *official*? Callie and Jade, analytics engineering at Montreal Analytics, share their advice on passing the dbt Certification Exam.
slug: tips-for-the-dbt-certification-exam
authors: [callie_white, jade_milaney]
tags: [analytics craft]
hide_table_of_contents: false
date: 2023-02-16
is_featured: true
---
The [new dbt Certification Program](https://www.getdbt.com/blog/dbt-certification-program) has been created by dbt Labs to codify the data development best practices that enable safe, confident, and impactful use of dbt. Taking the Certification allows dbt users to get recognized for the skills they’ve honed, and stand out to organizations seeking dbt expertise.

Over the last few months, [Montreal Analytics](https://www.montrealanalytics.com/), a full-stack data consultancy servicing organizations across North America, has had over 25 dbt Analytics Engineers become certified, earning them the 2022 dbt Platinum Certification award.

In this article, two Montreal Analytics consultants, Jade and Callie, discuss their experience in taking, and passing, the dbt Certification exam to help guide others looking to study for, and pass the exam.
<!--truncate-->

## What brought you to the exam?

**Jade (J):** I’m a newly minted Montreal Analytics Analytics Engineer coming from a background as a data analyst with a few months of dbt experience. My last company used some basic dbt in their BI implementation, not so far as tests or snapshots, but I have some exposure(s) (pun intended). I decided to take the exam to build up my knowledge as a Junior Analytics Engineer and to give future clients confidence in my skills.

**Callie (C):** As an experienced Analytics Engineer with 4 years of dbt experience, dating back to late 2018, 5 years of experience across the Modern Data Stack, and an overall 6 years of a career spent in data, I approached the new dbt test with an ‘old school’ dbt repertoire and years of ingrained bad habits. I have been through the whole evolution of dbt’s growth, and so I wanted to take the exam to polish up my skills, showcase Montreal Analytics’ dbt expertise, and earn that shiny badge for my LinkedIn profile.

## How did you prepare for the exam?

**J:** To prepare for the exam, I built up a practice dbt project. All consultants do this as part of Montreal Analytics onboarding process, and this project allowed me to practice implementing sources and tests, refactoring SQL models, and debugging plenty of error messages. Additionally, I reviewed the [Certification Study Guide](https://www.getdbt.com/assets/uploads/dbt_certificate_study_guide.pdf) and attended group learning sessions.

**C:** To prepare for the exam I reviewed the official dbt Certification Study Guide and the [official dbt docs](https://docs.getdbt.com/), and attended group study and learning sessions that were hosted by Montreal Analytics for all employees interested in taking the exam. As a group, we prioritized subjects that we felt less familiar with; for the first cohort of test takers this was mainly newer topics that haven’t yet become integral to a typical dbt project, such as [doc blocks](https://docs.getdbt.com/docs/collaborate/documentation#using-docs-blocks) and [configurations versus properties](https://docs.getdbt.com/reference/configs-and-properties). These sessions mainly covered the highlights and common “gotchas” that are experienced using these techniques. The sessions were moderated by a team member who had already successfully completed the dbt Certification, but operated in a very collaborative environment, so everyone could provide additional information, ask questions to the group, and provide feedback to other members of our certification taking group.

I felt comfortable with the breadth of my dbt knowledge and had familiarity with most topics. However in my day-to-day implementation, I am often reliant on documentation or copying and pasting specific configurations in order to get the correct settings. Therefore, my focus was on memorizing important criteria for *how to use* certain features, particularly on the order/nesting of how the key YAML files are configured (dbt_project.yml, table.yml, source.yml).

## How did the test go?

**J:** With a cup of coffee I started my exam in high spirits and high stress. I had never taken a proctored exam before, so going into this I had to adjust to being on camera while taking a test and in general taking a test in my living room felt strange!

The first few questions were trickier than I’d anticipated, and my heart started beating a little faster as a result. I found the build-list questions, five lines of code to create a valid YAML or SQL file that accomplishes a certain task, particularly difficult.

The exam consists of 65 questions, usually containing multiple parts, so by 90 minutes in I started to get tired. I’d flagged several questions and went back to check on those before submitting. At the time, I thought I answered about 60% of these questions right? Having lost my coffee buzz and with shaky confidence I submitted the test to see my result. Failed.

**C:** In advance of test day I did spend extra time making sure that I had an appropriate environment for taking the test; I booked a study room at my local library that had absolutely nothing on the walls, was completely quiet, and had a solid internet connection so that I wouldn’t have to be stressed about any details on that front.

I had been informed of the discrete option multiple choice questions, but those threw me off and shook my confidence. The total “major” question (ie. Question 5) was composed of a certain number of smaller sub-questions (ie. Question 5a-e). If you answered the first sub-question correctly, it served you the second sub-question. If you answered the second sub-question correctly, it moved to the third sub-question. If you got any of the sub-questions incorrect the page navigated to the next major question and you lost the point for the whole major question. There was no indication for how many sub-questions were in each major question, therefore regardless of how many questions I answered correctly, I never knew if it moved to the next major question because I was wrong, or because I had answered all the questions.

Otherwise, the questions required considerable focus to flush out the differences between them as there were often only small differences between the answer options. However, once I identified what the differences were between answer options I felt that it was pretty easy for me to choose the most correct option.

The questions that personally tripped me were things that I had expected to trip me up. These had the common theme of being technical terminology for specific techniques that I know how to use, but couldn’t speak the same official language that the test was using. An example is distinguishing slowly-changing data type(s) and their implementation in dbt.

Additionally, I got tripped up on the official names for test types — what was previously known as “schema/data tests” are now referred to as “generic” or “singular tests”. dbt Labs changed their naming conventions during the dbt 1.0.0 upgrade, so I was more familiar with the [old naming conventions](https://docs.getdbt.com/guides/legacy/writing-custom-generic-tests).

## Thoughts after taking the test?

**J:** Personal experience has taught me that the first thing to do when you’ve failed a test is to get yourself a treat. I took myself to my favorite bakery; got a walk in and a Boston Cream donut. Now I could properly reflect on how the test went, and prepare for round two.

**C:** After the test I immediately turned Slack back on, answered client questions, and got back to work. Check, done, and moving on.

The test felt as I had expected; I knew I hadn’t aced it because I had prioritized my actual dbt work over memorizing for a test I only needed 65% to pass. I was confident that my practical experience, along with brushing up on some specifics would get me a pass.

A huge proportion of a role in data is weighing the cost versus benefit of a task. Does the value of the insight gained from the data justify the effort and cost of modeling that data? What’s the acceptable error threshold? What’s the priority in comparison to other tasks that could be done? I applied the same principle to completing my dbt Certification.

## Retaking the dbt Certification exam

**J:** Getting ready for my second attempt, I leaned heavily on the dbt documentation and reference pages; I focused on debugging errors and schema generation, but the goal here was mostly to build up my confidence. A colleague and I built flashcards (decks [1](https://quizlet.com/ca/718959401/dbt-study-terms-and-practice-qs-flash-cards/) and [2](https://quizlet.com/ca/720366359/dbt-certification-prep-2-flash-cards/)) to help with this, working on recall of commands, error types, configurations, and properties. The extra hours and flash cards combined with pep talks from my team members had me feeling ready to go.

Test taking is a skill. As Callie says, "Academic-type test taking is its own skill that has huge emotional factors and has not been made for the way everyone’s brain works best."

With a deep breath, and a big cup of water — it’s 2:30pm two weeks later and I’m retaking the exam. Same set up as before with some tricky questions, especially the build list ones. I’m thankful I studied debugging errors and schemas because that came up a few times. I answer the questions confidently and flag 12 to look at again before I submit the exam at 3:45pm.
Passed.

Now, the first thing you must do when you’ve passed a test is to get yourself a treat — it’s Boston Cream time!

## Now that you’re dbt official, where to next?

**C:** I’m continuing on the same path, but with the shiny badge prominently posted on my LinkedIn profile along with the certifications of my teammates. The validation of having an external party verify that I know the key best practices in the primary data tool I use and that I can be trusted to implement a successful dbt project is great.

Standards and best practices are very important, but a test is a measure at a single point in time of a rapidly evolving industry. It’s also a measure of my test-taking abilities, my stress levels, and other things unrelated to my skill in data modeling; I wouldn’t be a good analyst if I didn’t recognize the faults of a measurement. I’m glad to have this check mark completed, but I will continue to stay up to date with changes, learn new data skills and techniques, and find ways to continue being a holistically helpful teammate to my colleagues and clients.


You can learn more about the dbt Certification [here](https://www.getdbt.com/blog/dbt-certification-program/).