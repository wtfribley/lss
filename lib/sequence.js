/**
 *  node-lss - Sequence class
 *  @license MIT
 */

var File = require('./file');

var Sequence = module.exports = function(files) {
    this.start = Number.POSITIVE_INFINITY;
    this.end = Number.NEGATIVE_INFINITY;
    
    if (files && files.length > 0) {
        files = files.map(function(file) {
            if (!(file instanceof File)) file = new File(file);
            return file;
        });

        this.files = [files.pop()];
        files.forEach(this.push.bind(this));
    }
    else this.files = [];
};

Sequence.prototype.contains = function contains(file) {
    if (this.files.length === 0) return false;

    if (!(file instanceof File)) file = new File(file);

    var diffs = this.files[0].diff(file);

    return diffs.length == 1 && this.files[0].chars.every(function(match, i) {
        return match === file.chars[i];
    });
};

Sequence.prototype.push = function push(file) {
    if (!(file instanceof File)) file = new File(file);
    if (!this.contains(file)) throw new NotInSequenceError(file.basename);

    var diff = this.files[this.files.length-1].diff(file)[0],
        lastIndex = parseInt(diff.matches[0]),
        fileIndex = parseInt(diff.matches[1]);

    // maintain ordering.
    if (lastIndex <= fileIndex) this.files.push(file);
    else this.files.splice(this.files.length-1, 0, file);

    // calculate start / end.
    this.start = Math.min(this.start, lastIndex, fileIndex);
    this.end = Math.max(this.end, lastIndex, fileIndex);

    // note the significant digit group.
    this._significantGroup = {
        index: diff.index,
        length: diff.matches[0].length
    }
};

// TODO: support a flexible format string.
Sequence.prototype.format = function format() {
    var basename = this.files[0].basename,
        str = basename.substring(0, this._significantGroup.index);

    str += '%0' + this._significantGroup.length + 'd';
    str += basename.substring(
        this._significantGroup.index +
        this._significantGroup.length
    );

    return str;
};

// Error.

var NotInSequenceError = function(file) {
    var err = Error.call(this, '\'' + file + '\' not in sequence.');
    err.name = 'NotInSequenceError';
    return err;
};

NotInSequenceError.prototype = Object.create(Error.prototype, {
    constructor: {value: NotInSequenceError}
});

