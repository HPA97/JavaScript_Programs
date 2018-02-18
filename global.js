var canvas = document.getElementById("canvas");
var canvasRect = canvas.getBoundingClientRect();

var amountTilesX = ((canvasRect.right - canvasRect.left) / 32) - 1;
var amountTilesY = ((canvasRect.bottom - canvasRect.top) / 32) - 1;

/*
amountTilesX = 3;
amountTilesY = 3;
*/

var tiles = [];
var waterGroups = [];
var landGroups = [];


// Not used?
var softCandidates = [];