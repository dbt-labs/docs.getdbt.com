The <Constant name="wizard" /> operates in three modes:

<SimpleTable>

| Mode | Behavior |
|------|----------|
| **Explore only** | The agent queries and explains data but can't edit files or run builds. Best when you want to analyze data or validate a model's output without the agent proposing changes. Every answer comes with the SQL or metric definition behind it. Available for read-only users in the home tab. |
| **Ask for approval** (default) | The agent drafts edits to files. You approve each file change before it is persisted. Best when you want tight control over what gets saved to your branch. |
| **Edit files automatically** | The agent drafts and automatically saves file edits without per-file approval. Best for faster iteration when you're confident in the prompt. |
</SimpleTable>

Switch between modes anytime with the **Agent mode** button (bottom-left). The authoring modes keep the analytical tools available, so switching out of **Explore only** doesn't cost you anything.
