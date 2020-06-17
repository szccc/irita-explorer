#!/usr/bin/env node

let fs = require('fs');
let program = require('commander');

function list (val) {
    return val.split(',')
}

program
    .option("-e, --environment <string>", "App environment")
    .option("-b, --buildNumber <string>", "Bamboo build number")
    .option("-p, --params <items>", "An list of app environment and bamboo build number, e.g.: dev,25", list)
    .parse(process.argv);

console.log('Replacing environments ...');
let env = program.environment ? program.environment : "dev",
    buildNumber = 1,
    serverAddr = "http://10.1.4.224:3000",
    lcdAddr = "http://10.2.10.130:2317";

if (program.params) {
    env = program.params[0] ? program.params[0] : env;
    buildNumber = program.params[1] ? program.params[1] : buildNumber;
    serverAddr = program.params[2] ? program.params[2].replace(/\/\$/,'') : serverAddr;
    lcdAddr = program.params[3] ? program.params[3].replace(/\/\$/,'') : lcdAddr;
}

console.log(env,buildNumber,serverAddr,lcdAddr);

replaceEnv([
        "./src/config.js",
    ],
    {
        "env": env,
        "buildNumber": buildNumber,
        "serverAddr": serverAddr,
        "lcdAddr": lcdAddr,
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