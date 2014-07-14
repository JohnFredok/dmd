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

##Templating
Running `jsdoc2md` without a `--template` generates documentation with the default template, which looks like this:

    {{>index}}
    {{>modules}}
    {{>globals}}
    {{>others}}
    
###{{>index}}
Only output if there are at least two modules defined. 

    #Index
    
    * Modules
      * {{>module-name}}
        * {{>member-names}}
    * Global
      * {{>global-name}}

###{{>modules}}
Outputs one {{>module}} partial per module.

###{{>globals}}

    #Global
    {{>global-index}}
    {{>members}}

###{{>members}}

    {{#each (members in=data)}}{{>member}}{{/each~}}
    {{#each (functions in=data)}}{{>function}}{{/each~}}
    {{#each (namespaces in=data)}}{{>namespace}}{{/each~}}
    {{#each (constants in=data)}}{{>constant}}{{/each~}}
    {{#each (typedefs in=data)}}{{>typedef}}{{/each~}}
    {{#each (events in=data)}}{{>event}}{{/each~}}
    {{#each (classes in=data)}}{{>class}}{{/each~}}

###{{>module}}

    {{>head}}
    {{>body}}
    {{>module-exported}}  (either a class with index, function or object with index)

###{{>head}}

    {{>anchor}}
    {{>heading}}{{>name}}
    
###{{>body}}

    {{>fields}}
    
###{{>fields}}

    {{>description~}}
    {{>params~}}
    {{>deprecated~}}
    {{>augments~}}
    {{>memberof~}}
    {{>type~}}
    {{>default~}}
    {{>returns~}}
    {{>access~}}
    {{>enum~}}
    {{>readOnly~}}
    {{>since~}}
    {{>version~}}
    {{>authors~}}
    {{>license~}}
    {{>copyright~}}
    {{>examples~}}

###{{>module-exported}}

    {{>class}}, {{>function}} or {{>module-index}} and {{>members}}

###{{>class}}

    {{>head}}
    {{>body~}}
    {{>class-members-index~}}
    {{>members-grouped~}}
    
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
