module.exports = {
  docs: {
    'sources': [
      'sources/introduction',
      'sources/guide',
      'sources/reference'
    ]
  },
  tutorial: {
    'Getting Started': [
      "tutorial/setting-up",
      {
        type: 'category',
        label: 'Create a Project',
        items: [
          "tutorial/create-a-project-dbt-cloud",
          "tutorial/create-a-project-dbt-cli"
        ],
      },
      "tutorial/build-your-first-models",
      "tutorial/test-and-document-your-project",
      "tutorial/deploy-your-project"
    ]
  },
}
