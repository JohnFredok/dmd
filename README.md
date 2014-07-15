[![view on npm](http://img.shields.io/npm/v/dmd.svg)](https://www.npmjs.org/package/dmd)
[![npm module downloads per month](http://img.shields.io/npm/dm/dmd.svg)](https://www.npmjs.org/package/dmd)
[![Build Status](https://travis-ci.org/75lb/dmd.svg?branch=master)](https://travis-ci.org/75lb/dmd)
[![Dependency Status](https://david-dm.org/75lb/dmd.svg)](https://david-dm.org/75lb/dmd)

#dmd
A transform stream taking javascript doclet data in (produced by [jsdoc-parse](https://github.com/75lb/jsdoc-parse) or any source), outputing markdown documentation. Essentially, the library is collection of Handlebars templates and helpers, any of which can be overridden to taste. The `main` template is rendered using the data received at stdin. 

##Synopsis
```
$ cat examples/doclet.json
[
    {
        "name": "fatUse",
        "kind": "member",
        "description": "I am a global variable",
        "scope": "global"
    }
]

$ cat examples/doclet.json | dmd
#Global

##fatUse
I am a global variable
```

##Usage
###As a library
Install:
```sh
$ npm install dmd --save
```
Example:
```js
var documenterMd = require("dmd");

process.stdin.pipe(documenterMd()).pipe(process.stdout);
```

###At the command line
Install the `dmd` tool globally: 
```sh
$ npm install -g dmd
```
Example:
```sh
$ cat examples/doclet.json | dmd
```

##Plugins
* [dmd-examples-highlight](https://github.com/75lb/dmd-examples-highlight)
    
#API Reference
<a name="module_dmd"></a>
##dmd(options) ⏏
Transforms doclet data into markdown documentation

**Params**

- options `object` - The render options
  - [template] `string` - A handlebars template to insert your documentation into.
  - [partial] `string` | `Array.<string>` - overrides
  - [helper] `string` | `Array.<string>` - overrides
  - [plugin] `string` | `Array.<string>` - packages containing overrides
  - [heading-depth] `number` - Root heading depth, defaults to 2.

**Returns**: `stream` - A readable stream containing the rendered markdown  


*documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)*
