node-lss
========

A simple utility for listing files which are grouped in a numerical sequence.

So this sequence of files:

    a123Sequence.0001.txt
    a123Sequence.0002.txt
    a123Sequence.0003.txt
    a123Sequence.0004.txt
    a123Sequence.0005.txt
    a124Sequence.0015.txt
    a124Sequence.0016.txt
    a124Sequence.0017.txt
    a124Sequence.0018.txt
    a124Sequence.0019.txt

Becomes something like this:
    
    a123Sequence.%04d.txt 1-5
    a124Sequence.%04d.txt 15-19

CLI
---

Use `node-lss` like `ls`

    $ lss /path/to/file/or/directory

Require
-------

Use `node-lss` in your own code.

```node
var lss = require('lss');

lss('/path/to/file/or/directory', function(err, sequences) {
    sequences.forEach(function(s) { console.log(s); });
});
```
-----

&copy; 2014 Weston Fribley

This software is MIT licensed - please see `LICENSE` for details.
