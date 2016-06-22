    var node1_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node1_2 = {"x": 352, "y": 192, "width": 64, "totalheight": 64};
    var result1 = isCollidingNN(node1_1, node1_2);
    if (result1 == false) { //Expected: false
        document.getElementById("test_1").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_1").style.color = "green";
        console.log("Test 1: Node 1.1 and Node 1.2 are NOT colliding");
    } else {
        document.getElementById("test_1").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_1").style.color = "red";
        console.log("Test 1: Node 1.1 and Node 1.2 are colliding");
    }

    var node2_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node2_2 = {"x": 64, "y": 192, "width": 64, "totalheight": 64};
    var result2 = isCollidingNN(node2_1, node2_2);
    if (result2 == false) { //Expected: false
        document.getElementById("test_2").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_2").style.color = "green";
        console.log("Test 2: Node 2.1 and Node 2.2 are NOT colliding");
    } else {
        document.getElementById("test_2").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_2").style.color = "red";
        console.log("Test 2: Node 2.1 and Node 2.2 are colliding");
    }

    var node3_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node3_2 = {"x": 352, "y": 64, "width": 64, "totalheight": 64};
    var result3 = isCollidingNN(node3_1, node3_2);
    if (result3 == false) { //Expected: false
        document.getElementById("test_3").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_3").style.color = "green";
        console.log("Test 3: Node 3.1 and Node 3.2 are NOT colliding");
    } else {
        document.getElementById("test_3").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_3").style.color = "red";
        console.log("Test 3: Node 3.1 and Node 3.2 are colliding");
    }

    var node4_1 = {"x": 256, "y": 64, "width": 64, "totalheight": 64};
    var node4_2 = {"x": 160, "y": 64, "width": 64, "totalheight": 64};
    var result4 = isCollidingNN(node4_1, node4_2);
    if (result4 == false) { //Expected: false
        document.getElementById("test_4").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_4").style.color = "green";
        console.log("Test 4: Node 4.1 and Node 4.2 are NOT colliding");
    } else {
        document.getElementById("test_4").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_4").style.color = "red";
        console.log("Test 4: Node 4.1 and Node 4.2 are colliding");
    }

    var node5_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 128};
    var node5_2 = {"x": 352, "y": 96, "width": 64, "totalheight": 64};
    var result5 = isCollidingNN(node5_1, node5_2);
    if (result5 == false) { //Expected: false
        document.getElementById("test_5").innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_5").style.color = "green";
        console.log("Test 5: Node 5.1 and Node 5.2 are NOT colliding");
    } else {
        document.getElementById("test_5").innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_5").style.color = "red";
        console.log("Test 5: Node 5.1 and Node 5.2 are colliding");
    }

    var node6_1 = {"x": 64, "y": 64, "width": 128, "totalheight": 128};
    var node6_2 = {"x": 128, "y": 96, "width": 128, "totalheight": 128};
    var result6 = isCollidingNN(node6_1, node6_2);
    if (result6 == true) { //Expected: true
        document.getElementById("test_6").innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_6").style.color = "green";
        console.log("Test 6: Node 6.1 and Node 6.2 are NOT colliding");
    } else {
        document.getElementById("test_6").innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_6").style.color = "red";
        console.log("Test 6: Node 6.1 and Node 6.2 are colliding");
    }

    var node7_1 = {"x": 64, "y": 128, "width": 128, "totalheight": 128};
    var node7_2 = {"x": 128, "y": 96, "width": 128, "totalheight": 128};
    var result7 = isCollidingNN(node7_1, node7_2);
    if (result7 == true) { //Expected: true
        document.getElementById("test_7").innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_7").style.color = "green";
        console.log("Test 7: Node 7.1 and Node 7.2 are NOT colliding");
    } else {
        document.getElementById("test_7").innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_7").style.color = "red";
        console.log("Test 7: Node 7.1 and Node 7.2 are colliding");
    }