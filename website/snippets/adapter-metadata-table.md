<table>
  <thead>
    <tr>
      <th>Attribute</th><th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Maintained by</strong></td>
      <td><p>{frontMatter.meta.maintained_by}</p></td>
    </tr>
    <tr>
      <td><strong>Authors</strong></td>
      <td><p>{frontMatter.meta.authors}</p></td>
    </tr>
    <tr>
      <td><strong>Github Repo</strong></td>
      <td><p><a href={frontMatter.meta.github_repo}>{frontMatter.meta.link_text}</a></p></td>
    </tr>
    <tr>
      <td><strong>Supported dbt Core version</strong></td>
      <td><p>{frontMatter.meta.core_version}</p></td>
    </tr>
      <tr><td><strong>dbt Cloud support</strong></td>
      <td><p>{frontMatter.meta.cloud_support}</p></td>
    </tr>
    <tr>
      <td><strong>Supported data platform version</strong></td>
      <td><p>{frontMatter.meta.supported_version}</p></td>
    </tr>
  </tbody>
</table>