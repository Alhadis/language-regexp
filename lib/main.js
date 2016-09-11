"use strict";

const {CompositeDisposable} = require("atom");
const ModeSelector = require("./views/mode-selector.js");
const ModeStatus   = require("./views/mode-status.js");
const Modes        = require("./modes.js");


class LanguageRegExp{
	
	activate(state = {}){
		Modes.thaw(state.modesForPaths);
		this.disposables  = new CompositeDisposable();
		this.modeSelector = new ModeSelector().initialize();
		this.modeStatus   = new ModeStatus();
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
		const normal   = atom.grammars.grammarsByScopeName["source.regexp"];
		const extended = atom.grammars.grammarsByScopeName["source.regexp.extended"];

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
		const selections = editor.getSelections();
		let text = selections.map(s => s.getText()).join("\n");
		text = Modes.getCurrent().filter(text);
		
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
		text = Modes.getCurrent().filter(text);
		
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
