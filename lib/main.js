"use strict";

const {CompositeDisposable} = require("atom");
const Previewer    = require("./previewer.js");


class LanguageRegExp{
	
	activate(){
		this.disposables  = new CompositeDisposable();
		this.grammars     = {
			normal:   atom.grammars.grammarsByScopeName["source.regexp"],
			extended: atom.grammars.grammarsByScopeName["source.regexp.extended"]
		};
	}
	
	
	/** Free up memory when deactivating package */
	deactivate(){
		this.disposables.dispose();
		this.disposables = null;
	}
}


module.exports = new LanguageRegExp();
