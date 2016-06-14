var database_obj;
var allnodes = [];

jsPlumb.ready(function() {
    var filepath = "animal.json";
    var client = new XMLHttpRequest();
    client.open("GET", filepath, true);
    client.onreadystatechange = function () { //callback
        if (client.readyState == 4) {
            if (client.status == 200 || client.status == 0) {
                database_obj = JSON.parse(client.responseText);
                initializeNodes();
            }
        }
    };

    client.send();
});

function initializeNodes() {
    var nodes = database_obj.nodes; 
    var edges = database_obj.edges; 

    jsPlumb.setContainer($('#container'));

    var grid_size = optimizeToGrid(nodes.length);
    //Set of coordinates of each node onto plane (optimized)
    var coord_array = setCoordinates(nodes, edges);
    //Scaled coordinates
    var scaled_coord_array = scaleCoordinates(coord_array);

    for (i = 0; i < nodes.length; i++) {
        var itemheight = 40;
        var newState = $('<div>').addClass('item');
        var title = $('<div>').attr('id', nodes[i].id).addClass('title').text(nodes[i].name);
        newState.append(title);

        for (j = 0; j < nodes[i].columns.length; j++) {
            var connect = $('<div>').attr('id', nodes[i].columns[j].id).addClass('connect').text(nodes[i].columns[j].name);
            newState.append(connect);
            itemheight += 20;
        }

        //Draws a node onto the coordinate
        var x_coord = scaled_coord_array[i][0];
        var y_coord = scaled_coord_array[i][1];
        placeNodes(newState, itemheight, nodes[i].width, x_coord, y_coord);
        
        $('#container').append(newState); 
        allnodes.push(nodes[i].id); 
 
        //Allows you to drag nodes
        jsPlumb.draggable(newState, {
          containment: 'parent'
        }); 

    }

    for (i = 0; i < edges.length; i++) { 
        jsPlumb.connect({
            connector: ["Flowchart", {stub: 20, cornerRadius: 5}],
            source: edges[i].source,
            target: edges[i].target,
            anchor: ["Left", "Right"],
            endpoint: ["Dot", { radius: 5 }],
            ConnectionsDetachable: false
        });
    }

}

//Draws a single node
function placeNodes(newState, itemheight, width, x, y) {
        newState.css({
            'height': itemheight,
            'width' : width,
            'left': x,
            'top' : y
        });
}


//Determines optimized coordinates for each node in a network
function setCoordinates(edges, nodes) {
        var grid_size = optimizeToGrid(nodes.length);
        //Create 2D array
        var coord_array = [];
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
    for (i=0; i < coord_array.length; i++) {
        newCoordinates[i] = [];
        if (coord_array[i][0] >= x_max) {
            x_max = coord_array[i][0];
        }

        if (coord_array[i][1] >= y_max) {
            y_max = coord_array[i][1];
        }
    }

    // scaling by proportion (by maximum valus of x and y)
    for (i=0; i < coord_array.length; i++) {
        newCoordinates[i][0] = coord_array[i][0]/x_max * 350 + 100; // random constant scaling
        newCoordinates[i][1] = coord_array[i][1]/y_max * 150 + 50; // random constant scaling
    }

    return newCoordinates;
}


function hasTarget(id, edges) {
    var numSource = 0;
    var numTarget = 0;
    for (i = 0; i < edges.length; i++) { 
        if (edges[i].source == id) {
            return true;
        }
    }
    return false;
}