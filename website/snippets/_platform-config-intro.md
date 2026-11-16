This page covers configurations specific to {props.platform}. Use them with settings that apply on every platform, such as `materialized` and `schema`, to control how <Constant name="dbt" /> builds models and other resources on {props.platform}. Those shared settings are documented in [Model configurations](/reference/model-configs).

Most {props.platform} configurations can be set in `dbt_project.yml`, a properties file, or a model's `config()` block.

{props.connectionNote && <p>{props.connectionNote}</p>}

{props.summary && <p>Topics include: {props.summary}</p>}
