"""
This script _should_ be used to update the redirects for moved pages.
Currently, it doesn't work:
1. Run python etc/move_page.py
2. Copy contents from redirects_new to redirects
Expected results:
- git should just pick up the changed lines + the new ones at the bottom
Actual results:
- git is picking up every row as changed, making it hard to see what's new

Additional details:
- I think it's something to do with the encoding
"""

import csv
import re

from_path = "docs/writing-code-in-dbt/macros/"

to_path = "docs/building-a-dbt-project/macros/"

filename = '_redirects'

with open(filename) as tsvfile:
    tsvreader = csv.reader(tsvfile, delimiter="\t")
    lines = list(tsvreader)
    for index, line in enumerate(lines):
        if line[1] == from_path:
            lines[index][2] = to_path
    lines.append([from_path, to_path, '302'])

    writer = csv.writer(open(filename + '_new', 'w', newline='\n', encoding='utf-8'), delimiter="\t", )
    writer.writerows(lines)
