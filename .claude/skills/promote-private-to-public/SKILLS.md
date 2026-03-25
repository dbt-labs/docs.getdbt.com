# Skill: promote-to-public        

  ## When to use this skill                                                                           
   
  Trigger this skill when the user says anything like:                                                
  - "promote my branch to public"                                                                   
  - "push my private branch to docs.getdbt.com"                                                       
  - "open a public PR for my internal branch"
  - "promote [branch-name] to public"                                                                 
                                                    
  ## What this skill does

  Takes work done in this repo (docs-internal) and gets the change onto a branch of the [public docs.getdbt.com repo](https://github.com/dbt-labs/docs.getdbt.com), then either **creates a draft PR** (if [GitHub CLI](https://cli.github.com/) (`gh`) is installed and works) or **prints a GitHub compare URL** so the author can open the PR in the browser. **No extra tools are required** beyond git and a normal GitHub workflow—the compare link is the fully supported path when `gh` is not available.                                                                  
                                                                                                      
  ## Prerequisites
                                                                                                      
  **Always required**
  - **Git** and a clone that can **fetch and push** to both repositories (credentials as usual).
  - **Two remotes** — one for the public docs repo, one for docs-internal. Internal docs often name them `origin` (public) and `private_docs` (private); many clones use **`origin` for docs-internal** and a second remote (for example **`public`**) for docs.getdbt.com. **Do not assume names:** run `git remote -v` and map URLs, or set **`PUBLIC_REMOTE`** / **`PRIVATE_REMOTE`** when running the shell script.

  **Optional (nice to have)**
  - **`gh`** — after a successful push, the shell script tries **`gh pr create --draft`**. If `gh` is missing, not logged in, or the command fails, the script **still succeeds** and shows the **compare URL** (and on macOS / many Linux systems may offer to open it). Set **`PROMOTE_NO_GH=1`** to always skip `gh` and only use the compare URL.
  - **`mktemp`** — used for the PR body file when running `gh` (standard on macOS and Linux).
                                                                                                      
  ## Steps                                          

  ### 1. Confirm readiness

  Run:                                                                                                
  ```bash
  git status --porcelain
  ```                       
  If the output is non-empty, stop and tell the user to commit or stash their changes before continuing.
                                                                                                      
  Confirm the two remotes exist (names may differ — use whatever maps to public vs private):
  ```bash
  git remote -v
  ```
                                                    
  If a remote is missing, ask the user to add it or set `PUBLIC_REMOTE` / `PRIVATE_REMOTE` for the script.
                                                                                                      
  ### 2. Gather inputs
                                                                                                      
  Ask the user:
  - Private branch — which branch to promote? (default: current branch from
  git branch --show-current)                                                                          
  - Public branch name — what to name the branch on the public repo?
  (default: public-<private-branch>)                                                                  
  - Promote type — squash (recommended) or keep full history?                                         
    - Squash: all changes land as one clean commit — use this for most cases
    - Full history: preserves all commits — use when reviewers need the history                       
  - Commit message (squash only) — describe what changed                                              
                                                                                                      
  Show a confirmation summary and ask the user to confirm before proceeding.                          
                                                                                                      
  ### 3. Fetch remotes
   ```bash                                                                             
  git fetch origin current                          
  git fetch private_docs <private-branch>                                                             
   ```
  ### 4a. Squash mode (recommended)                                                                       
                                                    
  Check for an empty diff first:                                                                      
  git diff origin/current...private_docs/<private-branch>
                                                                                                      
  If empty, stop and tell the user there are no differences to promote.                               
                                                                                                      
  If the public branch already exists locally:                                                        
  `git branch -D <public-branch>`
                                                    
  Then:  
  
  ```bash
  git checkout -b <public-branch> origin/current
  git diff origin/current...private_docs/<private-branch> | git apply                                 
  git add -A                                                         
  git commit -m "<commit-message>"                                                                    
  git push -u origin <public-branch>
   ```  
   
  ### 4b. Full history mode                             
   ```bash                                                                                      
  git fetch private_docs <private-branch>
  git checkout -b <public-branch> private_docs/<private-branch>                                       
  git merge origin/current --no-edit                
  git push -u origin <public-branch>
   ```                                                                 
   
  If git merge reports conflicts, stop and tell the user to resolve them                              
  manually, then run:            
  `git push -u origin <public-branch>`
                                                    
  ### 5. Finish the PR on GitHub
                                                                                                      
  After a successful push to the public remote, mirror the shell script (works with or without `gh`):
  - **If `gh` is available:** run **`gh pr create --draft`** with `--repo` from the public remote URL, **`--base current`**, **`--head <public-branch>`**, title (squash: first line of the commit message; full history: e.g. `Promote <branch> from docs-internal`), and a short body about the internal PR follow-up.
  - **If not:** give the compare URL `https://github.com/<owner>/<repo>/compare/<public-branch>?expand=1` and tell the user to set base to **`current`**, create the PR, and use **Draft** if they want—treat this as the normal path, not a failure.
                                                                                                      
  Remind the user to:                                                                                 
  - Finish the PR description and request review before marking the draft ready (if they used Draft)                                                     
  - After the public PR merges: comment on the docs-internal PR with the public PR link, then click Close (do not merge it)                                                         
                                                                                                      
  ## If something goes wrong
                                                                                                      
  - "Working tree has uncommitted changes" — commit or stash, then retry                              
  - "No differences found" — the branch may already be in sync with
  origin/current; double-check the branch name                                                        
  - Merge conflicts (full history mode) — resolve conflicts, git add,
  git commit, then git push -u origin <public-branch> manually                                        
  - Remote not configured — run git remote -v to check; add the missing
  remote with git remote add <name> <url>
  - **Draft PR step failed or no `gh`** — use the printed **compare URL** to open the PR manually. If they expected `gh`, run `which gh` and `gh auth status`, and check for an existing PR on that head branch.
                                                    
  ## Fallback                                                                                            
                                                    
  If you prefer to run this manually without AI assistance:                                           
  `.claude/skills/promote-private-to-public/promote-private-to-public.sh`
                                                                                                      
  Key changes from the original:                    
  - Steps 2–5 are now things Claude does, not instructions to the user                                
  - Added the empty-diff check and existing-branch handling that were in the shell script             
  - Shell script kept as a fallback at the bottom                                                     
  - Fixed the typo (`PUBLIC_RE=` → removed, replaced with cleaner remote-naming handling)             
                                                                                                  
