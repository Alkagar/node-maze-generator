var should = require('should');

var Cell = require('../cell.js');
var Generator = require('../generator.js');
var C = require('../const.js');
var E = require('../errors.js');

describe('Generator', function() {

    it('should random dir correctly', function() {
        var cell = Cell();
        cell.setWall(C.Directions.UP, false);
        cell.setWall(C.Directions.LEFT, false);
        cell.setWall(C.Directions.RIGHT, false);
        var walls = cell.getWalls();

        var generator = Generator([10, 50]);
        var dir = generator.randomDir(walls);
        dir.should.be.eql(C.Directions.DOWN);
    });

    it('should generate maze', function() {
        var generator = Generator([10, 10]);
        var maze = generator.generateMazeArray();
        generator.generateMaze();
        generator.draw();
    });




});
