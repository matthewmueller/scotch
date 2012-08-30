0.2.2 / 2012-08-30
==================

* Removed log

0.2.1 / 2012-08-29
==================

* updated, added aliasing
* building out the app example

0.2.0 / 2012-08-29
==================

* Rebuilt entire library
* Now outputs files to /build which can be picked up by static
* "main" now gets instatiated by default (require('index.js'))
* Added coffee-script support
* Hogan now requires aliasing in order to set up dependencies (see examples/app/)

0.1.2 / 2012-07-31
==================

* ignore requires that it cannot find
* better support for locating node_modules
* added graceful json string failure
* added logging to stylus error

0.1.1 / 2012-06-17
==================

* added nib
* now supports maps. ie: jquery-browserify => jquery

0.1.0 / 2012-06-17
==================

* Refactored the entire library
* No longer uses browserify, but uses what browserify uses
* Allows absolute paths now
* Only runs through requires once now
* Smaller footprint
* Registers original entry as basename for your convenience

0.0.3 / 2012-06-13
==================

* added json support

0.0.2 / 2012-06-13
==================

* added caching so we only run middleware once
* added css support

0.0.1 / 2012-06-13
==================

* Initial release
