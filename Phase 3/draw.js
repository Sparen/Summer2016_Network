/* ***************************************************************************
 * Network Optimization Black Box for IDIES - Drawing Component              *
 * Authors: Andrew Fan, Alex Ahn                                             *
 * This function takes a JSON filename input and renders the components      *
 *                                                                           *
 * General Notes:                                                            *
 * -All coordinates are handled in terms of PIXELS, not questionRowHeight    *
 * -This is entirely independent from the main black box and is used         *
 *  primarily for testing purposes.                                          *
 *************************************************************************** */

 "use strict";

/* ***************************************************************************
 * void render(string)                                                       *
 * param inputfilename - name of JSON file containing output ingredients     *
 *************************************************************************** */
function render(inputfilename) {
    console.log("Beginning rendering onto canvas - input from " + inputfilename);
    var inputobj = sessionStorage[inputfilename];
    console.log(inputobj);
}