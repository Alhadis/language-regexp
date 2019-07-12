Change Log
==========

This project honours [Semantic Versioning](http://semver.org).


[Staged]
------------------------------------------------------------------------
* __Added:__ Patterns for matching script runs (Perl 5.28+)
* __Added:__ Patterns for matching Oniguruma's `y{…}` text-segment mode
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
[Staged]: ./compare/v1.0.1...HEAD
[v1.0.1]: https://github.com/Alhadis/language-regexp/releases/tag/v1.0.1
[v1.0.0]: https://github.com/Alhadis/language-regexp/releases/tag/v1.0.0
