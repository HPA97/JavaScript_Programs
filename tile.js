function Tile(posX, posY, type, id) {
    this.posX = posX;
    this.posY = posY;
    this.type = type;
    this.category = "Water";
    this.id = id;
    this.groupId = -1;
    this.element;
    this.coastal = false;
    this.lake = false;
    this.partOfSomethingBig = false;
    this.climate = "Hot";

    // Used in calculations and map fixes
    this.visited = false;
    this.distanceFromLand = 0;

    // Construct tile
    this.create = function () {
        var newElement = document.createElement("div");
        newElement.setAttribute("id", this.id);
        newElement.classList.add("Tile");
        this.element = newElement;
        canvas.appendChild(this.element);
    }

    // Draws tile to screen
    this.draw = function () {
        this.element.style.left = this.posX + "px";
        this.element.style.top = this.posY + "px";
        if (this.climate == "Cold") {
            switch (this.type) {
                case "Sand_01": this.type = "Gravel_01"; break;
                case "Grass_01": this.type = "Grass_02"; break;
                case "Dirt_01": this.type = "Dirt_03"; break;
                case "Water_01": this.type = "Water_04"; break;
                case "Water_02": this.type = "Water_03"; break;
                case "Water_03": this.type = "Ice_01"; break;
            }
        }

        else if (this.climate == "Hot") {
            switch (this.type) {                           
                case "Water_01": this.type = "Water_02"; break;                
                case "Water_02": this.type = "Water_05"; break;    
                case "Grass_01": this.type = "Grass_03"; break;                
                case "Dirt_02": this.type = "Dirt_03"; break;                
                case "Sand_01": this.type = "Sand_02"; break;                
            }
        }

        switch (this.type) {
            case "Grass_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) 0 0"; break;
            case "Dirt_02": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -33.5px 0"; break;
            case "Water_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -66.5px 0"; break;
            case "Water_05": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -99.3px 0"; break;
            case "Dirt_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -132.5px 0"; break;
            case "Stone_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -165.5px 0"; break;
            case "Snow_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -198.5px 0"; break;
            case "Sand_02": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -231.5px 0"; break;
            case "Water_03": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) 0 -33.5px"; break;
            case "Ice_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -33.5px -33.5px"; break;
            case "Grass_02": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -66.5px -33.5px"; break;
            case "Gravel_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -99.3px -33.5px"; break;
            case "Water_04": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -132.5px -33.5px"; break;
            case "Water_02": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -165.5px -33.5px"; break;
            case "Grass_03": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -198.5px -33.5px"; break;
            case "Sand_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -231.5px -33.5px"; break;
            case "Dirt_03": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) 0 -66.5px"; break;

            // MARKERS: 
            case "Blue_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -231.5 -198.5px"; break;
            case "Red_01": this.element.style.background = "url(sprites/TileSprite_Sheet.gif) -231.5 -231.5px"; break;
            default: ;
        }
    }

    // Clears Tile from Screen
    this.clear = function () {

    }

    this.create();
}