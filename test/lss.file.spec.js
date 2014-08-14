var should = require('should'),
    File = require('../lib/file');

describe('new File(String)', function() {

    describe('given a file path as a String', function() {
    
        var file = new File('/path/to/file/a123Sequence.0001.txt');
        
        it('should create an array of chars by splitting the path ' +
           'on /\\d+/g', function() {

            file.chars[0].should.equal('/path/to/file/a');
            file.chars[1].should.equal('Sequence.');
            file.chars[2].should.equal('.txt');
        });

        it('should create an array of digit groups by matching /\\d+/g ' +
           'against the basepath', function() {
            file.digits[0].should.have.properties({match: '123', index: 1});
            file.digits[1].should.have.properties({match: '0001', index: 13});

            var fileB = new File('/path/to/file/AR145_GB_SB_1.1001.exr');
            
            fileB.digits[0].should.have.properties({match: '145', index: 2});
            fileB.digits[1].should.have.properties({match: '1', index: 12});
            fileB.digits[2].should.have.properties({match: '1001', index: 14});
        });
    });
});

describe('File.prototype.diff(File | String)', function() {

    var fileA = new File('/path/to/file/a123Sequence.0001.txt');

    describe('given a File instance', function() {

        it('should return an empty array if the two files have an unequal ' +
           'number of digit groups', function() {

            var diffs = fileA.diff(
                new File('/path/to/file/a123b456Sequence.0001.txt')
            );

            diffs.should.have.length(0);
        });

        it('should add an element to the differences array if a digit group ' +
           'has the same starting index, but are unequal strings', function() {

            var diffs = fileA.diff(
                new File('/path/to/file/a124Sequence.0002.txt')
            );

            diffs.should.have.length(2);
        });

        it('should return an array of elements containing an \'index\' naming ' +
           'the starting index of the digit groups and a \'matches\' array ' +
           'containing the two matching groups', function() {

            var diffs = fileA.diff(
                new File('/path/to/file/a124Sequence.0002.txt')
            );

            diffs[0].index.should.equal(1);
            diffs[0].matches[0].should.equal('123');
            diffs[0].matches[1].should.equal('124');
            
            diffs[1].index.should.equal(13);
            diffs[1].matches[0].should.equal('0001');
            diffs[1].matches[1].should.equal('0002');
        });
    });

    describe('given a String', function() {

        it('should exhibit the same behavior as if given a File instance',
            function() {

            var diffsA = fileA.diff('/path/to/file/a123b456Sequence.0001.txt')
            diffsA.should.have.length(0);

            var diffsB = fileA.diff('/path/to/file/a124Sequence.0002.txt')
            diffsB.should.have.length(2);

            var diffsC = fileA.diff('/path/to/file/a124Sequence.0002.txt')
            diffsC[0].index.should.equal(1);
            diffsC[0].matches[0].should.equal('123');
            diffsC[0].matches[1].should.equal('124');
            diffsC[1].index.should.equal(13);
            diffsC[1].matches[0].should.equal('0001');
            diffsC[1].matches[1].should.equal('0002');
        });
    });
});
