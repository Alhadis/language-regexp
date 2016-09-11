"use strict";

const Utils = require("./utils.js");
const files = {};


class Modes extends Array{
	get files(){ return files }
	get default(){ return this.JS; }
	
	constructor(...args){
		super(...args);
		this.forEach(mode => this[mode.label] = mode);
	}
	
	/**
	 * Provide data to be saved between workspace sessions.
	 *
	 * @return {Object}
	 */
	freeze(){
		const output = Object.assign({}, files);
		for(const key in output)
			output[key] = output[key].label;
		return output;
	}
	
	
	/**
	 * Remap filepaths back to object references.
	 *
	 * @param {Object} ice
	 */
	thaw(ice){
		if(!ice) return;
		for(const path in ice)
			files[path] = this[ice[path]];
	}
	
	
	/**
	 * Return the copy-mode for the currently-active editor.
	 *
	 * @return {Object}
	 */
	getCurrent(){
		const ed = atom.workspace.getActiveTextEditor();
		if(!ed) return this.default;
		return this.files[ed.getPath()] || this.default;
	}
}


module.exports = new Modes({
	value: null,
	label: "...",
	title: "None",
	info: "Don't transform source when copying to clipboard.",
	filter: s => s
},{
	value: "JS",
	label: "JS",
	title: "JavaScript",
	info: "Strip whitespace and comments. Produces a valid JavaScript RegExp literal.",
	filter: s => Utils.compressRegEx(s)
},{
	value: "CSON",
	label: "CSON",
	title: "CSON Grammar",
	info: "Retain whitespace and comments, but double-escape backslashes.",
	filter: s => s.replace(/\\/g, "\\\\")
});
