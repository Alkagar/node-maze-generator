var E = require('./errors.js');
var C = require('./const.js');

module.exports = Cell;

function Cell() {
    var obj = {};

    // possible directories to move
    var dirs = [
        C.Directions.UP,
        C.Directions.DOWN,
        C.Directions.LEFT,
        C.Directions.RIGHT,
    ];

    // cell status
    var visitCount = 0;
    var walls = {};
    var locked = false;

    // basic walls setup
    walls.up = true;
    walls.down = true;
    walls.left = true;
    walls.right = true;

    // exposed functions
    obj.getWalls = getWalls;
    obj.canMove = canMove;
    obj.setWall = setWall;
    obj.lockCell = lockCell;
    obj.isLocked = isLocked;
    obj.visit = visit;
    obj.wasVisited = wasVisited;

    /**
     * Define if user can move in provided direction.
     *
     * @method canMove
     * @throws {NotPossibleDirectionError}
     */
    function canMove(dir) {
        if (dirs.indexOf(dir) === -1) {
            throw new E.NotPossibleDirectionError();
        }
        return !walls[dir];
    }

    function lockCell() {
        locked = true;
    };

    function isLocked() {
        return locked;
    };

    function setWall(dir, wall) {
        if (dirs.indexOf(dir) === -1) {
            throw new E.NotPossibleDirectionError();
        }
        if(isLocked()) {
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

    function getWalls() {
        return walls;
    }

    return obj;
}
