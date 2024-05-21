import os
import requests
import json

# Fetch environment variables
PR_SUMMARY_TOKEN = os.getenv('PR_SUMMARY_TOKEN')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Define headers
github_headers = {
    'Authorization': f'token {PR_SUMMARY_TOKEN}',
    'Accept': 'application/vnd.github.v3+json'
}

openai_headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {OPENAI_API_KEY}'
}

# Function to fetch PR details
def fetch_pr_details(pr_number, repo_owner, repo_name):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/pulls/{pr_number}'
    response = requests.get(url, headers=github_headers)
    return response.json()

# Function to generate summary using OpenAI
def generate_summary(pr_details):
    prompt = f"Summarize the following PR details for documentation: {pr_details}"
    data = {
        "model": "text-davinci-003",
        "prompt": prompt,
        "max_tokens": 150
    }
    response = requests.post("https://api.openai.com/v1/completions", headers=openai_headers, data=json.dumps(data))
    return response.json()['choices'][0]['text']

# Function to post summary as a comment on the issue
def post_summary_to_issue(issue_number, summary, repo_owner, repo_name):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{issue_number}/comments'
    data = {'body': summary}
    response = requests.post(url, headers=github_headers, data=json.dumps(data))
    return response

# Main function
def main():
    # Fetch issue details from the event payload
    with open(os.getenv('GITHUB_EVENT_PATH'), 'r') as f:
        event = json.load(f)
    
    issue_body = event['issue']['body']
    issue_number = event['issue']['number']
    
    # Extract PR number from the issue body
    pr_number = issue_body.split('#')[-1]
    repo_owner = "dbt-labs"
    repo_name = "dbt-core"
    
    # Fetch PR details
    pr_details = fetch_pr_details(pr_number, repo_owner, repo_name)
    
    # Generate summary
    summary = generate_summary(pr_details)
    
    # Post summary as a comment on the issue
    post_summary_to_issue(issue_number, summary, "dbt-labs", "docs.getdbt.com")

if __name__ == "__main__":
    main()
