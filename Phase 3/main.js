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
 * void networkOptimization(string, number[2])                               *
 * param inputfilename - name of JSON file containing input ingredients      *
 * param canvas_size - 2D array containing x and y dimensions of canvas      *
 *************************************************************************** */
function networkOptimization(inputfilename, canvas_size) {
    var LEFT = -1;
    var RIGHT = 1;
    var database_obj; //the JSON input
    var allquestions = []; //the output question objects (complete objects)
    var alledges = []; //the output edge objects (complete edges)

    loadJSON();

    /* ***********************************************************************
     * void loadJSON()                                                       *
     *                                                                       *
     * This function loads the input JSON file to database_obj, and then     *
     * runs processInput()                                                   *
     *********************************************************************** */
    function loadJSON() {
        var client = new XMLHttpRequest();
        client.open("GET", inputfilename, true);
        client.onreadystatechange = function () { //callback
            if (client.readyState === 4) {
                if (client.status === 200 || client.status === 0) {
                    database_obj = JSON.parse(client.responseText);
                    processInput();
                }
            }
        };
        client.send();
    }

    /* ***********************************************************************
     * void processInput()                                                   *
     *                                                                       *
     * This function runs immediately after the input JSON has been loaded   *
     * into database_obj. It loads the appropriate data, then handles the    *
     * assignment of values to the question and edge objects.                *
     * Once this is done, coordinates are assigned by optimizeNetworkByGrid()*
     * and JSON is output by outputJSON().                                   *
     *********************************************************************** */
    function processInput() {
        pushAllQuestions();
        pushAllEdges();
        //optimizeNetworkByGrid();
        //outputJSON();
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
        // I'm not going to do this now. :)
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
     * TODO: parameterize buffer as input to blackbox instead of using magic number
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

                x_additive += (inputQuestions[index].rowWidth + inputQuestions[0].questionRowHeight * 4); //buffer in x direction

                if (current_rowMaxHeight < current_questionHeight) {
                    current_rowMaxHeight = current_questionHeight;
                }

                index += 1;
            }
            y_additive += (current_rowMaxHeight + inputQuestions[0].questionRowHeight * 4); //buffer in y direction
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

    function randomOffsetGenerator(inputQuestions) {
        var i;
        var offsetunit = inputQuestions[0].questionRowHeight;
        for (i = 0; i < inputQuestions.length; i += 1) {
            inputQuestions[i].x += offsetunit * Math.floor((Math.random() * 2) - 1);
            inputQuestions[i].y += offsetunit * Math.floor((Math.random() * 2) - 1);
        }
    }

    //returns true if value is not between bounds
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