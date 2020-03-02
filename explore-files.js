'use strict';

const filehound = require('filehound');
const parser = require('fast-xml-parser');
const path = require('path');
const globals = require('./globals');
const fs = require('fs');
const users = require('./git-log');

function getFiles(_root_dir, _services_path) {

	var jsonServices = [];

	//fs.statSync(file).ctime;

	var optionsParse = {
		ignoreAttributes : false,
		ignoreNameSpace: true
	};

	//Leer todos los contratos que se encuentran en el directorio local del Git
	const subdirs = filehound.create()
		.path(_root_dir + _services_path)
		.ext('wsdl')
		.findSync();

	//Procesarlos
	subdirs.forEach(serv => {

		var wsdl_file,
			wsdl_content,
			wsdl_json,
			xsd_path,
			xsd_file,
			file_exist,
			path_examples,
			path_images,
			service_find,
			servicioNombre,
			metodoNombre,
			metodoVersion,
			serviceOk;
        
		serviceOk = true;

		if(fs.existsSync(serv)) {

			wsdl_file = path.parse(serv);

			// Obtener el nombre del servicio a partir del nombre del wsdl
			servicioNombre = wsdl_file.name.substr(0, wsdl_file.name.indexOf('_'));
			// Obtener el método desde el nombre del wsdl
			metodoNombre = wsdl_file.name.substr(wsdl_file.name.indexOf('_')+1);

			wsdl_content = fs.readFileSync(serv, 'utf-8'); //Leer el wsdl
			// Parsear el wsdl y obtener el xsd que importado
			if(parser.validate(wsdl_content, optionsParse)) {

				wsdl_json = parser.parse(wsdl_content, optionsParse); //Convertirlo a json

				//Obtener la ruta del xsd
				try {
					xsd_path = wsdl_json.definitions.types.schema.import[0]['@_schemaLocation'];
					xsd_path = path.join(wsdl_file.dir, xsd_path);
					xsd_file = path.parse(xsd_path);
				}catch(err){
					xsd_path = '';
				}

			}
		}
    
		file_exist = fs.existsSync(xsd_path);
		if(servicioNombre && file_exist) {

			// Adivinar si es un versionado del servicio
			metodoVersion = wsdl_file.dir.split('\\').splice(-1)[0];
			if(metodoVersion.substring(0, 1).toUpperCase()!='V') {
				metodoVersion = '';
			}
			if(metodoVersion == servicioNombre) {
				metodoVersion = '';
			}

			path_examples = path.join(wsdl_file.dir, globals.SERVICES_EXAMPLES_DIR);
			path_examples = path_examples.replace(/\\/g, '/').substr(_root_dir.length) + metodoNombre + '/';
			path_images = path.join(wsdl_file.dir, globals.SERVICES_BIZAGIS_DIR).replace(/\\/g, '/').substr(_root_dir.length);
			path_images = path_images + servicioNombre + '/' + wsdl_file.name + (metodoVersion ? '': (metodoVersion + '/')) + 'Documentation/files/diagrams/';
		
			//Buscar todos los XMLs de ejemplos
			let xml_examples = [];
			if(fs.existsSync(_root_dir + path_examples)) {
				let examples_files = filehound.create()
					.path(_root_dir + path_examples)
					.ext('xml')
					.findSync();
				examples_files.forEach((_file) => {
					xml_examples.push(path.parse(_file).name);
				});
			}
	
			var metodo = {'metodoNombre': metodoNombre,
				'metodoVersion': metodoVersion,
				'methodComplete': true,
				'patch_wsdl': wsdl_file.dir.replace(/\\/g, '/').substr(_root_dir.length) + '/',
				'archivo_wsdl': wsdl_file.name.replace(/\\/g, '/'), //Reemplaza // por \
				'wsdl_file': ( wsdl_file.dir.substr(_root_dir.length) + '/' + wsdl_file.name + '.wsdl' ).replace(/\\/g, '/'),
				'patch_xsd': xsd_file.dir.replace(/\\/g, '/').substr(_root_dir.length) + '/',
				'archivo_xsd': xsd_file.name.replace(/\\/g, '/'),
				'xsd_file': ( xsd_file.dir.substr(_root_dir.length) + '/' + xsd_file.name + '.xsd' ).replace(/\\/g, '/'),
				'path_examples': path_examples,
				'examples': xml_examples,
				'example_request': path_examples + servicioNombre + '_' + metodoNombre + 'Request.xml',
				'example_responseErrNeg': path_examples + servicioNombre + '_' + metodoNombre + 'ResponseErrorNeg.xml',
				'example_responseOk': path_examples + servicioNombre + '_' + metodoNombre + 'ResponseOk.xml',
				'path_images': path_images,
				'design_patern': path_images + metodoNombre + '.png',
				'solution_scheme': path_images + 'Esquema_de_Solucion.png',
			};

			// Si ya existe el servicio agregar el método sino crear la entrada para el servicio
			service_find = jsonServices.find(item=>item.servicioNombre==servicioNombre);
			if(service_find) {
				service_find.metodos.push(metodo);
			}else{
				jsonServices.push({servicioNombre, serviceOk, 'metodos': [metodo]});
			}
		}

	});

	/* Ordenar */
	jsonServices = jsonServices.sort(function(a, b) {
		return (a.servicioNombre > b.servicioNombre) ? 1 : ((a.servicioNombre < b.servicioNombre) ? -1 : 0);
	});

	/* Check */
	jsonServices.forEach(function(service) {

		service.metodos.forEach(function(method) {

			if(!fs.existsSync(_root_dir + method.wsdl_file)) {
				method.methodComplete = false;
				method.wsdl_file = '';
			}
			if(!fs.existsSync(_root_dir + method.xsd_file)) {
				method.methodComplete = false;
				method.xsd_file = '';
			}

			//Verificar si hay archivos de ejemplos
			if(!fs.existsSync(_root_dir + method.path_examples)) {
				method.path_examples = '';
				method.example_request = '';
				method.example_responseErrNeg = '';
				method.example_responseOk = '';
			}else{
				let ex_files = filehound.create()
					.path(_root_dir + method.path_examples)
					.ext('xml')
					.findSync();
				if(ex_files) {
    
					if(!fs.existsSync(_root_dir + method.example_request)) {
						method.methodComplete = false;
						method.example_request = '';
					}
					if(!fs.existsSync(_root_dir + method.example_responseErrNeg)) {
						method.methodComplete = false;
						method.example_responseErrNeg = '';
					}
					if(!fs.existsSync(_root_dir + method.example_responseOk)) {
						method.methodComplete = false;
						method.example_responseOk = '';
					}
				}
			}

			if(!fs.existsSync(_root_dir + method.design_patern)) {
				method.methodComplete = false;
				//method.design_patern = '';
			}
			if(!fs.existsSync(_root_dir + method.solution_scheme)) {
				method.methodComplete = false;
				method.solution_scheme = '';
			}

			if(!method.methodComplete && service.serviceOk) {
				service.serviceOk = false; 
			}

		});
	});

	//Cargar quienes lo modificaron
	//jsonServices = getUsersSync(jsonServices);
	//jsonServices = await getUsersSync(jsonServices);
	return jsonServices;
}

