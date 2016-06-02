var database_obj;

jsPlumb.bind("ready", function() {
});

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

    jsPlumb.connect({
        source:"item_left",
        target:"item_right",
        endpoint:"Rectangle"
    });

    jsPlumb.setContainer($('#container'));
    
    for (i = 0; i < nodes.length; i++) {
        var newState = $('<div>').attr('id', nodes[i].id).addClass('item');        
        var title = $('<div>').addClass('title').text(nodes[i].name);
        var connect = $('<div>').addClass('connect');
        
        newState.append(title);
        newState.append(connect);
        
        $('#container').append(newState);
        
        jsPlumb.makeTarget(newState, {
          anchor: 'Continuous'
        });
        
        jsPlumb.makeSource(connect, {
          parent: newState,
          anchor: 'Continuous'
        });        
        
        jsPlumb.draggable(newState, {
          containment: 'parent'
        }); 
    } 
}