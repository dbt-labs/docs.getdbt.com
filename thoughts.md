## Thoughts
### Working on the Setting up page
* Would be cool to link out to explanations in little collapsible sections.
I can imagine someone doing the tutorial once, and then doing it again where
they have related questions / explanations.

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
