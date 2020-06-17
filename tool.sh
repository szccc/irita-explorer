#!/bin/bash

function recover_config_file(){
  git checkout -- src/config.js
}

function use_dev(){
  npm run param dev,200,http://10.1.4.224:3000,http://10.2.10.130:2317
}

function use_qa(){
  npm run param qa,200,http://10.1.4.224:3000,http://10.2.10.130:2317
}

function use_stage(){
  npm run param stage,200,http://10.1.4.224:3000,http://10.2.10.130:2317
}

if [ $1 == "r" ] ; then
  recover_config_file
elif [ $1 == "d" ] ; then
  use_dev
elif [ $1 == "q" ] ; then
  use_qa
elif [ $1 == "s" ] ; then
  use_stage
fi
