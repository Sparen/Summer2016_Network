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

    var grid_size = placeOnToGrid(questions.length);
    var scaled_coord_array = scaleCoordinates(grid_size, questions);

    pushAllQuestions(scaled_coord_array);
    pushAllEdges();
}

function optimizeNetworkByGrid() {
    console.log("optimizeNetworkByGrid(): Running");
    var grid_size = placeOnToGrid(questions.length);
    var scaled_coord_array = scaleCoordinates(grid_size, questions);
    var lowestEdgeNoise = Number.MAX_VALUE;
    var currentEdgeNoise;
    var optimalGridAssignment = [];
    var optimalQuestionsAssignment = [];

    //Iterates through and finds the optimal result (least number of collisions)
    var i;
    for (i = 0; i < 100; i ++) {
        shuffleQuestions(allquestions);
        scaled_coord_array = scaleCoordinates(grid_size, allquestions);
        updateCoordinates(scaled_coord_array);
        currentEdgeNoise = numCollisions();
        if (currentEdgeNoise < lowestEdgeNoise) {
            lowestEdgeNoise = currentEdgeNoise;
            var j;
            for (j = 0; j < allquestions.length; j++) {
                optimalQuestionsAssignment[j] = allquestions[j];
                optimalGridAssignment[j] = scaled_coord_array[j];
            }
        }
    }

    var n;
    for(n = 0; n < allquestions.length; n++) {
        allquestions[n] = optimalQuestionsAssignment[n];
    }

    centralizeCoordinates(optimalGridAssignment);
    updateCoordinates(optimalGridAssignment);
    randomOffsetGenerator(allquestions);
    update_main();
}

