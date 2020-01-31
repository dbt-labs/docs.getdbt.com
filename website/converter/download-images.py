#!/usr/bin/env python

import os
import re
import time
import requests
import shutil

for root, dirs, files in os.walk("docs"):
   for name in files:
      if name.endswith('.md'):
          path = os.path.join(root, name)
          print(f"Loading {path}")
          with open(path) as fh:
              contents = fh.read()

          matches = re.findall(r'"(https:\/\/files[^ ]*)"', contents)
          if len(matches) == 0:
              continue

          print(f"Found {len(matches)} matche(s)")

          for match in matches:
              img_name = match.split("/")[-1]
              img_path = os.path.join('../', 'static', 'img', root, img_name)

              target_path = os.path.dirname(img_path)
              if not os.path.exists(target_path):
                  print(f"creating {target_path}")
                  os.makedirs(target_path)

              resp = requests.get(match, stream=True)
              new_href = '/' + os.path.join('img', root, img_name)
              print(f"path on disk: {img_path}")
              print(f"path in url {new_href}")
              time.sleep(0.1)
              with open(img_path, 'wb') as fh:
                  shutil.copyfileobj(resp.raw, fh)
              contents = contents.replace(match, new_href)

          with open(path, 'w') as fh:
              fh.write(contents)
