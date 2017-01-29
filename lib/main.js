"use strict";

const {CompositeDisposable} = require("atom");
const {parse} = require("./utils.js");


class LanguageRegExp{
	
	activate(){
		this.disposables = new CompositeDisposable();
		this.registerCommand("copy-compressed", () => {
			const text = this.getEditorText();
			if(text) try {
				const {source} = parse(text);
				atom.clipboard.write(source);
				this.notify("Expression copied to clipboard");
			} catch(e){ this.error("Error parsing regular expression", e); }
		});
	}
	
	
	/** Free up memory when deactivating package */
	deactivate(){
		this.disposables.dispose();
		this.disposables = null;
	}
	
	
	/**
	 * Register a command in Atom.
	 *
	 * @param {String} name - Name of command, sans package prefix
	 * @param {Function} fn - Function that handles the command's logic
	 * @param {String} target - Selector for target receiving the command
	 * @private
	 */
	registerCommand(name, fn, target = "atom-text-editor"){
		name = "language-regexp:" + name;
		if(name in atom.commands.registeredCommands) return;
		this.disposables.add(atom.commands.add(target, name, fn));
	}
	
	
	/**
	 * Retrieve the contents of the current selection or buffer.
	 * 
	 * @return {String}
	 * @private
	 */
	getEditorText(){
		const editor = atom.workspace.getActiveTextEditor();
		return editor.getSelectedText() || editor.getText();
	}
	
	
	/**
	 * Show a brief notification to the user.
	 * 
	 * @param {String} text - Message to display
	 * @param {Number} [duration=1000] - Milliseconds before auto-dismissing
	 * @return {Notification}
	 * @private
	 */
	notify(text, duration = 1000){
		const result = atom.notifications.addInfo(text, {dismissable: true});
		setTimeout(() => result.dismiss(), duration);
		return result;
	}
	
	
	/**
	 * Display an error message to the user.
	 * 
	 * @param {String} text - One-line summary of error
	 * @param {Error} source - Error source
	 * @param {Number} [duration=1000] - Milliseconds before auto-dismissing
	 * @return {Notification}
	 * @private
	 */
	error(text, source = null, duration = 3500){
		if(source instanceof Error)
			console.dir(source);
		const detail = source ? source.message || source.toString() : null;
		const result = atom.notifications.addError(text, {detail, dismissable: true});
		setTimeout(() => result.dismiss(), duration);
		return result;
	}
}


module.exports = new LanguageRegExp();
