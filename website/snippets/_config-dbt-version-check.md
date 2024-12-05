
Starting in 2024, when you select a [release track in dbt Cloud](/docs/dbt-versions/cloud-release-tracks) to receive ongoing dbt version upgrades, dbt will ignore the `require-dbt-version` config.

dbt Labs is committed to zero breaking changes for code in dbt projects, with ongoing releases to dbt Cloud and new versions of dbt Core. We also recommend these best practices:

<Expandable alt_header="Installing dbt packages" >

If you install dbt packages for use in your project, whether the package is maintained by your colleagues or a member of the open source dbt community, we recommend pinning the package to a specific revision or `version` boundary. Since v1.7, dbt manages this out-of-the-box by _locking_ the version/revision of packages in development in order to guarantee predictable builds in production. To learn more, refer to [Predictable package installs](/reference/commands/deps#predictable-package-installs).

</Expandable>
<Expandable alt_header="Maintaining dbt packages" >

If you maintain dbt packages, whether on behalf of your colleagues or members of the open source community, we recommend writing defensive code that checks to verify that other required packages and global macros are available. For example, if your package depends on the availability of a `date_spine` macro in the global `dbt` namespace, you can write:

<File name="models/some_days.sql">

```sql
{% macro a_few_days_in_september() %}

    {% if not dbt.get('date_spine') %}
      {{ exceptions.raise_compiler_error("Expected to find the dbt.date_spine macro, but it could not be found") }}
    {% endif %}

    {{ date_spine("day", "cast('2020-01-01' as date)", "cast('2030-12-31' as date)") }}

{% endmacro %}
```

</File>

</Expandable>
