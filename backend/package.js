#!/usr/bin/env node

let fs = require('fs');
let program = require('commander');

function list (val) {
	return val.split(',')
}
program
.option("-p, <items>","config list" ,list)
.parse(process.argv);

replaceEnv([
		"./config/config.json",
	],
	{
		"mongoUrl": program.P[0],
		"lcdAddress": program.P[1],
		"syncServiceTime": program.P[2],
		
	}
);


function replaceEnv(files, params) {
	files.forEach(function(file,index){
		let result = fs.readFileSync(file).toString();
		for (let key in params) {
			let r = "\\${"+key+"}";
			result = result.replace(new RegExp(r,"g"), params[key]);
		}
		
		fs.writeFileSync(file, result)
	});
}
