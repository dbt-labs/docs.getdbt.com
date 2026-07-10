---
title: "Troubleshooting"
sidebar_label: "Troubleshooting"
description: "Resolve common DeltaStream adapter issues with function source readiness and file attachments."
---

### Function source readiness

If you encounter "function source is not ready" errors when creating functions:

1. **Automatic Retry**: The adapter automatically retries function creation with exponential backoff
2. **Timeout Configuration**: The default 30-second timeout can be extended if needed for large JAR files
3. **Dependency Order**: Ensure function sources are created before dependent functions
4. **Manual Retry**: If automatic retry fails, wait a few minutes and retry the operation

### File attachment issues

For problems with file attachments in function sources and descriptor sources:

1. **File Paths**: Use `@/path/to/file` syntax for project-relative paths
2. **File Types**:
   - Function sources require `.jar` files
   - Descriptor sources require compiled `.desc` files (not `.proto`)
3. **File Validation**: The adapter validates file existence before attempting attachment
4. **Compilation**: For descriptor sources, ensure protobuf files are compiled:

   ```bash
   protoc --descriptor_set_out=output.desc input.proto
   ```
