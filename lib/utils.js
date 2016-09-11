"use strict";

module.exports = {New, addTo, compressRegEx};


/**
 * Strip whitespace and comments from an expanded expression.
 *
 * The result is a JavaScript-compatible regex string, suitable
 * for dropping into JS source as a valid expression literal.
 *
 * @param {String} src
 * @param {Boolean} stripExtended - Remove "# comments"
 * @return {String}
 * @public
 */
function compressRegEx(src, stripExtended = false){
	
	/** RegEx modifiers currently supported by JavaScript */
	const recognised = {
		g: true,
		i: true,
		m: true,
		u: true,
		y: true
	};
	
	/** Glean flags from scoped modifiers */
	let on, off;
	const matchFlags = /^\s*\(\?(\w*)(?:-(\w+))?\)/;
	src = src.replace(matchFlags, function(...args){
		on  = args[1];
		off = args[2];
		return "";
	});
	
	/** Use a dumb but flexible/permissive approach for parsing flags */
	let flags = {};
	if(on)  for(let f of on.split(""))  if(recognised[f]) flags[f] = true;
	if(off) for(let f of off.split("")) if(recognised[f]) delete flags[f];
	flags = Object.keys(flags).join("");
	
	/** Strip comments */
	src = safeEscape(src);
	src = src.replace(/\(\?#(?:[^\\)]|\\.)*\)/g, "");  // (?# Bracketed)
	if(stripExtended) src = src.replace(/#.*$/gm, ""); //   # /x style
	
	src = safeUnescape(src);
	
	return "/" + src.replace(/\s+/g, "") + "/" + flags;
}


/**
 * Encode potentially problematic escapes using unicode sequences.
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
 * Unescape some characters obfuscated by safeEscape.
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
