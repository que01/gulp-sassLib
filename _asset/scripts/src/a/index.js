require("./index.scss");
var $ = require("npm-zepto");

var tpl = require("./index.tpl");

var html = tpl({about:"Hello World,Welcome!",c:"aaa"});

console.log("test789");

$("#test").html(html);
