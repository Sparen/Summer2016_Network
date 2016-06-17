var systemZoom = 1;

window.setZoom = function(zoom, transformOrigin, el) {
    transformOrigin = transformOrigin || [ 0.5, 0.5 ];
    el = document.getElementById(container);
    var p = [ "webkit", "moz", "ms", "o" ],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (var i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;   
};

function incrementZoom(num){
    console.log("incrementZoom(): running");
    systemZoom += num;
    window.setZoom(systemZoom);
    console.log("incrementZoom(): systemZoom is now " + systemZoom);
}