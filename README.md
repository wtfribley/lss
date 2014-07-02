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
-----

&copy; 2014 Weston Fribley

This software is MIT licensed - please see `LICENSE` for details.
