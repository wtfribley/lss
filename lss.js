/**
 *  node-lss - list groups of numerically sequenced files
 *  @version v0.1.0
 *  @author Weston Fribley <me@westonfribley.com> (http://westonfribley.com)
 *  @license MIT
 */

var fs = require('fs'),
    list = require('./lib/list'),
    Sequence = require('./lib/sequence');

var lss = module.exports = function lss(path, callback) {
    var sequences = [];

    list(path, function(err, files) {
        if (err) return callback(err);
        
        files.forEach(function(file) {
            
            var inSequence = sequences.some(function(sequence) {
                if (sequence.contains(file)) {
                    sequence.push(file);
                    return true;
                }
                else return false;
            });

            if (!inSequence) {
                sequences.push(new Sequence([file]));
            }
        });
        
        callback(null, sequences);
    });
};

lss.Sequence = Sequence;
