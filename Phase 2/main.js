var iterationNum = 0;
var database_obj;
var questions;
var edges;
var allquestions = [];
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
                initializeQuestions();
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
    for (i = 0; i < allquestions.length; i++) {
        allquestions[i].update();
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
    for (i = 0; i < allquestions.length; i++) {
        allquestions[i].draw();
    }
    var j;
    for (j = 0; j < alledges.length; j++) {
        alledges[j].draw();
    }
    numCollisions();
}

//Purges existing questions and calls initializeQuestions() to reset them
function resetCanvas(){
    allquestions = [];
    if (jsonreceived) { //do not run function immediately after opening webpage - only run block on reset
        initializeQuestions();
    }
}

/* ***** QUESTION HANDLING FUNCTIONS ***** */

function initializeQuestions() {
    console.log("initializeQuestions(): Running");
    questions = database_obj.questions; 
    edges = database_obj.edges; 

    var grid_size = optimizeToGrid(questions.length);
    var coord_array = setCoordinates();
    var scaled_coord_array = scaleCoordinates(coord_array);

    pushAllquestions(scaled_coord_array);
    pushAllEdges();
}

function optimizeNetworkByGrid() {
    console.log("optimizeNetworkByGrid(): Running");
    var grid_size = optimizeToGrid(questions.length);
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

function pushAllquestions(scaled_coord_array) {
    var i;
    allquestions = [];
    for (i = 0; i < questions.length; i++) { //for every question in survey.json
        var x_coord = scaled_coord_array[i][0];
        var y_coord = scaled_coord_array[i][1];
        setQuestionParameters(questions[i], x_coord, y_coord);
        allquestions.push(questions[i]); //add question to list of questions
    }

    var j;
    for (j = 0; j < allquestions.length; j += 1) {
        allquestions[j].update();
    }
}

function updateCoordinates(scaled_coord_array) {
    var i;
    for (i = 0; i < allquestions.length; i++) {
        allquestions[i].x = scaled_coord_array[i][0];
        allquestions[i].y = scaled_coord_array[i][1];
        allquestions[i].update();
    }
}

function pushAllEdges() {
    var i;
    for (i = 0; i < edges.length; i++) { 
        var j;
        for (j = 0; j < allquestions.length; j++) {            
            //sourceObject assignment
            if (edges[i].source == allquestions[j].questionID) {
                edges[i].sourceObject = allquestions[j];
            }
            else {
                var k;
                for (k = 0; k < allquestions[j].responses.length; k++) {
                    if (edges[i].source == allquestions[j].responses[k].nodeID) {
                        edges[i].sourceObject = allquestions[j].responses[k];
                    }
                }
            }
            //targetObject assignment
            if (edges[i].target == allquestions[j].questionID) {
                edges[i].targetObject = allquestions[j];
            }
            else {
                var k;
                for (k = 0; k < allquestions[j].responses.length; k++) {
                    if (edges[i].target == allquestions[j].responses[k].nodeID) {
                        edges[i].targetObject = allquestions[j].responses[k];
                    }            
                }
            }
        }
        setEdgeParameters(edges[i]);
        alledges.push(edges[i]); //add question to list of questions
    }
}

function setQuestionParameters(question, x_coord, y_coord){
    question.totalheight = question.questionRowHeight + question.responses.length * question.questionRowHeight;

    //top left coordinates
    question.x = x_coord;
    question.y = y_coord;

    //Iterate through questions and assign to responses
    var j;
    for (j = 0; j < question.responses.length; j++) {
        setColumnParameters(question.responses[j], question, j);
    }

    //Now define the draw and update for the questions
    question.update = function(){
        var n;
        for (n = 0; n < this.responses.length; n++) {
            this.responses[n].update();
        }
    };
    question.draw = function(){
        var ctx = myCanvas.context;
        ctx.beginPath();
        ctx.fillStyle = "#CCFFEE";
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#AAAAAA";
        if (this.type == "table" || this.type == "track") {
            ctx.rect(this.x, this.y, this.rowWidth, this.totalheight);
        } else {
            ctx.fillStyle = "black";
            ctx.arc(this.x, this.y + this.questionRowHeight, 6, 0, 2*Math.PI); //circle at source. +4 makes things align nicely.
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
        ctx.fillText(this.name, this.x + this.rowWidth/2, this.y + this.questionRowHeight/2);
            
        var n;
        for (n = 0; n < this.responses.length; n++) {
            this.responses[n].draw();
        }
    };
}

function setColumnParameters(col, question, off){
    col.offset = off; //which item it is in relation to title.
    col.parent = question;
    col.questionRowHeight = question.questionRowHeight;
    col.rowWidth = question.rowWidth;
    col.x = question.x;
    col.y = question.y + question.questionRowHeight + off*col.questionRowHeight; 
    col.update = function(){
        this.x = this.parent.x;
        this.y = this.parent.y + this.parent.questionRowHeight + this.offset*this.questionRowHeight;
    }
    col.draw = function(){
        var ctx = myCanvas.context;
        ctx.beginPath();
        ctx.fillStyle = "#EEEEEE";
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#AAAAAA";
        ctx.rect(this.x, this.y, this.rowWidth, this.questionRowHeight);
        ctx.fill(); //draw rectangle inside
        ctx.stroke(); //draw rectangle border

        ctx.font = "14px Andale Mono, monospace";
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, this.x + this.rowWidth/2, this.y + this.questionRowHeight/2);
    }
}

function setEdgeParameters(edge){
    edge.update = function(){
        //First, obtain values
        var sourcex = this.sourceObject.x;
        var sourcey = this.sourceObject.y + this.sourceObject.questionRowHeight/2;
        var targetx = this.targetObject.x;
        var targety = this.targetObject.y + this.targetObject.questionRowHeight/2;

        //Determine which side to use
        if (sourcex + this.sourceObject.rowWidth < targetx) {sourcex += this.sourceObject.rowWidth;}//source right side, target left side
        else if (sourcex > targetx + this.targetObject.rowWidth) {targetx += this.targetObject.rowWidth;}//source left side, target right side

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