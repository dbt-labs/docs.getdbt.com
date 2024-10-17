import requests
import re

# URLs of the source files
node_types_url = "https://raw.githubusercontent.com/dbt-labs/dbt-core/main/core/dbt/node_types.py"
resource_types_url = "https://raw.githubusercontent.com/dbt-labs/dbt-core/main/core/dbt/artifacts/resources/types.py"

# Function to fetch and parse the Python files
def fetch_and_parse(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.text

# Fetch the content of the Python files
node_types_content = fetch_and_parse(node_types_url)
resource_types_content = fetch_and_parse(resource_types_url)

# Extract resource types from the node_types.py file
node_types_lines = node_types_content.split('\n')
node_types = {}
for line in node_types_lines:
    match = re.search(r'(\w+)\s*=\s*"(\w+)"', line)
    if match:
        node_types[match.group(2)] = {'executable': False, 'refable': False, 'versioned': False}

# Extract resource types from the resource_types.py file
resource_types_lines = resource_types_content.split('\n')
resource_types = {}
for line in resource_types_lines:
    match = re.search(r'(\w+)\s*=\s*"(\w+)"', line)
    if match:
        resource_type = match.group(2)
        resource_types[resource_type] = {'executable': False, 'refable': False, 'versioned': False}

# Define the properties for each resource type
resource_properties = {
    "model": {"executable": True, "refable": True, "versioned": True},
    "analysis": {"executable": True, "refable": False, "versioned": False},
    "test": {"executable": True, "refable": False, "versioned": False},
    "snapshot": {"executable": True, "refable": True, "versioned": False},
    "operation": {"executable": True, "refable": False, "versioned": False},
    "seed": {"executable": True, "refable": True, "versioned": False},
    "rpc": {"executable": True, "refable": False, "versioned": False},
    "sql_operation": {"executable": True, "refable": False, "versioned": False},
    "doc": {"executable": True, "refable": False, "versioned": False},
    "source": {"executable": False, "refable": False, "versioned": False},
    "macro": {"executable": True, "refable": False, "versioned": False},
    "exposure": {"executable": False, "refable": False, "versioned": False},
    "metric": {"executable": False, "refable": False, "versioned": False},
    "group": {"executable": False, "refable": False, "versioned": False},
    "saved_query": {"executable": False, "refable": False, "versioned": False},
    "semantic_model": {"executable": False, "refable": False, "versioned": False},
    "unit_test": {"executable": False, "refable": False, "versioned": False},
    "fixture": {"executable": False, "refable": False, "versioned": False},
}

# Update the properties of resource types based on the definitions
for resource_type in resource_types.keys():
    if resource_type in resource_properties:
        resource_types[resource_type] = resource_properties[resource_type]

# Sort the resource types alphabetically
sorted_resource_types = dict(sorted(resource_types.items()))

# Generate the Markdown table
markdown_table = "| Resource type | Executable | Refable | Versioned |\n"
markdown_table += "|---------------|------------|---------|-----------|\n"
for resource_type, properties in sorted_resource_types.items():
    markdown_table += f"| {resource_type} | {'✅' if properties['executable'] else '❌'} | {'✅' if properties['refable'] else '❌'} | {'✅' if properties['versioned'] else '❌'} |\n"

# Define the file path
file_path = "../docs/reference/about-resources.md"

# Read the existing content of the file
with open(file_path, "r") as file:
    content = file.read()

# Replace the content under the "## Resource types" header
new_content = re.sub(r'(## Resource types\s*\n)(.*?)(\n## )', rf'\1\n{markdown_table}\3', content, flags=re.DOTALL)

# Write the updated content back to the file
with open(file_path, "w") as file:
    file.write(new_content)

print(f"The Markdown table has been added to {file_path} under the '## Resource types' header.")
