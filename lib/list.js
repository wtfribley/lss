/**
 *  lss - list function
 *  @license MIT
 */

var join = require('path').join,
    fs = require('fs'),
    glob = require('glob'),
    digitsRE = /\d+/g,
    sprintfRE = /%\d{2}d/;

module.exports = function list(path, callback) {
    var prependPath = false,
        listFunction;

    fs.stat(path, function(err, stats) {
        if (err && err.code != 'ENOENT') return callback(err);
        
        if (stats && stats.isFile()) {
            path = path.replace(digitsRE, '*');
            listFunction = glob.bind(glob, path, {nosort: true});
        }
        else if (sprintfRE.test(path)) {
            path = path.replace(sprintfRE, '*');
            listFunction = glob.bind(glob, path, {nosort: true});
        }
        else if (stats && stats.isDirectory()) {
             
            // fs.readdir only lists file names, not the full path.
            prependPath = true;
            listFunction = fs.readdir.bind(fs, path);
        }
        else {
            var error = 'Could not list files: [' + path + '] is ' +
                'not a file, directory or sequence';
            
            return callback(new Error(error));
        }

        listFunction(function(err, files) {
            if (err) return callback(err);

            files = files.filter(function(file) {
                
                // reset regex to start search from beginning of string.
                digitsRE.lastIndex = 0;
                return digitsRE.test(file);

            }).map(function(file) {
                return prependPath ? join(path, file) : file;
            });
            
            if (files.length === 0) {
                return callback(new Error('No Files Found'));
            }

            callback(null, files);
        });
    });
};
