import os
import json
import requests
import yaml
from jsonschema import validate, ValidationError

# Define the URLs of the schemas
SCHEMA_URLS = {
    "dbt_project": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dbt_project-latest.json",
    "dbt_cloud": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dbt_cloud-latest.json",
    "dbt_yml": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dbt_yml_files-latest.json",
    "dependencies": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dependencies-latest.json",
    "packages": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/packages-latest.json",
    "selectors": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/selectors-latest.json",
}

# Fetch schemas
def fetch_schemas():
    schemas = {}
    for name, url in SCHEMA_URLS.items():
        response = requests.get(url)
        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError as e:
            print(f"Failed to fetch schema {name}: {e}")
            print(f"Response: {response.text}")
            raise
        schemas[name] = response.json()
    return schemas

# Fetch code snippets from the PR
def fetch_code_snippets(pr_number, repo_owner, repo_name):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/pulls/{pr_number}/files'
    headers = {'Authorization': f'token {os.getenv("SNIPPET_VALIDATION")}'}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    files = response.json()
    
    snippets = []
    for file in files:
        if file['filename'].endswith('.yml') or file['filename'].endswith('.yaml'):
            if file['filename'].startswith('.github/workflows'):
                continue
            patch = file['patch']
            # Extract the actual YAML code from the patch
            yaml_snippet = "\n".join(line[1:] for line in patch.split('\n') if line.startswith('+') and not line.startswith('+++'))
            snippets.append((file['filename'], yaml_snippet))
    return snippets

# Validate each snippet against the schemas
def validate_snippets(snippets, schemas):
    results = []
    for filename, snippet in snippets:
        try:
            data = yaml.safe_load(snippet)
            if "dbt_project.yml" in filename:
                schema = schemas["dbt_project"]
            elif "dbt_cloud" in filename:
                schema = schemas["dbt_cloud"]
            elif "dbt_yml" in filename:
                schema = schemas["dbt_yml"]
            elif "dependencies" in filename:
                schema = schemas["dependencies"]
            elif "packages" in filename:
                schema = schemas["packages"]
            elif "selectors" in filename:
                schema = schemas["selectors"]
            else:
                continue  # Skip if no matching schema found
            validate(instance=data, schema=schema)
            results.append((filename, snippet, "Valid"))
        except ValidationError as e:
            results.append((filename, snippet, f"Invalid: {e.message}"))
        except yaml.YAMLError as e:
            results.append((filename, snippet, f"Invalid YAML: {str(e)}"))
    return results

# Main function
def main():
    repo_owner = "dbt-labs"
    repo_name = "docs.getdbt.com"

    # Load event data
    with open(os.getenv('GITHUB_EVENT_PATH'), 'r') as f:
        event = json.load(f)
    
    pr_number = event['pull_request']['number']

    # Fetch schemas and code snippets
    schemas = fetch_schemas()
    snippets = fetch_code_snippets(pr_number, repo_owner, repo_name)
    
    # Validate snippets
    results = validate_snippets(snippets, schemas)
    
    # Write results to a file and print them
    with open('website/validation_results.txt', 'w') as f:
        for filename, snippet, result in results:
            f.write(f"File: {filename}\nSnippet:\n{snippet}\nResult: {result}\n\n")
            print(f"File: {filename}\nSnippet:\n{snippet}\nResult: {result}\n\n")

    # Check if there are any invalid snippets
    if any("Invalid" in result for _, _, result in results):
        exit(1)

if __name__ == "__main__":
    main()
