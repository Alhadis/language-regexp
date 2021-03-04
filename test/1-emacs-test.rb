#!/usr/bin/env ruby
require_relative "./0-helpers"

print_heading __FILE__
EMACS_MODELINE = load_regexp("../modeline-emacs.regexp")
EMACS_TESTS = {
	:match => [
		"ruby",        "-*- ruby -*-",
		"ruby",        "-*- foo:bar; mode: ruby; -*-",
		"ruby",        "-*-mode:ruby-*-",
		"ruby",        "-*- mode: ruby -*-",
		"ruby",        "-*- mode  : ruby -*-",
		"ruby",        "-*- ruby-*-",
		"c++",         "-*-c++-*-",
		"c++",         "-*- c++ -*-",
		"C++",         "-*- mode:C++ -*-",
		"c++",         "-*- font:bar;mode:c++ -*-",
		"c++",         "-*-foo:bar;mode:c++;bar:foo-*-",
		"c++",         "-*- foo : bar ; mode : c++ ; bar : foo -*-",
		"c++",         "-*- mode : c++ ; bar : foo -*-",
		"C++",         "-*- font:x;foo : bar ; mode : C++ ; bar : foo ; foooooo:baaaaar;fo:ba-*-",
		"c++",         "-*-foo:bar;mode:c++;bar:foo;tyrell:corp-*-",
		"c++",         "-*- foo-bar mode: c++ -*-",
		"c++",         "-*--------- foo:bar mode: c++ -*-",
		"c++",         "/* -*- mode: c++ -------*- */",
		"PhP",         "; -*- MoDe: PhP;-*-",
		"Smalltalk",   "; -*-mode:Smalltalk-*-",
		"fundamental", "// -*- fundamental -*-",
	].freeze,
	
	:fail => [
		"-*- foo:bar bar:baz;",
		"-*- ruby --*-",
		"-*- ruby--*-",
	].freeze,
}

test_matches(EMACS_MODELINE, EMACS_TESTS[:match]).map {|x| print_result(x)}
test_failures(EMACS_MODELINE, EMACS_TESTS[:fail]).map {|x| print_result(x)}
