"use strict";

const {CompositeDisposable} = require("atom");
const {New, addTo} = require("../utils.js");


class ModeStatus extends HTMLDivElement{
	
	initialise(statusBar){
		this.disposables = new CompositeDisposable();
		this.mainModule  = require("../main.js");
		
		/** Pour a glass of DOM juice */
		this.statusBar   = statusBar;
		this.className   = "inline-block";
		this.labelNode   = New("span", {
			textContent: "JS",
			className: "mode-status-label"
		});
		addTo(this)
			(New("a", {href: "#"}))
			("(for ", this.labelNode, ")")
		
		/** Configure handlers */
		const sideOpt = "grammar-selector.showOnRightSideOfStatusBar";
		this.disposables.add(atom.config.observe(sideOpt, value => this.attach(value)));
		this.disposables.add(atom.workspace.onDidChangeActivePaneItem(_=> this.refresh()));
		this.addEventListener("click", e => {
			const view = atom.views.getView(atom.workspace.getActiveTextEditor());
			atom.commands.dispatch(view, "language-regexp:toggle-mode-list");
			e.preventDefault();
		});
	}
	
	
	/** Attach the status-tile to the appropriate side of the status-bar */
	attach(onRightSide = true){
		const tiles = onRightSide
			? this.statusBar.getRightTiles()
			: this.statusBar.getLeftTiles();
		
		/** Locate index of grammar-selector within tile-collection */
		const index = tiles.findIndex(t => 
			t.item &&
			t.item.tagName &&
			t.item.tagName.toLowerCase() === "grammar-selector-status"
		);
		
		if(index !== -1){
			const {item} = tiles[index];
			const {nextSibling} = item;
			item.parentElement.insertBefore(this, nextSibling);
		}
		
		this.refresh();
	}
	
	
	/** Show the mode-status tile if needed */
	refresh(){
		const ed = atom.workspace.getActiveTextEditor();
		
		/** Not relevant to this view; hide */
		if(!ed || !/^source\.regexp/.test(ed.getGrammar().scopeName)){
			this.currentEditor = null;
			this.style.display = "none";
		}
		
		/** Relevant */
		else if(ed){
			
			/** Dispose of any existing listeners */
			if(ed !== this.currentEditor && this.editorDisposable){
				this.editorDisposable.dispose();
				this.editorDisposable = null;
			}
			
			const mode = "";
			this.labelNode.textContent = mode ? mode.abbr : "...";
			this.style.display = "";
			this.currentEditor = ed;
			this.editorDisposable = new CompositeDisposable();
			this.editorDisposable.add(ed.onDidChangeGrammar(_=> {
				setImmediate(_=> this.refresh());
			}));
		}
	}
}

module.exports = document.registerElement("regex-copy-mode", {
	prototype: ModeStatus.prototype
});
