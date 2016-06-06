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

    var coord_array = optimizeToGrid(nodes.length);

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

        var x_coord = (i % coord_array[0])*150;
        var y_coord = (Math.floor(i / coord_array[0]))*150;
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
            connector: ["Flowchart"],
            source: edges[i].source,
            target: edges[i].target,
            anchor: ["Left", "Right"],
            endpoint: "Dot"
        });
    }

}

function placeNodes(newState, itemheight, width, x, y) {
        newState.css({
            'height': itemheight,
            'width' : width,
            'left': x, //Temporary static positioning.
            'top' : y //
        });
}