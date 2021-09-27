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
        n) number_issues=${OPTARG};;
    esac
done
echo "Owner:" $owner
echo "Repo:" $repo
echo "Project Number:" $project_number
echo "Maximum number of Issues to parse:" $number_issues #can't be more than 100 without pagination

# grab a list of open issues 

gh api graphql -f owner=$owner -f name=$repo -F number=$number_issues -f query='
  query($name: String!, $owner: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    openIssues: issues(states: OPEN,first:$number) {
    	nodes {
            id, 
            title, 
            createdAt,
            author{
                login
            }
    	}
    }
  }
}
  ' > data/open_issues.json

issues=$(jq '.data.repository.openIssues.nodes[] | .id' data/open_issues.json)

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
status_field_value=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name== "Status") |.settings | fromjson.options[] | select(.name=="Triage") |.id' data/project.json | sed -e 's/^"//' -e 's/"$//')
author_field_id=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name == "Issue Author") | .id' data/project.json )

type_field_id=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name == "Type") | .id' data/project.json )
type_issue=$(jq '.data.organization.projectNext.fields.nodes[] | select(.name== "Type") |.settings | fromjson.options[] | select(.name=="Issue") |.id' data/project.json | sed -e 's/^"//' -e 's/"$//')

echo "Project ID:" $project_id
echo "Date field ID:" $date_field_id
echo "Status field ID:" $status_field_id
echo "Status field value:" $status_field_value
echo "Author field value:" $author_field_id
echo "Type field ID:" $type_field_id
echo "Type field value:" $type_issue

for issue_id in $issues
do
    # strip blockquotes from datetime
    issue_datetime=$(jq '.data.repository.openIssues.nodes[] | select(.id == '$issue_id') | .createdAt' data/open_issues.json | sed -e 's/^"//' -e 's/"$//') 
    issue_date=$(gdate -d $issue_datetime +'%Y-%m-%d')

    issue_author=$(jq '.data.repository.openIssues.nodes[] | select(.id == '$issue_id') | .author.login' data/open_issues.json | sed -e 's/^"//' -e 's/"$//' -e 's/^/@/') 

    gh api graphql --header 'GraphQL-Features: projects_next_graphql' -f query='
            mutation($project:ID!, $issue:ID!) {
              addProjectNextItem(input: {projectId: $project, contentId: $issue}) {
                projectNextItem {
                  id
                }
              }
            }' -f project=$project_id -f issue=$issue_id > data/response.json

   
    response_id=$(jq '.data.addProjectNextItem.projectNextItem.id' data/response.json)

    echo "Issue Date:" $issue_date
    echo "Response ID:" $response_id
    echo "Issue Author:" $issue_author

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
                }' -F project=$project_id -F item=$response_id -F status_field=$status_field_id -f status_value=$status_field_value -F date_field=$date_field_id -f date_value=$issue_date -F author_field=$author_field_id -f author_value=$issue_author -F type_field=$type_field_id -f type_value=$type_issue
          
done