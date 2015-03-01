[![view on npm](http://img.shields.io/npm/v/dmd.svg)](https://www.npmjs.org/package/dmd)
[![npm module downloads per month](http://img.shields.io/npm/dm/dmd.svg)](https://www.npmjs.org/package/dmd)
[![Build Status](https://travis-ci.org/75lb/dmd.svg?branch=next)](https://travis-ci.org/75lb/dmd)
[![Dependency Status](https://david-dm.org/75lb/dmd.svg)](https://david-dm.org/75lb/dmd)

# dmd
dmd (document with markdown) is a module containing [handlebars](http://handlebarsjs.com) partials and helpers intended to transform [jsdoc-parse](https://github.com/75lb/jsdoc-parse) data into markdown API documentation. It exposes a <code>[single function](#module_dmd)</code> which requires data and a template. See [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown) for example output.

## Synopsis
With this input file containing [jsdoc-parse](http://handlebarsjs.com) output:
```json
[
    {
        "id": "fatUse",
        "name": "fatUse",
        "kind": "member",
        "description": "I am a global variable",
        "scope": "global"
    }
]
```
this command :
```
$ cat examples/input/doclet.json | dmd
```
produces this output: 
```
<a name="fatUse"></a>
## fatUse
I am a global variable

**Kind**: global variable
```

## Usage
### As a library
Install:
```sh
$ npm install dmd --save
```
Example:
```js
var dmd = require("dmd");

var options = {
   template: "my-template.hbs"
};
process.stdin.pipe(dmd(options)).pipe(process.stdout);
```

### At the command line
Install the `dmd` tool globally: 
```sh
$ npm install -g dmd
```
Example:
```sh
$ cat examples/doclet.json | dmd
```

## Templates
The default template contains a single call to the  [main](https://github.com/75lb/dmd/blob/master/partials/main.hbs) partial:
```hbs
{{>main}}
```

This partial outputs all documentation and an index (if there are enough items). You can customise the output by supplying your own template. For example, you could write a template like this:
```hbs
# A Module
This is the readme for a module. 

## Install
Install it using the power of thought. While breakdancing.

# API Documentation
{{>main}}
```

and employ it like this: 
```
$ cat your-docs.json | dmd --template readme-template.hbs
```

## Customising 
You can customise the generated documentation to taste by overriding or adding partials and/or helpers.

For example, let's say you wanted this datestamp at the bottom of your generated docs:

```
**documentation generated on Sun, 01 Mar 2015 09:30:17 GMT**
```

You need to do two things:

1. Write a helper method to return the date in your preferred format
2. Override the appropriate partial where you would like it to appear. We'll override the [main](https://github.com/75lb/dmd/blob/master/partials/main.hbs) partial.

### Write a new helper
A helper file is just a plain commonJS module. Each method exposed on the module will be available to your templates. So, our new helper file:

```js
exports.generatedDate = function(){
    return new Date().toUTCString();
}
```

[Read more about helpers in the handlebars documentation](http://handlebarsjs.com).

### Write a new [main](https://github.com/75lb/dmd/blob/master/partials/main.hbs) partial
Create a duplicate (typically in the project you are documenting) of the [main](https://github.com/75lb/dmd/blob/master/partials/main.hbs) partial containing your new footer:

```hbs
{{>main-index~}}
{{>all-docs~}}

**documentation generated on {{generatedDate}}**
```

*the file basename of a partial is significant - to override `main` the filename must be `main.hbs`.*

### Employ
To use the overrides, pass their file names as options to dmd (or [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown) if you're using that):
```
$ cat your-parsed-docs.json | dmd --partial custom/main.hbs --helper custom/generatedDate.js
```

If you have multiple overrides, the syntax is 
```
$ cat your-parsed-docs.json | dmd --partial override1.hbs override2.hbs
```

Globbing also works:
```
$ cat your-parsed-docs.json | dmd --partial overrides/*.hbs
```

### Plugins
* [dmd-plugin-example](https://github.com/75lb/dmd-plugin-example)
    
# API Reference
<a name="exp_module_dmd--dmd"></a>
### dmd([options]) ⇒ <code>[TransformStream](http://nodejs.org/api/stream.html#stream_class_stream_transform)</code> ⏏
Transforms doclet data into markdown documentation. Returns a transform stream - pipe doclet data in to receive rendered markdown out.

**Kind**: Exported function  
**Params**

- \[options\] <code>object</code> - The render options  
  - \[template =<code>&quot;\{\{&gt;main\}\}&quot;</code>\]  - {string} - A handlebars template to insert your documentation into.  
  - \[heading-depth =<code>2</code>\] <code>number</code> - the heading depth to begin the docs from (e.g. `2` starts from a markdown heading of `"##"`).  
  - \[example-lang\] <code>string</code> - for syntax highlighting on github  
  - \[partial\] <code>string</code> | <code>Array.&lt;string&gt;</code> - overrides  
  - \[helper\] <code>string</code> | <code>Array.&lt;string&gt;</code> - overrides  
  - \[plugin\] <code>string</code> | <code>Array.&lt;string&gt;</code> - packages containing overrides  

* * *

&copy; 2015 Lloyd Brookes <75pound@gmail.com>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
