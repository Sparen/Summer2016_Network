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
        newCoordinates[i][1] = coord_array[i][1]/y_max * 200 + 50; // random constant scaling
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

//returns true if directly adjacent or colliding. From Mozilla
function isCollidingNN(node1, node2) {
    if (node1.x < node2.x + node2.width && node1.x + node1.width > node2.x && node1.y < node2.y + node2.totalheight && node1.totalheight + node1.y > node2.y) {
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

    //Check if the source of the edge is located inside the node (no need to check target as long as one is checked). 
    //Used for edge case where edge is located within node and does not intersect with any of the sides.
    var pt = edge1.points[0];
    if(pt[0] > nodel && pt[0] < noder && pt[1] > nodet && pt[1] < nodeb){
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

    return isCollidingEE(rectEdge, edge1);
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

            //disregard source & target points as collisions
            if (rounded_int_pt[0] === edge1.points[0][0] && rounded_int_pt[1] === edge1.points[0][1] || 
                rounded_int_pt[0] === edge1.points[1][0] && rounded_int_pt[1] === edge1.points[1][1] ||
                rounded_int_pt[0] === edge2.points[0][0] && rounded_int_pt[1] === edge2.points[0][1] ||
                rounded_int_pt[0] === edge2.points[1][0] && rounded_int_pt[1] === edge2.points[1][1] ) {
                return false;
            }

            var mycanvas = document.getElementById('maincanvas');
            var ctx = mycanvas.getContext("2d");
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(int_pt[0], int_pt[1], 3, 0, 2*Math.PI);
            ctx.fill();

            return true;
        }
    }
return false;
}

function shuffleCoordArray(coordinates) {
    var maxIndex = coordinates.length;
    var randomNumIteration = Math.floor(Math.random()*maxIndex);
    var i;

    for (i = 0; i < randomNumIteration; i++) {
        var randomNumOne = Math.floor(Math.random()*maxIndex);
        var randomNumTwo = Math.floor(Math.random()*maxIndex);
        temp = coordinates[randomNumOne];
        coordinates[randomNumOne] = coordinates[randomNumTwo];
        coordinates[randomNumTwo] = temp;
    }
}