# Parse Server: Dropbox storage adapter

[![npm](https://img.shields.io/npm/v/parse-server-dropbox-adapter.svg?style=flat-square)](https://www.npmjs.com/package/parse-server-dropbox-adapter)
[![Travis](https://img.shields.io/travis/mckay-software/parse-server-dropbox-adapter.svg?style=flat-square)](https://travis-ci.org/mckay-software/parse-server-dropbox-adapter)
[![Coveralls](https://img.shields.io/coveralls/mckay-software/parse-server-dropbox-adapter.svg?style=flat-square)](https://coveralls.io/github/mckay-software/parse-server-dropbox-adapter)
[![License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://spdx.org/licenses/ISC.html)

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
