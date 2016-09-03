/* ***************************************************************************
 * Network Optimization Black Box for IDIES                                  *
 * Authors: Andrew Fan, Alex Ahn, San He Wu, Daniel Darg                     *
 * This function takes a JSON filename input and outputs a JSON file         *
 *                                                                           *
 * General Notes:                                                            *
 * -All coordinates are handled in terms of questionRowHeight.               *
 *************************************************************************** */

 "use strict";

/* ***************************************************************************
 * object networkOptimization(string, string, object, number[2]), number,    *
 * number, function, data)                                                   *
 * param inputfilename - name of JSON file containing input ingredients      *
 * param outputfilename - name of JSON file containing output objects        *
 * param jsoninput - direct JSON input ingredients                           *
 * param canvas_size - 2D array containing x and y dimensions of canvas      *
 * param nodebuffer - how many units to use as a buffer between nodes        *
 * param iterationnum - how many iterations of node placement to perform     *
 * param NO_callback - function to execute after output has been saved       *
 * param NO_callbackparam - optional parameter for the callback function     *
 *                                                                           *
 * Note that if using a JSON file, jsoninput should be "" (empty string)     *
 * If using direct JSON input, inputfilename should be "" (empty string)     *
 * outputfilename should be "" if it is not used                             *
 *************************************************************************** */
