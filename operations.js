'use strict';

const globals = require('./globals');
const fs = require('fs');

function getXML(_file) {

	if(fs.existsSync(_file)) {
		return fs.readFileSync(_file, 'utf8');
	}else{
		return '\n\nArchivo: \n\n\t' + _file.substr(globals.ROOT_DIR.length-1) + '\n\n\tNo generado o con nombre fuera de norma.\n\n\n';
	}

}

function getPicture(_file) {

	var pic_b64;

	if(fs.existsSync(_file)) {
		pic_b64 =fs.readFileSync(_file, 'base64');
		if(pic_b64) {
			return 'data:image/png;base64,' + pic_b64;
		}
	}

}

exports.getOperation = function(_service, _method, _version, _jsonservices) {

	var service_find,
		jsonMethod;

	service_find = _jsonservices.find(item=>item.servicioNombre==_service);
	if(service_find) {
		try {
			service_find.metodos.forEach(element => {
				if ( element.metodoNombre == _method && element.metodoVersion == _version ){

					jsonMethod = {'WSDL': getXML(globals.ROOT_DIR + element.patch_wsdl + element.archivo_wsdl + '.wsdl'),
						'XSD': getXML(globals.ROOT_DIR + element.patch_xsd + element.archivo_xsd + '.xsd'),
						'Request': getXML(globals.ROOT_DIR + element.path_examples + _service + '_' + _method + 'Request.xml'),
						'ResponseOK': getXML(globals.ROOT_DIR + element.path_examples + _service + '_' + _method + 'ResponseOK.xml'),
						'ResponseErrNeg': getXML(globals.ROOT_DIR + element.path_examples + _service + '_' + _method + 'ResponseErrorNeg.xml'),
						'GraphSchema': getPicture(globals.ROOT_DIR + element.path_images + 'Esquema_de_Solucion.png'),
						'GraphPatern': getPicture(globals.ROOT_DIR + element.path_images + _method + '.png')};
				} 
			});
		}catch(_e){
			console.log('Servicio: ' + _service + ', método: ' + _method + ' no encontrado!');
		}
	}else{
		console.log('Servicio: ' + _service + ' no encontrado!');
	}

	return jsonMethod;

};