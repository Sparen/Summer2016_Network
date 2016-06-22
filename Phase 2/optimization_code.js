function optimizeToGrid(num_nodes) {
	var n = 1;
	while (num_nodes > Math.pow(n,2)) {
		n++;
	}
	var m = n;
	while (n*m >= num_nodes) {
		m--;
	}
	m++;
	var gridArray = [n,m];
	return gridArray;
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

//returns true if directly adjacent or colliding. COMPLETELY WRONG.
function isCollidingNN(node1, node2) {
    if ((node1.x + node1.width >= node2.x) && (node1.y + node1.totalheight >= node2.y || node2.y + node2.totalheight >= node1.y)) {
        return true;
    } else if ((node2.x + node2.width >= node1.x) && (node1.y + node1.totalheight >= node2.y || node2.y + node2.totalheight >= node1.y)) {
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
    var noder = node1.x + node1.width;
    var nodeb = node1.y + node1.totalheight;

    //determine edge points
    var edgepoints = edge1.points;
    var i = 0;
    for (i = 0; i < edgepoints.length - 1; i++) { //for each segment
        //first get the two points 
        var point1 = edgepoints[i];
        var point2 = edgepoints[i+1];

        //Call numCollisionsEE to determine whether or not there is a collision
    }
}

//returns true if two edges have an intersection
function isCollidingEE(edge1, edge2) {
var p1x = edge1.points[0][0],
    p1y = edge1.points[0][1],
    v1x = edge1.points[1][0],
    v1y = edge1.points[1][1],
    p2x = edge2.points[0][0],
    p2y = edge2.points[0][1],
    v2x = edge2.points[1][0],
    v2y = edge2.points[1][1];

// Q: what if they are identical?
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
        // to return an intersecting point,
        // u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
        // return [p1x + u1 * v1x, p1y + u1 * v1y];
         return true;
    }
}
return false;
}