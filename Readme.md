# scotch

Extends browserify to tape your frontend together. Allow templates and stylesheets to be required in the same way you would require javascript and coffeescript files.

## Installation

    npm install scotch

## Usage

    require('./list.styl'); // Loads the css
    var person = require('./person.jst');
    person({ name : "Matt" }); // => Hogan compiled function

To include the css and javascript into your frontend:

    <link href="scotch.css" rel="stylesheet">
    <script src="scotch.js" type="text/javascript"></script>

## Support

Currently supports:

* CSS
* stylus
* hogan
* coffeescript
* JSON

## TODO

* better documentation
* tests

## License 

(The MIT License)

Copyright (c) 2012 Matt Mueller &lt;mattmuelle@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.