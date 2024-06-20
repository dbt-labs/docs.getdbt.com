import requests
import ast

# URLs of the Python files in the dbt core repository
resources_url = "https://raw.githubusercontent.com/dbt-labs/dbt-core/main/core/dbt/artifacts/resources/types.py"
node_types_url = "https://raw.githubusercontent.com/dbt-labs/dbt-core/main/core/dbt/node_types.py"

# Fetch the content of the files
resources_response = requests.get(resources_url)
node_types_response = requests.get(node_types_url)

# Parse the content of the files
resources_tree = ast.parse(resources_response.text)
node_types_tree = ast.parse(node_types_response.text)

def extract_resource_types(tree):
    resource_types = {}
    for node in tree.body:
        if isinstance(node, ast.ClassDef) and node.name == "NodeType":
            for item in node.body:
                if isinstance(item, ast.Assign):
                    for target in item.targets:
                        if isinstance(target, ast.Name) and isinstance(item.value, ast.Constant):
                            resource_types[target.id.lower()] = item.value.value.lower()
    return resource_types

def extract_node_type_lists(tree):
    executable_nodes = []
    refable_nodes = []
    versioned_nodes = []
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    if target.id == "EXECUTABLE_NODE_TYPES":
                        executable_nodes = [elt.attr for elt in node.value.elts if isinstance(elt, ast.Attribute)]
                    elif target.id == "REFABLE_NODE_TYPES":
                        refable_nodes = [elt.attr for elt in node.value.elts if isinstance(elt, ast.Attribute)]
                    elif target.id == "VERSIONED_NODE_TYPES":
                        versioned_nodes = [elt.attr for elt in node.value.elts if isinstance(elt, ast.Attribute)]
    # Print debug information
    print("Raw Executable Nodes:", executable_nodes)
    print("Raw Refable Nodes:", refable_nodes)
    print("Raw Versioned Nodes:", versioned_nodes)
    
    return executable_nodes, refable_nodes, versioned_nodes

# Extract resource types and node types
resource_types = extract_resource_types(resources_tree)
executable_nodes, refable_nodes, versioned_nodes = extract_node_type_lists(node_types_tree)

# Create a dictionary for node types
node_types = {}
for node_type in resource_types.values():
    node_types[node_type] = {
        "executable": node_type in executable_nodes,
        "ref": node_type in refable_nodes,
        "versioned": node_type in versioned_nodes
    }

# Debugging output
print("Resource Types:", resource_types)
print("Executable Nodes:", executable_nodes)
print("Refable Nodes:", refable_nodes)
print("Versioned Nodes:", versioned_nodes)
print("Node Types:", node_types)

# Generate the markdown content
def generate_markdown(resource_types, node_types):
    markdown_content = "## Resource types\n\n"
    markdown_content += "| Node | Executed in DAG | Exists in database | Created by execution | Upstream lineage | Downstream lineage | Versioned/Refable/Executable |\n"
    markdown_content += "|:----:|:---------------:|:------------------:|:--------------------:|:----------------:|:------------------:|:-----------------------------:|\n"

    for resource, value in resource_types.items():
        executed = "✅" if node_types.get(value, {}).get('executable', False) else ""
        exists = "✅" if value in ["source", "snapshot", "model", "seed", "export"] else ""
        created = "✅" if value in ["snapshot", "model", "seed"] else ""
        upstream = "←" if value in ["snapshot", "model", "seed", "analysis", "semantic_model", "metric", "saved_query", "exposure", "test", "unit", "fixture"] else ""
        downstream = "→" if value in ["source", "snapshot", "model", "seed", "semantic_model", "metric", "fixture", "group"] else ""
        versioned_ref_exec = []
        if node_types.get(value, {}).get('versioned', False):
            versioned_ref_exec.append("Versioned")
        if node_types.get(value, {}).get('ref', False):
            versioned_ref_exec.append("Refable")
        if node_types.get(value, {}).get('executable', False):
            versioned_ref_exec.append("Executable")
        versioned_ref_exec_str = ", ".join(versioned_ref_exec)
        markdown_content += f"| {value} | {executed} | {exists} | {created} | {upstream} | {downstream} | {versioned_ref_exec_str} |\n"

    return markdown_content

# Generate the markdown table content
markdown_table_content = generate_markdown(resource_types, node_types)

# Read the existing content of the markdown file
file_path = "../docs/reference/about-resources.md"
with open(file_path, "r") as file:
    content = file.read()

# Insert the markdown table content under the specified header
header = "## Resource types"
if header in content:
    header_index = content.index(header) + len(header)
    content = content[:header_index] + f"\n\n{markdown_table_content}" + content[header_index:]
else:
    content += f"\n{header}\n\n{markdown_table_content}"

# Write the updated content back to the markdown file
with open(file_path, "w") as file:
    file.write(content)

print(f"Updated {file_path} with the new resource types table.")
