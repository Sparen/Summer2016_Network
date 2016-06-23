    var testno = "1";

    var node1_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node1_2 = {"x": 352, "y": 192, "width": 64, "totalheight": 64};
    var result1 = isCollidingNN(node1_1, node1_2);
    if (result1 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "2";
    var node2_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node2_2 = {"x": 64, "y": 192, "width": 64, "totalheight": 64};
    var result2 = isCollidingNN(node2_1, node2_2);
    if (result2 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "3";
    var node3_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 64};
    var node3_2 = {"x": 352, "y": 64, "width": 64, "totalheight": 64};
    var result3 = isCollidingNN(node3_1, node3_2);
    if (result3 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "4";
    var node4_1 = {"x": 256, "y": 64, "width": 64, "totalheight": 64};
    var node4_2 = {"x": 160, "y": 64, "width": 64, "totalheight": 64};
    var result4 = isCollidingNN(node4_1, node4_2);
    if (result4 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "5";
    var node5_1 = {"x": 64, "y": 64, "width": 64, "totalheight": 128};
    var node5_2 = {"x": 352, "y": 96, "width": 64, "totalheight": 64};
    var result5 = isCollidingNN(node5_1, node5_2);
    if (result5 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "6";
    var node6_1 = {"x": 64, "y": 64, "width": 128, "totalheight": 128};
    var node6_2 = {"x": 128, "y": 96, "width": 128, "totalheight": 128};
    var result6 = isCollidingNN(node6_1, node6_2);
    if (result6 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "7";
    var node7_1 = {"x": 64, "y": 128, "width": 128, "totalheight": 128};
    var node7_2 = {"x": 128, "y": 96, "width": 128, "totalheight": 128};
    var result7 = isCollidingNN(node7_1, node7_2);
    if (result7 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "8";
    var node8_1 = {"x": 128, "y": 96, "width": 128, "totalheight": 128};
    var node8_2 = {"x": 64, "y": 64, "width": 128, "totalheight": 128};
    var result8 = isCollidingNN(node8_1, node8_2);
    if (result8 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "9";
    var node9_1 = {"x": 128, "y": 96, "width": 128, "totalheight": 128};
    var node9_2 = {"x": 64, "y": 128, "width": 128, "totalheight": 128};
    var result9 = isCollidingNN(node9_1, node9_2);
    if (result9 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "10";
    var node10_1 = {"x": 176, "y": 96, "width": 128, "totalheight": 128};
    var node10_2 = {"x": 112, "y": 128, "width": 128, "totalheight": 64};
    var result10 = isCollidingNN(node10_1, node10_2);
    if (result10 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "11";
    var node11_1 = {"x": 176, "y": 96, "width": 128, "totalheight": 128};
    var node11_2 = {"x": 240, "y": 128, "width": 128, "totalheight": 64};
    var result11 = isCollidingNN(node11_1, node11_2);
    if (result11 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "12";
    var node12_1 = {"x": 176, "y": 96, "width": 128, "totalheight": 128};
    var node12_2 = {"x": 208, "y": 32, "width": 64, "totalheight": 128};
    var result12 = isCollidingNN(node12_1, node12_2);
    if (result12 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "13";
    var node13_1 = {"x": 176, "y": 96, "width": 128, "totalheight": 128};
    var node13_2 = {"x": 208, "y": 160, "width": 64, "totalheight": 128};
    var result13 = isCollidingNN(node13_1, node13_2);
    if (result13 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "14";
    var node14_1 = {"x": 176, "y": 32, "width": 128, "totalheight": 256};
    var node14_2 = {"x": 112, "y": 96, "width": 256, "totalheight": 128};
    var result14 = isCollidingNN(node14_1, node14_2);
    if (result14 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "15";
    var node15_1 = {"x": 208, "y": 128, "width": 64, "totalheight": 64};
    var node15_2 = {"x": 176, "y": 96, "width": 128, "totalheight": 128};
    var node15_3 = {"x": 144, "y": 64, "width": 192, "totalheight": 192};
    var result15 = isCollidingNN(node15_1, node15_2) && isCollidingNN(node15_1, node15_3) && isCollidingNN(node15_2, node15_3);
    if (result15 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1, Node " + testno + ".2, and Node " + testno + ".3 are NOT all colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1, Node " + testno + ".2, and Node " + testno + ".3 are all colliding");
    }

    testno = "16";
    var node16_1 = {"x": 176, "y": 96, "width": 128, "totalheight": 128};
    var node16_2 = {"x": 304, "y": 96, "width": 64, "totalheight": 128};
    var node16_3 = {"x": 112, "y": 96, "width": 64, "totalheight": 128};
    var result16 = isCollidingNN(node16_1, node16_2) && isCollidingNN(node16_1, node16_3) && isCollidingNN(node16_2, node16_3);
    if (result16 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }

    testno = "17";
    var node17_1 = {"x": 176, "y": 96, "width": 128, "totalheight": 128};
    var node17_2 = {"x": 176, "y": 32, "width": 128, "totalheight": 64};
    var node17_3 = {"x": 176, "y": 224, "width": 128, "totalheight": 64};
    var result17 = isCollidingNN(node17_1, node17_2) && isCollidingNN(node17_1, node17_3) && isCollidingNN(node17_2, node17_3);
    if (result17 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are NOT colliding");
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
        console.log("Test " + testno + ": Node " + testno + ".1 and Node " + testno + ".2 are colliding");
    }