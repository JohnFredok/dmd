<a name="module_file-set"></a>
#file-set
this module exports a class constructor

**Example**  
```js
var FileSet = require("file-set");
```

<a name="exp_module_file-set"></a>
##class: FileSet ⏏
this class returns a set of files

**Members**

* [class: FileSet ⏏](#exp_module_file-set)
  * [new FileSet()](#exp_new_module_file-set)
  * [file-set.files](#module_file-set#files)
  * [file-set.delete(paths)](#module_file-set#delete)

<a name="exp_new_module_file-set"></a>
###new FileSet()
Takes a list of path patterns

**Params**

-  `Array.<string>` - a list of file patterns  

**Example**  
```js
var cowFiles = new FileSet("cow/*");
```

<a name="module_file-set#files"></a>
###file-set.files
the prototype [instance](http://zombo.com) property

<a name="module_file-set#delete"></a>
###file-set.delete(paths)
A prototype instance methy meth

**Params**

- paths `array` - the paths to delete  

