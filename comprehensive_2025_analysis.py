#!/usr/bin/env python3
"""
Comprehensive 2025 analysis of docs.getdbt.com repository
"""

import sys
import os
import requests
import re
from collections import defaultdict, Counter

# Docs team members to exclude
DOCS_TEAM = [
    "mirnawong1",
    "matthewshaver", 
    "nataliefiann",
    "runleonarun",
    "luna-bianca"
]

def get_all_commits_2025(token, repo="dbt-labs/docs.getdbt.com"):
    """Get all commits in 2025"""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    url = f"https://api.github.com/repos/{repo}/commits"
    params = {
        "since": "2025-01-01T00:00:00Z",
        "per_page": 100
    }
    
    all_commits = []
    page = 1
    
    print("Fetching all commits from 2025...", file=sys.stderr)
    
    while True:
        params["page"] = page
        print(f"  Fetching commit page {page}...", file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code != 200:
            print(f"Error fetching commits: {response.status_code}", file=sys.stderr)
            break
        
        commits = response.json()
        if not commits:
            break
        
        all_commits.extend(commits)
        page += 1
        
        print(f"    Got {len(commits)} commits (total: {len(all_commits)})", file=sys.stderr)
        
        # Limit to prevent too many requests
        if len(all_commits) >= 3000:
            print("    Reached 3000 commits limit", file=sys.stderr)
            break
    
    return all_commits

def get_commit_details(token, repo, sha):
    """Get detailed commit information including file changes"""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    url = f"https://api.github.com/repos/{repo}/commits/{sha}"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return None
    
    return response.json()

def count_words_and_code_blocks(patch):
    """Count words added and code blocks in a patch"""
    if not patch:
        return 0, 0
    
    lines = patch.split('\n')
    words_added = 0
    code_blocks_added = 0
    
    for line in lines:
        if line.startswith('+') and not line.startswith('+++'):
            # Count words in added lines
            # Remove the + prefix
            content = line[1:]
            # Count code fence markers
            if '```' in content:
                code_blocks_added += content.count('```') // 2
            # Count words (excluding markdown/code syntax)
            words = len(re.findall(r'\b\w+\b', content))
            words_added += words
    
    return words_added, code_blocks_added

def get_current_file_content(token, repo, path):
    """Get current content of a file to count words"""
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    
    url = f"https://api.github.com/repos/{repo}/contents/{path}"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return None
    
    data = response.json()
    if data.get("encoding") == "base64":
        import base64
        content = base64.b64decode(data["content"]).decode('utf-8', errors='ignore')
        return content
    
    return None

def count_words_in_content(content):
    """Count words in markdown content"""
    if not content:
        return 0
    
    # Remove code blocks
    content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    # Remove HTML tags
    content = re.sub(r'<[^>]+>', '', content)
    # Count words
    words = len(re.findall(r'\b\w+\b', content))
    return words

def main():
    token = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("GITHUB_TOKEN")
    
    if not token:
        print("Error: GitHub token required.")
        sys.exit(1)
    
    repo = "dbt-labs/docs.getdbt.com"
    
    # Get all commits
    commits = get_all_commits_2025(token, repo)
    
    print(f"\n\nAnalyzing {len(commits)} commits...\n", file=sys.stderr)
    
    # Track statistics by author
    author_stats = defaultdict(lambda: {
        "commits": 0,
        "words_added": 0,
        "code_blocks_added": 0,
        "files_modified": set(),
        "new_files": []
    })
    
    all_files_modified = set()
    total_new_files = []
    
    for i, commit in enumerate(commits, 1):
        author = commit.get("author", {}).get("login") if commit.get("author") else commit.get("commit", {}).get("author", {}).get("name", "Unknown")
        
        if i % 50 == 0:
            print(f"  [{i}/{len(commits)}] Processing commits...", file=sys.stderr)
        
        # Get commit details (limit to avoid rate limiting)
        if i <= 500:  # Only get details for first 500 commits to avoid rate limits
            details = get_commit_details(token, repo, commit["sha"])
            
            if details and details.get("files"):
                author_stats[author]["commits"] += 1
                
                for file_info in details["files"]:
                    filename = file_info["filename"]
                    
                    # Only count documentation files
                    if filename.endswith(('.md', '.mdx')):
                        all_files_modified.add(filename)
                        author_stats[author]["files_modified"].add(filename)
                        
                        # Track new files
                        if file_info.get("status") == "added":
                            total_new_files.append(filename)
                            author_stats[author]["new_files"].append(filename)
                        
                        # Count words and code blocks from patch
                        patch = file_info.get("patch", "")
                        words, code_blocks = count_words_and_code_blocks(patch)
                        author_stats[author]["words_added"] += words
                        author_stats[author]["code_blocks_added"] += code_blocks
        else:
            # For commits beyond 500, just count commit
            author_stats[author]["commits"] += 1
    
    # Separate external and docs team
    external_contributors = {}
    docs_team_stats = {}
    
    for author, stats in author_stats.items():
        if author and author.lower() in [m.lower() for m in DOCS_TEAM]:
            docs_team_stats[author] = stats
        else:
            external_contributors[author] = stats
    
    # Get longest pages in 2025
    print("\n\nFinding longest pages...", file=sys.stderr)
    longest_pages = []
    
    for filename in list(all_files_modified)[:100]:  # Sample first 100 to avoid too many API calls
        if filename.startswith('website/docs/'):
            content = get_current_file_content(token, repo, filename)
            if content:
                word_count = count_words_in_content(content)
                longest_pages.append({
                    "filename": filename,
                    "word_count": word_count
                })
    
    longest_pages.sort(key=lambda x: x["word_count"], reverse=True)
    
    # Calculate totals
    total_commits = len(commits)
    total_words = sum(s["words_added"] for s in author_stats.values())
    total_new_pages = len(set(total_new_files))
    
    # Print results
    print("\n" + "="*70)
    print("2025 COMPREHENSIVE REPOSITORY ANALYSIS")
    print("="*70)
    
    print(f"\n{'='*70}")
    print("TOP EXTERNAL CONTRIBUTORS (outside docs team)")
    print(f"{'='*70}\n")
    
    # Sort by commits
    sorted_external = sorted(external_contributors.items(), 
                            key=lambda x: x[1]["commits"], 
                            reverse=True)
    
    for i, (author, stats) in enumerate(sorted_external[:10], 1):
        print(f"{i}. {author}")
        print(f"   Commits: {stats['commits']}")
        print(f"   Words added: {stats['words_added']:,}")
        print(f"   Code blocks added: {stats['code_blocks_added']}")
        print(f"   Files modified: {len(stats['files_modified'])}")
        print()
    
    print(f"{'='*70}")
    print("TOP 3: MOST WORDS CONTRIBUTED")
    print(f"{'='*70}\n")
    
    sorted_by_words = sorted(author_stats.items(), 
                             key=lambda x: x[1]["words_added"], 
                             reverse=True)
    
    for i, (author, stats) in enumerate(sorted_by_words[:3], 1):
        team_label = " (Docs Team)" if author.lower() in [m.lower() for m in DOCS_TEAM] else ""
        print(f"{i}. {author}{team_label}")
        print(f"   Words added: {stats['words_added']:,}")
        print()
    
    print(f"{'='*70}")
    print("TOP 3: MOST CODE BLOCKS ADDED")
    print(f"{'='*70}\n")
    
    sorted_by_code = sorted(author_stats.items(), 
                            key=lambda x: x[1]["code_blocks_added"], 
                            reverse=True)
    
    for i, (author, stats) in enumerate(sorted_by_code[:3], 1):
        team_label = " (Docs Team)" if author.lower() in [m.lower() for m in DOCS_TEAM] else ""
        print(f"{i}. {author}{team_label}")
        print(f"   Code blocks added: {stats['code_blocks_added']}")
        print()
    
    print(f"{'='*70}")
    print("TOP 3: MOST FILES MODIFIED")
    print(f"{'='*70}\n")
    
    sorted_by_files = sorted(author_stats.items(), 
                             key=lambda x: len(x[1]["files_modified"]), 
                             reverse=True)
    
    for i, (author, stats) in enumerate(sorted_by_files[:3], 1):
        team_label = " (Docs Team)" if author.lower() in [m.lower() for m in DOCS_TEAM] else ""
        print(f"{i}. {author}{team_label}")
        print(f"   Files modified: {len(stats['files_modified'])}")
        print()
    
    print(f"{'='*70}")
    print("TOP 3: LONGEST PAGES (by word count)")
    print(f"{'='*70}\n")
    
    for i, page in enumerate(longest_pages[:3], 1):
        print(f"{i}. {page['filename']}")
        print(f"   Word count: {page['word_count']:,}")
        print()
    
    print(f"{'='*70}")
    print("OVERALL 2025 STATISTICS")
    print(f"{'='*70}\n")
    
    print(f"Total commits: {total_commits:,}")
    print(f"Total words added (estimated): {total_words:,}")
    print(f"Total new pages: {total_new_pages}")
    print(f"Total unique files modified: {len(all_files_modified)}")
    print(f"Total contributors: {len(author_stats)}")
    print(f"  - Docs team: {len(docs_team_stats)}")
    print(f"  - External: {len(external_contributors)}")
    
    print(f"\n{'='*70}")

if __name__ == "__main__":
    main()

