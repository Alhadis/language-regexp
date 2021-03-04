#!/usr/bin/env ruby
require_relative "./0-helpers"

print_heading __FILE__
VIM_MODELINE = load_regexp("../modeline-vim.regexp")
VIM_TESTS = {
	:match => [
		"conf",  "# vim: noexpandtab: ft=conf",
		"js",    "# vim:noexpandtab titlestring=hi|there\\\\ ft=js ts=4",
		"sh",    "vim: noai :  ft=sh:noexpandtab",
		"js",    "vim: noai ft=js noexpandtab",
		"ruby",  "vim: ft   =ruby",
		"a65",   "/* vim: set filetype=a65: */",
		"bash",  "/* vim: set ts=8 sw=4 filetype=bash tw=0: */",
		"ruby",  "/* vim: set ft=ruby ts=8 sw=4 tw=0: */",
		"ruby",  "# vim: filetype=ruby",
		"ruby",  "# vim: ft=ruby",
		"Ruby",  "# vim: syntax=Ruby",
		"ruby",  "# vim: se syntax=ruby:",
		"ruby",  "# vim: set syntax=ruby:",
		"ruby",  "# ex: syntax=ruby",
		"ruby",  " ex: noexpandtab: ft=ruby",
		"ruby",  "# vim600: ft=ruby",
		"ruby",  "vim<520: ft=ruby",
		"cpp",   "/* vim: set ft=cpp: */",
	].freeze,
	
	:fail => [
		"# vim:noexpandtab titlestring=hi\|there\\\ ft=perl ts=4",
		"/* vim: set filEtype=pRoloG: */",
		"ex: noexpandtab: ft=ruby",
		"vim: titlestring=\\ ft=perl",
		"vim: ft= ",
	].freeze,
}

test_matches(VIM_MODELINE, VIM_TESTS[:match]).map {|x| print_result(x)}
test_failures(VIM_MODELINE, VIM_TESTS[:fail]).map {|x| print_result(x)}
