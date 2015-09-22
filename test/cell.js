var should = require('should');

var Cell = require('../cell.js');
var C = require('../const.js');
var E = require('../errors.js');

describe('Cell', function() {
    it('should expose basic methods', function() {
        var cell = Cell();
        (typeof cell.canMove).should.be.eql('function');
        (typeof cell.getWalls).should.be.eql('function');
    });

    it('should throw on wrong direction', function() {
        var cell = Cell();

        should(function() {
            cell.canMove('top');
        }).throw(E.NotPossibleDirectionError);
    });

    it('should not throw on correct direction', function() {
        var cell = Cell();

        should(function() {
            cell.canMove(C.Directions.UP);
        }).not.throw(E.NotPossibleDirectionError);

        should(function() {
            cell.canMove(C.Directions.DOWN);
        }).not.throw(E.NotPossibleDirectionError);

        should(function() {
            cell.canMove(C.Directions.LEFT);
        }).not.throw(E.NotPossibleDirectionError);

        should(function() {
            cell.canMove(C.Directions.RIGHT);
        }).not.throw(E.NotPossibleDirectionError);
    });

    it('should set correctly walls', function() {
        var cell = Cell();
        cell.setWall(C.Directions.UP, false);
        cell.setWall(C.Directions.LEFT, false);
        var walls = cell.getWalls();

        walls.up.should.be.ok;
        walls.down.should.not.be.ok;
        walls.left.should.be.ok;
        walls.right.should.not.be.ok;
    });

    it('should be visited after visit', function() {
        var cell = Cell();
        cell.wasVisited().should.not.be.ok;
        cell.visit();
        cell.wasVisited().should.be.ok;
    });

    
});
