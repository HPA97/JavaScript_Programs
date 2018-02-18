function Map(width, height, type) {
    this.width = width;
    this.height = height;
    this.type = type;
    this.tilesTotal = 0;

    this.createMap = function () {
        var nextId = 0;
        for (x = 0; x < this.width; x++) {
            tiles.push([]);
            for (y = 0; y < this.height; y++) {
                var newTile = new Tile(32 * x, 32 * y, "Water_01", nextId);
                tiles[x][y] = newTile;
                this.tilesTotal++;
                nextId++;
            }
        }

        // Make land start Nodes:
        var amountOfLandNodes = Math.floor((Math.random() * 5) + 4);
        for (i = 0; i < amountOfLandNodes; i++) {
            var landNodeStartX = Math.floor((Math.random() * amountTilesX));
            var landNodeStartY = Math.floor((Math.random() * amountTilesY));
            this.makeNode("Dirt_01", landNodeStartX, landNodeStartY, landNodeStartX, landNodeStartY, 5, 0);
        }

        var amountOfWaterNodes = Math.floor((Math.random() * 3) + 1);   
        for (i = 0; i < amountOfWaterNodes; i++) {
            var waterNodeStartX = Math.floor((Math.random() * amountTilesX));            
            var waterNodeStartY = Math.floor((Math.random() * amountTilesY));
            this.makeNode("Water_01", waterNodeStartX, waterNodeStartY, waterNodeStartX, waterNodeStartY, 3, 0);
        }

        // Modify map: 
        this.createGroups();
        this.editBodies();
        this.createGroups();
        this.locateCoastals();
        this.naturalizeMap();        
        this.drawTiles();
    }

    








    // RECURSION
    this.makeNode = function (type, startX, startY, thisX, thisY, expansionGrade, iteration) {

        var maxIteration = 4 * expansionGrade;        

        if (iteration > maxIteration) {
            return;
        }

        var distanceFromStart = distanceBetweenXandY(startX, startY, thisX, thisY);
        distanceFromStart = (distanceFromStart * 2) + (iteration / 2);
        
        // Places first landNode
        tiles[thisX][thisY].type = type;          
        var directionCheckValue = Math.floor((Math.random() * 100));
        var directionsLeftToGoto = 0;
        switch (true) {
            case (directionCheckValue < 5): directionsLeftToGoto = 1; break;
            case (directionCheckValue < 35 + distanceFromStart): directionsLeftToGoto = 2; break;
            case (directionCheckValue < 60 + distanceFromStart): directionsLeftToGoto = 3; break;
            case (directionCheckValue < 90 - distanceFromStart): directionsLeftToGoto = 4; break;
            case (directionCheckValue < 101 && iteration > 2): directionsLeftToGoto = 0; break;
            default: directionsLeftToGoto = 3;
        }
        var availableDirections = [];                             
        
        // Left
        if (thisX - 1 >= 0 && tiles[thisX - 1][thisY].type != type) {
            availableDirections[0] = "Left";
        }

        // Right
        if (thisX + 1 < amountTilesX && tiles[thisX + 1][thisY].type != type) {
            availableDirections[1] = "Right";
        }

        // Up
        if (thisY - 1 >= 0 && tiles[thisX][thisY - 1].type != type) {
            availableDirections[2] = "Up";
        }

        // Down
        if (thisY + 1 < amountTilesY && tiles[thisX][thisY + 1].type != type) {
            availableDirections[3] = "Down";
        }       
        
        if (directionsLeftToGoto > availableDirections.length) {
            directionsLeftToGoto = availableDirections.length;
        }

        var visitedLeft = false;
        var visitedRight = false;
        var visitedUp = false;
        var visitedDown = false;

        while (directionsLeftToGoto > 0) {
            var nextDirection = Math.floor((Math.random() * availableDirections.length));
            if (!visitedLeft && availableDirections[nextDirection] == "Left") {
                visitedLeft = true;
                this.makeNode(type, startX, startY, thisX - 1, thisY, expansionGrade, iteration++);
            }
            else if (!visitedRight && availableDirections[nextDirection] == "Right") {
                visitedRight = true;
                this.makeNode(type, startX, startY, thisX + 1, thisY, expansionGrade, iteration++);
            }
            else if (!visitedUp && availableDirections[nextDirection] == "Up") {
                visitedUp = true;
                this.makeNode(type, startX, startY, thisX, thisY - 1, expansionGrade, iteration++);
            }
            else if (!visitedDown && availableDirections[nextDirection] == "Down") {
                visitedDown = true;
                this.makeNode(type, startX, startY, thisX, thisY + 1, expansionGrade, iteration++);
            }
            directionsLeftToGoto--;
        }
    }

    this.createGroups = function () {        
        waterGroups = [];
        landGroups = [];        
        var waterBodiesCurrentCount = 0;
        var landBodiesCurrentCount = 0;

        for (x = 0; x < amountTilesX; x++) {
            for (y = 0; y < amountTilesY; y++) {                
                if ((!tiles[x][y].visited) && tiles[x][y].type == "Water_01") {                    
                    waterGroups.push([]);
                    this.calculateBodies("Water_01", x, y, waterBodiesCurrentCount, 0);
                    waterBodiesCurrentCount++;

                } else if ((!tiles[x][y].visited) && tiles[x][y].type == "Dirt_01") {
                    landGroups.push([]);
                    this.calculateBodies("Dirt_01", x, y, landBodiesCurrentCount, 0);
                    landBodiesCurrentCount++;
                }
            }
        }
        this.resetVisitedTiles();
    }

    // RECURSION
    this.calculateBodies = function (bodyType, thisX, thisY, currentBodyIndex, currentIndex) {
        if (bodyType == "Water_01") {
            tiles[thisX][thisY].category = "Water";
            waterGroups[currentBodyIndex][currentIndex] = tiles[thisX][thisY];
        } else if (bodyType == "Dirt_01") {
            tiles[thisX][thisY].category = "Land";
            landGroups[currentBodyIndex][currentIndex] = tiles[thisX][thisY];
        } else { return; }        
        tiles[thisX][thisY].visited = true;
        tiles[thisX][thisY].groupId = currentBodyIndex;
        // Left
        if (thisX - 1 >= 0 && tiles[thisX - 1][thisY].type == bodyType && !(tiles[thisX - 1][thisY].visited)) {
            currentIndex = this.calculateBodies(bodyType, thisX - 1, thisY, currentBodyIndex, (currentIndex + 1));
        }

        // Right
        if (thisX + 1 < amountTilesX && tiles[thisX + 1][thisY].type == bodyType && !(tiles[thisX + 1][thisY].visited)) {
            currentIndex = this.calculateBodies(bodyType, thisX + 1, thisY, currentBodyIndex, (currentIndex + 1));
        }

        // Up
        if (thisY - 1 >= 0 && tiles[thisX][thisY - 1].type == bodyType && !(tiles[thisX][thisY - 1].visited)) {
            currentIndex = this.calculateBodies(bodyType, thisX, thisY - 1, currentBodyIndex, (currentIndex + 1));
        }

        // Down
        if (thisY + 1 < amountTilesY && tiles[thisX][thisY + 1].type == bodyType && !(tiles[thisX][thisY + 1].visited)) {
            currentIndex = this.calculateBodies(bodyType, thisX, thisY + 1, currentBodyIndex, (currentIndex + 1));
        }

        return currentIndex;
    }

    this.resetVisitedTiles = function () {
        for (x = 0; x < amountTilesX; x++) {
            for (y = 0; y < amountTilesY; y++) {
                tiles[x][y].visited = false; 
            }
        }
    }

    this.editBodies = function () {
        
        for (i = 0; i < waterGroups.length; i++) {            
            if (waterGroups[i].length < 2) {
                var randomValue = randomRangeX(100, 0);
                if (randomValue < 101) {
                    for (j = 0; j < waterGroups[i].length; j++) {
                        waterGroups[i][j].type = "Dirt_01";   
                        waterGroups[i][j].partOfSomethingBig = true;
                    }                    
                } else {
                    if (waterGroups.length > 20) {
                        for (j = 0; j < waterGroups[i].length; j++) {
                            waterGroups[i][j].partOfSomethingBig = true;
                        }
                    }
                }
            }
        }
        
        for (i = 0; i < landGroups.length; i++) {
            if (landGroups[i].length < 4) {
                var randomValue = randomRangeX(100, 0);
                if (randomValue < 101) {
                    for (j = 0; j < landGroups[i].length; j++) {
                        landGroups[i][j].type = "Water_01";                        
                        landGroups[i][j].partOfSomethingBig = true;
                        // landGroups[i][j].draw();
                    }
                    landGroups.splice(i, 1);
                } else {
                    if (landGroups.length > 20) {
                        for (j = 0; j < landGroups[i].length; j++) {
                            landGroups[i][j].partOfSomethingBig = true;                            
                        }
                    }                    
                }
            }
        } 

        // Set big groups to be ".partOfSomethingBig = true"
        // Land
        
        for (i = 0; i < landGroups.length; i++) {
            if (landGroups[i].length > 15) {
                for (j = 0; j < landGroups[i].length; j++) {
                    landGroups[i][j].partOfSomethingBig = true;
                }
            }            
        }
        // Water
        for (i = 0; i < waterGroups.length; i++) {
            if (waterGroups[i].length > 15) {
                for (j = 0; j < waterGroups[i].length; j++) {
                    waterGroups[i][j].partOfSomethingBig = true;
                }
            }
        }
        
    }
    

    // Recursion
    this.tileEdgeAnalyze = function (thisX, thisY, thisType) {
        // console.log("X:" + thisX + " Y:" + thisY + " | " + thisType);
        if (thisType == "Dirt_01") {
            var randomValue = randomRangeX(100, 0);
            if (randomValue < 50) {                      
                tiles[thisX][thisY].type = "Water_01";
                // tiles[thisX][thisY].draw();
            }            
        }

        if (thisType == "Water_01") {
            var randomValue = randomRangeX(100, 0);
            if (randomValue < 50) {
                tiles[thisX][thisY].type = "Dirt_01";
                // tiles[thisX][thisY].draw();
            }
        }
    }

    this.locateCoastals = function () {
        for (x = 0; x < amountTilesX; x++) {
            for (y = 0; y < amountTilesY; y++) {
                var checkType = tiles[x][y].type;
                // Left
                if (x - 1 >= 0 && tiles[x - 1][y].type != checkType) {                    
                    if (tiles[x - 1][y].partOfSomethingBig) {
                        tiles[x][y].coastal = true;
                    } else {
                        tiles[x][y].lake = true;
                    }                      
                }

                // Right
                else if (x + 1 < amountTilesX && tiles[x + 1][y].type != checkType) {
                    if (tiles[x + 1][y].partOfSomethingBig) {
                        tiles[x][y].coastal = true;
                    } else {
                        tiles[x][y].lake = true;
                    }   
                }

                // Up
                else if (y - 1 >= 0 && tiles[x][y - 1].type != checkType) {
                    if (tiles[x][y - 1].partOfSomethingBig) {
                        tiles[x][y].coastal = true;
                    } else {
                        tiles[x][y].lake = true;
                    }   
                }

                // Down
                else if (y + 1 < amountTilesY && tiles[x][y + 1].type != checkType) {
                    if (tiles[x][y + 1].partOfSomethingBig) {
                        tiles[x][y].coastal = true;
                    } else {                        
                        tiles[x][y].lake = true;
                    }   
                }
            }
        }
    }

    this.naturalizeMap = function () {
        for (x = 0; x < amountTilesX; x++) {
            for (y = 0; y < amountTilesY; y++) {
                if (tiles[x][y].type == "Dirt_01") {                    
                    if (tiles[x][y].coastal) {
                        tiles[x][y].type = "Sand_01";
                    }
                    else if (tiles[x][y].lake){
                        tiles[x][y].type = "Dirt_02";
                    }                    
                    // tiles[x][y].draw();
                }
                else if (tiles[x][y].type == "Water_01") {
                    if (tiles[x][y].coastal) {
                        tiles[x][y].type = "Water_02";
                    }
                    else if (tiles[x][y].lake) {                        
                        tiles[x][y].type = "Water_02";
                    }                      
                    // tiles[x][y].draw();
                }                
            }
        }
        
        for (i = 0; i < waterGroups.length; i++) {
            for (j = 0; j < waterGroups[i].length; j++) {
                if (!(waterGroups[i][j].partOfSomethingBig)) {
                    waterGroups[i][j].type = "Water_03";
                }
            }
        }

        for (x = 0; x < amountTilesX; x++) {
            for (y = 0; y < amountTilesY; y++) {
                if (tiles[x][y].type == "Dirt_01") {                    
                    var checkType = "Dirt_01";
                    var staySame = false;

                    if (x - 1 >= 0 && tiles[x - 1][y].type != checkType) {
                        if (tiles[x - 1][y].type != "Grass_01") {
                            staySame = true;                        
                        }
                    }

                    // Right
                    if (x + 1 < amountTilesX && tiles[x + 1][y].type != checkType) {
                        if (tiles[x + 1][y].type != "Grass_01") {
                            staySame = true;
                        }
                    }

                    // Up
                    if (y - 1 >= 0 && tiles[x][y - 1].type != checkType) {
                        if (tiles[x][y - 1].type != "Grass_01") {
                            staySame = true;
                        }
                    }

                    // Down
                    if (y + 1 < amountTilesY && tiles[x][y + 1].type != checkType) {
                        if (tiles[x][y + 1].type != "Grass_01") {
                            staySame = true;
                        }
                    }    

                    if (!staySame) {
                        var randomValue = randomRangeX(100, 0);
                        if (randomValue < 75) {
                            tiles[x][y].type = "Grass_01";
                        }                        
                    }
                }
            }
        }

        var maxColdNorth = Math.floor((amountTilesY / 100) * 10); 
        var coldBuffer = 12;
        var temperateBuffer = 22;
        // NORTH
        var currentColdY = randomRangeX(maxColdNorth, (maxColdNorth / 2));
        for (x = 0; x < amountTilesX; x++) {
            
            var randomValue = randomRangeX(100, 0);
            if (randomValue > 50) {
                if (currentColdY < (maxColdNorth)) {
                    currentColdY++;
                } else {
                    currentColdY--;
                }
            } else {
                if (currentColdY > (maxColdNorth / 2)) {
                    currentColdY--;
                } else {
                    currentColdY++;
                }
                
            }

            for (y = currentColdY; y >= 0; y--) {                  
                if (tiles[x][y].category == "Land") {
                    tiles[x][y].type = "Snow_01";
                    tiles[x][y].climate = "Cold";
                } else {
                    tiles[x][y].type = "Ice_01";
                    tiles[x][y].climate = "Cold";
                } 
            }      

            for (y = currentColdY; y < currentColdY + coldBuffer; y++) {
                tiles[x][y].climate = "Cold";
            }

            for (y = currentColdY + coldBuffer; y < currentColdY + coldBuffer + temperateBuffer; y++) {
                tiles[x][y].climate = "Temperate";
            }
        }

        // SOUTH
        currentColdY = randomRangeX((maxColdNorth / 2), (amountTilesY - maxColdNorth));        
        for (x = 0; x < amountTilesX; x++) {

            var randomValue = randomRangeX(100, 0);
            if (randomValue > 50) {
                if (currentColdY < ((amountTilesY - maxColdNorth))) {
                    currentColdY++;
                } else {
                    currentColdY--;
                }
            } else {
                if (currentColdY > (amountTilesY - (maxColdNorth / 2))) {
                    currentColdY--;
                } else {
                    currentColdY++;
                }

            }

            for (y = currentColdY; y < amountTilesY; y++) {
                if (tiles[x][y].category == "Land") {
                    tiles[x][y].type = "Snow_01";
                    tiles[x][y].climate = "Cold";
                } else {
                    tiles[x][y].type = "Ice_01";
                    tiles[x][y].climate = "Cold";
                }
            }

            for (y = currentColdY; y > currentColdY - coldBuffer; y--) {
                tiles[x][y].climate = "Cold";
            }

            for (y = currentColdY - coldBuffer; y > currentColdY - coldBuffer - temperateBuffer; y--) {
                tiles[x][y].climate = "Temperate";
            }
        }
    }

    this.drawTiles = function () {
        for (x = 0; x < amountTilesX; x++) {
            for (y = 0; y < amountTilesY; y++) {
                tiles[x][y].draw();
            }
        }
    }

    this.clearMap = function () {

    }

    this.logMap = function () {
        for (x = 0; x < amountTilesX; x++) {
            for (y = 0; y < amountTilesY; y++) {
                console.log(tiles[x][y].type);
            }
        }
    }

    this.createMap();
}