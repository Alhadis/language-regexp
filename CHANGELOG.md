Change Log
==========

This project honours [Semantic Versioning](http://semver.org).


[Staged]
------------------------------------------------------------------------
* __Added:__ Dedicated scope for identifying empty capturing groups
* __Added:__ Grammar for POSIX.2 (IEEE Std 1003.2) “extended” regexes
* __Added:__ Highlighting of quoted/verbatim characters inside `\Q`…`\E`
* __Added:__ Extended regexp highlighting inside `(?x: …)` groups
* __Added:__ Support for codepoint sequences ([Oniguruma 6.9.5+][3])
* __Added:__ Support for trailing whitespace in `\x{… }` and `\o{… }`
* __Fixed:__ Typo in `.source.regexp`'s `editor.commentEnd` setting

[3]: https://github.com/kkos/oniguruma/releases/tag/v6.9.5



[v1.1.2]
------------------------------------------------------------------------
**May 4th, 2020**  
Adds syntax highlighting for patterns in Bash `[[ =~ … ]]` conditionals.
Note that this only works when [Tree Sitter parsers are disabled][2].

[2]: https://github.com/Alhadis/language-regexp/issues/5



[v1.1.1]
------------------------------------------------------------------------
**September 1st, 2019**  
Fixes malformed syntax reported by [`Alhadis/language-regexp#1`][1].

[1]: https://github.com/Alhadis/language-regexp/issues/1


[v1.1.0]
------------------------------------------------------------------------
**July 12th, 2019**  
Considerable improvements made to syntax highlighting:

* __Added:__ Patterns for matching script runs (Perl 5.28+)
* __Added:__ Patterns for matching Oniguruma's "absent functions"
* __Added:__ Patterns for matching Oniguruma's `y{…}` text-segment mode
* __Added:__ Patterns for matching Oniguruma callouts
* __Added:__ Patterns for matching Oniguruma's `\y`, `\Y`, and `\O`
* __Added:__ Support for toggling comments and auto-indenting groups
* __Fixed:__ Lack of comment highlighting in "extended" regexp grammar
* __Fixed:__ Incorrect highlighting of `(?R)` and `(?0)` constructs
* __Fixed:__ Missing highlighting for `\R` escapes
* __Fixed:__ Missing highlighting of reset sequence in scoped modifiers


[v1.0.1]
------------------------------------------------------------------------
**March 1st, 2017**  
Unexciting patch-release to address trivial highlighting bugs:

* __Fixed:__ "Match-anything" dots not highlighted as metacharacters
* __Fixed:__ Runaway-matching in bracketed classes that end with a dash


[v1.0.0]
------------------------------------------------------------------------
**January 30th, 2017**  
Initial release. Adds syntax highlighting for regular expression data.


[Referenced links]:_____________________________________________________
[Staged]: ../../compare/v1.1.3...HEAD
[v1.1.2]: https://github.com/Alhadis/language-regexp/releases/tag/v1.1.2
[v1.1.1]: https://github.com/Alhadis/language-regexp/releases/tag/v1.1.1
[v1.1.0]: https://github.com/Alhadis/language-regexp/releases/tag/v1.1.0
[v1.0.1]: https://github.com/Alhadis/language-regexp/releases/tag/v1.0.1
[v1.0.0]: https://github.com/Alhadis/language-regexp/releases/tag/v1.0.0
