"use strict";

module.exports = {New, addTo, compress, escape, unescape};


/**
 * Compress expanded regular expression source into JS-friendly syntax.
 *
 * @param {String} source
 * @return {RegExp}
 * @public
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
 * Double-escape backslashes in regular expression source.
 *
 * @param {String} source
 * @return {String}
 * @public
 */
function escape(source){
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
function unescape(source){
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


/**
 * Wrapper for creating a new DOM element, optionally assigning it a hash of properties upon construction.
 *
 * @param {String} nodeType - Element type to create.
 * @param {Object} obj - An optional hash of properties to assign the newly-created object.
 * @return {Element}
 */
function New(nodeType, obj){
	function absorb(a, b){
		for(const i in b)
			if(Object(a[i]) === a[i] && Object(b[i]) === b[i])
				absorb(a[i], b[i]);
			else a[i] = b[i];
	};
	const node = document.createElement(nodeType);
	if(obj) absorb(node, obj);
	return node;
}


/**
 * Curried method to append multiple nodes at once.
 *
 * @example addTo(node)(el1, el2, …)
 * @example node = addTo(node)(…)[0]
 * @return {Function}
 */
function addTo(parent){
	let count = 0;
	let target = parent;
	
	const fn = (...nodes) => {
		let lastElement;
		
		for(let node of nodes){
			if("string" === typeof node)
				node = document.createTextNode(node);
			else if(node)
				lastElement =
				fn[++count] = node;
			node && target.appendChild(node);
		}
		
		target = lastElement || target;
		return fn;
	};
	fn[count] = target;
	return fn;
}
