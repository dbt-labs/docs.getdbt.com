import os
import json
import requests
import yaml
from jsonschema import validate, ValidationError

# Define the URL of the latest schema
SCHEMA_URL = "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/schema.json"

# Fetch the latest schema
def fetch_schema():
    response = requests.get(SCHEMA_URL)
    response.raise_for_status()
    return response.json()

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
            patch = file['patch']
            # Extract the actual YAML code from the patch
            yaml_snippet = "\n".join(line[1:] for line in patch.split('\n') if line.startswith('+') and not line.startswith('+++'))
            snippets.append((file['filename'], yaml_snippet))
    return snippets

# Validate each snippet against the schema
def validate_snippets(snippets, schema):
    results = []
    for filename, snippet in snippets:
        try:
            data = yaml.safe_load(snippet)
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

    # Fetch schema and code snippets
    schema = fetch_schema()
    snippets = fetch_code_snippets(pr_number, repo_owner, repo_name)
    
    # Validate snippets
    results = validate_snippets(snippets, schema)
    
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
