#!/usr/local/bin/node --es_staging
"use strict";

const {tokenise} = require("./charmap.js");
const print = require("print");

let test = tokenise("ABC (IJK) XYZ");
print.out(test);