function getUsers(_jsonServices) {

	var promises = [];

	_jsonServices.forEach(function(service) {

		service.metodos.forEach(function(method) {

			if(method.xsd_file) {
				promises.push(users.getLog(method.xsd_file)
					.then(function(jusers) {
						method.xsd_modifiers = jusers;
						console.log('XSD  Ok :', method.xsd_file);
					})
					.catch(function(_e) {
						console.log('XSD  NOk:', method.xsd_file);
					}));
			}

			if(method.wsdl_file) {
				promises.push(users.getLog(method.wsdl_file)
					.then(function(jusers) {
						method.wsdl_modifiers = jusers;
						console.log('WSDL Ok :', method.wsdl_file);
					})
					.catch(function(_e) {
						console.log('WSDL NOk:', method.wsdl_file);
					}));
			}

		});
	});

	Promise.all(promises).then((_results) => {
		console.log('Promesas finalizadas.');
		return _jsonServices;
	}).catch((e) => {
		console.log('Error en promise all: ', e);
	});

}

async function getUsersSync(_jsonServices) {

	var jsonlogs = [];

	async function fs() {

		let total = _jsonServices.length;
		for(let s in _jsonServices) {
			let servicio = _jsonServices[s];
			for(let m in servicio.metodos) {
				let metodo = servicio.metodos[m];
				if(metodo.xsd_file) {
					try {
						let jsonlog = await users.getLog(metodo.xsd_file);
						console.log('XSD  Ok :', metodo.xsd_file);
						jsonlogs.push({'file': metodo.xsd_file, 'modifiers': jsonlog});
					} catch (e) {
						console.log('XSD  NOk:', metodo.xsd_file);
					}
				}
				if(metodo.wsdl_file) {
					try {
						let jsonlog = await users.getLog(metodo.wsdl_file);
						console.log('WSDL Ok :', metodo.wsdl_file);
						jsonlogs.push({'file': metodo.wsdl_file, 'modifiers': jsonlog});
					} catch (e) {
						console.log('WSDL NOk:', metodo.wsdl_file);
					}
				}
			}
			let avance = (parseInt(s)+1) / total * 100;
			console.log( (parseInt(s)+1) + ' de ' + total + ' - ' + avance.toFixed(2)+'%');
		}
	}

	await fs();
	return jsonlogs;

}
 
module.exports = {
	getFiles,
	getUsersSync
};