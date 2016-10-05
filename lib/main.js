"use strict";

const {CompositeDisposable} = require("atom");
const ModeSelector = require("./views/mode-selector.js");
const ModeStatus   = require("./views/mode-status.js");
const Modes        = require("./modes.js");
const Previewer    = require("./previewer.js");


class LanguageRegExp{
	
	activate(state = {}){
		Modes.thaw(state.modesForPaths);
		this.disposables  = new CompositeDisposable();
		this.modeSelector = new ModeSelector().initialize();
		this.modeStatus   = new ModeStatus();
		this.grammars     = {
			normal:   atom.grammars.grammarsByScopeName["source.regexp"],
			extended: atom.grammars.grammarsByScopeName["source.regexp.extended"]
		};
		this.registerCommands();
		this.patchExtendedGrammar();
		this.modeSelector.onDidConfirm(({mode}) => {
			this.modeStatus.setTo(mode);
		});
	}
	
	serialize(){
		return {
			modesForPaths: Modes.freeze()
		};
	}


	/**
	 * Associate a copy-mode with a file.
	 *
	 * @param {Object} mode
	 * @param {String|TextEditor} file
	 * @private
	 */
	assignMode(mode, file){
		file = file.getPath ? file.getPath() : file;
		
		if(!mode)
			delete Modes.files[file];
		else
			Modes.files[file] = mode;
	}
	
	
	/** Register the default command set in Atom */
	registerCommands(){
		
		for(const flag of "igmyu")
			this.addCommand("toggle-flag-"+flag, _=> Previewer.toggleFlag(flag));
		
		for(const name of ["cut", "copy", "paste", "match"])
			this.addCommand(name, _=> this[name](atom.workspace.getActiveTextEditor()));
		
		this.addCommand("toggle-mode-list", _=> this.modeSelector.toggle());
	}
	
	
	/**
	 * Register a command with Atom.
	 *
	 * @param {String} name - Command's name following package prefix: "language-regexp:#{name}"
	 * @param {Function} fn - Function that implements the actual command
	 * @private
	 */
	addCommand(name, fn){
		const namespace = "language-regexp";
		const cmdName   = `${namespace}:${name}`;
		const selector  =
			"atom-text-editor[data-grammar^='source regexp'], " +
			"atom-text-editor[data-grammar^='source js'], " +
			"atom-text-editor.regex-preview";
		
		const cmd = atom.commands.add(selector, cmdName, (...args) => fn.apply(this, args));
		this.disposables.add(cmd);
	}
	
	
	/**
	 * HACK: Install a listener to manually assign the extended regex grammar.
	 *
	 * For unknown reasons, Atom (as of v1.10.2) isn't picking up the firstLineMatch
	 * pattern of "regexp-extended.cson" (unless the file extension differs).
	 *
	 * @todo Remove once bug is fixed in Atom core
	 * @private
	 */
	patchExtendedGrammar(){
		const {normal, extended} = this.grammars;
		this.disposables.add(atom.workspace.observeTextEditors(editor => {
			const path = editor.getPath();
			
			/** Don't override manually-assigned grammars */
			if(!path || atom.grammars.grammarOverridesByPath[path]) return;
			
			/** Limit this to files using the ordinary regexp grammar */
			if(editor.getGrammar() !== normal) return;
			
			/** Override the file's grammar if its first line matches */
			const text = editor.getText().match(/^.*$/m).join("");
			if(extended.firstLineRegex.testSync(text)){
				atom.grammars.setGrammarOverrideForPath(path, "source.regexp.extended");
				editor.setGrammar(extended);
			}
		}));
	}
	
	
	/** Free up memory when deactivating package */
	deactivate(){
		this.disposables.dispose();
		this.disposables = null;
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
		return this.doCopy(editor);
	}
	
	
	/**
	 * Cut the currently-selected text of an editor.
	 *
	 * @param {TextEditor} editor
	 * @return {String}
	 */
	cut(editor){
		return this.doCopy(editor, true);
	}
	
	
	/**
	 * Paste the uncompressed/unmodified version of a copied expression.
	 *
	 * Stops the regex-compression feature getting underfoot when copying
	 * bits and pieces of a regex around in the same file.
	 *
	 * @param {TextEditor} editor
	 */
	paste(editor){
		const existingData = atom.clipboard.readWithMetadata();
		const {text, metadata} = existingData;
		
		/** Swap the clipboard's current content temporarily */
		if(metadata && "raw" in metadata){
			atom.clipboard.write(metadata.raw);
			editor.pasteText();
			atom.clipboard.write(text, metadata);
		}
	}
	
	
	/** Activate match-previewing mode */
	match(){
		Previewer.open();
	}
	
	
	/**
	 * Perform the actual cut/copy operation on the selected text.
	 *
	 * Wrapper method used internally by the copy/cut methods.
	 *
	 * @private
	 * @param {TextEditor} editor
	 * @param {Boolean} remove - Delete the text after copying it
	 * @return {String}
	 */
	doCopy(editor, remove = false){
		const selections  = editor.getSelections();
		const grammar     = editor.getGrammar();
		const textRaw     = selections.map(s => s.getText()).join("\n");
		
		/** Bail if nothing was selected */
		if(!textRaw.length) return;
		
		const currentMode = Modes.getCurrent();
		const textCleaned = currentMode.filter(textRaw, {
			scopeName:  grammar.scopeName,
			isExtended: grammar === this.grammars.extended
		});
		
		/** Delete the text if we're cutting it */
		remove && editor.buffer.transact(() => {
			for(const sel of selections){
				const range = sel.getBufferRange();
				editor.delete(range);
			}
		});
		
		atom.clipboard.write(textCleaned, {
			regexMode: currentMode,
			path: editor.getPath(),
			raw: textRaw
		});
		return textCleaned;
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