function networkOptimization(inputfilename, outputfilename, jsoninput, canvas_size, nodebuffer, iterationnum, NO_callback, NO_callbackparam) {
    var LEFT = -1;
    var RIGHT = 1;
    var database_obj; //the JSON input
    var allquestions = []; //the output question objects (complete objects)
    var alledges = []; //the output edge objects (complete edges)

    if (jsoninput === "") { //If using an external JSON file
        return loadJSON();
    } else { //If directly feeding the input into the program
        database_obj = jsoninput;
        return processInput();
    }

    /* ***********************************************************************
     * object loadJSON()                                                     *
     *                                                                       *
     * This function loads the input JSON file to database_obj, and then     *
     * runs processInput(). The results of processInput() are then returned  *
     * to the main function.                                                 *
     *********************************************************************** */
    function loadJSON() {
        var client = new XMLHttpRequest();
        client.open("GET", inputfilename, true);
        client.onreadystatechange = function () { //callback
            if (client.readyState === 4) {
                if (client.status === 200 || client.status === 0) {
                    database_obj = JSON.parse(client.responseText);
                    return processInput();
                }
            }
        };
        client.send();
    }

    /* ***********************************************************************
     * object processInput()                                                 *
     *                                                                       *
     * This function runs immediately after the input JSON has been loaded   *
     * into database_obj. It loads the appropriate data, then handles the    *
     * assignment of values to the question and edge objects.                *
     * Once this is done, coordinates are assigned by optimizeNetworkByGrid()*
     * and JSON is output by outputJSON(), which is returned by this         *
     * function.                                                             *
     *********************************************************************** */
    function processInput() {
        pushAllQuestions();
        pushAllEdges();
        optimizeNetworkByGrid(0);
        return outputJSON();
    }

    /* ***********************************************************************
     * void optimizeNetworkByGrid(number)                                    *
     * param retryattemptno - number of times optimization has failed        *
     *                                                                       *
     * This function iterates through various possibilities for node         *
     * placement in order to find the least amount of noise.                 *
     *********************************************************************** */

    function optimizeNetworkByGrid(retryattemptno) {
        var grid_size = placeOnToGrid(allquestions.length);
        var scaled_coord_array = scaleCoordinates(grid_size, allquestions);
        var lowestEdgeNoise = Number.MAX_VALUE;
        var currentEdgeNoise;
        var optimalGridAssignment = [];
        var optimalQuestionsAssignment = [];

        //Iterates through and finds the optimal result (least number of collisions)
        var i;
        var j;
        for (i = 0; i < iterationnum; i += 1) {
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

        //Ensure that an optimal assignment was actually made
        if (optimalGridAssignment.length !== 0) {
            //centralizeCoordinates(optimalGridAssignment);
            updateCoordinates(optimalGridAssignment);
            randomOffsetGenerator(allquestions);
        } else { //retry
            retryattemptno += 1;
            console.log("optimizeNetworkByGrid: With iteration number " + iterationnum + ", no successful placements could be determined. Retrying - attempt number " + retryattemptno);
            optimizeNetworkByGrid(retryattemptno);
        }
    } 

    /* ***********************************************************************
     * object outputJSON()                                                   *
     *                                                                       *
     * This function takes the IDs and coordinates of the nodes and outputs  *
     * the information as a JSON object, saving to session storage with the  *
     * filename specified as a parameter to the wrapper function as well as  *
     * returning the JSON object to the function that called outputJSON.     *
     * This function only writes to session storage if outputfilename is     *
     * provided as a parameter to the wrapper function.                      *
     *********************************************************************** */

    function outputJSON() {
        var outputobj = {}; //wrapper object for all output
        var OF_coords = {}; //object containing coordinates for node IDs. **OUTPUT FIELD**

        var i;
        var j;
        var k;

        //First, iterate through all questions and log their coordinates
        for (i = 0; i < allquestions.length; i++) {
            var currquestion = allquestions[i];
            var currquestionID = currquestion.questionID;
            OF_coords[currquestionID] = [currquestion.x, currquestion.y];
        }

        //Next, iterate through all edges, assign the midpoints all unique IDs, and log their coordinates
        var midpointobjects = []; //array containing all midpoint objects, NOT midpoint IDs
        var OF_midPoints = []; //array containing all output midpoint IDs. **OUTPUT FIELD**
        var midpoint_counter = 0; //counter used to make unique midpoint object IDs
        var OF_edges = {}; //object containing all output edges with midPoint component IDs. **OUTPUT FIELD**
        for (i = 0; i < alledges.length; i++) {
            //first, generate an output edge structure
            var newoutputedgenodes = [];
            for (j = 0; j < alledges[i].points.length; j++) {
                //First, we will see if the given node is already locked to an existing midpoint
                var existing = -1; //stores the index of the duplicate midpoint or -1 if there is none.
                for (k = 0; k < midpointobjects.length; k++) {
                    if (alledges[i].points[j][0] === midpointobjects[k].x && alledges[i].points[j][1] === midpointobjects[k].y) {
                        existing = k;
                    }
                }
                if (existing !== -1) { //If it already exists, push the midpoint's ID onto the list
                    newoutputedgenodes.push(midpointobjects[existing].midpointID);
                } else { //otherwise, create a new midpoint object.
                    var newmidpointID = "m" + midpoint_counter;
                    var newmidpointobject = {"x": alledges[i].points[j][0], "y": alledges[i].points[j][1], "midpointID": newmidpointID};
                    midpointobjects.push(newmidpointobject); //add the new midpoint to the set
                    OF_midPoints.push(newmidpointID); //add the midpoint ID to the output field
                    newoutputedgenodes.push(newmidpointID); //add the midpoint ID to the output edge
                    OF_coords[newmidpointID] = [newmidpointobject.x, newmidpointobject.y];
                    midpoint_counter++;
                }
            } 
            OF_edges[alledges[i].edgeID] = newoutputedgenodes;
        }

        //Now, add fields to the output object
        outputobj["coords"] = OF_coords;
        outputobj["midPoints"] = OF_midPoints;
        outputobj["edges"] = OF_edges;

        //Finally, use JSON.stringify on the entire output object and write to file/local storage for use by drawing code
        var outputJSON = JSON.stringify(outputobj);
        if (outputfilename !== "") {
            sessionStorage[outputfilename] = outputJSON;
            console.log(sessionStorage[outputfilename]); //debug
        }
        if (typeof NO_callback === "function") { //make sure it's not undefined
            NO_callback(NO_callbackparam);
        }

        return outputobj;
    }     

    /* ***********************************************************************
     * void pushAllQuestions()                                               *
     *                                                                       *
     * This function assigns key information to each question object,        *
     * including its total height, responses, and update. It also calls for  *
     * a helper function to assign values to the response objects.           *
     * This function does NOT assign coordinates - see                       *
     * optimizeNetworkByGrid().                                              *
     *********************************************************************** */
    function pushAllQuestions() {
        allquestions = database_obj.questions;
        var i;
        var j;
        var newresponseobj;
        for (i = 0; i < allquestions.length; i += 1) {
            allquestions[i].totalheight = allquestions[i].questionRowHeight + allquestions[i].responseRowIDs.length * allquestions[i].questionRowHeight;

            allquestions[i].x = -1;
            allquestions[i].y = -1;

            //Iterate through questions and assign to responseRowIDs
            allquestions[i].responses = [];
            for (j = 0; j < allquestions[i].responseRowIDs.length; j += 1) {
                newresponseobj = {nodeID: allquestions[i].responseRowIDs[j]};
                setColumnParameters(newresponseobj, allquestions[i], j);
                allquestions[i].responses.push(newresponseobj);
            }

            //Define a recursive update for the question
            allquestions[i].update = function () {
                var n;
                for (n = 0; n < this.responses.length; n += 1) {
                    this.responses[n].update();
                }
            };
        }
    }

    /* ***********************************************************************
     * void setColumnParameters(object, object, number)                      *
     * param col - response object to assign values to                       *
     * param question - parent object to the response                        *
     * param off - position of the response with regard to all responses for *
     *       the given question                                              *
     *                                                                       *
     * This function assigns key information to each question response       *
     * object, including its offset, parent, dimensions, and update.         *
     * This function does NOT assign coordinates - response coordinates are  *
     * determined in the update method based on the coordinates of the       *
     * parent question object.                                               *
     *********************************************************************** */
    function setColumnParameters(col, question, off) {
        col.offset = off; //which item it is in relation to title.
        col.parent = question;
        col.questionRowHeight = question.questionRowHeight;
        col.rowWidth = question.rowWidth;
        col.x = -1;
        col.y = -1;
        col.update = function () {
            this.x = this.parent.x;
            this.y = this.parent.y + this.parent.questionRowHeight + this.offset * this.questionRowHeight;
        };
    }

    /* ***********************************************************************
     * void pushAllEdges()                                                   *
     *                                                                       *
     * This function assigns key information to each edge object, including  *
     * its source object, target object, and update.                         *
     * This function does NOT assign coordinates - see the update method.    *
     *********************************************************************** */
    function pushAllEdges() {
        //First assign colors to the edges based on what type they are.
        var black;
        var blue;
        var red;
        for (black = 0; black < database_obj.blackedges.length; black++) {
            database_obj.blackedges[black].color = "black";
            alledges.push(database_obj.blackedges[black]);
        }
        if (database_obj.blueedges !== null && database_obj.blueedges !== undefined) {
            for (blue = 0; blue < database_obj.blueedges.length; blue++) {
                database_obj.blueedges[blue].color = "blue";
                alledges.push(database_obj.blueedges[blue]);
            }
        }
        if (database_obj.rededges !== null && database_obj.rededges !== undefined) {
            for (red = 0; red < database_obj.rededges.length; red++) {
                database_obj.rededges[blue].color = "red";
                alledges.push(database_obj.rededges[red]);
            }
        }

        //Assign source and target objects to the edges
        var i;
        var j;
        var k;
        for (i = 0; i < alledges.length; i += 1) {
            for (j = 0; j < allquestions.length; j += 1) {
                //sourceObject assignment
                if (alledges[i].source === allquestions[j].questionID) {
                    alledges[i].sourceObject = allquestions[j];
                } else {
                    for (k = 0; k < allquestions[j].responses.length; k += 1) {
                        if (alledges[i].source === allquestions[j].responses[k].nodeID) {
                            alledges[i].sourceObject = allquestions[j].responses[k];
                        }
                    }
                }
                //targetObject assignment
                if (alledges[i].target === allquestions[j].questionID) {
                    alledges[i].targetObject = allquestions[j];
                } else {
                    for (k = 0; k < allquestions[j].responses.length; k += 1) {
                        if (alledges[i].target === allquestions[j].responses[k].nodeID) {
                            alledges[i].targetObject = allquestions[j].responses[k];
                        }
                    }
                }
            }
            alledges[i].update = function () {
                updateEdge(this);
            };
        }
    }

    /* ***********************************************************************
     * void updateEdge(object)                                               *
     * param curr_edge - edge object to assign midpoints to                  *
     *                                                                       *
     * This function assigns midpoints (including stubs) to a given edge     *
     *********************************************************************** */
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
        //handle seperation of red and blue edges from black
        if (curr_edge.color === "blue") {
            sourcey -= curr_edge.targetObject.questionRowHeight / 4;
            targety -= curr_edge.targetObject.questionRowHeight / 4;
        }
        if (curr_edge.color === "red") {
            sourcey += curr_edge.targetObject.questionRowHeight / 4;
            targety += curr_edge.targetObject.questionRowHeight / 4;
        }

        var i;
        var largestRowWidth = 0;
        for (i = 0; i < allquestions.length; i += 1) {
            if (allquestions[i].rowWidth > largestRowWidth) {
                largestRowWidth = allquestions[i].rowWidth;
            }
        }

        //bad: if there was a collision with a node or there was no place to put the edge, bad is true
        var bad = determineEdgeMidpointsLR(curr_edge, sourcex, targetx, sourcey, targety, sourcestub);

        //If there was a collision with a node or there was overlap... first, try the other source port
        if (bad && curr_edge.color === "black") {
            sourcestub *= -1;
            if (sourcestub === LEFT) {
                sourcex = curr_edge.sourceObject.x;
            } else {
                sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth;
            }
            bad = determineEdgeMidpointsLR(curr_edge, sourcex, targetx, sourcey, targety, sourcestub);
        }
        //Try original source port and other target port
        if (bad) {
            sourcestub *= -1;
            if (curr_edge.color === "blue") {
                sourcestub = 1;
            }
            if (sourcestub === LEFT) {
                sourcex = curr_edge.sourceObject.x;
            } else {
                sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth;
            }
            targetx = curr_edge.targetObject.x + curr_edge.targetObject.rowWidth / 2;
            if (curr_edge.color === "blue") {
                targetx -= curr_edge.targetObject.questionRowHeight / 4;
            }
            targety = curr_edge.targetObject.y;
            bad = determineEdgeMidpointsTOP(curr_edge, sourcex, targetx, sourcey, targety, sourcestub);
        }

        //Try other source port and other target port
        if (bad) {
            sourcestub *= -1;
            if (curr_edge.color === "blue") {
                sourcestub = 1;
            }
            if (sourcestub === LEFT) {
                sourcex = curr_edge.sourceObject.x;
            } else {
                sourcex = curr_edge.sourceObject.x + curr_edge.sourceObject.rowWidth;
            }
            bad = determineEdgeMidpointsTOP(curr_edge, sourcex, targetx, sourcey, targety, sourcestub);
        }

        //If it still fails on all two-midpoint solutions or not a black edge, have the edge move around nodes
        if (bad) {
            targetx = curr_edge.targetObject.x;
            targety = curr_edge.targetObject.y;
            // add new midpoints that goes around the node here
            resetEdgeToLoop(curr_edge, sourcex, sourcey, targetx, targety, sourcestub);       
        }
    }

    /* ***********************************************************************
     * boolean determineEdgeMidpointsLR(object, number, number, number,      *
     *       number, number)                                                 *
     * param curr_edge - edge object to assign midpoints to                  *
     * param sourcex - x coordinate for source midpoint                      *
     * param targetx - x coordinate for target midpoint                      *
     * param sourcey - y coordinate for source midpoint                      *
     * param targety - y coordinate for target midpoint                      *
     * param sourcestub - direction in which source stub points              *
     *                                                                       *
     * This function assigns midpoints (including stubs) to a given edge.    *
     * It returns true if no acceptable position was found.                  *
     *********************************************************************** */

    function determineEdgeMidpointsLR(curr_edge, sourcex, targetx, sourcey, targety, sourcestub) {
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
        segment = {points: [[sourcestubx, sourcey], [targetstubx, sourcey], [targetstubx, targety]], sourceObject: curr_edge.sourceObject, targetObject: curr_edge.targetObject, color: curr_edge.color};
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

            segment = {points: [[sourcestubx, sourcey], [testx, sourcey], [testx, targety], [targetstubx, targety]], sourceObject: curr_edge.sourceObject, targetObject: curr_edge.targetObject, color: curr_edge.color};

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

    /* ***********************************************************************
     * boolean determineEdgeMidpointsTOP(object, number, number, number,     *
     *       number, number)                                                 *
     * param curr_edge - edge object to assign midpoints to                  *
     * param sourcex - x coordinate for source midpoint                      *
     * param targetx - x coordinate for target midpoint                      *
     * param sourcey - y coordinate for source midpoint                      *
     * param targety - y coordinate for target midpoint                      *
     * param sourcestub - direction in which source stub points              *
     *                                                                       *
     * This function assigns midpoints (including stubs) to a given edge.    *
     * It returns true if no acceptable position was found.                  *
     *********************************************************************** */

    function determineEdgeMidpointsTOP(curr_edge, sourcex, targetx, sourcey, targety, sourcestub) {
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
                var segment = {points: [[sourcestubx + multipleLR * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, sourcey], [sourcestubx + multipleLR * sourcestub * curr_edge.sourceObject.questionRowHeight / 2, targetstuby - multipleTOP * curr_edge.targetObject.questionRowHeight / 2], [targetx, targetstuby - multipleTOP * curr_edge.targetObject.questionRowHeight / 2]], sourceObject: curr_edge.sourceObject, targetObject: curr_edge.targetObject, color: curr_edge.color};
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

    /* ***********************************************************************
     * void resetEdgeToLoop(object, number, number, number, number, number)  *                                                      *
     * param curr_edge - edge object to assign midpoints to                  *
     * param sourcex - x coordinate for source midpoint                      *
     * param targetx - x coordinate for target midpoint                      *
     * param sourcey - y coordinate for source midpoint                      *
     * param targety - y coordinate for target midpoint                      *
     * param sourcestub - direction in which source stub points              *
     *                                                                       *
     * This function assigns midpoints (including stubs) to a given edge.    *
     *********************************************************************** */

    function resetEdgeToLoop(curr_edge, sourcex, sourcey, targetx, targety, sourcestub) {
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
        if (curr_edge.color === "blue") {
            targetx -= curr_edge.targetObject.questionRowHeight;
        }
        var targetstubx = targetx + curr_edge.targetObject.rowWidth/2;
        var targetstuby = targety - stublength;

        // Make target point to be top mid points
        targetx += curr_edge.targetObject.rowWidth/2;

        // Renew the points of the edge
        curr_edge.points = [];
        curr_edge.points.push([sourcex, sourcey]); //source
        curr_edge.points.push([sourcestubx, sourcestuby]); //source stub

        // Add looping-midpoints
        var m1x = 0, m1y = 0;

        // Go straight down from sourcestub until targetstuby + c
        m1x = sourcestubx;
        m1y = targetstuby;
        var m1 = [m1x, m1y];
        curr_edge.points.push(m1);
        
        curr_edge.points.push([targetstubx, targetstuby]);
        curr_edge.points.push([targetx, targety]); // Top Node Middle Point
    }

    /* ***********************************************************************
     * number testSegmentCollision(object)                                   *
     * param segment - edge object to test against all existing edges        *
     *                                                                       *
     * This function is a helper function for updateEdge. It returns the     *
     * number of edge to edge collisions between the given segment and all   *
     * existing edges, or Number.MAX_VALUE if it overlaps another edge or    *
     * collides with a question.                                             *
     * This function handles overlap conditions unrelated to the actual      *
     * points that make up the edge, such as color and source/target objects.*
     *********************************************************************** */
    function testSegmentCollision(segment) {
        var i;
        var numcollisions = 0;
        for (i = 0; i < alledges.length; i += 1) { //Iterate through all edges and make sure it's not overlapping any of them.
            if (alledges[i].points !== undefined && alledges[i].points !== null) {
                if (isOverlappingEE(segment, alledges[i])) { //overlaps are automatically rejected
                    if (segment.sourceObject !== alledges[i].sourceObject || segment.color !== alledges[i].color) { //if they share the same source, it's OK, but if their colors are different, it's not. NOTE: CANNOT BE SOURCE OR TARGET SHARED OR WEIRD STUFF HAPPENS
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

    /* ***********************************************************************
     * number numCollisions()                                                *
     *                                                                       *
     * This function returns the number of edge to edge collisions on the    *
     * entire canvas. It does not handle node to node collisions, and node   *
     * to edge collisions are arbitrarily handled (the placement of edge     *
     * midpoints should prevent node to edge collisions from occuring).      *
     *********************************************************************** */
    function numCollisions() {
        var i; //questions
        var j; //edges
        var k; //edges
        var num = 0; //number of collisions. NOT A COUNTER

        for (i = 0; i < allquestions.length; i += 1) {
            allquestions[i].update();
        }

        for (j = 0; j < alledges.length; j += 1) {
            alledges[j].update();
        }

        //node to edge
        for (i = 0; i < allquestions.length; i += 1) {
            for (j = 0; j < alledges.length; j += 1) {
                if (isCollidingNE(allquestions[i], alledges[j])) {
                    num += 10; //arbitrary value, must be less than Number.MAX_VALUE
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

    /* ***********************************************************************
     * number[2] placeOnToGrid(number)                                       *
     * param num_nodes - number of questions to be rendered                  *
     *                                                                       *
     * This function returns a 2D array consisting of dimensions for the     *
     * node grid.                                                            *
     *********************************************************************** */
    function placeOnToGrid(num_nodes) {
        var n = 1;
        while (num_nodes > Math.pow(n, 2)) {
            n += 1;
        }
        var m = n;
        while (n * m >= num_nodes) {
            m -= 1;
        }
        m += 1;
        var grid_size = [n, m];
        return grid_size;
    }

    /* ***********************************************************************
     * number[][2] scaleCoordinates(number[2], object[])                     *
     * param grid_size - 2D array consisting of dimensions for the node grid *
     * param inputQuestions - array of question objects to place             *
     *                                                                       *
     * This function returns an array of coordinates for the placement of    *
     * the inputQuestions. These are placed using standard buffers and the   *
     * dimensions of the input questions.                                    *
     *********************************************************************** */
    function scaleCoordinates(grid_size, inputQuestions) {
        var newCoordinates = [];

        var x_max = grid_size[0];
        var y_max = grid_size[1];

        var x_additive = 0;
        var y_additive = 0;
        var current_rowMaxHeight = 0;
        var current_questionHeight = 0;

        var i;
        var j;
        var index = 0;

        for (i = 0; i < y_max && index < inputQuestions.length; i += 1) {
            for (j = 0; j < x_max && index < inputQuestions.length; j += 1) {
                newCoordinates[index] = [];
                newCoordinates[index][0] = x_additive;
                newCoordinates[index][1] = y_additive;

                current_questionHeight = (inputQuestions[index].questionRowHeight) * (inputQuestions[index].responseRowIDs.length + 1);

                x_additive += (inputQuestions[index].rowWidth + inputQuestions[0].questionRowHeight * nodebuffer);

                if (current_rowMaxHeight < current_questionHeight) {
                    current_rowMaxHeight = current_questionHeight;
                }

                index += 1;
            }
            y_additive += (current_rowMaxHeight + inputQuestions[0].questionRowHeight * nodebuffer);
            current_rowMaxHeight = 0;
            x_additive = 0;
        }
        return newCoordinates;
    }


    /* ***********************************************************************
     * void centralizeCoordinates(number[][2])                               *
     * param old_coordinates - coordinates to update                         *
     *                                                                       *
     * This function shifts all of the coordinates provided by a set amount  *
     * Deprecated due to changing of coordinate system.                      *
     *********************************************************************** */
    function centralizeCoordinates(old_coordinates) {
        var x_canvas = canvas_size[0];
        var y_canvas = canvas_size[1];
        var i;
        for (i = 0; i < old_coordinates.length; i += 1) {
            old_coordinates[i][0] += x_canvas / 4;
            old_coordinates[i][1] += y_canvas / 7;
        }
    }

    /* ***********************************************************************
     * void updateCoordinates(number[][2])                                   *
     * param scaled_coord_array - new coordinates for question nodes         *
     *                                                                       *
     * This function applies a predetermined set of scaled coordinates to    *
     * the array containing all questions.                                   *
     *********************************************************************** */
    function updateCoordinates(scaled_coord_array) {
        var i;
        for (i = 0; i < allquestions.length; i += 1) {
            allquestions[i].x = scaled_coord_array[i][0];
            allquestions[i].y = scaled_coord_array[i][1];
            allquestions[i].update();
        }
    }

    /* ***********************************************************************
     * boolean isCollidingNN(object, object)                                 *
     * param node1 - first node to check for collision                       *
     * param node2 - second node to check for collision                      *
     *                                                                       *
     * This function returns whether or not the two given nodes are colliding*
     *********************************************************************** */
    function isCollidingNN(node1, node2) {
        if (node1.x < node2.x + node2.rowWidth && node1.x + node1.rowWidth > node2.x && node1.y < node2.y + node2.totalheight && node1.totalheight + node1.y > node2.y) {
            return true;
        } else {
            return false;
        }
    }

    /* ***********************************************************************
     * boolean isCollidingNE(object, object)                                 *
     * param node1 - node to check for collision                             *
     * param edge1 - edge to check for collision                             *
     *                                                                       *
     * This function returns whether or not the given node and edge are      *
     * colliding by transforming the sides of the node into an edge. If the  *
     * edge overlaps one side of the node, it is considered a collision.     *
     *********************************************************************** */
    function isCollidingNE(node1, edge1) {
        //determine node bounds
        var nodel = node1.x;
        var nodet = node1.y;
        var noder = node1.x + node1.rowWidth;
        var nodeb = node1.y + node1.totalheight;

        //Check if the source of the edge is located inside the node (no need to check target as long as one is checked)
        //Used for edge case where edge is located within node and does not intersect with any of the sides.
        var pt = edge1.points[0];
        if (pt[0] > nodel && pt[0] < noder && pt[1] > nodet && pt[1] < nodeb) {
            return true;
        }

        //Make a path for the rect.
        var rectEdge = {};
        rectEdge.points = [];
        rectEdge.points.push([nodel, nodet]);
        rectEdge.points.push([noder, nodet]);
        rectEdge.points.push([noder, nodeb]);
        rectEdge.points.push([nodel, nodeb]);
        rectEdge.points.push([nodel, nodet]);

        return (isCollidingEE(rectEdge, edge1, true, false) || isOverlappingEE(rectEdge, edge1));
    }

    /* ***********************************************************************
     * boolean isCollidingEE(object, object, boolean, boolean)               *
     * param edge1 - first edge to check for collision                       *
     * param edge2 - second edge to check for collision                      *
     * param corners1 - whether or not to include the source in collisions   *
     * param corners2 - whether or not to include the target in collisions   *
     *                                                                       *
     * This function returns whether or not the given edges are colliding.   *
     *********************************************************************** */
    function isCollidingEE(edge1, edge2, corners1, corners2) {
        var i;
        var j;
        for (i = 0; i < edge1.points.length - 1; i += 1) {
            for (j = 0; j < edge2.points.length - 1; j += 1) {
                var p1x = edge1.points[i][0];
                var p1y = edge1.points[i][1];
                var v1x = edge1.points[i + 1][0];
                var v1y = edge1.points[i + 1][1];
                var p2x = edge2.points[j][0];
                var p2y = edge2.points[j][1];
                var v2x = edge2.points[j + 1][0];
                var v2y = edge2.points[j + 1][1];

                v1x -= p1x;
                v1y -= p1y;
                v2x -= p2x;
                v2y -= p2y;

                var cross = v1x * v2y - v1y * v2x;
                if (cross !== 0) {
                    var dx = p1x - p2x,
                    dy = p1y - p2y,
                    u1 = (v2x * dy - v2y * dx) / cross,
                    u2 = (v1x * dy - v1y * dx) / cross,
                    epsilon = 1e-12,
                    uMin = -epsilon,
                    uMax = 1 + epsilon;
                    if (uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
                        u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
                        var int_pt = [p1x + u1 * v1x, p1y + u1 * v1y];
                        var rounded_int_pt = [Math.ceil(int_pt[0]), Math.ceil(int_pt[1])];

                        //disregard source & target points as collisions... unless corners is set to true.
                        if (rounded_int_pt[0] === edge1.points[i][0] && rounded_int_pt[1] === edge1.points[i][1] && !corners1 ||
                            rounded_int_pt[0] === edge1.points[edge1.points.length - 1][0] && rounded_int_pt[1] === edge1.points[edge1.points.length - 1][1] && !corners1 ||
                            rounded_int_pt[0] === edge2.points[j][0] && rounded_int_pt[1] === edge2.points[j][1] && !corners2 ||
                            rounded_int_pt[0] === edge2.points[edge2.points.length - 1][0] && rounded_int_pt[1] === edge2.points[edge2.points.length - 1][1] && !corners2 ) {
                        } else {
                            return true; //collision found
                        }
                    }
                }
            }
        }
        return false;
    }

    /* ***********************************************************************
     * boolean isOverlappingEE(object, object)                               *
     * param edge1 - first edge to check for overlap                         *
     * param edge2 - second edge to check for overlap                        *
     *                                                                       *
     * This function returns whether or not the given edges are overlapping. *
     * This function assumes that all edges are orthogonal and locked to a   *
     * grid.                                                                 *
     *********************************************************************** */
    function isOverlappingEE(edge1, edge2) {
        var i;
        var j;
        for (i = 0; i < edge1.points.length - 1; i += 1) {
            for (j = 0; j < edge2.points.length - 1; j += 1) {
                var p1x = edge1.points[i][0];
                var p1y = edge1.points[i][1];
                var p2x = edge1.points[i + 1][0];
                var p2y = edge1.points[i + 1][1];
                var p3x = edge2.points[j][0];
                var p3y = edge2.points[j][1];
                var p4x = edge2.points[j + 1][0];
                var p4y = edge2.points[j + 1][1];

                var min1x = Math.min(p1x, p2x);
                var max1x = Math.max(p1x, p2x);
                var min2x = Math.min(p3x, p4x);
                var max2x = Math.max(p3x, p4x);
                var min1y = Math.min(p1y, p2y);
                var max1y = Math.max(p1y, p2y);
                var min2y = Math.min(p3y, p4y);
                var max2y = Math.max(p3y, p4y);

                /*if (min1x === min2x && max1x === max2x && min1y === min2y && max1y === max2y) { //same edge, all clear           
                } else */
                if (min1x === min2x && min2x === max1x && max1x === max2x) { //x coordinates are same
                    if ((min1y < min2y && max1y < max2y && min2y < max1y) || (min2y < min1y && max2y < max1y && min1y < max2y)) { //one portion is shared
                        return true;
                    } else if ((min1y < min2y && max1y > max2y) || (min2y < min1y && max2y > max1y)) { //one encompasses the other
                        return true;
                    }
                } else if (min1y === min2y && min2y === max1y && max1y === max2y) { //y coordinates are same
                    if ((min1x < min2x && max1x < max2x && min2x < max1x) || (min2x < min1x && max2x < max1x && min1x < max2x)) { //one portion is shared
                        return true;
                    } else if ((min1x < min2x && max1x > max2x) || (min2x < min1x && max2x > max1x)) { //one encompasses the other
                        return true;
                    }
                }


            }
        }
        return false;
    }

    /* ***********************************************************************
     * void shuffleQuestions(object[])                                       *
     * param inputQuestions - array of questions to shuffle                  *
     *                                                                       *
     * This function shuffles the elements of the inputQuestions array       *
     *********************************************************************** */
    function shuffleQuestions(inputQuestions) {
        var maxi = inputQuestions.length;

        var randomNumIteration = Math.floor(Math.random() * maxi);

        var i;
        var temp;
        for (i = 0; i < randomNumIteration; i += 1) {
            var randomNumOne = Math.floor(Math.random() * maxi);
            var randomNumTwo = Math.floor(Math.random() * maxi);
            temp = inputQuestions[randomNumOne];
            inputQuestions[randomNumOne] = inputQuestions[randomNumTwo];
            inputQuestions[randomNumTwo] = temp;
        }
    }

    /* ***********************************************************************
     * void randomOffsetGenerator(object[])                                  *
     * param inputQuestions - array of questions to offset                   *
     *                                                                       *
     * This function offsets the elements of the inputQuestions array by a   *
     * random unit                                                           *
     *********************************************************************** */
    function randomOffsetGenerator(inputQuestions) {
        var i;
        var offsetunit = inputQuestions[0].questionRowHeight;
        for (i = 0; i < inputQuestions.length; i += 1) {
            inputQuestions[i].x += offsetunit * Math.floor((Math.random() * 2) - 1);
            inputQuestions[i].y += offsetunit * Math.floor((Math.random() * 2) - 1);
        }
    }

    /* ***********************************************************************
     * boolean isNotBetween(number, number, number)                          *
     * param value - value to check                                          *
     * param bound1 - first bound to compare against                         *
     * param bound2 - second bound to compare against                        *
     *                                                                       *
     * This function return true if the given value is not between the two   *
     * provided bounds                                                       *
     *********************************************************************** */
    function isNotBetween(value, bound1, bound2) {
        if (bound1 < bound2) {
            if (value < bound1 || value > bound2) {
                return true;
            }
        }
        if (bound1 > bound2) {
            if (value > bound1 || value < bound2) {
                return true;
            }
        }
        return false;
    }
}