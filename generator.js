var _ = require('underscore');

var E = require('./errors.js');
var C = require('./const.js');

var Room = require('./room.js');

module.exports = Generator;

function Generator(dimention) {
    var obj = {};
    if (dimention && dimention.length && dimention.length !== 2) {
        throw E.WrongMazeDimention();
    }
    if (isNaN(dimention[0]) || isNaN(dimention[1])) {
        console.log('here dupa');
        throw E.WrongMazeDimention();
    }

    var x = dimention[0];
    var y = dimention[1];
    var lastVisited = [];
    var maze = [];
    var mazeStart = randomRoom();
    var currentPosition = [];

    function randomDir(room) {
        if(room === null) {
            console.log('DDDD DUPA DDD');
            return null;
        }
        var walls = room.getWalls();
        var dirs = _.clone(C.PossibleDirections);
        var dir;
        var index;
        var cannotMove = true;
        var nextRoom = false;
        var closedWalls = room.getClosedWalls();
        var roomType = 2 + Math.floor(2 * Math.random())
        if(closedWalls < roomType) {
            return null;
        }
        do {
            index = Math.floor(Math.random() * dirs.length);
            dir = dirs[index];
            console.log('Current room::', room.getPosition(), dir, dirs, index);
            if(!room.canMove(dir) && room.canOpenWall(dir)) {
                var pos = getNewPosition(room, dir);
                var nextRoom = getRoom(pos);
                console.log(pos, dir);
                closedWalls = nextRoom.getClosedWalls();
                console.log('Current room::', room.getPosition(), ' - checking room for visits: ', nextRoom.getPosition(), ' ::', nextRoom.getVisitedTimes());

                if(!nextRoom.wasVisited() && closedWalls >= 2) {
                    cannotMove = false;
                }
            }
            dirs.splice(index, 1);
            if(dirs.length === 0) {
                cannotMove = false;
            }
        } while (cannotMove);
        if(dirs.length === 0) {
            return null;
        } else {
            return dir;
        }
    }


    function generateMazeArray() {
        for (var i = 0; i < x; i++) {
            maze[i] = [];
            for (var j = 0; j < y; j++) {
                var room = Room();
                maze[i][j] = room;
                room.setPosition([i, j]);
                room.setMazeSize([x, y]);
                room.setMaze(maze);
            }
        }
        return maze;
    }

    function draw(maze) {
        var x = maze.length;
        for (var i = 0; i < x; i++) {
            var y = maze[i].length;
            var rowA = '';
            var rowB = '';
            var rowC = '';
            var rowD = '';
            for (var j = 0; j < y; j++) {
                var room = maze[i][j];
                var roomRepresentation = room.draw().split('\n');
                rowA += roomRepresentation[0];
                rowB += roomRepresentation[1];
                rowC += roomRepresentation[2];
                rowD += roomRepresentation[3];
            }
            console.log(rowA);
            console.log(rowB);
            console.log(rowC);
            console.log(rowD);
        }
    }

    function randomRoom() {
        var randomX = Math.floor(Math.random() * x);
        var randomY = Math.floor(Math.random() * y);
        return [randomX, randomY];
    }

    function getRoom(position) {
        var pX = position[0];
        var pY = position[1];
        var ok = pX >= 0 && pY >= 0 && pX < x && pY < y;

        if(ok) {
            return maze[position[0]][position[1]];
        } else {
            return null;
        }
    }

    function visitRoom(room) {
        room.visit();
        lastVisited.push(room);
    }

    function getNewPosition(room, dir) {
        var newX = room.getPosition()[0];
        var newY = room.getPosition()[1];


        switch (dir) {
            case C.Directions.UP:
                newX = newX - 1;
                break;
            case C.Directions.LEFT:
                newY = newY - 1;
                break;
            case C.Directions.RIGHT:
                newY = newY + 1;
                break;
            case C.Directions.DOWN:
                newX = newX + 1;
                break;
        }

        console.log(newX, newY);
        return [newX, newY];
    }

    function nextRoomVisited(room, dir) {
        var nextPosition = getNewPosition(room, dir);
        var nextRoom = getRoom(nextPosition);
        if(nextRoom !== null) {
            // return nextRoom.wasVisited();
        } else {
            console.log(' -- ', nextRoom);
        }
        return false;
    }

    function opositeDir(dir) {
        var oposite = {};
        oposite[C.Directions.UP] = C.Directions.DOWN;
        oposite[C.Directions.DOWN] = C.Directions.UP;
        oposite[C.Directions.RIGHT] = C.Directions.LEFT;
        oposite[C.Directions.LEFT] = C.Directions.RIGHT;

        return oposite[dir];
    }

    function moveInDirection(room, dir) {
        room.setWall(dir, false);
        var nextRoom = getRoom(getNewPosition(room, dir));
        nextRoom.setWall(opositeDir(dir), false);
        return true;
    }

    function stepMazeFrom(room) {
        currentPosition = room.getPosition();
        // console.log('current room visited', room.wasVisited());
        var moved = false;
        var walls = _.clone(room.getWalls());
        var dir = randomDir(room);
        if(dir === null) {
            if(lastVisited.length > 0) {
                stepMazeFrom(lastVisited.pop());
            } else {
                console.log('We hit the end!');
            }
        } else {
            visitRoom(room);
            moveInDirection(room, dir);
            var nextRoom = getRoom(getNewPosition(room, dir));
            stepMazeFrom(nextRoom);
        }
    }

    function generateMaze() {
        console.log('Lets start maze from point:', mazeStart);
        var start = getRoom(mazeStart);
        stepMazeFrom(start);
    }

    function isRoom(dir) {
        var pX = currentPosition[0];
        var pY = currentPosition[1];

        var mX = x;
        var mY = y;

        switch (dir) {
            case C.Directions.UP:
                return pX !== 0;
            case C.Directions.LEFT:
                return pY !== 0;
            case C.Directions.RIGHT:
                return pY !== (mX - 1);
            case C.Directions.BOTTOM:
                return pX !== (mY - 1);
        }
    }

    obj.randomDir = randomDir;
    obj.generateMazeArray = generateMazeArray;
    obj.generateMaze = generateMaze;
    obj.draw = function() {
        draw(maze);
    };
    return obj;
}
