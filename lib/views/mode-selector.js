"use strict";

const {SelectListView} = require("atom-space-pen-views");
const {New, addTo} = require("../utils.js");
const mainModule   = require("../main.js");


class ModeSelector extends SelectListView{
	
	initialize(){
		super.initialize();
		this.list.addClass("mark-active");
		return this;
	}
	
	attach(){
		this.storeFocusedElement();
		if(!this.panel)
			this.panel = atom.workspace.addModalPanel({item: this});
		this.focusFilterEditor();
	}
	
	destroy(){
		this.cancel();
	}
	
	toggle(){
		if(this.panel != null)
			this.cancel();
		
		else{
			const editor = atom.workspace.getActiveTextEditor();
			const path   = editor.getPath();
			
			this.currentEditor = editor;
			this.currentMode   = {};
			this.attach();
		}
	}
	
	viewForItem(mode){
		const el = New("li", {textContent: mode.title});
		if(this.currentMode === mode)
			el.className = "active";
		return el;
	}
	
	getFilterKey(){
		return "title";
	}
	
	confirmed(mode){
		mode.assign(this.currentEditor);
	}
	
	cancelled(){
		this.panel && this.panel.destroy();
		this.panel = null;
		this.currentEditor = null;
	}
}


module.exports = ModeSelector;
