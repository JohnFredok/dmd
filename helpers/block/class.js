var a = require("array-tools");

module.exports = function(handlebars){
    handlebars.registerHelper("class", function(options){
        var selectedClass = a.findWhere(options.data.root, {
            kind: "class",
            name: new RegExp(options.hash.name)
        });
        if (selectedClass){
            return options.fn(selectedClass);
        } else {
            return "ERROR: CLASS NOT FOUND"
        }
    });
};
