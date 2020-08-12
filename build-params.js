#!/usr/bin/env node

let fs = require('fs');
let prodConfig =  require("./src/productionConfig"); 


let title = prodConfig.title || 'CSChain Explorer',
    text_color_first = prodConfig.text.color.first || '#171D44',
    text_color_second = prodConfig.text.color.second || '#787C99',
    text_color_third = prodConfig.text.color.third || '#C0C4CC',
    text_color_fourth = prodConfig.text.color.fourth || 'rgba(255,255,255,0.5)',
    text_color_link = prodConfig.text.color.link || '#3264fd',
    button_color_common = prodConfig.button.color.common || 'white',
    button_bgColor_common = prodConfig.button.color.common || '#3264FD';


replaceEnv([
        "./public/index.html",
        "./src/style/productization.scss",
    ],
    {
        title : title,
        text_color_first : text_color_first,
        text_color_second : text_color_second,
        text_color_third : text_color_third,
        text_color_fourth : text_color_fourth,
        text_color_link : text_color_link,
        button_color_common : button_color_common,
        button_bgColor_common : button_bgColor_common
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