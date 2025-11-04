:::note
While you can customize paths with `base_location_root` and `base_location_subpath`, we don't recommend you rely on these for environment isolation (such as separating development and production environments). These configuration values can be easily modified by anyone with repository access. For true environment isolation, use separate `EXTERNAL VOLUME`s with infrastructure-level access controls.
:::
