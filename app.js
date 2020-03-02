'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const users = require('./git-log');
const operations = require('./operations');
const fs = require('fs');

// Lista de servicios
var jsonservices;

/*
var app = require('app.js');
var debug = require('debug')('mean-app:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '4300');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  debug('Listening on ' + port);
}
*/

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// ruta principal (route)
app.get('/', function(_req, _res) {
	_res.status(403).send('No autorizado!');
});

// Obtener la totalidad de los servicios leidos
app.get('/api/services', function(_req, _res) {
	_res.status(200).json(jsonservices);
});

// Obtener detalles del servicio
app.post('/api/metodo', function(req, res) {

	var jdoc;

	let srv = req.body.servicio;
	let mtd = req.body.metodo;
	let vrs = req.body.version;

	if(srv && mtd){
		jdoc = operations.getOperation(srv, mtd, vrs, jsonservices);
		if(jdoc == '') {
			res.status(404).send('Nada encontrado!');
		}else{
			res.status(200).send(jdoc);
		}
	}else{
		if (srv == '') { res.status(400).send('Parámetro Servicio no recibido!'); }
		if (mtd == '') { res.status(400).send('Parámetro Método no recibido!'); }
	}
});

// Obtener el log modificaciones de la operación
app.post('/api/log_modificaciones', function(req, res) {

	/*
	var users;
	let op = req.body.operacion;
	console.log(op);
	if(op){
		users.getLog(op)
			.then(function(jusers) {
				res.status(200).send(jusers);
			})
			.catch(function() {
				res.status(404).send('Operación no encontrada!');
			});
	}else{
		res.status(400).send('Parámetro Operación no recibido!');
	}
	*/

	let op = req.body.operacion;
	console.log(op);
	if(op){
		jsonservices[op].
			users.getLog(op)
			.then(function(jusers) {
				res.status(200).send(jusers);
			})
			.catch(function() {
				res.status(404).send('Operación no encontrada!');
			});
	}else{
		res.status(400).send('Parámetro Operación no recibido!');
	}
});

// Refresh
app.get('/api/refresh', function(_req, _res) {
	jsonservices = getServices();
	console.log('Servicios releidos');
	_res.status(200).send(jsonservices.length + ' servicios leidos.');
});

// Cualquier otra ruta dar error 
app.get('/api/*', function(_req, _res) {
	_res.status(403).send('No autorizado!');
});

var port = '3000'; //normalizePort(process.env.PORT || '3000');

app.listen(port, (_req, _res) => {
	jsonservices = getServices();
	console.log('Servidor iniciado!');
} 
);

function getServices() {
	const _file = './catalog.json';
	if(fs.existsSync(_file)) {
		jsonservices = JSON.parse(fs.readFileSync(_file, 'utf8'));
		//delete jsonservices['metodos']['xsd_modifiers'];
		//delete jsonservices['metodos']['wsdl_modifiers'];
	}
	return jsonservices;
}