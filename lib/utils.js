"use strict";

module.exports = {
	compress,
	escapeRegExp,
	escapeSlashes,
	unescapeSlashes
};


/**
 * Compress expanded regular expression source into JS-friendly syntax.
 *
 * @param {String} source
 * @return {RegExp}
 */
function compress(source){
	
	// RegEx modifiers currently supported by JavaScript
	const recognised = {
		g: true,
		i: true,
		m: true,
		u: true,
		y: true
	};
	
	// Glean flags from scoped modifiers
	let on, off;
	const matchFlags = /^\s*\(\?(\w*)(?:-(\w+))?\)/;
	source = source.replace(matchFlags, function(...args){
		on  = args[1];
		off = args[2];
		return "";
	});
	
	// Use a dumb but flexible/permissive approach for parsing flags
	let flags = {};
	if(on)  for(let f of on.split(""))  if(recognised[f]) flags[f] = true;
	if(off) for(let f of off.split("")) if(recognised[f]) delete flags[f];
	flags = Object.keys(flags).join("");
	
	// Strip (?# bracketed comments)
	source = safeEscape(source)
		.replace(/\(\?#(?:[^\\)]|\\.)*\)/g, "")
		.replace(/#.*$/gm, "");
	
	source = safeUnescape(source).replace(/\s+/g, "");
	return new RegExp(source, flags);
}


/**
 * Escape special regex characters within a string.
 *
 * @example "file.js" -> "file\\.js"
 * @param {String} input
 * @return {String}
 */
function escapeRegExp(input){
	return input.replace(/([/\\^$*+?{}\[\]().|])/g, "\\$1");
}


/**
 * Double-escape backslashes in regular expression source.
 *
 * @param {String} source
 * @return {String}
 */
function escapeSlashes(source){
	return source
		.replace(/(^|[^\\])\\(['"`])/g, "$1$2")
		.replace(/\\/g,    "\\\\")
		.replace(/'|"|`/g, "\\$&");
}


/**
 * Strip slashes from double-escaped sequences.
 *
 * @param {String} source
 * @return {String}
 */
function unescapeSlashes(source){
	return source
		.replace(/(^|[^\\])\\(['"`])/g, "$1$2")
		.replace(/\\(.)/g, "$1");
}


/**
 * Encode potentially problematic escapes using Unicode sequences.
 *
 * @param {String} src
 * @return {String}
 * @private
 */
function safeEscape(src){
	const encodeNumeric = (_, s) =>
		"\\x" + s.charCodeAt(0).toString(16).toUpperCase();
	
	return src
		.replace(/\\([\\[\]])/g,  encodeNumeric)
		.replace(/\[([^\]]+)\]/g, (_, chars) => {
			return "[" + chars.replace(/([\t\x20#])/g, encodeNumeric) + "]"
		});
}


/**
 * Unescape some characters obfuscated by {@link safeEscape}.
 *
 * @param {String} src
 * @return {String}
 * @private
 */
function safeUnescape(src){
	return src
		.replace(/\\x(5[BD]|23|09)/g, (_,s) => String.fromCodePoint(parseInt(s, 16)))
		.replace(/\\x5C/g, "\\\\");
}
