#!/usr/local/bin/node --es_staging
"use strict";

const print = require("print");
const {STT, charmap, CHARMAP_SIZE} = require("./charmap.js");


const input = "ABC(IJK)XYZ";
const stack = [];
let token = [];
let state = 0;

const {length} = input;
for(let i = 0; i < length; ++i){
	const code = input.charCodeAt(i);
	const charClass = code > CHARMAP_SIZE
		? 0
		: charmap[code];
	
	const instruction = STT[state][charClass];
	if(instruction < 0){
		
		switch(instruction){
			case -2: // CARRY
				console.log(`+ CARRY: ${input[i]}`, state);
				token.push(input[i]);
				break;
			case -3:{ // PUSH
				console.log(`\x1B[38;5;10m> PUSH:\x1B[0m`, token, state);
				stack.push(token);
				token = [state];
				break;
			}
			case -4:{ // POP RESULT
				console.log(`\x1B[38;5;6m< POP:\x1B[0m `, token, state);
				break;
			}
			default:{
				const message = `Unexpected token: ${input[i]} (ClassCode: ${charClass}; State ID: ${state});`;
				throw new SyntaxError(message);
			}
		}
	}
	
	else{
		console.log(`STATE TRANSITION: ${state} -> ${instruction}`);
		state = instruction;
		stack.push(token);
		token = [];
	}
}


print.out(token);
print.out(stack);
