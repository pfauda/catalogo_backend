/*
const parser = require('fast-xml-parser');
const fs = require('fs');

var xmlData;

xmlData = fs.readFileSync('../Geolocalizacion_ConsultarATMCercanos.wsdl', 'utf-8');

//default options need not to set
var defaultOptions = {
    attrPrefix : "",
    ignoreTextNodeAttr: false,
    ignoreNameSpace: true,
    allowBooleanAttributes: true,
    parseNodeValue: true,
    parseAttributeValue: false,
    arrayMode: false,
    trimValues: false,
    cdataTagName: false,
    parseTrueNumberOnly: false
}

if(parser.validate(xmlData, defaultOptions)){
    var jsonObj = parser.parse(xmlData, defaultOptions);
    console.log(jsonObj);
}
*/

const fs = require("fs");
const path = require('path');

xmlData = fs.readFileSync("../Geolocalizacion_ConsultarATMCercanos.wsdl").toString();

var fastXmlParser = require("fast-xml-parser");

// when a tag has attributes
var options = {
  ignoreAttributes : false,
  ignoreNameSpace: true
};
if (fastXmlParser.validate(xmlData) === true) {
  //optional
  var data = fastXmlParser.parse(xmlData, options);
}
console.log(data.definitions.types.schema.import);
var pt = data.definitions.types.schema.import[0]['@_schemaLocation'];

console.log(pt); 

var a = path.normalize(pt);

console.log(a);