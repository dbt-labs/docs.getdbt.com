import os
import json
import requests
import yaml
from jsonschema import validate, ValidationError
import re

SCHEMA_URLS = {
    "dbt_project": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dbt_project-latest.json",
    "dbt_cloud": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dbt_cloud-latest.json",
    "dbt_yml": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dbt_yml_files-latest.json",
    "dependencies": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/dependencies-latest.json",
    "packages": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/packages-latest.json",
    "selectors": "https://raw.githubusercontent.com/dbt-labs/dbt-jsonschema/main/schemas/latest/selectors-latest.json",
}

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

def fetch_code_snippets(pr_number, repo_owner, repo_name):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/pulls/{pr_number}/files'
    headers = {'Authorization': f'token {os.getenv("GITHUB_TOKEN")}'}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    files = response.json()

    snippets = []
    for file in files:
        if file['filename'].endswith('.md'):
            patch = file['patch']
            yaml_snippets = re.findall(r'```(yaml|yml)\n(.*?)```', patch, re.DOTALL)
            for snippet in yaml_snippets:
                cleaned_snippet = "\n".join(line[1:] if line.startswith(('+', '-')) else line for line in snippet[1].split('\n'))
                snippets.append((file['filename'], cleaned_snippet))
    return snippets

def identify_schema(snippet):
    if "dbt_project" in snippet:
        return "dbt_project"
    elif "dbt_cloud" in snippet:
        return "dbt_cloud"
    elif "dependencies" in snippet:
        return "dependencies"
    elif "packages" in snippet:
        return "packages"
    elif "selectors" in snippet:
        return "selectors"
    return "dbt_yml"

def validate_snippets(snippets, schemas):
    results = []
    for filename, snippet in snippets:
        try:
            data = yaml.safe_load(snippet)
            schema_name = identify_schema(snippet)
            schema = schemas.get(schema_name)
            if schema:
                validate(instance=data, schema=schema)
                results.append((filename, snippet, "Valid"))
            else:
                results.append((filename, snippet, "Unknown schema type"))
        except ValidationError as e:
            results.append((filename, snippet, f"Invalid: {e.message}"))
        except yaml.YAMLError as e:
            results.append((filename, snippet, f"Invalid YAML: {str(e)}"))
    return results

def main():
    repo_owner = "dbt-labs"
    repo_name = "docs.getdbt.com"

    with open(os.getenv('GITHUB_EVENT_PATH'), 'r') as f:
        event = json.load(f)

    pr_number = event['pull_request']['number']

    schemas = fetch_schemas()
    snippets = fetch_code_snippets(pr_number, repo_owner, repo_name)

    results = validate_snippets(snippets, schemas)

    with open('website/validation_results.txt', 'w') as f:
        for filename, snippet, result in results:
            f.write(f"File: {filename}\nSnippet:\n{snippet}\nResult: {result}\n\n")

    if any("Invalid" in result for _, _, result in results):
        exit(1)

if __name__ == "__main__":
    main()
