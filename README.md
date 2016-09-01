# Network Optimization Black Box for IDIES

Authors: Andrew Fan, Alex Ahn, San He Wu

# Usage

Within the Phase 3 folder, there is a main.js that contains the black box. The black box will take a specifically formatted JSON input containing fields for questions, edges, and other points of interest, and will output complete edges and recommended coordinates for the various input ingredients.

All that needs to be done is to call networkOptimization() with the relevant parameters.

JSON input can be entered in two different ways. First, an input file containing the JSON object with the input ingredients can be used. In this case, inputfilename should be the relevant filename and jsoninput should be the empty string. Alternatively, JSON can be fed directly in the jsoninput argument. In this case, inputfile is not needed and can be left as an empty string. 

As for the output, the function by default returns the output JSON object, and also writes to session storage if outputfilename is provided.

# Input structure

TODO

# Output structure

TODO