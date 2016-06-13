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
    var coord_array = setCoordinates(nodes, edges);


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

        //Drawing nodes by the coordinates
        var x_coord = coord_array[i][0];
        var y_coord = coord_array[i][1];
        placeNodes(newState, itemheight, nodes[i].width, x_coord, y_coord);
        
        $('#container').append(newState); 
        allnodes.push(nodes[i].id); 
 
        //Allows you to drag nodes
        jsPlumb.draggable(newState, {
          containment: 'parent'
        }); 

    }

    //Connecting edges
    for (i = 0; i < edges.length; i++) { 
        jsPlumb.connect({
            connector: ["Flowchart", {stub: 20, cornerRadius: 5}],
            source: edges[i].source,
            target: edges[i].target,
            anchor: ["Left", "Right"],
            endpoint: ["Dot", { radius: 5 }],
        });
    }

}

function placeNodes(newState, itemheight, width, x, y) {
        newState.css({
            'height': itemheight,
            'width' : width,
            'left': x+100, //Temporary static positioning.
            'top' : y+40 //
        });
}

function setCoordinates(edges, nodes) {
        var grid_size = optimizeToGrid(nodes.length);
        //Create 2D array
        var coord_array = [];
        for (i = 0; i < nodes.length; i++) {
            coord_array[i] = [];
            var x_coord = (i % grid_size[0])*150;
            var y_coord = (Math.floor(i / grid_size[0]))*150;    
            coord_array[i][0] = x_coord;
            coord_array[i][1] = y_coord;              
        }
    return coord_array;
}


function hasTarget(id, edges) {
    numSource = 0;
    numTarget = 0;
    for (i = 0; i < edges.length; i++) { 
        if (edges[i].source == id) {
            return true;
        }
    }
    return false;
}