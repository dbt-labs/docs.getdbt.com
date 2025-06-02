Configuring automatic downstream exposures with Tableau have the following considerations:

- You can only connect to a single Tableau site on the same server.
- If you're using Tableau Server, you need to [allowlist <Constant name="cloud" />'s IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your <Constant name="cloud" /> region.
- Tableau dashboards built using custom SQL queries aren't supported.
- Downstream exposures sync automatically _once per day_ or when a user updates the selected collections.
- <Expandable alt_header="The database fully qualified names (FQNs) in Tableau must match those in the dbt build.">
  Tableau's database FQNs (fully qualified names) must match those in the dbt build. To view all expected dependencies in your exposure, the FQNs must match but aren't case-sensitive. For example:
    | Tableau FQN | dbt FQN | <div style={{width:'250px'}}>Result</div> |
    | --- | --- | --- |
    | `analytics.dbt_data_team.my_model` | `analytics.dbt_data_team.my_model` | ✅  Matches and dependencies will display as expected.|
    | `analytics.dbt_data_team.my_model` | `prod_analytics.dbt_data_team.my_model` | ❌ Doesn't match and not all expected dependencies will display. |

  To troubleshoot this:
  1. In <Constant name="cloud" />, download the `manifest.json` from the most recent production run that includes the missing dependencies by clicking on the **Artifacts** tab and scrolling to `manifest.json`.
  2. Run the following [GraphiQl](https://help.tableau.com/current/api/metadata_api/en-us/docs/meta_api_start.html#explore-the-metadata-api-schema-using-graphiql) query. Make sure to run the query at `your_tableau_server/metadata/graphiql`, where `your_tableau_server` is the value you provided for the Server URL when [setting up your Tableau integration](/docs/cloud-integrations/downstream-exposures-tableau#set-up-in-tableau):

            ```jsx
                query {
                  workbooks {
                    name
                    uri
                    id
                    luid
                    projectLuid
                    projectName
                    upstreamTables {
                      id
                      name
                      schema
                      database {
                        name
                        connectionType
                    }
                  }
                }
              }
            ```

  3. Compare database FQNs between `manifest.json` and the GraphiQL response. Make sure that `{database}.{schema}.{name}` matches in both. 
    The following images are examples of FQNs that _match_ in both `manifest.json` and the GraphiQL response and aren't case-sensitive: 
    <Lightbox src="/img/docs/cloud-integrations/auto-exposures/manifest-json-example.png" width="80%" title="manifest.json example with lowercase FQNs."/>
    <Lightbox src="/img/docs/cloud-integrations/auto-exposures/graphiql-example.png" width="80%" title="GraphiQl response example with uppercase FQNs."/>
  4. If the FQNs don't match, update your Tableau FQNs to match the dbt FQNs.
  5. If you're still experiencing issues, please contact [dbt Support](mailto:support@getdbt.com) and share the results with them.
  </Expandable>
