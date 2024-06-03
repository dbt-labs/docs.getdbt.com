import os
import json
import requests
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
            snippets.append(file['patch'])  # Simplified: In reality, you may need to extract the actual YAML code
    return snippets

# Validate each snippet against the schema
def validate_snippets(snippets, schema):
    results = []
    for snippet in snippets:
        try:
            data = json.loads(snippet)
            validate(instance=data, schema=schema)
            results.append((snippet, "Valid"))
        except ValidationError as e:
            results.append((snippet, f"Invalid: {e.message}"))
        except json.JSONDecodeError as e:
            results.append((snippet, f"Invalid JSON: {e.msg}"))
    return results

# Main function
def main():
    repo_owner = "dbt-labs"
    repo_name = "docs.getdbt.com"
    pr_number = os.getenv('GITHUB_EVENT_PULL_REQUEST_NUMBER')

    # Fetch schema and code snippets
    schema = fetch_schema()
    snippets = fetch_code_snippets(pr_number, repo_owner, repo_name)
    
    # Validate snippets
    results = validate_snippets(snippets, schema)
    
    # Print results
    for snippet, result in results:
        print(f"Snippet: {snippet}\nResult: {result}\n")

if __name__ == "__main__":
    main()