function pushAllQuestions(scaled_coord_array) {
    console.log("pushAllQuestions(): Running");
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

//Requires that setQuestionParameters has already been run.
function pushAllEdges() {
    console.log("pushAllEdges(): Running");
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

//Note: This function creates the response objects
function setQuestionParameters(question, x_coord, y_coord){
    console.log("setQuestionParameters(): Running");
    question.totalheight = question.questionRowHeight + question.responseRowIDs.length * question.questionRowHeight;

    //top left coordinates
    question.x = x_coord;
    question.y = y_coord;

    //Iterate through questions and assign to responseRowIDs
    question.responses = [];
    var j;
    for (j = 0; j < question.responseRowIDs.length; j++) {
        var newresponseobj = {nodeID: question.responseRowIDs[j]};
        setColumnParameters(newresponseobj, question, j);
        question.responses.push(newresponseobj);
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
        ctx.strokeStyle = "#CCCCCC";
        ctx.rect(this.x, this.y, this.rowWidth, this.totalheight);
        ctx.fill(); //draw inside
        ctx.stroke(); //draw border

        var n;
        for (n = 0; n < this.responses.length; n++) {
            this.responses[n].draw();
        }
    };
}

function setColumnParameters(col, question, off){
    console.log("setColumnParameters(): Running");
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
        ctx.strokeStyle = "#CCCCCC";
        ctx.rect(this.x, this.y, this.rowWidth, this.questionRowHeight);
        ctx.fill(); //draw rectangle inside
        ctx.stroke(); //draw rectangle border
    }
}

function setEdgeParameters(edge){
    console.log("setEdgeParameters(): Running");
    edge.update = function(){
        updateEdge(this);
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



        // Drawing an arrow at the end of the edge
        if (this.drawtarget) {
            var prev_coord = this.points[this.points.length-2];
            var target_coord = this.points[this.points.length-1];
            var arrow_size = 4;
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = this.color;
            ctx.lineWidth = "1.5";
            ctx.moveTo(target_coord[0], target_coord[1]);
            ctx.lineTo(prev_coord[0] + (target_coord[0] - prev_coord[0])/2, prev_coord[1] + arrow_size);
            ctx.lineTo(prev_coord[0] + (target_coord[0] - prev_coord[0])/2, prev_coord[1] - arrow_size);
            ctx.lineTo(target_coord[0], target_coord[1]);
            ctx.fill();
            ctx.stroke();
        }
    }
}

//obtains points on an edge
//BLUE EDGES: Must start at right side
//RED EDGES: Must start at right side and end at left side
//No edges should end at the right side
function updateEdge(curr_edge) {
    //First, obtain values
    var sourcex = curr_edge.sourceObject.x;
    var sourcey = curr_edge.sourceObject.y + curr_edge.sourceObject.questionRowHeight/2;
    var targetx = curr_edge.targetObject.x;
    var targety = curr_edge.targetObject.y + curr_edge.targetObject.questionRowHeight/2;
    var sourcestub = -1; //-1 is left, 1 is right
    var targetstub = -1; //-1 is left, 0 is top, 1 is right

    //Determine which side to use
    if (sourcex + curr_edge.sourceObject.rowWidth < targetx) {sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth; sourcestub = 1;}//source right side, target left side
    else if (sourcex > targetx + curr_edge.targetObject.rowWidth) {targetx = curr_edge.targetObject.x + curr_edge.targetObject.rowWidth; targetstub = 1;}//source left side, target right side

    //overrides for blue and red edges
    if (curr_edge.color === "blue" || curr_edge.color === "red") {
        sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth; sourcestub = 1;
    }
    if (curr_edge.color === "red") {
        targetx = curr_edge.targetObject.x; targetstub = -1;
    }

    //coordinates for the stubs
    var sourcestubx;
    var sourcestuby;
    var targetstubx;
    var targetstuby;

    //store last point added
    var currx;
    var curry;

    //Handle determination of source and target stub locations
    if (sourcestub === -1) {
        sourcestubx = sourcex - curr_edge.sourceObject.questionRowHeight/2;
    } else {
        sourcestubx = sourcex + curr_edge.sourceObject.questionRowHeight/2;
    }
    sourcestuby = sourcey;
    if (targetstub === -1) {
        targetstubx = targetx - curr_edge.targetObject.questionRowHeight/2;
    } else {
        targetstubx = targetx + curr_edge.targetObject.questionRowHeight/2;
    }
    targetstuby = targety;
    currx = sourcestubx;
    curry = sourcestuby;

    curr_edge.points = [];
    curr_edge.points.push([sourcex, sourcey]); //source
    curr_edge.points.push([sourcestubx, sourcestuby]); //source stub

    
    var multiple = 0;
    var mincollisions = Number.MAX_VALUE; 
    var bestmultiple = 0;//stores which multiple is best
    while (multiple < 8) { //8 attempts before givin up
        var segment = {points: [[sourcestubx, sourcestuby], [sourcestubx + multiple * sourcestub * curr_edge.sourceObject.questionRowHeight/2, targetstuby]]};
        var i;
        var numcollisions = 0;
        for (i = 0; i < alledges.length; i++) { //Iterate through all edges and make sure it's not overlapping any of them.
            if (alledges[i].points !== undefined && alledges[i].points !== null) {
                if (isOverlappingEE(segment, alledges[i])) { //overlaps are automatically rejected
                    numcollisions = Number.MAX_VALUE;
                    break; //stop bothering with this multiple
                } else if (isCollidingEE(segment, alledges[i], false, false)) {
                    numcollisions++;
                }
            }
        }
        for (i = 0; i < allquestions.length; i++) { //Iterate through all nodes
            if (isCollidingNE(allquestions[i], segment)) {
                numcollisions = Number.MAX_VALUE;
                break; //stop bothering with this multiple
            }
        }
        if (numcollisions < mincollisions) {
            mincollisions = numcollisions;
            bestmultiple = multiple;
        }
        multiple++;
    }
    curr_edge.points.push([sourcestubx + bestmultiple * sourcestub * curr_edge.sourceObject.questionRowHeight/2, sourcestuby])
    curr_edge.points.push([sourcestubx + bestmultiple * sourcestub * curr_edge.sourceObject.questionRowHeight/2, targetstuby])

    curr_edge.points.push([targetstubx, targetstuby]);
    curr_edge.points.push([targetx, targety]); //target
}

//draws intersecting points and returns number of collisions between edges
function numCollisions() {
    var i; //questions
    var j; //edges
    var k; //edges
    var num = 0; //number of collisions. NOT A COUNTER

    for (i = 0; i < allquestions.length; i += 1) {
        allquestions[i].update();
    }

    //node to node
    /*for (i = 0; i < allquestions.length; i++) { //preventing node to node collision entirely
        for (j = i + 1; j < allquestions.length; j++) {
            if (isCollidingNN(allquestions[i], allquestions[j])) {
                return Number.MAX_VALUE;
            }
        }
    }*/

    for (j = 0; j < alledges.length; j += 1) {
        alledges[j].update();
    }

    //node to edge
    for (i = 0; i < allquestions.length; i++) {
        for (j = 0; j < alledges.length; j++) {
            if (isCollidingNE(allquestions[i], alledges[j])) {
                num += 10; //counts as two collisions, may be changed in the future
            }
        }
    }

    for (j = 0; j < alledges.length; j++) {
        for (k = j+1; k < alledges.length; k++) {
            if (isCollidingEE(alledges[j], alledges[k], false, false)) {
                num++;
            }
        }
    }
    return num;
}