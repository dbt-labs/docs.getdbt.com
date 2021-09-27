#!/bin/bash

# depends on jq coreutils and gh from homebrew 

# set input flags. Usage: 
# -o 'ownername'
# -r 'reponame'
# -p 12
# -n 100


while getopts o:r:p:n: flag
do
    case "${flag}" in
        o) owner=${OPTARG};;
        r) repo=${OPTARG};;
        p) project_number=${OPTARG};;
        n) number_prs=${OPTARG};;
    esac
done
echo "Owner:" $owner
echo "Repo:" $repo
echo "Project Number:" $project_number
echo "Maximum number of PRs to parse:" $number_prs #can't be more than 100 without pagination

# grab a list of open issues 

gh api graphql -f owner=$owner -f name=$repo -F number=$number_prs -f query='
  query($name: String!, $owner: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
     pullRequests: pullRequests(states: OPEN, first:$number) {
    	nodes {
            id, 
            title, 
            createdAt,
        	isDraft,
        	reviewDecision,
            author{
                login
            }
    	}
    }
  }
}' > data/open_prs.json


prs=$(jq '.data.repository.pullRequests.nodes[] | .id' data/open_prs.json)

# grab project information

gh api graphql --header 'GraphQL-Features: projects_next_graphql' -f query='
            query($org: String!, $number: Int!) {
              organization(login: $org){
                projectNext(number: $number) {
                  id
                  fields(first:20) {
                    nodes {
                      id
                      name
                      settings
                    }
                  }
                }
              }
            }' -f org=$owner -F number=$project_number > data/project.json

project_id=$(jq '.data.organization.projectNext.id' data/project.json)
date_field_id=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name == "Date") | .id' data/project.json)
status_field_id=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name == "Status") | .id' data/project.json)
status_field_dr=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name== "Status") |.settings | fromjson.options[] | select(.name=="Drafts") |.id' data/project.json | sed -e 's/^"//' -e 's/"$//')
status_field_ar=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name== "Status") |.settings | fromjson.options[] | select(.name=="Awaiting Review") |.id' data/project.json | sed -e 's/^"//' -e 's/"$//')
status_field_nm=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name== "Status") |.settings | fromjson.options[] | select(.name=="Ready to Merge") |.id' data/project.json | sed -e 's/^"//' -e 's/"$//')
status_field_ip=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name== "Status") |.settings | fromjson.options[] | select(.name=="In Progress") |.id' data/project.json | sed -e 's/^"//' -e 's/"$//')

author_field_id=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name == "Issue Author") | .id' data/project.json )

type_field_id=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name == "Type") | .id' data/project.json )
type_pr=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name== "Type") |.settings | fromjson.options[] | select(.name=="PR") |.id' data/project.json | sed -e 's/^"//' -e 's/"$//')

echo "Project ID:" $project_id
echo "Date field ID:" $date_field_id
echo "Status field ID:" $status_field_id
echo "Status field drafts ID:" $status_field_dr 
echo "Status field awaiting review ID:" $status_field_ar
echo "Status field ready to merge ID:" $status_field_nm
echo "Author field value:" $author_field_id
echo "Type field ID:" $type_field_id
echo "Type field value:" $type_pr

for pr_id in $prs
do
    # strip blockquotes from datetime
    pr_datetime=$(jq '.data.repository.pullRequests.nodes[] | select(.id == '$pr_id') | .createdAt' data/open_prs.json | sed -e 's/^"//' -e 's/"$//') 
    pr_date=$(gdate -d $pr_datetime +'%Y-%m-%d')

    pr_author=$(jq '.data.repository.pullRequests.nodes[] | select(.id == '$pr_id') | .author.login' data/open_prs.json | sed -e 's/^"//' -e 's/"$//' -e 's/^/@/') 
    pr_isDraft=$(jq '.data.repository.pullRequests.nodes[] | select(.id == '$pr_id') | .isDraft' data/open_prs.json) 
    pr_reviewDecision=$(jq '.data.repository.pullRequests.nodes[] | select(.id == '$pr_id') | .reviewDecision' data/open_prs.json | sed -e 's/^"//' -e 's/"$//') 


    gh api graphql --header 'GraphQL-Features: projects_next_graphql' -f query='
            mutation($project:ID!, $pr:ID!) {
              addProjectNextItem(input: {projectId: $project, contentId: $pr}) {
                projectNextItem {
                  id
                }
              }
            }' -f project=$project_id -f pr=$pr_id > data/response.json

   
    response_id=$(jq '.data.addProjectNextItem.projectNextItem.id' data/response.json)

    echo "PR Date:" $pr_date
    echo "Response ID:" $response_id
    echo "PR Author:" $pr_author
    echo "PR Draft?" $pr_isDraft 
    echo "PR Review Decision:" $pr_reviewDecision
    
    status_field_value=""

    if [ $pr_isDraft = "true" ]
    then 
        status_field_value=$status_field_dr
    elif [ $pr_reviewDecision = "APPROVED" ] 
    then 
        status_field_value=$status_field_nm
    elif [ $pr_reviewDecision = "CHANGES_REQUESTED" ] 
    then 
        status_field_value=$status_field_ip
    else
        status_field_value=$status_field_ar
    fi

    echo $status_field_value


    gh api graphql --header 'GraphQL-Features: projects_next_graphql' -f query='
            mutation (
                $project: ID!
                $item: ID!
                $status_field: ID!
                $status_value: String!
                $date_field: ID!
                $date_value: String!
                $author_field: ID!
                $author_value: String!
                $type_field: ID!
                $type_value: String!
                ) {
                    set_status: updateProjectNextItemField(input: {
                        projectId: $project
                        itemId: $item
                        fieldId: $status_field
                        value: $status_value
                    }) {
                        projectNextItem {
                        id
                        }
                    }
                    set_date_posted: updateProjectNextItemField(input: {
                        projectId: $project
                        itemId: $item
                        fieldId: $date_field
                        value: $date_value
                    }) {
                        projectNextItem {
                        id
                        }
                    }
                    set_author: updateProjectNextItemField(input: {
                        projectId: $project
                        itemId: $item
                        fieldId: $author_field
                        value: $author_value
                    }) {
                        projectNextItem {
                        id
                        }
                    }
                    set_type: updateProjectNextItemField(input: {
                        projectId: $project
                        itemId: $item
                        fieldId: $type_field
                        value: $type_value
                    }) {
                        projectNextItem {
                        id
                        }
                    }
                }' -F project=$project_id -F item=$response_id -F status_field=$status_field_id -f status_value=$status_field_value -F date_field=$date_field_id -f date_value=$pr_date -F author_field=$author_field_id -f author_value=$pr_author -F type_field=$type_field_id -f type_value=$type_pr
          
done