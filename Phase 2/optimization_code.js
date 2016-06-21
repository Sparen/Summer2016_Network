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

function isCollidingNN(node1, node2) {
    if ((node1.x + node1.width >= node2.x || node2.x + node2.width >= node1.x) && (node1.y + node1.height >= node2.height || node2.y + node2.height >= node1.y) {
        return true;
    } else {
        return false;
    }
}