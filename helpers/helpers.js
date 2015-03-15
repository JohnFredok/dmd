"use strict";
var ddata = require("ddata");
var a = require("array-tools");
var handlebars = require("stream-handlebars");

/**
A library of helpers used exclusively by dmd.. dmd also registers helpers from ddata.
@module
*/
exports.escape = escape;
exports.inlineLinks = inlineLinks;
exports.tableHead = tableHead;
exports.tableHeadHtml = tableHeadHtml;
exports.tableRow = tableRow;
exports.deprecated = deprecated;
exports.groupBy = groupBy;
exports._groupBy = _groupBy;
exports._addGroup = _addGroup;
exports.add = add;
exports.kindInThisContext = kindInThisContext;
exports.titleCase = titleCase;
exports.parseType = parseType;

/**
Escape special markdown characters
*/
function escape(input){
    if (typeof input !== "string") return null;
    return input.replace(/([\*|])/g, "\\$1");
}

/**
replaces {@link} tags with markdown links in the suppied input text
*/
function inlineLinks(text, options){
    if (text){
        var links = ddata.parseLink(text);
        links.forEach(function(link){
            var linked = ddata._link(link.url, options);
            if (link.caption === link.url) link.caption = linked.name;
            if (linked.url) link.url = linked.url;
            text = text.replace(link.original, "[" + link.caption + "](" + link.url + ")");
        });
    }
    return text;
}

/**
returns a gfm table header row.. only columns which contain data are included in the output
*/
function tableHead(){
    var args = a.arrayify(arguments);
    var data = args.shift();
    if (!data) return;
    var options = args.pop();
    var cols = args;
    var colHeaders = cols.map(function(col){
        var spl = col.split("|");
        return spl[1] || spl[0];
    });
    cols = cols.map(function(col){
        return col.split("|")[0];
    });
    var toSplice = [];
    cols = cols.filter(function(col, index){
        var hasValue = data.some(function(row){
            return typeof row[col] !== "undefined";
        });
        if (!hasValue) toSplice.push(index);
        return hasValue;
    });
    toSplice.reverse().forEach(function(index){
        colHeaders.splice(index, 1);
    }); 
    
    var table = "| " + colHeaders.join(" | ") + " |\n";
    table += cols.reduce(function(p){ return p + " --- |" }, "|") + "\n";
    return table;
}

function containsData(rows, col){
    return rows.some(function(row){
        return typeof row[col] !== "undefined";
    });
}

/**
returns a gfm table row.. only columns which contain data are included in the output
*/
function tableRow(){
    var args = a.arrayify(arguments);
    var rows = args.shift();
    if (!rows) return;
    var options = args.pop();
    var cols = args;
    var output = "";
    var self = this;
    
    if (options.data){
        var data = handlebars.createFrame(options.data);
        cols.forEach(function(col, index){
            var colNumber = index + 1;
            data["col" + colNumber] = containsData(rows, col)
        });
    }
    rows.forEach(function(row){
        output += options.fn(row, { data: data });
    });
    return output;
}

/**
@example
{{#each (tableHeadHtml params "name|Param" "type|Type" )}}<td>{{this}}</td>{{/each}}
*/
function tableHeadHtml(){
    var args = a.arrayify(arguments);
    var data = args.shift();
    if (!data) return;
    var options = args.pop();
    var cols = args;
    var colHeaders = cols.map(function(col){
        var spl = col.split("|");
        return spl[1] || spl[0];
    });
    cols = cols.map(function(col){
        return col.split("|")[0];
    });
    var toSplice = [];
    cols = cols.filter(function(col, index){
        var hasValue = data.some(function(row){
            return typeof row[col] !== "undefined";
        });
        if (!hasValue) toSplice.push(index);
        return hasValue;
    });
    toSplice.reverse().forEach(function(index){
        colHeaders.splice(index, 1);
    }); 
    
    return colHeaders;
}

function deprecated(options){
    if (this.deprecated){
        if (ddata.optionEquals("no-gfm", true, options) || options.hash["no-gfm"]){
            return "<del>" + options.fn(this) + "</del>";
        } else {
            return "~~" + options.fn(this) + "~~";
        }
    } else {
        return options.fn(this);
    }
}

/**

*/
function groupBy(groupByFields, options){
    return handlebars.helpers.each(_groupChildren.call(this, groupByFields, options), options);
}

function _addGroup(identifiers, groupByFields){
    return identifiers.map(function(identifier){
        identifier._group = groupByFields.map(function(field){
            return typeof identifier[field] === "undefined" ? null : identifier[field];
        });
        return identifier
    });
}

function _groupChildren(groupByFields, options){
    var children = ddata._children.call(this, options);
    return _groupBy(children, groupByFields);
}

/**
takes the children of this, groups them, inserts group headings.. 
*/
function _groupBy(identifiers, groupByFields){
    /* don't modify the input array */
    groupByFields = groupByFields.slice(0);
    
    groupByFields.forEach(function(group){
        var groupValues = a.unique(identifiers.filter(function(identifier){
            /* exclude constructors from grouping.. re-implement to work off a `null` group value */
            return identifier.kind !== "constructor";
        }).map(function(i){ return i[group]; }));
        if (groupValues.length <= 1) groupByFields = a.without(groupByFields, group);
    });
    identifiers = _addGroup(identifiers, groupByFields);

    var inserts = [];
    var prevGroup = [];
    var level = 0;
    identifiers.forEach(function(identifier, index){
        if (!deepEqual(identifier._group, prevGroup)){
            var common = a.commonSequence(identifier._group, prevGroup);
            level = common.length;
            identifier._group.forEach(function(group, i){
                if (group !== common[i] && group !== null){
                    inserts.push({
                        index: index,
                        _title: group,
                        level: level++
                    });
                }
            });
        }
        identifier.level = level;
        prevGroup = identifier._group;
        delete identifier._group;
    });

    /* insert title items */
    inserts.reverse().forEach(function(insert){
        identifiers.splice(insert.index, 0, { _title: insert._title, level: insert.level });
    });
    return identifiers;
}

function add(){
    var args = a.arrayify(arguments);
    args.pop(); 
    return args.reduce(function(p, c){ return p + (c || 0); }, 0);
}

function deepEqual(a, b){
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
returns a more appropriate 'kind', depending on context
@return {string}
*/
function kindInThisContext(options){
    if (this.kind === "function" && this.memberof){
        return "method";
    } else if (this.kind === "member" && !this.isEnum && this.memberof){
        return "property";
    } else if (this.kind === "member" && this.isEnum && this.memberof){
        return "enum property";
    } else if (this.kind === "member" && this.isEnum && !this.memberof){
        return "enum";
    } else if (this.kind === "member" && this.scope === "global"){
        return "variable";
    } else {
        return this.kind;
    }
}

function titleCase(string){
    return string[0].toUpperCase() + string.slice(1);
}

function parseType(string){
    var matches = string.match(/{(.*?)}/);
    if (matches){
        return matches[1];
    }
}
