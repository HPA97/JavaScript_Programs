function distanceBetweenXandY(x1, y1, x2, y2) {
    var distanceX = Math.abs(x1 - x2);
    var distanceY = Math.abs(y1 - y2);

    var distanceXSquared = distanceX * distanceX;
    var distanceYSquared = distanceY * distanceY;    

    return Math.ceil(Math.sqrt(distanceXSquared + distanceYSquared));
}

function randomRangeX(x, constant) {
    return Math.floor((Math.random() * x) + constant);
}

function amountOfNextTargetTiles(x, y, targetTile) {    
    var targetTilesFound = 0;
    if (x - 1 >= 0 && tiles[x - 1][y].type == targetTile) {
        targetTilesFound++;
    }
    if (x + 1 < amountTilesX && tiles[x + 1][y].type == targetTile) {
        targetTilesFound++;
    }
    if (y - 1 >= 0 && tiles[x][y - 1].type == targetTile) {
        targetTilesFound++;
    }
    if (y + 1 < amountTilesY && tiles[x][y + 1].type == targetTile) {
        targetTilesFound++;
    }
    return targetTilesFound;
} 