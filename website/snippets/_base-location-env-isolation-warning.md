:::note
While you can customize paths with `base_location_root` and `base_location_subpath`, we don't recommend relying on them for environment isolation (such as separating development and production environments). Anyone with repository access can easily modify these configuration values. For true environment isolation, use separate `external_volume` values with infrastructure-level access controls.
:::
