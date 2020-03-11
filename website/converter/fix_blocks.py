
import re
import json

# TODO : Fix glossary

class Fixer(object):
    pattern = None
    max_passes = None

    @classmethod
    def convert(cls, data):
        return "<TODO>"

    @classmethod
    def replace(cls, s, block, start, end):
        try:
            contents = json.loads(block)
        except json.decoder.JSONDecodeError as e:

            import ipdb; ipdb.set_trace()
            print(f"Error while parsing json {e}")
            print(block)
            raise
        to_replace = cls.convert(contents).strip()
        to_replace = f"\n{to_replace}\n"
        return s[0:start] + to_replace + s[end:]

    @classmethod
    def fix(cls, s):
        match = cls.pattern.search(s)

        pass_number = 0
        while match is not None:
            pass_number += 1
            s = cls.replace(s, match.groups()[0], match.start(), match.end())
            if cls.max_passes is not None and pass_number >= cls.max_passes:
                break
            match = cls.pattern.search(s)

        return s

class TextFixer(Fixer):
    @classmethod
    def replace(cls, s, block, start, end):
        to_replace = cls.convert(block).strip()
        to_replace = f"{to_replace}\n"
        return s[0:start] + to_replace + s[end:]


class FrontMatterFixer(TextFixer):
    pattern = re.compile('---(.*?)---', re.DOTALL)
    max_passes = 1

    @classmethod
    def convert(cls, data):
        meta = {}
        for row in data.strip().split("\n"):
            k,v = row.split(":", 1)
            meta[k.strip()] = v.strip()

        return f"""
---
title: {meta['title']}
id: {meta['slug']}
---
"""

class LinkFixer(Fixer):
    pattern = re.compile('(\[[^\]]*?\]\(doc:[-_a-zA-Z0-9]+\))', re.DOTALL)

    @classmethod
    def replace(cls, s, block, start, end):
        to_replace = cls.convert(block).strip()
        return s[0:start] + to_replace + s[end:]

    @classmethod
    def convert(cls, data):
        # This isn't perfect, but it's something :/
        # TODO : handle links which point to sections?
        matches = re.match('\[(.*?)\]\(doc:(.*?)\)', data, re.DOTALL)
        text, slug = matches.groups()
        return f"[{text}]({slug})"

class CodeFixer(Fixer):
    pattern = re.compile('\[block:code\](.*?)\[\/block\]', re.DOTALL)

    @classmethod
    def convert(cls, data):
        code = data['codes'][0]['code']
        lang = data['codes'][0].get('language', 'text')
        name = data['codes'][0].get('name')
        if not name:
            return f"""
```{lang}
{code}"
```
"""
        else:
            return f"""
<File name='{name}'>

```{lang}
{code}
```

</File>
"""

class TableFixer(Fixer):
    pattern = re.compile('\[block:parameters\](.*?)\[\/block\]', re.DOTALL)

    @classmethod
    def to_row(cls, items):
        clean_items = [i.replace("```", "`").replace("\n", "<br />") for i in items]
        return "| " + " | ".join(clean_items) + " |"

    @classmethod
    def convert(cls, data):
        table = data['data']
        cols = data['cols']
        rows = data['rows']

        header_cols = [table[f'h-{i}'] for i in range(cols)]
        header_s = cls.to_row(header_cols)

        rows_s = ""
        for row in range(rows):
            fields = [table.get(f'{row}-{col}', '') for col in range(cols)]
            rows_s += cls.to_row(fields) + "\n"

        sep_s = cls.to_row("-" * len(h) for h in header_cols)
        return f"""

{header_s}
{sep_s}
{rows_s}
"""

class ImageFixer(Fixer):
    pattern = re.compile('\[block:image\](.*?)\[\/block\]', re.DOTALL)

    @classmethod
    def convert(cls, data):
        image_data = data['images'][0]

        href, title, width, height, color = image_data['image']
        caption = image_data.get('caption', '').replace('"', "'")

        return f'<Lightbox src="{href}" title="{caption}"/>'

class CalloutFixer(Fixer):
    pattern = re.compile('\[block:callout\](.*?)\[\/block\]', re.DOTALL)

    @classmethod
    def convert(cls, data):
        callout_type = data['type']
        body = data.get('body', '')
        title = data.get('title', '')

        return f"""
<Callout type="{callout_type}" title="{title}">

{body}

</Callout>
"""

class HtmlFixer(Fixer):
    pattern = re.compile('\[block:html\](.*?)\[\/block\]', re.DOTALL)

    @classmethod
    def convert(cls, data):
        return f"""
<!-- TODO 
    {data['html']}
-->
"""

class EmbedFixer(Fixer):
    pattern = re.compile('\[block:embed\](.*?)\[\/block\]', re.DOTALL)

    @classmethod
    def convert(cls, data):
        return f"""
<!-- TODO 
    {data['title']}
    {data['url']}
    {data['html']}
-->
"""

class SpecialFixer(TextFixer):
    @classmethod
    def fix(cls, s):
        return s.replace("<", "&lt;").replace(">", "&gt;")

class GlossaryFixer(TextFixer):
    pattern = re.compile('<<(.*)>>', re.DOTALL)

    @classmethod
    def convert(cls, data):
        return data

fixers = [
    SpecialFixer,

    FrontMatterFixer,
    LinkFixer,

    CodeFixer,
    TableFixer,
    ImageFixer,
    CalloutFixer,
    HtmlFixer,
    EmbedFixer,

    GlossaryFixer,
]

def fix_blocks(s):
    for fixer in fixers:
        s = fixer.fix(s)
    return s

if __name__ == '__main__':
    with open('using-jinja.md') as fh:
        s = fh.read()

    print(fix_blocks(s))
