function NotPossibleDirectionError(message) {
  this.name = 'NotPossibleDirectionError';
  this.message = message || 'You need to define one of following directions: up, down, left, right.';
  this.stack = (new Error()).stack;
}
NotPossibleDirectionError.prototype = Object.create(Error.prototype);
NotPossibleDirectionError.prototype.constructor = NotPossibleDirectionError;


function UpdateLockedCellError(message) {
  this.name = 'UpdateLockedCellError';
  this.message = message || 'You shouldn\'t update locked cell.';
  this.stack = (new Error()).stack;
}
UpdateLockedCellError.prototype = Object.create(Error.prototype);
UpdateLockedCellError.prototype.constructor = UpdateLockedCellError;

function WrongMazeDimention(message) {
  this.name = 'WrongMazeDimention';
  this.message = message || 'You need to specify correct maze dimention, eg. [40, 48]';
  this.stack = (new Error()).stack;
}
WrongMazeDimention.prototype = Object.create(Error.prototype);
WrongMazeDimention.prototype.constructor = WrongMazeDimention;


module.exports = {
    NotPossibleDirectionError: NotPossibleDirectionError,
    UpdateLockedCellError: UpdateLockedCellError,
    WrongMazeDimention: WrongMazeDimention
}
