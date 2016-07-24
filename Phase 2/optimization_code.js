"use strict";

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

//Scales the coordinates relative to the center of canvas (plane)
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


// function that centralizes the network to the center of canvas
function centralizeCoordinates(old_coordinates) {
    var canvas_size = getCanvasSize('maincanvas');
    var x_canvas = canvas_size[0];
    var y_canvas = canvas_size[1];
    var i;
    for (i = 0; i < old_coordinates.length; i += 1) {
        old_coordinates[i][0] += x_canvas / 4;
        //old_coordinates[i][1] += y_canvas / 4;
    }
}


function getCanvasSize(canvasid) {
    var canvas = document.getElementById(canvasid);
    var width = canvas.width;
    var height = canvas.height;
    return [width, height];
}

//returns true if directly adjacent or colliding. From Mozilla
function isCollidingNN(node1, node2) {
    if (node1.x < node2.x + node2.rowWidth && node1.x + node1.rowWidth > node2.x && node1.y < node2.y + node2.totalheight && node1.totalheight + node1.y > node2.y) {
        return true;
    } else {
        return false;
    }
}

//returns true if one crosses over the other. Running alongside does not count as a collision. Requires straight line segments
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

//returns true if two edges have an intersection
//corners parameter: if true, it will treat source and targets as collidable points. Corners1 for first edge, etc.
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

                        /*
                        var mycanvas = document.getElementById('maincanvas');
                        var ctx = mycanvas.getContext("2d");
                        ctx.beginPath();
                        ctx.fillStyle = 'red';
                        ctx.arc(int_pt[0], int_pt[1], 3, 0, 2*Math.PI);
                        ctx.fill();
                        */
            
                        return true; //collision found
                    }
                }
            }
        }
    }
    return false;
}

//returns true if two edges overlap but segments are not exactly the same. Requires edges to be orthogonal
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

            if (min1x === min2x && max1x === max2x && min1y === min2y && max1y === max2y) { //same edge, all clear           
            } else if (min1x === min2x && min2x === max1x && max1x === max2x) { //x coordinates are same
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