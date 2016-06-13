var systemZoom = 1;

//following function from jsPlumb documentation.
window.setZoom = function(zoom, instance, transformOrigin, el) {
    transformOrigin = transformOrigin || [ 0.5, 0.5 ];
    instance = instance || jsPlumb;
    el = el || instance.getContainer();
    var p = [ "webkit", "moz", "ms", "o" ],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;

    instance.setZoom(zoom);    
};

function incrementZoom(num){
    console.log("incrementZoom(): running");
    systemZoom += num;
    jsPlumb.setZoom(systemZoom);
    window.setZoom(systemZoom);
    console.log("incrementZoom(): systemZoom is now " + systemZoom);
}