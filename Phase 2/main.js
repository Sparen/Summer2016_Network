var iterationNum = 0;
var database_obj;
var nodes;
var edges;
var allnodes = [];
var alledges = [];
var jsonreceived = false; //whether or not the JSON file has been received.

/* ***** INITIALIZATION AND CANVAS FUNCTIONS ***** */

paper.install(window); //Inject paper.js into the window

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

function start(canvasid) {
    console.log("start(): Running on canvas with id " + canvasid);
    myCanvas.start(canvasid); //set up canvas and interval, etc.
    onLoad();
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

//Main update loop. Calls the update loops of all objects
function update_main() {
    myCanvas.frameNo++; //Increment the master counter
    var i;
    for (i = 0; i < allnodes.length; i++) {
        allnodes[i].update();
    }
    var j;
    for (j = 0; j < alledges.length; j++) {
        alledges[j].update();
    }
    draw_main(); //draw updated things
}

//Main draw loop. Handles render order.
function draw_main() {
    myCanvas.clear();
    var i;
    for (i = 0; i < allnodes.length; i++) {
        allnodes[i].draw();
    }
    var j;
    for (j = 0; j < alledges.length; j++) {
        alledges[j].draw();
    }
    numCollisions();
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
    var coord_array = setCoordinates();
    var scaled_coord_array = scaleCoordinates(coord_array);

    pushAllNodes(scaled_coord_array);
    pushAllEdges();
}

function optimizeNetworkByGrid() {
    console.log("optimizeNetworkByGrid(): Running");
    var grid_size = optimizeToGrid(nodes.length);
    var coord_array = setCoordinates();
    var scaled_coord_array = scaleCoordinates(coord_array);
    var lowestEdgeNoise = 1000;
    var currentEdgeNoise;
    var optimalGridAssignment = [];

    var i;
    for (i = 0; i < 1000; i ++) {        
        shuffleCoordArray(scaled_coord_array);
        updateCoordinates(scaled_coord_array);
        currentEdgeNoise = numCollisions();
        if (currentEdgeNoise < lowestEdgeNoise) {
            lowestEdgeNoise = currentEdgeNoise;
            var j;
            for (j = 0; j < scaled_coord_array.length; j++) {
                optimalGridAssignment[j] = scaled_coord_array[j];
            }
        }
    }
    updateCoordinates(optimalGridAssignment);
    update_main();
}

function pushAllNodes(scaled_coord_array) {
    var i;
    allnodes = [];
    for (i = 0; i < nodes.length; i++) { //for every node in survey.json
        var x_coord = scaled_coord_array[i][0];
        var y_coord = scaled_coord_array[i][1];
        setNodeParameters(nodes[i], x_coord, y_coord);
        allnodes.push(nodes[i]); //add node to list of nodes
    }

    var j;
    for (j = 0; j < allnodes.length; j += 1) {
        allnodes[j].update();
    }
}

function updateCoordinates(scaled_coord_array) {
    var i;
    for (i = 0; i < allnodes.length; i++) {
        allnodes[i].x = scaled_coord_array[i][0];
        allnodes[i].y = scaled_coord_array[i][1];
        allnodes[i].update();
    }
}

function pushAllEdges() {
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
        setEdgeParameters(edges[i]);
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
        if (this.type == "table" || this.type == "track") {
            ctx.rect(this.x, this.y, this.width, this.totalheight + 2); //+2 is to make the borders look nice
        } else {
            ctx.fillStyle = "black";
            ctx.arc(this.x, this.y + 20, 6, 0, 2*Math.PI); //circle at source. 20 is default title height. +4 makes things align nicely.
        }
        ctx.fill(); //draw inside
        ctx.stroke(); //draw border

        ctx.font = "14px Andale Mono, monospace";
        if (this.type == "table" || this.type == "track") {
            ctx.fillStyle = "black";
        } else {
            ctx.fillStyle = "white";
        }
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

function setEdgeParameters(edge){
    edge.update = function(){
        //First, obtain values
        var sourcex = this.sourceObject.x;
        var sourcey = this.sourceObject.y + this.sourceObject.height/2;
        var targetx = this.targetObject.x;
        var targety = this.targetObject.y + this.targetObject.height/2;

        //Determine which side to use
        if (sourcex + this.sourceObject.width < targetx) {sourcex += this.sourceObject.width;}//source right side, target left side
        else if (sourcex > targetx + this.targetObject.width) {targetx += this.targetObject.width;}//source left side, target right side

        this.points = [];
        this.points.push([sourcex, sourcey]);
        this.points.push([targetx, targety]);

    }
    edge.draw = function(){
        var ctx = myCanvas.context;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = "2";
        ctx.moveTo(this.points[0][0], this.points[0][1]);
        var i;
        for (i = 1; i < this.points.length; i += 1) {
            ctx.lineTo(this.points[i][0], this.points[i][1]);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = this.color;
        ctx.lineWidth = "2";
        ctx.arc(this.points[0][0], this.points[0][1], 4, 0, 2*Math.PI); //circle at source
        ctx.fill();
        ctx.stroke();

        if (this.drawtarget) {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = this.color;
            ctx.lineWidth = "2";
            ctx.arc(this.points[this.points.length-1][0], this.points[this.points.length-1][1], 4, 0, 2*Math.PI); //circle at target
            ctx.fill();
            ctx.stroke();
        }
    }
}

//draws intersecting points and returns number of collisions between edges
function numCollisions() {
    var j;
    for (j = 0; j < alledges.length; j += 1) {
        alledges[j].update();
    }

    var num = 0;
    var i;
    for (i = 0; i < alledges.length; i++) {
        var j;
        for (j = i+1; j < alledges.length; j++) {
            if (isCollidingEE(alledges[i], alledges[j])) {
                num++;
            }
        }
    }
    return num;
}