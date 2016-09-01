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

    //constants used in edge drawing
    var LEFT = -1;
    var RIGHT = 1;
    var UP = -2;
    var DOWN = 2;
    var SAME = 0;

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
        var k;

        //first, get all edges together
        var edges = [];
        for (i = 0; i < database_obj.blackedges.length; i++) {
            var tempedge = database_obj.blackedges[i];
            tempedge.color = "black";
            edges.push(tempedge);
        }
        if (database_obj.blueedges !== undefined) {
            for (i = 0; i < database_obj.blueedges.length; i++) {
                var tempedge = database_obj.blueedges[i];
                tempedge.color = "blue";
                edges.push(tempedge);
            }
        }
        if (database_obj.rededges !== undefined) {
            for (i = 0; i < database_obj.rededges.length; i++) {
                var tempedge = database_obj.rededges[i];
                tempedge.color = "red";
                edges.push(tempedge);
            }
        }

        //Then render them
        for (j = 0; j < edges.length; j++) {
            edges[j].points = [];
            var coordlist = inputobj.edges[edges[j].edgeID]; //list of midpoints
            for (k = 0; k < coordlist.length; k++) { //for every midpoint
                var nextpointID = coordlist[k];
                var nextpointcoords = [inputobj.coords[nextpointID][0], inputobj.coords[nextpointID][1]];
                edges[j].points.push(nextpointcoords);
            }
            edges[j].draw = function () { //By Alex Ahn
                var ctx = myCanvas.context;
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = "2";
                var curveRadius = 6;

                var prevPoint;
                var currPoint = this.points[0];
                var nextPoint = this.points[1];

                // Draw the very first segment of the edge
                ctx.moveTo(currPoint[0], currPoint[1]);
                var LRside = leftOrRight(currPoint, nextPoint);
                var UDside = upOrDown(currPoint, nextPoint);
                var last;

                // draw a stub line up until the arc, to left or right side

                // going out right
                if (LRside === LEFT) {
                    ctx.lineTo(nextPoint[0] - curveRadius, nextPoint[1]);
                    last = [nextPoint[0] - curveRadius, nextPoint[1]];
                } else { //right
                    ctx.lineTo(nextPoint[0] + curveRadius, nextPoint[1]);
                    last = [nextPoint[0] + curveRadius, nextPoint[1]];
                }

                ctx.stroke();
                
                var arcTangentPoint;
                var i;
                // Draw arc first, then segment - radius
                for (i = 1; i < this.points.length-1; i++) {
                    prevPoint = last; // point at the end of segment just before current point
                    currPoint = this.points[i];            
                    nextPoint = this.points[i+1];

                    var firstLRside = leftOrRight(prevPoint, currPoint);
                    var firstUDside = upOrDown(prevPoint, currPoint);
                    var secondLRside = leftOrRight(currPoint, nextPoint);
                    var secondUDside = upOrDown(currPoint, nextPoint);

                    /***********************************************************
                    BUG DETECTED: there are cases where duplicate edge points are added
                    ************************************************************/
                    
                    if (currPoint[0] === nextPoint[0] && currPoint[1] === nextPoint[1]) {
                        continue;
                    }

                    if (secondLRside === SAME) {
                        if (secondUDside === UP) {
                            arcTangentPoint = [currPoint[0], currPoint[1]+curveRadius];
                            nextPoint = [nextPoint[0], nextPoint[1]-curveRadius];
                        } else {
                            arcTangentPoint = [currPoint[0], currPoint[1]-curveRadius];
                            nextPoint = [nextPoint[0], nextPoint[1]+curveRadius];
                        }
                    }

                    // horizontally aligned
                    if (secondUDside === SAME) {
                        if (secondLRside === LEFT) {
                            arcTangentPoint = [currPoint[0]+curveRadius, currPoint[1]];
                            nextPoint = [nextPoint[0]-curveRadius, nextPoint[1]];
                        } else {
                            arcTangentPoint = [currPoint[0]-curveRadius, currPoint[1]];
                            nextPoint = [nextPoint[0]+curveRadius, nextPoint[1]];
                        }
                    }

                    ctx.arcTo(currPoint[0], currPoint[1], arcTangentPoint[0], arcTangentPoint[1], curveRadius);
                    ctx.stroke();

                    ctx.lineTo(nextPoint[0], nextPoint[1]);
                    last = nextPoint;
                }

                // Draw the last segment
                ctx.lineTo(this.points[i][0], this.points[i][1]);
                ctx.stroke();

                // Drawing an arrow at the end of the edge
                if (this.drawtarget) {
                    var prev_coord = this.points[this.points.length - 2];
                    var target_coord = this.points[this.points.length - 1];
                    var arrow_size = 4;
                    ctx.beginPath();
                    ctx.fillStyle = "white";
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = "1.5";
                    ctx.moveTo(target_coord[0], target_coord[1]);
                    if (prev_coord[1] < target_coord[1]) { //top
                        ctx.lineTo(prev_coord[0] + arrow_size, prev_coord[1] + (target_coord[1] - prev_coord[1]) / 2);
                        ctx.lineTo(prev_coord[0] - arrow_size, prev_coord[1] + (target_coord[1] - prev_coord[1]) / 2);
                    } else { //left or right
                        ctx.lineTo(prev_coord[0] + (target_coord[0] - prev_coord[0]) / 2, prev_coord[1] + arrow_size);
                        ctx.lineTo(prev_coord[0] + (target_coord[0] - prev_coord[0]) / 2, prev_coord[1] - arrow_size);
                    }
                    ctx.lineTo(target_coord[0], target_coord[1]);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            edges[j].draw();
        }
    }

    /* ***********************************************************************
     * void leftOrRight(object, object)                                      *
     * param currentPoint - current point in drawing code                    *
     * param otherPoint - point to compare currentPoint to                   *
     *                                                                       *
     * This function returns -1 if currentPoint is to the left of otherPoint *
     * or 1 if to the right or 0 if both share the same y coordinate.        *
     *********************************************************************** */
    function leftOrRight(currentPoint, otherPoint) {
        if (currentPoint[0] === otherPoint[0]) {
            return SAME;
        }
        else if (currentPoint[0] < otherPoint[0]) {
            return LEFT;
        }
        else {
            return RIGHT;
        }
    }

    /* ***********************************************************************
     * void upOrDown(object, object)                                         *
     * param currentPoint - current point in drawing code                    *
     * param otherPoint - point to compare currentPoint to                   *
     *                                                                       *
     * This function returns -2 if currentPoint is above otherPoint or 2 if  *
     * below or 0 if both share the same x coordinate.                       *
     *********************************************************************** */
    function upOrDown(currentPoint, otherPoint) {
        if (currentPoint[1] === otherPoint[1]) {
            return SAME;
        }
        else if (currentPoint[1] < otherPoint[1]) {
            return UP;
        }
        else {
            return DOWN;
        }
    }
}