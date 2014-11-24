var express = require('express')
	,http 	= require('http')
	,bodyParser = require('body-parser')
	,validator = require('jsonschema').Validator
	,tools = require('./loadTools');

var app = express();

var conf = {	
	services:[]
}
// ------------------------------------------------------------------------------------------
// ----------------------------------- Auxiliar functions -----------------------------------
// ------------------------------------------------------------------------------------------
tools.showState();

services = tools.services;

var validate = function(schema, data){
	var objectName = "";
	// Get object name
	for(var root in schema.properties){
		objectName = root;
	}

	var v = new validator();
	
	if(v.validate(data,schema.properties[objectName]).errors.length == 0){
		return true;
	}else{
		return v.validate(data,schema.properties[objectName]).errors;
	}
	return true;
}
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

app.use(bodyParser.json());

app.use(tools.getServicesPaths(), function(req, res){
	var url = req.originalUrl;
	var service = tools.getService(url);

	// Check if method is correct
	if(service['method'] == req.method){
		// Check if header is correct
		if(req.headers['content-type'] == 'application/json'){
			// Get content and save as json
			var content = req.body;

			// Check if post request is valid
			if(service['method'] == "POST"){
				// Schema request validation
				var valRes = validate(service["request"],content);
				if(valRes != true){
					res.status(400).send("Invalid request:\n"+valRes);
					return;
				}
			}

			// Send response
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(service["response"]);

		}else{
			res.status(406).send("Invalid headers");
		}
	}else{
		console.log("Error, peticion no valida");
		res.status(405).send("Invalid method");
	}
})


app.use(function(req, res){
  res.status(404).send("Not found");
});

app.listen(process.env.PORT || 8080);