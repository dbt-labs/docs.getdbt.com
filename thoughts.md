## Thoughts
### Working on the Setting up page
* I think we should make the recommendation "Do this tutorial once, and then
do it a second time with your _own_ query / data warehouse / credentials"
* As I'm writing this, I have a instinct to want to explain _everything_. This
is because I'm a person who wants to understand the why of everything. This is
in fact how we **onboard people to the viewpoint**. How can we support people
that have these sort of questions without cluttering up the simplicty of the
tutorial? Thoughts:
  * A collapsible section with links to a ton of questions / further explanations/
  e.g. for the "Connect to BigQuery" section, I can see us creating short articles
  for:
    * What is a profile?
    * How do I set up a profile for my own warehouse?
    * Why are profiles in a folder named `.dbt`?
    * Why are profiles stored outside of my dbt project?
  * Using a different format other than docs for the tutorial -- something that's
  interactive. This would help us make sure you get through one section before
  moving on to the next, and gives you the opportunity to click into various
  articles --> this is in fact **online Learn**.
I think in the past we tried to anticipate all these questions at once, and I
got hung up on putting them in a structure that made sense for a side bar, but
having short articles that answer specific questions is probably _much better
for search_.
* Similar to above, I also have this instinct to try to anticipate people who
hit roadblocks. How do they ask for help when they get stuck? How do we list
some common troubleshooting issues?
* This style of content is _very_ amenable to videos. I think once we get
everything written, a series of Loom videos is 100% the next step.

### Questions in general
I think taking a question-based approach to documentation is in fact **the best
way** for us to indoctrinate people with the viewpoint.

I'd love to think through what this could look like way into the future. Could
we have a button that allows someone to submit a question at any point in the
docs? Here's my rough sketch:
[ insert sketch from iPad ]

### Working on "Build your first models" page:
* Can we / should we add `git` steps in this tutorial?
  * In particular:
    * Switch branches
    * Open a PR
  * Managed repos means you can't open a PR
  * Happy to have a callout that we normally wouldn't merge to master, but this
  is just the GS tutorial
  * **Resolution:** Just call out the git thing

### Fleshing out the steps
I think there could almost be two versions of the videos.
1. Just the screen grab that has no audio (supportive of learners like myself
who like to see + read things but do not want to sit through someone explaining
things lol). This would replace the need for a ton of screenshots for each step.
2. The longer version which has the narration as well.

What's a good interface for that? Who knows 🤷‍

## Accessibility
* How do we get Loom videos close captioned?

## The first version of videos
* Some of them I didn't cut in the right place

## Making this multi-warehouse compatible
* Would love to do this with different warehouses. Maybe we put the files up
in a public S3 bucket, and provide some `copy into` / `create stage` statements
as a first step (the `seed` method means folks have to query the data first)

## Content
* Should we be explaining the reason for each step at the top of each section?
Should we just go straight to the instructions and rely on the
"Related questions" to explain?
* Do we need more link-outs to guides?

## Analytics
* Snowplow? Tracking BQ queries to see how many people are actually running the
queries? We could maybe write code to try to identify test projects in the IDE?
