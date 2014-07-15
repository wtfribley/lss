lss - File Sequence Listing for Node
====================================

A simple utility for listing files which are grouped in a numerical sequence.

So this sequence of files:

    a123Sequence.0001.txt
    a123Sequence.0002.txt
    a123Sequence.0003.txt
    a123Sequence.0004.txt
    a123Sequence.0005.txt
    b124Sequence.0015.txt
    b124Sequence.0016.txt
    b124Sequence.0017.txt
    b124Sequence.0018.txt
    b124Sequence.0019.txt

Becomes something like this:
    
    a123Sequence.%04d.txt 1-5
    b124Sequence.%04d.txt 15-19

Installation
------------

    $ npm install lss

This package does include a command line interface - to make it available globally do:

    $ npm install lss -g

CLI
---

Use `lss` like `ls`

    $ lss /path/to/file/or/directory

Pass `--help` for usage info.

Require
-------

Use `lss` in your own code.

```node
var lss = require('lss');

lss('/path/to/file/or/directory', function(err, sequences) {
    sequences.forEach(function(s) { console.log(s); });
});
```

Format
------

Use `sequence.format(String)` to return a formatted string using the following directives:

- **%s** The start (i.e. lowest index) of the sequence.
- **%e** The end (i.e. highest index) of the sequence.
- **%l** The length of the sequence (end - start + 1).
- **%r** The range of the sequence as a string (ex: '1-100').
- **%p** The sequence's padding in sprintf-like notation (ex: '%04d').
- **%#** The sequence's padding in number-sign notation (ex: ####).
- **%b** The substring of the sequence's name BEFORE its numerical index.
- **%a** The substring of the sequence's name AFTER its numerical index.
- **%d** The sequence's directory.

The default argument to the format method is `%b%p%a`, which might produce something like:

    substringBeforeIndex.%04d.ext

In addition, `%s, %e, %l, %r` may all be padded using sprintf-like notation - so `%07r` yields something like:

    0000001-0000100

Finally, any unknown directive - like `%c` or `%%`, for example - will be replaced with the literal directive (i.e. the leading `%` will be stripped).

-----

&copy; 2014 Weston Fribley

This software is MIT licensed - please see `LICENSE` for details.
