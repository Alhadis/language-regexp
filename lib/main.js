"use strict";

const {CompositeDisposable} = require("atom");
const ModeSelector = require("./views/mode-selector.js");
const ModeStatus   = require("./views/mode-status.js");


class LanguageRegExp{
	
	activate(state = {}){
		this.disposables  = new CompositeDisposable();
		this.modeSelector = new ModeSelector().initialize();
		this.modeStatus   = new ModeStatus();
		this.registerCommands();
	}

	
	/** Register Atom commands */
	registerCommands(){
		const namespace = "language-regexp";
		const selector  = "atom-text-editor[data-grammar^='source regexp']";
		
		for(const name of ["cut", "copy"]){
			const cmdName = `${namespace}:${name}`;
			this.disposables.add(atom.commands.add(selector, cmdName, _=> {
				this[name](atom.workspace.getActiveTextEditor());
			}));
		}
		
		this.disposables.add(atom.commands.add(selector, `${namespace}:toggle-mode-list`, _=> {
			this.modeSelector.toggle();
		}));
	}
	
	
	/** Free up memory when deactivating package */
	deactivate(){
		this.disposables.dispose();
		this.disposables = null;
	}
	
	
	/**
	 * Strip whitespace and comments from a string.
	 *
	 * @param {String} text
	 * @return {String}
	 */
	cleanUp(text){
		return text
			.replace(/\(\?#(?:[^\\)]|\\.)*\)/g, "")
			.replace(/\s+/g, "")
	}
	
	
	/**
	 * Copy a cleaned-up version of an editor's selection.
	 *
	 * This takes into account the user's current copy-mode for this
	 * file, overriding Atom's default copy command.
	 *
	 * @param {TextEditor} editor
	 * @return {String}
	 */
	copy(editor){
		const selections = editor.getSelections();
		let text = selections.map(s => s.getText()).join("\n");
		text = this.cleanUp(text);
		
		const path = editor.getPath();
		atom.clipboard.write(text, {path});
		return text;
	}
	
	
	/**
	 * Cut the currently-selected text of an editor.
	 *
	 * @param {TextEditor} editor
	 * @return {String}
	 */
	cut(editor){
		const selections = editor.getSelections();
		let text = selections.map(s => s.getText()).join("\n");
		text = this.cleanUp(text);
		
		editor.buffer.transact(() => {
			for(const sel of selections){
				const range = sel.getBufferRange();
				editor.delete(range);
			}
		});
		
		const path = editor.getPath();
		atom.clipboard.write(text, {path});
		return text;
	}
	
	
	/**
	 * Display a mode-indicator in the status-bar.
	 *
	 * NOTE: This doesn't use the services API, because we need to ensure
	 * the tile is inserted directly after the grammar selector's tile.
	 *
	 * @param {StatusBar} statusBar
	 */
	consumeStatusBar(statusBar){
		setTimeout(() => this.modeStatus.initialise(statusBar), 1);
	}
}


module.exports = new LanguageRegExp();
