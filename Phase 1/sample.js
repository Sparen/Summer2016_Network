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
    
    for (i = 0; i < nodes.length; i++) {
        var itemheight = 40;
        var newState = $('<div>').addClass('item');        
        var title = $('<div>').attr('id', nodes[i].id).addClass('title').text(nodes[i].name);

        /*jsPlumb.makeSource(title, {
            parent: newState,
            anchor: 'Continuous'
        });

        jsPlumb.makeTarget(title, {
            anchor: 'Continuous'
        });*/ 
        
        newState.append(title);

        for (j = 0; j < nodes[i].columns.length; j++) {
            var connect = $('<div>').attr('id', nodes[i].columns[j].id).addClass('connect').text(nodes[i].columns[j].name);
            newState.append(connect);
            itemheight += 20;

            /*jsPlumb.makeSource(connect, {
                parent: newState,
                anchor: 'Continuous'
            });

            jsPlumb.makeTarget(connect, {
                anchor: 'Continuous'
            });*/      
        }

        newState.css({
            'height': itemheight,
            'left': i*120 //Temporary static positioning.
        });
        
        $('#container').append(newState); 
        allnodes.push(nodes[i].id); 
 
        //Allows you to drag nodes
        jsPlumb.draggable(newState, {
          containment: 'parent'
        }); 

    }

    for (i = 0; i < edges.length; i++) { 
        jsPlumb.connect({
            connector: ["Bezier"],
            source: edges[i].source,
            target: edges[i].target,
            anchor: ["Left", "Right"],
            endpoint: "Dot"
        });
    }

    placeNodes();

}

function placeNodes() {
    //TODO
}