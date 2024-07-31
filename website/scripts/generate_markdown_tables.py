import json
import requests
import os

# Load the JSON schema from the provided URL
schema_url = "https://schemas.getdbt.com/dbt/manifest/v12.json"
response = requests.get(schema_url)
schema = response.json()

def extract_section(schema, section):
    print(f"Searching for section: {section}")
    if isinstance(schema, dict):
        if section in schema:
            print(f"Found section {section} directly in schema")
            return schema[section]
        if 'properties' in schema:
            for key, value in schema['properties'].items():
                if key == section:
                    print(f"Found section {section} in properties")
                    return value
                if isinstance(value, dict):
                    result = extract_section(value, section)
                    if result:
                        print(f"Found section {section} nested under {key}")
                        return result
    print(f"Section {section} not found")
    return None

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

# Update these paths as per your directory structure
base_path = "/Users/mirnawong/Documents/docs.getdbt.com/website/docs/docs/build/"
sections = {
    'semantic_models': os.path.join(base_path, 'semantic-models.md'),
}

for section, file_path in sections.items():
    section_schema = extract_section(schema['additionalProperties'], section)
    if section_schema:
        print(f"Generating content for section: {section}")
        table_rows = generate_markdown_table(section_schema)
        markdown_table = rows_to_markdown_table(table_rows)
        example_entry = generate_example(section_schema)
        example_json = json.dumps(example_entry, indent=2)
        update_markdown_file(file_path, markdown_table, example_json)
    else:
        print(f"Section '{section}' not found in schema.")

print("Markdown files updated successfully.")
