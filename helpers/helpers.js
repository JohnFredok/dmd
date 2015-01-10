"use strict";
var ddata = require("ddata");
var marked = require("marked");

exports.escape = escape;
exports.linkify = linkify;
exports.renderMarkdown = renderMarkdown;

/**
Escape special markdown characters
*/
function escape(input){
    if (typeof input !== "string") return null;
    return input.replace(/\*/g, "\\*");
}

function linkify(text, options){
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

function renderMarkdown(input){
    if (input){
        return marked(input);
    }
}
