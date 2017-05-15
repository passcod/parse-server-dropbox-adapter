# Parse Server: Dropbox storage adapter

<!--
[![Greenkeeper badge](https://badges.greenkeeper.io/passcod/parse-server-dropbox-adapter.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/parse-server-dropbox-adapter.svg?style=flat-square)](https://www.npmjs.com/package/parse-server-dropbox-adapter)
[![Travis](https://img.shields.io/travis/passcod/parse-server-dropbox-adapter.svg?style=flat-square)](https://travis-ci.org/passcod/parse-server-dropbox-adapter)
[![Coveralls](https://img.shields.io/coveralls/passcod/parse-server-dropbox-adapter.svg?style=flat-square)](https://coveralls.io/github/passcod/parse-server-dropbox-adapter)
-->

[![License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://spdx.org/licenses/ISC.html)

## Notice

This is not maintained. The test-suite passed at the last commit, but no
further work has been done to it and the CI has been stopped as the Dropbox
test account was removed. Fork and use at your own risk.

## Install

```
$ npm install --save parse-server-dropbox-adapter
```

## Usage

```js
filesAdapter: {
  module: 'parse-server-dropbox-adapter',
  options: {
    token: 'dropbox oauth token',
    prefix: '',
    publicUrl: (prefix, name, join) =>
      join('https://example.com/files/', `${prefix}${name}`)
  }
}
```

| Option | Default | Description |
|:-------|:-------:|:------------|
| `token` | **required** ||
| `prefix` | `''` | A prefix to apply to all filenames. Can be set to e.g. `'/foo/'` to put all files in a subdirectory. A `/` will be prefixed if one isn't there already, unless the string is empty. |
| `publicUrl` | **required** | A function that takes the prefix and a filename and returns a string for the public URL of the file, or `false` to disable public URLs. Third argument is [url-join](https://www.npmjs.com/package/url-join), a `join`-like function for URLs. |

Note that this module does not handle erasing files, so if you want to
garbage-collect Parse files that are not being used, you need to do so
yourself.

## Test

You need a Dropbox token set as `DROPBOX_TOKEN` in the environment to run
tests. It is recommended to set this to a dedicated "App Folder Only" token, so
the tests cannot access anything else and cannot mess up your Dropbox with its
temporary files. Also, app folders are not synced to your desktop by default,
so you'll be saving yourself from notifications and wasted bandwidth.
