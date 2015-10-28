var E = require('./errors.js');
var C = require('./const.js');

module.exports = Room;

function Room() {
    var obj = {};

    // room status
    var visitCount = 0;
    var walls = {};
    var locked = false;
    var position = [0, 0];
    var maze = [
        [obj]
    ];

    // basic walls setup
    walls.UP = true;
    walls.DOWN = true;
    walls.LEFT = true;
    walls.RIGHT = true;

    // exposed functions
    obj.getWalls = getWalls;
    obj.canMove = canMove;
    obj.setWall = setWall;
    obj.buildRoom = buildRoom;
    obj.isBuilded = isBuilded;
    obj.visit = visit;
    obj.wasVisited = wasVisited;
    obj.draw = draw;
    obj.setPosition = setPosition;
    obj.getPosition = getPosition;
    obj.setMazeSize = setMazeSize;
    obj.getMazeSize = getMazeSize;
    obj.canOpenWall = canOpenWall;
    obj.getPossibleDirections = getPossibleDirections;
    obj.getVisitedTimes = getVisitedTimes;
    obj.getMaze = getMaze;
    obj.setMaze = setMaze;
    obj.getClosedWalls = getClosedWalls;

    /**
     * Define if user can move in provided direction.
     *
     * @method canMove
     * @throws {NotPossibleDirectionError}
     */
    function canMove(dir) {
        if (C.PossibleDirections.indexOf(dir) === -1) {
            throw new E.NotPossibleDirectionError();
        }
        return !walls[dir];
    }

    function getPossibleDirections() {
        return C.PossibleDirections;
    }

    function buildRoom() {
        locked = true;
    };

    function isBuilded() {
        return locked;
    };

    var mazeSize = [1, 1];
    function setMazeSize(size) {
        mazeSize = size;
    }

    function getMazeSize() {
        return mazeSize;
    }

    var position = [0, 0];
    function setPosition(pos) {
        position = pos;
    }

    function getPosition() {
        return position;
    }

    function setWall(dir, wall) {
        if (C.PossibleDirections.indexOf(dir) === -1) {
            throw new E.NotPossibleDirectionError();
        }
        if (isBuilded()) {
            throw new E.UpdateLockedCellError();
        }

        walls[dir] = wall;
    }

    function visit() {
        visitCount = visitCount + 1;
    }

    function wasVisited() {
        return visitCount > 0;
    }

    function getVisitedTimes() {
        return visitCount;
    }

    function getWalls() {
        return walls;
    }


    function draw() {
        var representation = '';
        representation += '+UP+\n';
        representation += 'LEFT    RIGHT\n';
        representation += 'LEFT    RIGHT\n';
        representation += '+DOWN+\n';
        representation = representation.replace('UP', (walls.UP ? '----' : '    '));
        representation = representation.replace(/RIGHT/g, (walls.RIGHT ? '|' : ' '));
        representation = representation.replace(/LEFT/g, (walls.LEFT ? '|' : ' '));
        representation = representation.replace('DOWN', (walls.DOWN ? '----' : '    '));
        return representation;
    }

    function canOpenWall(dir) {
        var pX = position[0];
        var pY = position[1];

        var mX = mazeSize[0];
        var mY = mazeSize[1];
        var can = false;
        switch (dir) {
            case C.Directions.UP:
                can = pX !== 0;
                break;
            case C.Directions.LEFT:
                can = pY !== 0;
                break;
            case C.Directions.RIGHT:
                can = pY !== (mX - 1);
                break;
            case C.Directions.DOWN:
                can = pX !== (mY - 1);
                break;
        }

        if (pX === 0 || pY === 0) {
            console.log(position, dir, can);
        }
        return can;

        throw new Error('wrong direction');
    }

    function getMaze() {
        return maze;
    }

    function setMaze(m) {
        maze = m;
    }

    function getClosedWalls() {
        var closedWallsCounter = 0;
        for(var i in walls) {
            if(walls[i]) {
                closedWallsCounter += 1;
            }
        }
        return closedWallsCounter;
    }


    return obj;
}
