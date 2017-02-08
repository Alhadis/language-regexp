"use strict";

const {CompositeDisposable} = require("atom");
const {
	compress,
	escapeRegExp,
	escapeSlashes,
	unescapeSlashes,
} = require("./utils.js");


class LanguageRegExp{
	
	activate(){
		this.disposables = new CompositeDisposable();
		this.registerCommands({
			"escape":          () => this.escape(),
			"unescape":        () => this.unescape(),
			"copy-compressed": () => this.copyCompressed(),
			"cut-compressed":  () => this.copyCompressed(true),
			"copy-escaped":    () => this.copyEscaped(),
			"cut-escaped":     () => this.copyEscaped(true),
			"paste-unescaped": () => this.pasteUnescaped(),
		});
	}
	
	
	/** Free up memory when deactivating package */
	deactivate(){
		this.disposables.dispose();
		this.disposables = null;
	}
	
	
	/**
	 * Lazily register multiple commands in Atom.
	 *
	 * @example registerCommands({"cmd-name": () => handler() });
	 * @param {Object} commands - Hash of names keyed to handlers
	 * @private
	 */
	registerCommands(commands, target){
		for(const name in commands)
			this.registerCommand(name, commands[name], target);
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
	 * Escape metacharacters in selected text.
	 * @private
	 */
	escape(){
		const editor = atom.workspace.getActiveTextEditor();
		editor.mutateSelectedText(selection => {
			const source = escapeRegExp(selection.getText());
			selection.insertText(source, {select: true});
		});
	}
	
	
	/**
	 * Unescape metacharacters in selected text.
	 * @private
	 */
	unescape(){
		const editor = atom.workspace.getActiveTextEditor();
		editor.mutateSelectedText(selection => {
			const source = selection.getText().replace(/\\(.)/g, "$1");
			selection.insertText(source, {select: true});
		});
	}
	
	
	/**
	 * Compress expanded regular expression source and copy it to the clipboard.
	 * 
	 * @param {Boolean} [cut=false] - Cut text instead of copy.
	 * @private
	 */
	copyCompressed(cut = false){
		this.copy(cut, text => {
			const {source} = compress(text);
			return atom.config.get("language-regexp.copyWithDelimiters")
				? `/${source}/`
				: source;
		});
	}
	
	
	/**
	 * Double-escape backslashes in regexp source and copy it to the clipboard.
	 * 
	 * Useful when working with CSON-based language grammars.
	 * 
	 * @param {Boolean} [cut=false] - Cut text instead of copy.
	 * @private
	 */
	copyEscaped(cut = false){
		this.copy(cut, text => escape(text));
	}
	
	
	/**
	 * Copy the current selection or buffer to the clipboard.
	 * 
	 * Called internally by other copy/cut methods.
	 * 
	 * @param {Boolean} [cut=false] - Erase selection or buffer after copying.
	 * @param {Function} [filter] - Transformation to apply to text before copying.
	 * @private
	 */
	copy(cut = false, filter = null){
		const editor = atom.workspace.getActiveTextEditor();
		cut ? editor.cutSelectedText() : editor.copySelectedText();
		try {
			let {text, metadata} = atom.clipboard.readWithMetadata();
			text = filter ? filter(text) : text;
			atom.clipboard.write(text, metadata);
		} catch(e){ this.error("Error copying regular expression", e); }
	}
	
	
	/**
	 * Strip slashes from copied regular expression data.
	 * 
	 * Used in conjunction with {@link #copyEscaped}.
	 * @private
	 */
	pasteUnescaped(){
		let {text, metadata} = atom.clipboard.readWithMetadata();
		if(!text) return;
		atom.clipboard.write(unescape(text), metadata);
		const editor = atom.workspace.getActiveTextEditor();
		editor.pasteText();
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
