'use strict';

const globals = require('./globals');
const files = require('./explore-files');
const fs = require('fs');

var jsonservices = files.getFiles(globals.ROOT_DIR, globals.SERVICES_DIR);
fs.writeFileSync('./db_services.json', JSON.stringify(jsonservices, null, '\t'), 'utf8');
console.log('Archivo db_services.json grabado!');
/*
files.getFiles(globals.ROOT_DIR, globals.SERVICES_DIR).then((json) => {
	fs.writeFileSync('./db_services.json', JSON.stringify(json, null, '\t'), 'utf8');
	console.log('Proceso terminado!');
});
*/

/*
files.getUsersSync(jsonservices).then((_json) => {
	fs.writeFileSync('./db_modifiers.json', JSON.stringify(_json, null, '\t'), 'utf8');
	console.log('Proceso terminado!');
});
*/
