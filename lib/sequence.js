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

Sequence.prototype.format = function format(fmt) {
    var str = fmt = fmt || '%b%p%a',
        re = /%(.\d)?./g,
        replacements = {},
        padding ,matches, placeholder, directive;

    while ((matches = re.exec(fmt))) {
        placeholder = matches[0];

        if (replacements[placeholder]) continue;
        
        directive = placeholder.slice(-1);
        
        if (matches[1]) {
            padding = new Array(parseInt(matches[1][1])+1).join(matches[1][0]);
        }
        else padding = false;

        replacements[placeholder] = this._replace(directive, padding);

        // replace all occurances of the placeholder at once.
        str = str.split(placeholder).join(replacements[placeholder]);
    }

    return str;
};

Sequence.prototype._replace = function(directive, padding) {
    var r, sg = this._significantGroup, basename = this.files[0].basename;

    switch (directive) {

        // start of sequence
        case 's': r = this.start; break;
        
        // end of sequence
        case 'e': r = this.end; break;

        // length of sequence
        case 'l': r = this.end - this.start + 1; break;
        
        // sequence padding (e.g. %04d)
        case 'p': r = '%0' + sg.length + 'd'; break;

        // number sign sequence padding (e.g. ####)
        case '#': r = new Array(sg.length+1).join('#'); break;

        // sequence range (e.g. 1-100)
        case 'r': r = this.start + '-' + this.end; break;

        // sequence name part BEFORE the numerical index.
        case 'b': r = basename.substring(0, sg.index); break;

        // sequence name part AFTER the numerical index.
        case 'a': r = basename.substring(sg.index + sg.length); break;

        default: return directive;
    }

    function pad(str) {
        return padding ? (padding + str).slice(-padding.length) : str;
    }

    if (directive == 'r') return r.split('-').map(pad).join('-');
    else if (['p','#','b','a'].indexOf(directive) > -1) return r;
    else return pad(r);
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

