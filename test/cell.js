var should = require('should');

var Room = require('../cell.js');
var C = require('../const.js');
var E = require('../errors.js');

describe('Room', function() {
    it('should expose basic methods', function() {
        var room = Room();
        (typeof room.canMove).should.be.eql('function');
        (typeof room.getWalls).should.be.eql('function');
    });

    it('should return possible directions', function() {
        var room = Room();

        var dirs = room.getPossibleDirections();
        dirs.should.be.an.instanceOf(Array);
        dirs.length.should.eql(4);
        dirs.should.containEql('UP');
        dirs.should.containEql('DOWN');
        dirs.should.containEql('LEFT');
        dirs.should.containEql('RIGHT');
    });

    it('should throw on wrong direction', function() {
        var room = Room();

        should(function() {
            room.canMove('TOP');
        }).throw(E.NotPossibleDirectionError);
    });

    it('should not throw on correct direction', function() {
        var room = Room();
        should(function() {
            room.canMove(C.Directions.UP);
        }).not.throw(E.NotPossibleDirectionError);

        should(function() {
            room.canMove(C.Directions.DOWN);
        }).not.throw(E.NotPossibleDirectionError);

        should(function() {
            room.canMove(C.Directions.LEFT);
        }).not.throw(E.NotPossibleDirectionError);

        should(function() {
            room.canMove(C.Directions.RIGHT);
        }).not.throw(E.NotPossibleDirectionError);
    });

    it('should move on correct direction', function() {
        var room = Room();
        room.setWall(C.Directions.UP, false);
        room.setWall(C.Directions.LEFT, false);

        room.canMove('UP').should.be.ok;
        room.canMove('LEFT').should.be.ok;
        room.canMove('RIGHT').should.not.be.ok;
        room.canMove('DOWN').should.not.be.ok;
    });

    it('should corectly build room', function() {
        // maybe anable this only once per room?
        var room = Room();
        room.isBuilded().should.not.be.ok;
        room.buildRoom();
        room.isBuilded().should.be.ok;
    });

    it('should get maze size correctly', function() {
        var room = Room();
        var size = room.getMazeSize();
        size.should.be.an.instanceof(Array).and.have.lengthOf(2);
        size.should.containEql(1);
    });

    it('should set maze size correctly', function() {
        var room = Room();
        room.setMazeSize([4,6]);
        var size = room.getMazeSize();
        size.should.be.an.instanceof(Array).and.have.lengthOf(2);
        size.should.containEql(4);
        size.should.containEql(6);
    });

    it('should set room position in maze correctly', function() {
        var room = Room();
        room.setPosition([4, 6]);
        var position = room.getPosition();
        position.should.be.an.instanceof(Array).and.have.lengthOf(2);
        position.should.containEql(4);
        position.should.containEql(6);
    });

    it('should get room position in maze correctly', function() {
        var room = Room();
        var position = room.getPosition();
        position.should.be.an.instanceof(Array).and.have.lengthOf(2);
        position.should.containEql(0);
        position.should.containEql(0);
    });

    it('should throw on incorect direction in set wall', function() {
        var room = Room();
        should(function() {
            room.setWall('bottom', false);
            room.setWall(C.Directions.LEFT, false);
        }).throw(E.NotPossibleDirectionError);
    });

    it('should throw on set wall in builded room', function() {
        var room = Room();
        room.buildRoom();

        should(function() {
            room.setWall(C.Directions.LEFT, false);
        }).throw(E.UpdateLockedCellError);
    });

    it('should set correctly walls', function() {
        var room = Room();
        room.setWall(C.Directions.UP, false);
        room.setWall(C.Directions.LEFT, false);
        var walls = room.getWalls();

        walls.UP.should.be.ok;
        walls.DOWN.should.not.be.ok;
        walls.LEFT.should.be.ok;
        walls.RIGHT.should.not.be.ok;
    });

    it('should be visited after visit', function() {
        var room = Room();
        room.wasVisited().should.not.be.ok;
        room.visit();
        room.wasVisited().should.be.ok;
    });

    it('should retain visit counter', function() {
        var room = Room();
        room.getVisitedTimes().should.eql(0);
        room.visit();
        room.visit();
        room.visit();
        room.getVisitedTimes().should.eql(3);
    });

    it('should return current walls statuses', function() {
        var room = Room();
        var walls = room.getWalls();
        walls.should.be.an.instanceOf(Object);
        walls.should.have.property('UP', true);
        walls.should.have.property('LEFT', true);
        walls.should.have.property('RIGHT', true);
        walls.should.have.property('DOWN', true);
    });

    it('should draw correctly', function() {
        var room = Room();
        room.setWall(C.Directions.LEFT, false);
        var drawing = room.draw();
        console.log(drawing);
    });
});
