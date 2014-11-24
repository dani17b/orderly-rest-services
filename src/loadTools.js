var fs 	= require('fs')
	,orderly = require('orderly');
var conf = {	
	services:[]
}


var showState = function() {
	console.log("\n------------------- Loaded services -------------------");
}


var loadService = function(name,type,pos){
	// Get file and convert orderly to json
	var file;
	if (type == "request") {
		file = "../data/services"+name+"/"+type+".orderly";
	} else {
		file = "../data/services"+name+"/"+type+".json";
	}
	
	var schema = {};
	fs.readFile(file, 'utf8', function(err, data) {
		// Comprobamos si hay un esquema de petición, en ese caso
		// interpretamos la petición como un post, en caso contrario la 
		// interpretaremos como un get.
		if(type == "request"){
			if (err) {
				services[pos]["method"] = "GET";
				console.log("Name: "+services[pos]["url"]);
				console.log("Method: "+services[pos]["method"]);
				console.log("--------------------------x----------------------------");
				return;
			} else {
				services[pos]["method"] = "POST";
				console.log("Name: "+services[pos]["url"]);
				console.log("Method: "+services[pos]["method"]);
				console.log("--------------------------x----------------------------");
				var jsonSchemaObject = orderly.parse(data);
				schema = jsonSchemaObject;	
				services[pos][type] = jsonSchemaObject;	
			}
		}else{
			services[pos][type] = data;
		}
	});
	return schema;
}


var walkDirectory = function(path) {
  var dir = fs.readdirSync(path);
  for (var i = 0; i < dir.length; i++) {
    var name = dir[i];
    var target = path + '/' + name;
    var stats = fs.statSync(target);
    if (stats.isDirectory()) {
    	var auxDir = fs.readdirSync(target+"/");
    	for (var j = 0; j < auxDir.length; j++) {
    		var name = auxDir[j];
    		if(name != undefined){
    			if(name == 'request.orderly' || name == 'response.json'){
    				conf["services"].push({url : target.slice(16)});
    				break;
    			}
    		}
    	}
      walkDirectory(target);
    }
  }
};

var getServices = function(conf){
	
	// Find services
	walkDirectory('../data');
	var services = [];
	var i = 0;
	conf["services"].forEach(function(service) {
		services.push({ url : service['url'], method : "", request : {},
			response : {}});
		loadService(service['url'],"request",i);
		loadService(service['url'],"response",i);
		i++;
	});
	return services;
}

var services = getServices(conf); 

// Funcion que recupera un servicio al realizar una peticion
var getService = function(url){
	var result = {};
	services.forEach(function(service) {
		if(service['url'] == url){
			result = service;
		}
	});
	return result;
}

var getServicesPaths = function(){
	var servicesPaths = [];
	services.forEach(function(service) {
		servicesPaths.push(service['url']);
	});
	return servicesPaths;
}

// Exports
module.exports.showState = showState;
module.exports.services = services;
module.exports.getService = getService;
module.exports.getServicesPaths = getServicesPaths;