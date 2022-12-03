import logging
import micropip
import os
from pyodide.http import pyfetch
import shutil
import sqlite3
from typing import List
BUCKET = "https://storage.googleapis.com/db-owser"
STDOUT = logging.getLogger("default_stdout")
deps = [
    f"{BUCKET}/multidict-6.0.2-py3-none-any.whl",
    f"{BUCKET}/grpclib-0.4.3-py3-none-any.whl",
    f"{BUCKET}/stringcase-1.2.0-py3-none-any.whl",
    f"{BUCKET}/betterproto-1.2.5-py3-none-any.whl",
    f"{BUCKET}/parsedatetime-2.7-py3-none-any.whl",
    f"{BUCKET}/minimal-snowplow-tracker-0.0.2-py3-none-any.whl",
    f"{BUCKET}/dbt_core-1.4.0a1-5-py3-none-any.whl",
    f"{BUCKET}/dbt_sqlite-1.0.0-py3-none-any.whl",
]
for d in deps:
    await micropip.install(d, True)
import dbt.main
def tdb(cmd: str = None):
    if cmd is None:
        try:
            return dbt.main.main([])
        except SystemExit:
            pass
    else:
        try:
            return dbt.main.main(cmd.split(" "))
        except SystemExit:
            pass
def cat(filename: str) -> None:
    f = open(filename)
    for line in f:
        STDOUT.info(line)
def ls(root_dir: str) -> None:
    for root, dirs, files in os.walk(root_dir):
        for filename in files:
            STDOUT.info(f"{root}/{filename}")
def file_list(root_dir: str) -> List[str]:
    result = []
    for root, dirs, files in os.walk(root_dir):
        for filename in files:
            relative = root[len(root_dir):]
            if not filename.startswith("._"):
                if len(relative) > 0:
                    result.append(f"{relative}/{filename}")
                else:
                    result.append(filename)
    return result
def file_cat(filename: str) -> List[str]:
    result = []
    f = open(filename)
    for line in f:
        result.append(line.strip())
    return result
def file_write(filename: str, value: str) -> None:
    f = open(filename, "w")
    f.write(value)
    f.close()
class DB(object):
    def __init__(self, filename: str) -> None:
        self._con = sqlite3.connect(filename)
def select(db: DB, query: str) -> None:
    cur = db._con.cursor()
    STDOUT.info("Query results:")
    STDOUT.info("===========================")
    for row in cur.execute(query):
        STDOUT.info(row)
    STDOUT.info("===========================")
def tables(db: DB) -> None:
    return select(db, "select * from sqlite_master")
def query(filename: str) -> None:
    db = DB("./dev.db")
    sql = open(filename).read().rstrip()
    if sql.endswith(";"):
        sql = sql[:len(sql)-1]
    sql += " limit 50;"
    select(db, sql)
# Set up project
project = await pyfetch(f"{BUCKET}/jaffle_shop_0.0.1-b0b77aa.tgz")
await project.unpack_archive(extract_dir="/home/pyodide", format="gztar")
dest = shutil.move(src="/home/pyodide/project/.dbt", dst="/home/pyodide")
os.chdir("/home/pyodide/project")
# tdb("build")
tdb("debug")
tdb("seed")
tdb("run")
