"use strict";

var LEFT = -1;
var RIGHT = 1;
var iterationNum = 0;
var database_obj;
var questions;
var edges;
var allquestions = [];
var alledges = [];
var jsonreceived = false; //whether or not the JSON file has been received.

/* ***** INITIALIZATION AND CANVAS FUNCTIONS ***** */

var myCanvas = {
    start: function (canvasid) {
        resetCanvas();
        this.canvas = document.getElementById(canvasid);
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        //this.interval = setInterval(update_main, 10, canvasid); //in milliseconds. Runs update every 10 millis (25 FPS). canvasid is passed to update_main
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
        if (client.readyState === 4) {
            if (client.status === 200 || client.status === 0) {
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
    myCanvas.frameNo += 1; //Increment the master counter
    var i;
    for (i = 0; i < allquestions.length; i += 1) {
        allquestions[i].update();
    }
    var j;
    for (j = 0; j < alledges.length; j += 1) {
        alledges[j].update();
    }
    draw_main(); //draw updated things
}

//Main draw loop. Handles render order.
function draw_main() {
    myCanvas.clear();
    var i;
    for (i = 0; i < allquestions.length; i += 1) {
        allquestions[i].draw();
    }
    var j;
    for (j = 0; j < alledges.length; j += 1) {
        alledges[j].draw();
    }
    numCollisions();
}

//Purges existing questions and calls initializeQuestions() to reset them
function resetCanvas() {
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

    update_main();
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
    var j;
    for (i = 0; i < 100; i += 1) {
        shuffleQuestions(allquestions);
        scaled_coord_array = scaleCoordinates(grid_size, allquestions);
        updateCoordinates(scaled_coord_array);
        currentEdgeNoise = numCollisions();
        if (currentEdgeNoise < lowestEdgeNoise) {
            lowestEdgeNoise = currentEdgeNoise;
            for (j = 0; j < allquestions.length; j += 1) {
                optimalQuestionsAssignment[j] = allquestions[j];
                optimalGridAssignment[j] = scaled_coord_array[j];
            }
        }
    }

    var n;
    for (n = 0; n < allquestions.length; n += 1) {
        allquestions[n] = optimalQuestionsAssignment[n];
    }

    centralizeCoordinates(optimalGridAssignment);
    updateCoordinates(optimalGridAssignment);
    randomOffsetGenerator(allquestions);
    console.log("Lowest Edge Noise:" + lowestEdgeNoise);
    update_main();
}

function pushAllQuestions(scaled_coord_array) {
    console.log("pushAllQuestions(): Running");
    var x_coord;
    var y_coord;
    var i;
    allquestions = [];
    for (i = 0; i < questions.length; i += 1) { //for every question in survey.json
        x_coord = scaled_coord_array[i][0];
        y_coord = scaled_coord_array[i][1];
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
    for (i = 0; i < allquestions.length; i += 1) {
        allquestions[i].x = scaled_coord_array[i][0];
        allquestions[i].y = scaled_coord_array[i][1];
        allquestions[i].update();
    }
}

//Requires that setQuestionParameters has already been run.
function pushAllEdges() {
    console.log("pushAllEdges(): Running");
    var i;
    var j;
    var k;
    for (i = 0; i < edges.length; i += 1) {
        for (j = 0; j < allquestions.length; j += 1) {
            //sourceObject assignment
            if (edges[i].source === allquestions[j].questionID) {
                edges[i].sourceObject = allquestions[j];
            } else {
                for (k = 0; k < allquestions[j].responses.length; k += 1) {
                    if (edges[i].source === allquestions[j].responses[k].nodeID) {
                        edges[i].sourceObject = allquestions[j].responses[k];
                    }
                }
            }
            //targetObject assignment
            if (edges[i].target === allquestions[j].questionID) {
                edges[i].targetObject = allquestions[j];
            } else {
                for (k = 0; k < allquestions[j].responses.length; k += 1) {
                    if (edges[i].target === allquestions[j].responses[k].nodeID) {
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
function setQuestionParameters(question, x_coord, y_coord) {
    console.log("setQuestionParameters(): Running");
    question.totalheight = question.questionRowHeight + question.responseRowIDs.length * question.questionRowHeight;

    //top left coordinates
    question.x = x_coord;
    question.y = y_coord;

    //Iterate through questions and assign to responseRowIDs
    question.responses = [];
    var j;
    for (j = 0; j < question.responseRowIDs.length; j += 1) {
        var newresponseobj = {nodeID: question.responseRowIDs[j]};
        setColumnParameters(newresponseobj, question, j);
        question.responses.push(newresponseobj);
    }

    //Now define the draw and update for the questions
    question.update = function () {
        var n;
        for (n = 0; n < this.responses.length; n += 1) {
            this.responses[n].update();
        }
    };
    question.draw = function () {
        var ctx = myCanvas.context;
        ctx.beginPath();
        ctx.fillStyle = "#CCFFEE";
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#CCCCCC";
        ctx.rect(this.x, this.y, this.rowWidth, this.totalheight);
        ctx.fill(); //draw inside
        ctx.stroke(); //draw border

        var n;
        for (n = 0; n < this.responses.length; n += 1) {
            this.responses[n].draw();
        }
    };
}

function setColumnParameters(col, question, off) {
    console.log("setColumnParameters(): Running");
    col.offset = off; //which item it is in relation to title.
    col.parent = question;
    col.questionRowHeight = question.questionRowHeight;
    col.rowWidth = question.rowWidth;
    col.x = question.x;
    col.y = question.y + question.questionRowHeight + off * col.questionRowHeight;
    col.update = function () {
        this.x = this.parent.x;
        this.y = this.parent.y + this.parent.questionRowHeight + this.offset * this.questionRowHeight;
    };
    col.draw = function () {
        var ctx = myCanvas.context;
        ctx.beginPath();
        ctx.fillStyle = "#EEEEEE";
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#CCCCCC";
        ctx.rect(this.x, this.y, this.rowWidth, this.questionRowHeight);
        ctx.fill(); //draw rectangle inside
        ctx.stroke(); //draw rectangle border
    };
}

function setEdgeParameters(edge) {
    console.log("setEdgeParameters(): Running");
    edge.update = function () {
        updateEdge(this);
    };
    edge.draw = function () {
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
            var prev_coord = this.points[this.points.length - 2];
            var target_coord = this.points[this.points.length - 1];
            var arrow_size = 4;
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = this.color;
            ctx.lineWidth = "1.5";
            ctx.moveTo(target_coord[0], target_coord[1]);
            if (prev_coord[1] < target_coord[1]) { //top
                ctx.lineTo(prev_coord[0] + arrow_size, prev_coord[1] + (target_coord[1] - prev_coord[1]) / 2);
                ctx.lineTo(prev_coord[0] - arrow_size, prev_coord[1] + (target_coord[1] - prev_coord[1]) / 2);
            } else { //left or right
                ctx.lineTo(prev_coord[0] + (target_coord[0] - prev_coord[0]) / 2, prev_coord[1] + arrow_size);
                ctx.lineTo(prev_coord[0] + (target_coord[0] - prev_coord[0]) / 2, prev_coord[1] - arrow_size);
            }
            ctx.lineTo(target_coord[0], target_coord[1]);
            ctx.fill();
            ctx.stroke();
        }
    };
}

//obtains points on an edge
//BLUE EDGES: Must start at right side
//RED EDGES: Must start at right side and end at left side
//No edges should end at the right side
function updateEdge(curr_edge) {
    //First, obtain values
    var sourcex = curr_edge.sourceObject.x;
    var sourcey = curr_edge.sourceObject.y + curr_edge.sourceObject.questionRowHeight / 2;
    var targetx = curr_edge.targetObject.x;
    var targety = curr_edge.targetObject.y + curr_edge.targetObject.questionRowHeight / 2;
    var sourcestub = LEFT; //-1 is left, 1 is right

    //If source completely on the left side of target, make source x be the righter edge
    //Also, sourcestub becomes on the right
    if (sourcex + curr_edge.sourceObject.rowWidth < targetx) {
        sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth; sourcestub = RIGHT;
    }

    //overrides for blue and red edges, always goes out from the right
    if (curr_edge.color === "blue" || curr_edge.color === "red") {
        sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth; sourcestub = RIGHT;
    }

    var i;
    var largestRowWidth = 0;
    for (i = 0; i < allquestions.length; i += 1) {
        if (allquestions[i].rowWidth > largestRowWidth) {
            largestRowWidth = allquestions[i].rowWidth;
        }
    }

    //bad: if there was a collision with a node or there was no place to put the edge, bad is true
    var bad = determineEdgeMidpointsLR(curr_edge, sourcex, targetx, sourcey, targety, sourcestub, largestRowWidth);

    //If there was a collision with a node or there was overlap... first, try the other source port
    if (bad && curr_edge.color === "black") {
        sourcestub *= -1;
        if (sourcestub === LEFT) {
            sourcex = curr_edge.sourceObject.x;
        } else {
            sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth;
        }
        bad = determineEdgeMidpointsLR(curr_edge, sourcex, targetx, sourcey, targety, sourcestub, largestRowWidth);
    }
    //Try original source port and other target port
    if (bad && curr_edge.color === "black") {
        sourcestub *= -1;
        if (sourcestub === LEFT) {
            sourcex = curr_edge.sourceObject.x;
        } else {
            sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth;
        }
        targetx = curr_edge.targetObject.x + curr_edge.targetObject.rowWidth / 2;
        targety = curr_edge.targetObject.y;
        bad = determineEdgeMidpointsTOP(curr_edge, sourcex, targetx, sourcey, targety, sourcestub, largestRowWidth);
    }

    //Try other source port and other target port
    if (bad && curr_edge.color === "black") {
        sourcestub *= -1;
        if (sourcestub === LEFT) {
            sourcex = curr_edge.sourceObject.x;
        } else {
            sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth;
        }
        bad = determineEdgeMidpointsTOP(curr_edge, sourcex, targetx, sourcey, targety, sourcestub, largestRowWidth);
    }

    //If it still fails on all two-midpoint solutions or not a black edge, have the edge move around nodes
    if (bad || isCollidingNE(curr_edge.targetObject, curr_edge)) {
        targetx = curr_edge.targetObject.x;
        targety = curr_edge.targetObject.y;
        // add new midpoints that goes around the node here
        resetEdgeToLoop(curr_edge, sourcestub, sourcex, sourcey, targetx, targety);       
    }
}

//Helper function for updateEdge. Handles setting the points of an edge
function determineEdgeMidpointsLR(curr_edge, sourcex, targetx, sourcey, targety, sourcestub, largestRowWidth) {
    //coordinates for the stubs
    var sourcestubx;
    var targetstubx;
    var stublength = curr_edge.sourceObject.questionRowHeight;

    //Handle determination of source and target stub locations
    if (sourcestub === LEFT) {
        sourcestubx = sourcex - stublength;
    } else {
        sourcestubx = sourcex + stublength;
    }
    
    targetstubx = targetx - stublength;

    curr_edge.points = [];
    curr_edge.points.push([sourcex, sourcey]); //source
    curr_edge.points.push([sourcestubx, sourcey]); //source stub

    var testx;
    var segment;
    var numcollisions;

    //first, see if you can just go straight to the target
    segment = {points: [[sourcestubx, sourcey], [targetstubx, sourcey], [targetstubx, targety]]};
    numcollisions = testSegmentCollision(segment);
    if (numcollisions !== Number.MAX_VALUE) {
        curr_edge.points.push([targetstubx, sourcey]);
        curr_edge.points.push([targetstubx, targety]);
        curr_edge.points.push([targetx, targety]); //target
        return false;
    }

    //If not, check possible places to shove down a line.

    var multiple = 0;
    var mincollisions = Number.MAX_VALUE;
    var bestmultiple = 0;//stores which multiple is best

    while (multiple < 8) { //Number of attempts is based on largest possible buffer between nodes
        testx = sourcestubx + (multiple * sourcestub * curr_edge.sourceObject.questionRowHeight / 2); //x coordinate for the potential segment

        segment = {points: [[sourcestubx, sourcey], [testx, sourcey], [testx, targety], [targetstubx, targety]], sourceObject: curr_edge.sourceObject, targetObject: curr_edge.targetObject};

        numcollisions = testSegmentCollision(segment);
        if (numcollisions < mincollisions && isNotBetween(testx, targetx, targetstubx)) {
            mincollisions = numcollisions;
            bestmultiple = multiple;
        }
        multiple += 1;
    }

    curr_edge.points.push([sourcestubx + bestmultiple * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, sourcey]);
    curr_edge.points.push([sourcestubx + bestmultiple * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, targety]);

    curr_edge.points.push([targetstubx, targety]);
    curr_edge.points.push([targetx, targety]); //target
    return mincollisions === Number.MAX_VALUE;
}

//Helper function for updateEdge. Handles setting the points of an edge
//Targetx is the midpoint of the node's top edge
function determineEdgeMidpointsTOP(curr_edge, sourcex, targetx, sourcey, targety, sourcestub, largestRowWidth) {
    //coordinates for the stubs
    var sourcestubx;
    var targetstuby;

    //Handle determination of source and target stub locations
    if (sourcestub === -1) {
        sourcestubx = sourcex - curr_edge.sourceObject.questionRowHeight;
    } else {
        sourcestubx = sourcex + curr_edge.sourceObject.questionRowHeight;
    }
    targetstuby = targety - curr_edge.targetObject.questionRowHeight;

    curr_edge.points = [];
    curr_edge.points.push([sourcex, sourcey]); //source
    curr_edge.points.push([sourcestubx, sourcey]); //source stub

    //First see if you can go straight down with no problems
    //TODO

    //If not, move around a bit.

    var multipleLR = 0;
    var bestmultipleLR = 0;//stores which multiple is best
    var multipleTOP = 0;
    var bestmultipleTOP = 0;
    var mincollisions = Number.MAX_VALUE;
    while (multipleLR < 8) { //Number of attempts is based on largest possible buffer between nodes
        while (multipleTOP < 8) { //Number of attempts is based on largest possible buffer between nodes
            var segment = {points: [[sourcestubx + multipleLR * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, sourcey], [sourcestubx + multipleLR * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, targetstuby - multipleTOP * curr_edge.targetObject.questionRowHeight / 2], [targetx, targetstuby - multipleTOP * curr_edge.targetObject.questionRowHeight / 2]], sourceObject: curr_edge.sourceObject, targetObject: curr_edge.targetObject};
            var numcollisions = testSegmentCollision(segment);
            if (numcollisions < mincollisions) { //if found a new best choice
                mincollisions = numcollisions;
                bestmultipleLR = multipleLR;
                bestmultipleTOP = multipleTOP;
            }
            multipleTOP += 1;
        }
        multipleLR += 1;
    }

    curr_edge.points.push([sourcestubx + bestmultipleLR * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, sourcey]);
    curr_edge.points.push([sourcestubx + bestmultipleLR * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, targetstuby - bestmultipleTOP * curr_edge.targetObject.questionRowHeight / 2]);
    curr_edge.points.push([targetx, targetstuby - bestmultipleTOP * curr_edge.targetObject.questionRowHeight / 2]);

    curr_edge.points.push([targetx, targetstuby]);
    curr_edge.points.push([targetx, targety]);

    return mincollisions === Number.MAX_VALUE;
}

function resetEdgeToLoop(curr_edge, sourcestub, sourcex, sourcey, targetx, targety) {
    var currentMinCollision = testSegmentCollision(curr_edge);
    var stublength = curr_edge.sourceObject.questionRowHeight;


    var sourcestubx;
    // Get left and right stub
    if (sourcestub === -1) {
        sourcestubx = sourcex - stublength;
    } else {
        sourcestubx = sourcex + stublength;
    }
    var sourcestuby = sourcey;
    var targetstubx = targetx + curr_edge.targetObject.rowWidth/2;
    var targetstuby = targety - stublength;

    // Make target point to be top mid points
    targetx += curr_edge.targetObject.rowWidth/2;

    var topDown = false;
    var fromLeftToRight = false;

    // Check whether source is above the target
    if (sourcestuby < targetstuby) {
        topDown = true;
    }

    if (sourcestubx < targetstubx) {
        fromLeftToRight = true;
    }

    // Renew the points of the edge
    curr_edge.points = [];
    curr_edge.points.push([sourcex, sourcey]); //source
    curr_edge.points.push([sourcestubx, sourcestuby]); //source stub

    // Add looping-midpoints
    var m1x = 0, m1y = 0, m2x = 0, m2y = 0, m3x = 0, m3y = 0;

    if (topDown) {
        // If top down, go straight down from sourcestub until targetstuby + c
        m1x = sourcestubx;
        m1y = targetstuby;
        var m1 = [m1x, m1y];
        curr_edge.points.push(m1);
    } else {
        // If bottom up, go straight up from sourcestub until targetstuby + c
        m1x = sourcestubx;
        m1y = targetstuby;
        var m1 = [m1x, m1y];
        curr_edge.points.push(m1);

    }

    curr_edge.points.push([targetstubx, targetstuby]);
    curr_edge.points.push([targetx, targety]); // Top Node Middle Point

    // Draw midpoints
    var mycanvas = document.getElementById('maincanvas');
    var ctx = mycanvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(m1x, m1y, 4, 0, 2*Math.PI);
    ctx.fill();
}

//Helper function for updateEdge
function testSegmentCollision(segment) {
    var i;
    var numcollisions = 0;
    for (i = 0; i < alledges.length; i += 1) { //Iterate through all edges and make sure it's not overlapping any of them.
        if (alledges[i].points !== undefined && alledges[i].points !== null) {
            if (isOverlappingEE(segment, alledges[i])) { //overlaps are automatically rejected
                if (segment.sourceObject !== alledges[i].sourceObject) { //if they share the same source, it's OK though. NOTE: CANNOT BE SOURCE OR TARGET SHARED OR WEIRD STUFF HAPPENS
                    numcollisions = Number.MAX_VALUE;
                    break; //stop bothering with this multiple
                }
            } else if (isCollidingEE(segment, alledges[i], false, false)) {
                numcollisions += 1;
            }
        }
    }
    for (i = 0; i < allquestions.length; i += 1) { //Iterate through all nodes
        if (isCollidingNE(allquestions[i], segment)) {
            numcollisions = Number.MAX_VALUE;
            break; //stop bothering with this multiple
        }
    }
    return numcollisions;
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
    /*for (i = 0; i < allquestions.length; i += 1) { //preventing node to node collision entirely
        for (j = i + 1; j < allquestions.length; j += 1) {
            if (isCollidingNN(allquestions[i], allquestions[j])) {
                return Number.MAX_VALUE;
            }
        }
    }*/

    for (j = 0; j < alledges.length; j += 1) {
        alledges[j].update();
    }

    //node to edge
    for (i = 0; i < allquestions.length; i += 1) {
        for (j = 0; j < alledges.length; j += 1) {
            if (isCollidingNE(allquestions[i], alledges[j])) {
                num += 10; //counts as two collisions, may be changed in the future
            }
        }
    }

    for (j = 0; j < alledges.length; j += 1) {
        for (k = j + 1; k < alledges.length; k += 1) {
            if (isCollidingEE(alledges[j], alledges[k], false, false)) {
                num += 1;
            }
        }
    }
    return num;
}