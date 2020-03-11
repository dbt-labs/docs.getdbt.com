
import os
import re
from fix_blocks import fix_blocks

output_path = '../docs/docs/'

def get_slug(contents):
    matches = re.search('id: (.*)', contents)
    if not matches:
        raise RuntimeError("no slug")
    return matches.groups()[0].replace('"', '').strip()

def slugify(s):
    return s.lower().replace(" ", '-').replace(".", '-')

def get_path(path, slug):
    paths = path.split("/")[2:]
    fname = paths.pop().replace('.md', '') # get rid of the filename
    path_parts = [slugify(p) for p in paths]

    #if slug == path_parts[-1]:
    #    return "/".join(path_parts) + '.md'
    #else:
    #    return "/".join(path_parts) + '/' + slug + '.md'
    return "-".join(path_parts) + '-' + slug + '.md'

def emit(contents, path):
    dest = os.path.join(output_path, path)
    dirname = os.path.dirname(dest)
    if not os.path.exists(dirname):
        os.makedirs(dirname)

    existing = None
    if os.path.exists(dest):
        with open(dest, 'r') as fh:
            existing = fh.read()

    if existing != contents:
        with open(dest, 'w') as fh:
            print(f"writing to {dest}")
            fh.write(contents)
    else:
        print(f"NOT writing to {dest}")

def convert(path):
    print(f"converting {path}")
    with open(path) as fh:
        contents = fh.read()

    fixed = fix_blocks(contents)
    slug = get_slug(fixed)
    relpath = get_path(path, slug)

    emit(fixed, relpath)

def redirects(path):
    with open(path) as fh:
        contents = fh.read()

    fixed = fix_blocks(contents)
    slug = get_slug(fixed)
    relpath = get_path(path, slug)

    print(f"{path},{slug}")

    #emit(fixed, relpath)

rootDir = 'readme/v0.15/'
for dirName, subdirList, fileList in os.walk(rootDir):
    for fname in fileList:
        fpath = "{}/{}".format(dirName, fname)
        if '.md' in fpath:
            redirects(fpath)
