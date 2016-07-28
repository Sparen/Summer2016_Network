/* ****************************************************************
 * Network Optimization Black Box for IDIES
 * Authors: Andrew Fan, Alex Ahn, San He Wu, Daniel Darg
 * This function takes a JSON filename input and outputs a JSON file
 **************************************************************** */

 "use strict";

function networkOptimization(inputfilename) {
    var LEFT = -1;
    var RIGHT = 1;
    var database_obj; //the JSON input
    var questions; //the input question objects (incomplete objects)
    var edges; //the input edge objects (fundamental edges)
    var allquestions = []; //the output question objects (complete objects)
    var alledges = []; //the output edge objects (complete edges)
    var jsonreceived = false; //whether or not the JSON file has been received.

    //call load function
    loadJSON(processInput);

    //Loads JSON object into database_obj and runs callback
    function loadJSON(callback) {
        var client = new XMLHttpRequest();
        client.open("GET", inputfilename, true);
        client.onreadystatechange = function () { //callback
            if (client.readyState === 4) {
                if (client.status === 200 || client.status === 0) {
                    database_obj = JSON.parse(client.responseText);
                    callback();
                }
            }
        };
        client.send();
    }

    //Runs immediately after JSON has been loaded into database_obj.
    //Loads the appropriate data from database_obj into questions and edges, and determines grid size and scaling.
    function processInput() {
        questions = database_obj.questions;
        edges = database_obj.edges;

        var grid_size = placeOnToGrid(questions.length);
        var scaled_coord_array = scaleCoordinates(grid_size, questions);
    }
}