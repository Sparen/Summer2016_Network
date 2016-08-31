/* ***************************************************************************
 * Network Optimization Black Box for IDIES - Drawing Component              *
 * Authors: Andrew Fan, Alex Ahn                                             *
 * This function takes a JSON filename input and renders the components      *
 *                                                                           *
 * General Notes:                                                            *
 * -All coordinates are handled in terms of PIXELS, not questionRowHeight    *
 * -This is entirely independent from the main black box and is used         *
 *  primarily for testing purposes. Therefore, there may be hardcoded values *
 *************************************************************************** */

 "use strict";

/* ***************************************************************************
 * void render(string)                                                       *
 * param inputfilename - name of JSON file containing output ingredients     *
 *************************************************************************** */
function render(inputfilename) {
    console.log("Beginning rendering onto canvas - input from " + inputfilename);
    var inputobj = sessionStorage[inputfilename];

    var database_obj; //the JSON input

    loadJSON();

    /* ***********************************************************************
     * void loadJSON()                                                       *
     *                                                                       *
     * This function loads the input JSON file to database_obj, and then     *
     * runs processInput()                                                   *
     *********************************************************************** */
    function loadJSON() {
        var client = new XMLHttpRequest();
        client.open("GET", "survey.json", true);
        client.onreadystatechange = function () { //callback
            if (client.readyState === 4) {
                if (client.status === 200 || client.status === 0) {
                    database_obj = JSON.parse(client.responseText);
                    processInput();
                }
            }
        };
        client.send();
    }

    /* ***********************************************************************
     * void processInput()                                                   *
     *                                                                       *
     * This function runs immediately after the input JSON has been loaded   *
     * into database_obj. It loads the appropriate data, then handles the    *
     * rendering of the components to the canvas                             *
     *********************************************************************** */
    function processInput() {
        handleQuestions();
        handleEdges();
    }

    /* ***********************************************************************
     * void handleQuestions()                                                *
     *                                                                       *
     * This function takes the input questions and renders them using the    *
     * coordinates from the black box JSON                                   *
     *********************************************************************** */

    function handleQuestions() {

    }

    /* ***********************************************************************
     * void handleEdges()                                                    *
     *                                                                       *
     * This function takes the input edges and renders them using the        *
     * coordinates from the black box JSON                                   *
     *********************************************************************** */

    function handleEdges() {

    }
}