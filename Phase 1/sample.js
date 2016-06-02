var database_obj;

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
        var itemheight = 40;
        var newState = $('<div>').attr('id', nodes[i].id).addClass('item');        
        var title = $('<div>').addClass('title').text(nodes[i].name);

        jsPlumb.makeSource(title, {
            parent: newState,
            anchor: 'Continuous'
        });

        jsPlumb.makeTarget(title, {
            anchor: 'Continuous'
        }); 
        
        newState.append(title);

        for (j = 0; j < nodes[i].columns.length; j++) {
            var connect = $('<div>').addClass('connect').text(nodes[i].columns[j].id);
            newState.append(connect);
            itemheight += 20;

            jsPlumb.makeSource(connect, {
                parent: newState,
                anchor: 'Continuous'
            });

            jsPlumb.makeTarget(connect, {
                anchor: 'Continuous'
            });      
        }

        newState.css({
            'height': itemheight
        });
        
        $('#container').append(newState);  
 
        
        jsPlumb.draggable(newState, {
          containment: 'parent'
        }); 
    } 

}