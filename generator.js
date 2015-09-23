var E = require('./errors.js');
var C = require('./const.js');

var Cell = require('./cell.js');

module.exports = Generator;

function Generator(dimention) {
    var obj = {};
    if (dimention && dimention.length && dimention.length !== 2) {
        throw E.WrongMazeDimention();
    }
    if (!isNaN(dimention[0]) || !isNaN(dimention[1])) {
        // throw E.WrongMazeDimention();
    }

    var x = dimention[0];
    var y = dimention[1];
    var lastVisited = [];
    var maze = [];
    var mazeStart = randomRoom();
    var currentPosition = [];

    function randomDir(walls) {
        var wallKeys = Object.keys(walls);
        var closedWalls = wallKeys.reduce(function(prev, curr) {
            if (walls[curr]) {
                prev.push(curr);
            }
            return prev;
        }, []);

        return closedWalls[Math.floor(Math.random() * closedWalls.length)];
    }


    function generateMazeArray() {
        for (var i = 0; i < x; i++) {
            maze[i] = [];
            for (var j = 0; j < y; j++) {
                var room = Cell();
                maze[i][j] = room;
                room.setPosition([i, j]);
                room.setMazeSize([x, y]);
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

                // rowA += room.canMove(C.Directions.UP) ? '+  ' : '+--';
                //
                // rowB += room.canMove(C.Directions.LEFT) ? ' ' : '|';
                // rowB += '  ';
                //
                // rowC += room.canMove(C.Directions.DOWN) ? '+  ' : '+--';
                //
                // if(j === maze[i].length - 1) {
                //     rowA += '+';
                //     rowB += room.canMove(C.Directions.RIGHT) ? ' ' : '|';
                //     rowC += '+';
                // }
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
        return [newX, newY];
    }

    function nextRoomVisited(room, dir) {
        var nextPosition = getNewPosition(room, dir);
        var nextRoom = getRoom(nextPosition);
        if(nextRoom !== null) {
            return nextRoom.wasVisited();
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
        console.log(' >> ', room.canOpenWall(dir));
        console.log('result', room.canOpenWall(dir) && !nextRoomVisited(room, dir));
        if (room.canOpenWall(dir) && !nextRoomVisited(room, dir)) {
            room.setWall(dir, false);
            var nextRoom = getRoom(getNewPosition(room, dir));
            nextRoom.setWall(opositeDir(dir), false);
            return true;
        } else {
            return false;
        }

    }

    function stepMazeFrom(room) {
        currentPosition = room.getPosition();
        console.log('current room visited', room.wasVisited());
        var dir;
        var moved = false;
        var walls = room.getWalls();
        do {
            dir = randomDir(walls);
            if(typeof dir === 'undefined') {
                break;
            }
            moved = moveInDirection(room, dir);
            if(!moved) {
                console.log('Moved:', currentPosition, moved);
                delete walls[dir];
            }
        } while(!moved && Object.keys(walls).length > 0);

        if(moved) {
            visitRoom(room);
            // console.log('We just moved!! Lets go deeper');
            var nextPosition = getNewPosition(room, dir);
            var nextRoom = getRoom(nextPosition);
            stepMazeFrom(nextRoom);
        } else {
            if(lastVisited.length > 0) {
                // stepMazeFrom(lastVisited.pop());
            } else {
                console.log('We hit the end!');
            }
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
