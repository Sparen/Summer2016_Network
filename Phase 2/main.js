var database_obj;
var allnodes = [];

/* ***** INITIALIZATION AND CANVAS FUNCTIONS ***** */

function start(canvasid) {
    console.log("start(): Running on canvas with id " + canvasid);
    myCanvas.start(canvasid); //set up canvas and interval, etc.
    onLoad();
}

var myCanvas = {
    start: function (canvasid) {
        resetCanvas();
        this.canvas = document.getElementById(canvasid);
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(update_main, 10, canvasid); //in milliseconds. Runs update every 10 millis (25 FPS). canvasid is passed to update_main
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

//Main update loop. Calls the update loops of all objects
function update_main(canvasid) {
    myCanvas.clear(); //Begin by clearing everything
    myCanvas.frameNo += 1; //Increment the master counter

    var i;
    for (i = 0; i < allnodes.length; i += 1) {
        allnodes[i].update();
    }

    draw_main(canvasid); //draw updated things 
}

//Main draw loop. Handles render order.
function draw_main(canvasid) {
    var i;
    for (i = 0; i < allnodes.length; i += 1) {
        allnodes[i].draw();
    }
}

function onLoad() {
    var filepath = "survey.json";
    var client = new XMLHttpRequest();
    client.open("GET", filepath, true);
    client.onreadystatechange = function () { //callback
        if (client.readyState == 4) {
            if (client.status == 200 || client.status == 0) {
                database_obj = JSON.parse(client.responseText);
                initializeNodes();
            }
        }
    };

    client.send();
}

//Purges existing nodes and calls initializeNodes() to reset them
function resetCanvas(){
    allnodes = [];
    initializeNodes();
}

/* ***** NODE HANDLING FUNCTIONS ***** */

function initializeNodes() {
    nodes = database_obj.nodes; 
    edges = database_obj.edges; 

    var grid_size = optimizeToGrid(nodes.length);
    //Set of coordinates of each node onto plane (optimized)
    var coord_array = setCoordinates();
    //Scaled coordinates
    var scaled_coord_array = scaleCoordinates(coord_array);

    var i;
    for (i = 0; i < nodes.length; i++) { //for every node in survey.json
        var itemheight = 40;
        //TODO

        var x_coord = scaled_coord_array[i][0];
        var y_coord = scaled_coord_array[i][1];
        //placeNodes(newState, itemheight, nodes[i].width, x_coord, y_coord); //To be replaced by canvas draw

        allnodes.push(nodes[i]); 
    }

    //Draws edges between nodes
    connectNodes();
}

function connectNodes() {
    var i;
    for (i = 0; i < edges.length; i++) { 
        //TODO
    }    
}

//Determines optimized coordinates for each node in a network
function setCoordinates() {
    var grid_size = optimizeToGrid(nodes.length);
    //Create 2D array
    var coord_array = [];
    var i;
    for (i = 0; i < nodes.length; i++) {
        coord_array[i] = [];
        var x_coord = (i % grid_size[0]);
        var y_coord = (Math.floor(i / grid_size[0]));    
        coord_array[i][0] = x_coord;
        coord_array[i][1] = y_coord;
    }
    return coord_array;
}

//Scales the coordinates relative to the center of canvas (plane)
function scaleCoordinates(coord_array) {
    var newCoordinates = [];
    var x_max = 0;
    var y_max = 0;

    // return maximum values of x and y
    var i;
    for (i = 0; i < coord_array.length; i++) {
        newCoordinates[i] = [];
        if (coord_array[i][0] >= x_max) {
            x_max = coord_array[i][0];
        }

        if (coord_array[i][1] >= y_max) {
            y_max = coord_array[i][1];
        }
    }

    // scaling by proportion (by maximum valus of x and y)
    for (i = 0; i < coord_array.length; i++) {
        newCoordinates[i][0] = coord_array[i][0]/x_max * 350 + 100; // random constant scaling
        newCoordinates[i][1] = coord_array[i][1]/y_max * 150 + 50; // random constant scaling
    }
    return newCoordinates;
}


function hasTarget(id) {
    var numSource = 0;
    var numTarget = 0;
    var i;
    for (i = 0; i < edges.length; i++) { 
        if (edges[i].source == id) {
            return true;
        }
    }
    return false;
}