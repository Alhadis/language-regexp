"use strict";

const {SelectListView} = require("atom-space-pen-views");
const {Emitter}        = require("atom");
const {New, addTo}     = require("../utils.js");
const mainModule       = require("../main.js");
const Modes            = require("../modes.js");


class ModeSelector extends SelectListView{
	
	initialize(){
		this.emitter = new Emitter();
		super.initialize();
		this.list.addClass("mark-active copy-mode-list");
		return this;
	}
	
	
	/**
	 * Tie a callback to run when a selection's been confirmed.
	 *
	 * @param {Function} fn
	 * @public
	 */
	onDidConfirm(fn){
		this.emitter.on("did-confirm", fn);
	}
	
	
	attach(){
		this.storeFocusedElement();
		if(!this.panel)
			this.panel = atom.workspace.addModalPanel({item: this});
		this.focusFilterEditor();
	}
	
	
	/**
	 * Generate an HTML element to represent a specific mode-type.
	 *
	 * @param {Object} mode
	 * @return {HTMLLIElement}
	 * @private
	 */
	viewForItem(mode){
		const el = New("li");
		
		if(mode === this.currentMode)
			el.className = "active";
		
		addTo(el)(
			New("div", {className: "copy-mode-wrap"})
		)(
			New("div", {
				className: "copy-mode-title",
				textContent: mode.title
			}),
			New("div", {
				className: "copy-mode-info",
				innerHTML: mode.info
			})
		);
		
		if(this.currentMode === mode)
			el.className = "active";
		return el;
	}
	
	
	/**
	 * Detach the list when deactivating.
	 *
	 * @private
	 */
	destroy(){
		this.cancel();
	}
	
	
	/**
	 * Show or hide the selection list.
	 *
	 * @private
	 */
	toggle(){
		if(this.panel != null)
			this.cancel();
		
		else{
			this.currentEditor = atom.workspace.getActiveTextEditor();
			this.currentPath = this.currentEditor.getPath();
			this.currentMode = Modes.files[this.currentPath] || Modes.default;
			this.setItems(Modes);
			this.attach();
		}
	}
	
	
	/**
	 * Return the property name to search/filter entries by.
	 *
	 * @return {String}
	 * @private
	 */
	getFilterKey(){
		return "title";
	}
	
	
	/**
	 * Callback invoked when a user makes their selection.
	 *
	 * @param {Object} mode
	 * @private
	 */
	confirmed(mode){
		const path = this.currentPath;
		Modes.files[path] = mode;
		this.emitter.emit("did-confirm", {path, mode});
		this.cancel();
	}
	
	
	/**
	 * Called when user dismisses the list without making a choice.
	 *
	 * @private
	 */
	cancelled(){
		this.panel && this.panel.destroy();
		this.panel = null;
		this.currentEditor = null;
	}
}


module.exports = ModeSelector;
