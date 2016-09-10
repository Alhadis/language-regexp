"use strict";

module.exports = {New, addTo};


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
