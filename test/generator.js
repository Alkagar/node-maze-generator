var should = require('should');

var Room = require('../room.js');
var Generator = require('../generator.js');
var C = require('../const.js');
var E = require('../errors.js');

describe('Generator', function() {

    it('should generate maze', function() {
        var generator = Generator([20, 20]);

        var maze = generator.generateMazeArray();
        generator.generateMaze();
        generator.draw();
    });




});
