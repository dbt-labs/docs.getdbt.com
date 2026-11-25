If you're receiving a `Session occupied` error in the <Constant name="platform_cli" /> or if you're experiencing a long-running session, you can use the `dbt invocation list` command in a separate terminal window to view the status of your active session. This helps debug the issue and identify the arguments that are causing the long-running session.

To cancel an active session, use the `Ctrl + Z` shortcut.

To learn more about the `dbt invocation` command, see the [dbt invocation command reference](/reference/commands/invocation?version=2.0).

Alternatively, you can reattach to your existing session with <code>dbt reattach</code> and then press <code>Control-C</code> and choose to cancel the invocation.