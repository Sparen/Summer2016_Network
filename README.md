# Network Optimization Black Box for IDIES

Authors: Andrew Fan, Alex Ahn, San He Wu

# Usage

Within the Phase 3 folder, there is a main.js that contains the black box. The black box will take a specifically formatted JSON input containing fields for questions, edges, and other points of interest, and will output complete edges and recommended coordinates for the various input ingredients.

All that needs to be done is to call networkOptimization() with the relevant parameters.

JSON input can be entered in two different ways. First, an input file containing the JSON object with the input ingredients can be used. In this case, inputfilename should be the relevant filename and jsoninput should be the empty string. Alternatively, JSON can be fed directly in the jsoninput argument. In this case, inputfile is not needed and can be left as an empty string. 

As for the output, the function by default returns the output JSON object, and also writes to session storage if outputfilename is provided.

# Input structure

The input format is sturctured as follows:

The input consists of a single object with the following fields:

* questions
* pluspoints
* globalpoints
* blackedges
* blueedges (optional)
* rededges (optional)

`questions` is an array of question objects. Each question object contains the following fields:

* questionID (string) - the unique ID for this question
* type (string) - the type of this question, standard (table) or track (track)
* rowWidth (integer) - the width of the question box, in terms of standard units
* questionRowHeight (integer) - the height of each row in the box, in terms of standard units
* responseRowIDs ([string]) - the unique IDs for each response for the given node

`pluspoints` and `globalpoints` are both arrays of unique IDs for plus and global points, respectively. These must be the SAME unique IDs as in the edges, see below.

`blackedges`, `blueedges`, and `rededges` are all arrays of edge objects. Each has a unique ID that is used to identify the edge in the output, and has both a source and a target. The source and target correspond to the unique IDs of the source question/point/node and target question/point/node. If an edge originates from a response option in a question, the source should be the unique ID of that response (see responseRowIDs above).

# Output structure

The output structure is, similarly to the input, a single object with the following fields:

* midPoints
* edges
* coords

`midPoints` is an array of midpoint IDs, which are automatically generated by the program and are all prefixed by the lowercase m. <b>The lowercase m + number format is explicitly reserved for midpoints and should not be used for any source IDs.</b>

`edges` is an object consisting of key-value pairs. The keys are the edge IDs provided in the input (see above), while the values are arrays consisting of the component midpoints of the edges, in order. It is important to note that question IDs are NOT utilized in the output - midpoints are created relative to the questions to ensure that orientation and exact location of a given point are known.

`coords` is, similarly to `edges`, an object with key-value pairs. In this case, the keys are unique IDs for midpoints, plus points, global points, and questions (question responses have their position determined relative to their parent - this is not within the scope of our black box and is to be handled externally by the drawing code). The values are the x and y coordinates (in standard units) for the location of a given component.

# Standard Units

All coordinates in this algorithm are in terms of standard units. For example, in the input, a question will usually have a questionRowHeight of 1 standard unit and a width typically &gt;5 standard units. These are ratios that can be scaled in drawing by multiplying them with a set number (see our draw.js in the Phase 3 folder for an example of how the standard units are used in rendering).

All collision detection is done in terms of standard units. Usually, half units are used as well. Keep in mind that quarter units are also used occasionally.

# Description of Algorithm - General

Our algorithm works as follows:

First, it loads the input JSON, whether via file or via direct parameter input. Once it has the data, it processes it. First, it creates objects for all plus and global objects (initializePlusGlobal()) with their ID. Then it takes all the input questions and assigns fields to them, including their responses, dimensions (via input JSON), and tentative dummy position (pushAllQuestions()). Next, edges are processed. Color, source and target objects, and various other fields are populated (pushAllEdges()).

Once all of these have been initialized, the optimization begins (optimizeNetworkByGrid()). Our algorithm uses the iterationnum input parameter to determine how many times to try and find a good match. The function first shuffles the questions, then creates positions for the questions using that random positioning. Coordinates are assigned, and then we find the edge noise - a value determined by the number of collisions on the screen. In this function, edges are updated and their midpoints are calculated. This process will be explained in further detail later.

The best possible assignment of coordinates is saved, and is used later. If no appropriate result is found, the function repeats in an attempt to generate appropriate output. This final assignment is then output. 

During the output process, all existing coordinates for questions, global points, and plus points are added into the output. As for points on edges, all of them are assigned a unique ID starting with 'm' and are added into the output with no duplicate midpoints. Edges are output using these midpoints to denote where they start, end, and turn. Note that the edge positions are completely independent of the questions, responses, plus, and global points they start and end at.

The output is saved to session storage is applicable and is also returned by the function.

# Description of Algorithm - Edge Midpoint Assignment, Global Point Assignment, and Plus Point Assignment

TODO

# Notes on Positioning of Plus and Global Points

Global points are positioned directly above a target question, with their x coordinate being the center of the target question. They are placed with a minimum distance from their target, and are locked to the standard grid (in 0.5x standard units).

Plus points, however, are positioned differently. Similarly to Global points, the edges point to a certain location, but the midpoint designating the end of the edge is NOT equivalent to the coordinate returned for the position of the actual plus point. 

Plus points are offset by 0.25 standard units from the end of the edge by default. This may be parameterizable in the future.

# Known Issues

* Plus points that sprout off edges are ambiguous as to source edge (No immediate solution proposed)
* Some edges overlap, resulting in ambiguous results (See #26)
* Plus points that sprout off edges occasionally missing points (Part of #16)
* Global points occasionally choose a less than optimal position when an optimal position is available (cause unknown)