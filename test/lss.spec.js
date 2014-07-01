var join = require('path').join,
    should = require('should'),
    lss = require('../lss');

describe('lss(String, Callback)', function() {

    var path = join(__dirname, 'files');
    
    describe('given a directory', function() {

        it('should return all sequences in the directory', function(done) {

            lss(path, function(err, sequences) {
                sequences.should.have.length(2);
                done();
            });
        });
    });

    describe('given a file', function() {

        it('should return a single sequence matching the file', function(done) {

            lss(join(path, 'a123Sequence.0001.txt'), function(err, sequences) {
                sequences.should.have.length(1);
                sequences[0].files[0].basename
                .should.match(/a123Sequence\.\d{4}\.txt$/);
                
                done();
            });
        });
    });

    describe('given sprintf-like sequence notation', function() {

        it('should return a single sequence matching the notation', function(done) {

            lss(join(path, 'a123Sequence.%04d.txt'), function(err, sequences) {
                sequences.should.have.length(1);
                sequences[0].files[0].basename
                .should.match(/a123Sequence\.\d{4}\.txt$/);

                done();
            });
        });
    });
});
