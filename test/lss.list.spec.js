var join = require('path').join,
    should = require('should'),
    list = require('../lib/list');

describe('list(String)', function() {

    describe('given a path to an existing file', function() {

        it('should replace any digits in the file name with \'*\' ' +
           'and do a glob search', function(done) {

            var path = join(__dirname, 'files', 'a123Sequence.0001.txt'),
                digitsRE = /\d+/g;

            list(path, function(err, files) {

                files.should.have.length(5);

                files.forEach(function(file) {
                    file.replace(digitsRE, '*')
                        .should.match(/a\*Sequence\.\*\.txt$/);
                });

                done();
            });
        });
    });

    describe('given a path to an non-existing file', function() {

        it('should give an error', function(done) {

            var path = join(__dirname, 'files', 'doesNotExist.0001.txt');

            list(path, function(err, files) {
                err.message.should.be.a.String;
                done();
            });
        });
    });

    describe('given a path to an existing sequence', function() {

        it('should replace any sprintf-like notation with \'*\' ' +
           'and do a glob search', function(done) {

            var path = join(__dirname, 'files', 'a123Sequence.%04d.txt'),
                mockSprintfRE = /\d{4}\.txt$/;

            list(path, function(err, files) {
                files.should.have.length(5);

                files.forEach(function(file) {
                    file.replace(mockSprintfRE, '*')
                        .should.match(/a123Sequence\.\*$/);
                });

                done();
            });
        });
    });

    describe('given a path to an non-existing sequence', function() {

        it('should give an error', function(done) {

            var path = join(__dirname, 'files', 'doesNotExist.%04d.txt');

            list(path, function(err, files) {
                err.message.should.be.a.String;
                done();
            });
        });
    });


    describe('given a path to an existing directory', function() {

        it('should list only the directory\'s files which contain ' +
           'digits', function(done) {

            var path = join(__dirname, 'files');

            list(path, function(err, files) {
                files.should.have.length(10);
                files.should.match(/\d/);
                done();
            });
        });
    });

    describe('given a path to an non-existing directory', function() {

        it('should give an error', function(done) {

            var path = join(__dirname, 'doesnotexist');

            list(path, function(err, files) {
                err.message.should.be.a.String;
                done();
            });
        });
    });
});
