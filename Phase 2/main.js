var database_obj;
var allnodes = [];
var alledges = [];
var jsonreceived = false; //whether or not the JSON file has been received.

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
    console.log("onLoad(): Running");
    var filepath = "survey.json";
    var client = new XMLHttpRequest();
    client.open("GET", filepath, true);
    client.onreadystatechange = function () { //callback
        if (client.readyState == 4) {
            if (client.status == 200 || client.status == 0) {
                database_obj = JSON.parse(client.responseText);
                initializeNodes();
                jsonreceived = true;
            }
        }
    };

    client.send();
}

//Purges existing nodes and calls initializeNodes() to reset them
function resetCanvas(){
    allnodes = [];
    if (jsonreceived) { //do not run function immediately after opening webpage - only run block on reset
        initializeNodes();
    }
}

/* ***** NODE HANDLING FUNCTIONS ***** */

function initializeNodes() {
    console.log("initializeNodes(): Running");
    nodes = database_obj.nodes; 
    edges = database_obj.edges; 

    var grid_size = optimizeToGrid(nodes.length);
    //Set of coordinates of each node onto plane (optimized)
    var coord_array = setCoordinates();
    //Scaled coordinates
    var scaled_coord_array = scaleCoordinates(coord_array);

    var i;
    for (i = 0; i < nodes.length; i++) { //for every node in survey.json
        var x_coord = scaled_coord_array[i][0];
        var y_coord = scaled_coord_array[i][1];
        setNodeParameters(nodes[i], x_coord, y_coord);
        allnodes.push(nodes[i]); //add node to list of nodes
    }

    //Draws edges between nodes
    connectNodes();
}

function connectNodes() {
    var i;
    for (i = 0; i < edges.length; i++) { 
        var j;
        for (j = 0; j < allnodes.length; j++) {            
            //sourceObject assignment
            if (edges[i].source == allnodes[j].id) {
                edges[i].sourceObject = allnodes[j];
            }
            else {
                var k;
                for (k = 0; k < allnodes[j].columns.length; k++) {
                    if (edges[i].source == allnodes[j].columns[k].id) {
                        edges[i].sourceObject = allnodes[j].columns[k];
                    }
                }
            }

            //targetObject assignment
            if (edges[i].target == allnodes[j].id) {
                edges[i].targetObject = allnodes[j];
            }
            else {
                var k;
                for (k = 0; k < allnodes[j].columns.length; k++) {
                    if (edges[i].target == allnodes[j].columns[k].id) {
                        edges[i].targetObject = allnodes[j].columns[k];
                    }            
                }
            }
        }
        alledges.push(edges[i]); //add node to list of nodes
    }
}

function setNodeParameters(node, x_coord, y_coord){
    node.height = 40; //for the title
    node.totalheight = node.height + node.columns.length * 20;

    //top left coordinates
    node.x = x_coord;
    node.y = y_coord;

    //Iterate through nodes and assign to columns
    var j;
    for (j = 0; j < node.columns.length; j++) {
        setColumnParameters(node.columns[j], node, j);
    }

    //Now define the draw and update for the nodes
    node.update = function(){
        var n;
        for (n = 0; n < this.columns.length; n++) {
            this.columns[n].update();
        }
    };
    node.draw = function(){
        var ctx = myCanvas.context;
        ctx.beginPath();
        ctx.fillStyle = "#DDDDFF";
        ctx.lineWidth = "2";
        ctx.strokeStyle = "black";
        ctx.rect(this.x, this.y, this.width, this.totalheight + 2); //+2 is to make the borders look nice
        ctx.fill(); //draw rectangle inside
        ctx.stroke(); //draw rectangle border

        ctx.font = "14px Andale Mono, monospace";
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, this.x + this.width/2, this.y + this.height/2);
            
        var n;
        for (n = 0; n < this.columns.length; n++) {
            this.columns[n].draw();
        }
    };
}

function setColumnParameters(col, node, off){
    col.offset = off; //which item it is in relation to title.
    col.parent = node;
    col.height = 20; //default height for column is 20
    col.width = node.width;
    col.x = node.x;
    col.y = node.y + node.height + off*col.height; 
    col.update = function(){
        this.x = this.parent.x;
        this.y = this.parent.y + this.parent.height + this.offset*this.height;
    }
    col.draw = function(){
        var ctx = myCanvas.context;
        ctx.beginPath();
        ctx.fillStyle = "#CCFFEE";
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#BBEEDD";
        ctx.rect(this.x + 2, this.y, this.width - 4, this.height);
        ctx.fill(); //draw rectangle inside
        ctx.stroke(); //draw rectangle border

        ctx.font = "14px Andale Mono, monospace";
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, this.x + this.width/2, this.y + this.height/2);
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