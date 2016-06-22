    var node1_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node1_2 = {"x": 352, "y": 192, "width": 64, "totalheight": 64};
    var result1 = isCollidingNN(node1_1, node1_2);
    if (result1 == false) { //Expected: false
        document.getElementById("test_1").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_1").style.color = "green";
    } else {
        document.getElementById("test_1").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_1").style.color = "red";
    }

    var node2_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node2_2 = {"x": 64, "y": 192, "width": 64, "totalheight": 64};
    var result2 = isCollidingNN(node2_1, node2_2);
    if (result2 == false) { //Expected: false
        document.getElementById("test_2").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_2").style.color = "green";
    } else {
        document.getElementById("test_2").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_2").style.color = "red";
    }

    var node3_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node3_2 = {"x": 352, "y": 64, "width": 64, "totalheight": 64};
    var result3 = isCollidingNN(node3_1, node3_2);
    if (result3 == false) { //Expected: false
        document.getElementById("test_3").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_3").style.color = "green";
    } else {
        document.getElementById("test_3").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_3").style.color = "red";
    }