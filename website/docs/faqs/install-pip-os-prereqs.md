---
title: Are there prerequisites for my operating system?
---

Some operating systems require additional pre-installation setup. After running whichever commands are relevant to your development environment, return to the instructions above.

#### MacOS

The version of python installed on your system may not be compatible with dbt. To check, run:
```
python --version
```
If needed, download and install [Python version 3.6 or higher for MacOS](https://www.python.org/downloads/macos).

If your machine runs on an Apple M1 architecture, we recommend that you install dbt via [Rosetta](https://support.apple.com/en-us/HT211861). This is necessary for certain dependencies that are only supported on Intel processors.

#### Ubuntu/Debian
```shell
sudo apt-get install git libpq-dev python-dev python3-pip
sudo apt-get remove python-cffi
sudo pip install --upgrade cffi
pip install cryptography~=3.4
```

#### CentOS

```shell
sudo yum install redhat-rpm-config gcc libffi-devel \
  python-devel openssl-devel
```

#### Windows

Install [Git for Windows](https://git-scm.com/downloads) and [Python version 3.6 or higher for Windows](https://www.python.org/downloads/windows/).