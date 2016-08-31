/* ***************************************************************************
 * Network Optimization Black Box for IDIES - Drawing Component              *
 * Authors: Andrew Fan, Alex Ahn                                             *
 * This function takes a JSON filename input and renders the components      *
 *                                                                           *
 * General Notes:                                                            *
 * -All coordinates are handled in terms of PIXELS, not questionRowHeight    *
 * -Widths and heights are in terns of questionRowHeight                     *
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
    var inputobj = JSON.parse(sessionStorage[inputfilename]);

    var database_obj; //the JSON input

    var UNIT = 24; //pixel size for a single unit

    var myCanvas = {
        start: function (canvasid) {
            this.canvas = document.getElementById(canvasid);
            this.context = this.canvas.getContext("2d");
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    };

    myCanvas.start("maincanvas");
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
        var i;
        var j;
        for (i = 0; i < database_obj.questions.length; i++) {
            var newquestion = database_obj.questions[i];
            var newquestionID = newquestion.questionID;
            var newquestioncoords = inputobj.coords[newquestionID];

            newquestion.totalheight = newquestion.questionRowHeight + newquestion.responseRowIDs.length * newquestion.questionRowHeight;

            newquestion.x = newquestioncoords[0] * UNIT;
            newquestion.y = newquestioncoords[1] * UNIT;
            //Iterate through questions and assign to responseRowIDs
            newquestion.responses = [];
            var j;
            for (j = 0; j < newquestion.responseRowIDs.length; j += 1) {
                var newresponseobj = {nodeID: newquestion.responseRowIDs[j]};
                setColumnParameters(newresponseobj, newquestion, j);
                newquestion.responses.push(newresponseobj);
            }

            newquestion.draw = function () {
                var ctx = myCanvas.context;
                ctx.beginPath();
                ctx.fillStyle = "#CCFFEE";
                ctx.lineWidth = "1";
                ctx.strokeStyle = "#CCCCCC";
                ctx.rect(this.x, this.y, this.rowWidth * UNIT, this.totalheight * UNIT);
                ctx.fill(); //draw inside
                ctx.stroke(); //draw border

                var n;
                for (n = 0; n < this.responses.length; n += 1) {
                    this.responses[n].draw();
                }
            };

            newquestion.draw(); //actually draw
        }

        function setColumnParameters(col, question, off) {
            col.offset = off; //which item it is in relation to title.
            col.parent = question;
            col.questionRowHeight = question.questionRowHeight;
            col.rowWidth = question.rowWidth;
            col.x = question.x;
            col.y = question.y + question.questionRowHeight * UNIT + off * col.questionRowHeight * UNIT;
            col.draw = function () {
                var ctx = myCanvas.context;
                ctx.beginPath();
                ctx.fillStyle = "#EEEEEE";
                ctx.lineWidth = "1";
                ctx.strokeStyle = "#CCCCCC";
                ctx.rect(this.x, this.y, this.rowWidth * UNIT, this.questionRowHeight * UNIT);
                ctx.fill(); //draw rectangle inside
                ctx.stroke(); //draw rectangle border
            };
        }
    }

    /* ***********************************************************************
     * void handleEdges()                                                    *
     *                                                                       *
     * This function takes the input edges and renders them using the        *
     * coordinates from the black box JSON                                   *
     *********************************************************************** */

    function handleEdges() {
        var i;
        var j;
        for (i = 0; i < database_obj.blackedges.length; i++) {

        }
        if (database_obj.blueedges !== undefined) {
            for (i = 0; i < database_obj.blueedges.length; i++) {
            
            }
        }
        if (database_obj.rededges !== undefined) {
            for (i = 0; i < database_obj.rededges.length; i++) {
            
            }
        }
    }
}