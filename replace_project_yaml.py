import os
import re

config_keys = [
    'materialized',
    'sql_header',
    'enabled',
    'tags',
    'pre-hook',
    'post-hook',
    'database',
    'schema',
    'alias',
    'quote_columns',
    'column_types',
    'target_schema',
    'target_database',
    'unique_key',
    'strategy',
    'updated_at',
    'check_cols',
    'labels',
    'encrypted',
    'sort',
    'dist',
    'bind',
    'sort_type',
    'transient',
    'incremental_strategy',
    'cluster_by',
    'automatic_clustering',
    'secure',
    'persist_docs'
]

def fixPath(path):
    with open(path) as fh:
        contents = fh.read()

    print(f"Found dbt_project.yml in {path}")

    for config in config_keys:
        # Do it once for the non-hyperlinked version, e.g. `schema`
        regex = '''(?<=<File name='dbt_project.yml'>)(.*)(''' + config + ''')(.*)(?=<\/File>)'''
        out = re.sub(regex, '+' + config, contents, flags=re.S)

        # and then again for the hyperlinked version, e.g. `[schema](schema)`
        regex = '''(?<=<File name='dbt_project.yml'>)(.*)(\[''' + config + ''')(.*)(?=<\/File>)'''
        out = re.sub(regex, '+[' + config, contents, flags=re.S)

    with open(path, 'w') as fh:
        fh.write(out)

fixPath('test.md')

# rootDir = '.'
# for dirName, subdirList, fileList in os.walk(rootDir):
#     for fname in fileList:
#         if not fname.endswith('.md'):
#             continue
#
#         path = os.path.join(dirName, fname)
#         fixPath(path)
