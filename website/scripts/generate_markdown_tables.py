import json
import os

# Define the schema section for semantic_models
semantic_models_schema = json.loads ("""
{
    "semantic_models": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "model"
        ],
        "properties": {
          "name": {
            "type": "string",
            "pattern": "(?!.*__).*^[a-z][a-z0-9_]*[a-z0-9]$"
          },
          "description": {
            "type": "string"
          },
          "defaults": {
            "type": "object",
            "properties": {
              "agg_time_dimension": {
                "type": "string"
              }
            },
            "additionalProperties": false
          },
          "dimensions": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/dimension"
            }
          },
          "entities": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/entity"
            }
          },
          "measures": {
            "type": "array",
            "items": {
              "$ref": "#/$defs/measure"
            }
          },
          "model": {
            "type": "string",
            "default": "ref('')"
          },
          "primary_entity": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    }
}

""")

def generate_markdown_table(schema_section, parent_key=''):
    rows = []
    if 'properties' in schema_section:
        for key, value in schema_section['properties'].items():
            full_key = f"{parent_key}.{key}" if parent_key else key
            description = value.get('description', 'No description')
            value_type = value.get('type', 'No type specified')
            rows.append([full_key, value_type, description])
            if value_type == 'object' and 'properties' in value:
                rows.extend(generate_markdown_table(value, full_key))
    return rows

def rows_to_markdown_table(rows):
    if not rows:
        return "No parameters available."
    markdown = "| Parameter | Type | Description |\n"
    markdown += "|-----------|------|-------------|\n"
    for row in rows:
        markdown += f"| {row[0]} | {row[1]} | {row[2]} |\n"
    return markdown

def generate_example(schema_section):
    example = {}
    if 'properties' in schema_section:
        for key, value in schema_section['properties'].items():
            if 'default' in value:
                example[key] = value['default']
            elif value.get('type') == 'object' and 'properties' in value:
                example[key] = generate_example(value)
            else:
                example[key] = f"Example {key}"
    return example

def update_markdown_file(file_path, table, example):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r') as file:
        content = file.read()

    start_marker = '<!-- start generated content -->'
    end_marker = '<!-- end generated content -->'

    new_content = f"\n{table}\n\n### Example\n```json\n{example}\n```\n"

    if start_marker in content and end_marker in content:
        start_index = content.find(start_marker) + len(start_marker)
        end_index = content.find(end_marker)
        updated_content = content[:start_index] + new_content + content[end_index:]
    else:
        updated_content = content + "\n\n" + new_content

    with open(file_path, 'w') as file:
        file.write(updated_content)

# Define the file path for the markdown file
file_path = "/Users/mirnawong/Documents/docs.getdbt.com/website/docs/docs/build/semantic-models.md"

# Use the directly provided schema section
section_schema = semantic_models_schema.get('semantic_models').get('items')
if section_schema:
    print("Generating content for semantic_models")
    table_rows = generate_markdown_table(section_schema)
    markdown_table = rows_to_markdown_table(table_rows)
    example_entry = generate_example(section_schema)
    example_json = json.dumps(example_entry, indent=2)
    update_markdown_file(file_path, markdown_table, example_json)
else:
    print("Section 'semantic_models' not found in schema.")

print("Markdown files updated successfully.")
