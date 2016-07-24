    var testno = "1";

    var node1_1 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var node1_2 = {"x": 352, "y": 192, "rowWidth": 64, "totalheight": 64};
    var result1 = isCollidingNN(node1_1, node1_2);
    if (result1 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "2";
    var node2_1 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var node2_2 = {"x": 64, "y": 192, "rowWidth": 64, "totalheight": 64};
    var result2 = isCollidingNN(node2_1, node2_2);
    if (result2 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "3";
    var node3_1 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var node3_2 = {"x": 352, "y": 64, "rowWidth": 64, "totalheight": 64};
    var result3 = isCollidingNN(node3_1, node3_2);
    if (result3 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "4";
    var node4_1 = {"x": 256, "y": 64, "rowWidth": 64, "totalheight": 64};
    var node4_2 = {"x": 160, "y": 64, "rowWidth": 64, "totalheight": 64};
    var result4 = isCollidingNN(node4_1, node4_2);
    if (result4 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "5";
    var node5_1 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 128};
    var node5_2 = {"x": 352, "y": 96, "rowWidth": 64, "totalheight": 64};
    var result5 = isCollidingNN(node5_1, node5_2);
    if (result5 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "6";
    var node6_1 = {"x": 64, "y": 64, "rowWidth": 128, "totalheight": 128};
    var node6_2 = {"x": 128, "y": 96, "rowWidth": 128, "totalheight": 128};
    var result6 = isCollidingNN(node6_1, node6_2);
    if (result6 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "7";
    var node7_1 = {"x": 64, "y": 128, "rowWidth": 128, "totalheight": 128};
    var node7_2 = {"x": 128, "y": 96, "rowWidth": 128, "totalheight": 128};
    var result7 = isCollidingNN(node7_1, node7_2);
    if (result7 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "8";
    var node8_1 = {"x": 128, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node8_2 = {"x": 64, "y": 64, "rowWidth": 128, "totalheight": 128};
    var result8 = isCollidingNN(node8_1, node8_2);
    if (result8 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "9";
    var node9_1 = {"x": 128, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node9_2 = {"x": 64, "y": 128, "rowWidth": 128, "totalheight": 128};
    var result9 = isCollidingNN(node9_1, node9_2);
    if (result9 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "10";
    var node10_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node10_2 = {"x": 112, "y": 128, "rowWidth": 128, "totalheight": 64};
    var result10 = isCollidingNN(node10_1, node10_2);
    if (result10 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "11";
    var node11_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node11_2 = {"x": 240, "y": 128, "rowWidth": 128, "totalheight": 64};
    var result11 = isCollidingNN(node11_1, node11_2);
    if (result11 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "12";
    var node12_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node12_2 = {"x": 208, "y": 32, "rowWidth": 64, "totalheight": 128};
    var result12 = isCollidingNN(node12_1, node12_2);
    if (result12 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "13";
    var node13_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node13_2 = {"x": 208, "y": 160, "rowWidth": 64, "totalheight": 128};
    var result13 = isCollidingNN(node13_1, node13_2);
    if (result13 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "14";
    var node14_1 = {"x": 176, "y": 32, "rowWidth": 128, "totalheight": 256};
    var node14_2 = {"x": 112, "y": 96, "rowWidth": 256, "totalheight": 128};
    var result14 = isCollidingNN(node14_1, node14_2);
    if (result14 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "15";
    var node15_1 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var node15_2 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node15_3 = {"x": 144, "y": 64, "rowWidth": 192, "totalheight": 192};
    var result15 = isCollidingNN(node15_1, node15_2) && isCollidingNN(node15_1, node15_3) && isCollidingNN(node15_2, node15_3);
    if (result15 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "16";
    var node16_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node16_2 = {"x": 304, "y": 96, "rowWidth": 64, "totalheight": 128};
    var node16_3 = {"x": 112, "y": 96, "rowWidth": 64, "totalheight": 128};
    var result16 = isCollidingNN(node16_1, node16_2) && isCollidingNN(node16_1, node16_3);
    if (result16 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "17";
    var node17_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node17_2 = {"x": 176, "y": 32, "rowWidth": 128, "totalheight": 64};
    var node17_3 = {"x": 176, "y": 224, "rowWidth": 128, "totalheight": 64};
    var result17 = isCollidingNN(node17_1, node17_2) && isCollidingNN(node17_1, node17_3);
    if (result17 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "18";
    var node18_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node18_2 = {"x": 304, "y": 32, "rowWidth": 64, "totalheight": 64};
    var node18_3 = {"x": 304, "y": 224, "rowWidth": 64, "totalheight": 64};
    var node18_4 = {"x": 112, "y": 32, "rowWidth": 64, "totalheight": 64};
    var node18_5 = {"x": 112, "y": 224, "rowWidth": 64, "totalheight": 64};
    var result18 = isCollidingNN(node18_1, node18_2) || isCollidingNN(node18_1, node18_3) || isCollidingNN(node18_1, node18_4) || isCollidingNN(node18_1, node18_5);
    if (result18 == false) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "19";
    var node19_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node19_2 = {"x": 208, "y": 160, "rowWidth": 64, "totalheight": 64};
    var result19 = isCollidingNN(node19_1, node19_2);
    if (result19 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "20";
    var node20_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node20_2 = {"x": 208, "y": 96, "rowWidth": 64, "totalheight": 128};
    var result20 = isCollidingNN(node20_1, node20_2);
    if (result20 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "21";
    var node21_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node21_2 = {"x": 176, "y": 128, "rowWidth": 64, "totalheight": 128};
    var result21 = isCollidingNN(node20_1, node20_2);
    if (result21 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "22";
    var node22_1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var node22_2 = {"x": 240, "y": 128, "rowWidth": 64, "totalheight": 128};
    var result22 = isCollidingNN(node22_1, node22_2);
    if (result22 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B1";
    var nodeB1 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var edgeB1 = {"points": [[240, 64], [240, 256]]};
    var resultB1 = isCollidingNE(nodeB1, edgeB1);
    if (resultB1 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B2";
    var nodeB2 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var edgeB2 = {"points": [[64, 160], [256, 160]]};
    var resultB2 = isCollidingNE(nodeB2, edgeB2);
    if (resultB2 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B3";
    var nodeB3 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var edgeB3 = {"points": [[64, 256], [256, 64]]};
    var resultB3 = isCollidingNE(nodeB3, edgeB3);
    if (resultB3 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B4";
    var nodeB4 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var edgeB4 = {"points": [[64, 256], [256, 256], [256, 64]]};
    var resultB4 = isCollidingNE(nodeB4, edgeB4);
    if (resultB4 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B5";
    var nodeB5 = {"x": 64, "y": 64, "rowWidth": 64, "totalheight": 64};
    var edgeB5 = {"points": [[32, 256], [256, 256], [256, 32], [32, 32], [32, 256]]};
    var resultB5 = isCollidingNE(nodeB5, edgeB5);
    if (resultB5 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B6";
    var nodeB6 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB6_1 = {"points": [[240, 128], [240, 64]]};
    var edgeB6_2 = {"points": [[240, 192], [240, 256]]};
    var edgeB6_3 = {"points": [[208, 160], [144, 160]]};
    var edgeB6_4 = {"points": [[272, 160], [336, 160]]};
    var resultB6 = isCollidingNE(nodeB6, edgeB6_1) || isCollidingNE(nodeB6, edgeB6_2) || isCollidingNE(nodeB6, edgeB6_3) || isCollidingNE(nodeB6, edgeB6_4);
    if (resultB6 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B7";
    var nodeB7 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB7 = {"points": [[64, 160], [416, 160]]};
    var resultB7 = isCollidingNE(nodeB7, edgeB7);
    if (resultB7 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B8";
    var nodeB8 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB8 = {"points": [[240, 64], [240, 256]]};
    var resultB8 = isCollidingNE(nodeB8, edgeB8);
    if (resultB8 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B9";
    var nodeB9 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB9 = {"points": [[208, 96], [272, 224]]};
    var resultB9 = isCollidingNE(nodeB9, edgeB9);
    if (resultB9 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B10";
    var nodeB10 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB10 = {"points": [[176, 96], [304, 224]]};
    var resultB10 = isCollidingNE(nodeB10, edgeB10);
    if (resultB10 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B11";
    var nodeB11 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB11 = {"points": [[176, 96], [240, 160]]};
    var resultB11 = isCollidingNE(nodeB11, edgeB11);
    if (resultB11 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B12";
    var nodeB12 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB12 = {"points": [[304, 96], [176, 224]]};
    var resultB12 = isCollidingNE(nodeB12, edgeB12);
    if (resultB12 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B13";
    var nodeB13 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB13 = {"points": [[304, 96], [240, 160]]};
    var resultB13 = isCollidingNE(nodeB13, edgeB13);
    if (resultB13 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B14";
    var nodeB14 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB14 = {"points": [[288, 144], [224, 208]]};
    var resultB14 = isCollidingNE(nodeB14, edgeB14);
    if (resultB14 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "B15";
    var nodeB15 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeB15 = {"points": [[216, 160], [264, 160]]};
    var resultB15 = isCollidingNE(nodeB15, edgeB15);
    if (resultB15 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "C1";
    var nodeC1 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeC1 = {"points": [[272, 160], [272, 64]]};
    var resultC1 = isCollidingNE(nodeC1, edgeC1);
    if (resultC1 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "C2";
    var nodeC2 = {"x": 208, "y": 128, "rowWidth": 64, "totalheight": 64};
    var edgeC2 = {"points": [[208, 160], [272, 160]]};
    var resultC2 = isCollidingNE(nodeC2, edgeC2);
    if (resultC2 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "D1";
    var nodeD1 = {"x": 176, "y": 96, "rowWidth": 128, "totalheight": 128};
    var edgeD1 = {"points": [[304, 128], [320, 128], [320, 160], [64, 160], [64, 192]]};
    var resultD1 = isCollidingNE(nodeD1, edgeD1);
    if (resultD1 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "E1";
    var edgeE1_1 = {"points": [[208, 128], [272, 128]]};
    var edgeE1_2 = {"points": [[208, 192], [272, 192]]};
    var resultE1 = isCollidingEE(edgeE1_1, edgeE1_2, false, false);
    if (resultE1 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "E2";
    var edgeE2_1 = {"points": [[208, 128], [208, 192]]};
    var edgeE2_2 = {"points": [[272, 128], [272, 192]]};
    var resultE2 = isCollidingEE(edgeE2_1, edgeE2_2, false, false);
    if (resultE2 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "E3";
    var edgeE3_1 = {"points": [[80, 64], [336, 256]]};
    var edgeE3_2 = {"points": [[144, 64], [400, 256]]};
    var resultE3 = isCollidingEE(edgeE3_1, edgeE3_2, false, false);
    if (resultE3 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "E4";
    var edgeE4_1 = {"points": [[240, 64], [240, 224]]};
    var edgeE4_2 = {"points": [[120, 256], [360, 256]]};
    var resultE4 = isCollidingEE(edgeE4_1, edgeE4_2, false, false);
    if (resultE4 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "H1";
    var edgeH1_1 = {"points": [[120, 64], [360, 64]]};
    var edgeH1_2 = {"points": [[120, 256], [360, 256]]};
    var resultH1 = isOverlappingEE(edgeH1_1, edgeH1_2);
    if (resultH1 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "H2";
    var edgeH2_1 = {"points": [[120, 160], [360, 160]]};
    var edgeH2_2 = {"points": [[120, 160], [360, 160]]};
    var resultH2 = isOverlappingEE(edgeH2_1, edgeH2_2);
    if (resultH2 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "H3";
    var edgeH3_1 = {"points": [[120, 160], [288, 160]]};
    var edgeH3_2 = {"points": [[192, 160], [360, 160]]};
    var resultH3 = isOverlappingEE(edgeH3_1, edgeH3_2);
    if (resultH3 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "H4";
    var edgeH4_1 = {"points": [[120, 160], [360, 160]]};
    var edgeH4_2 = {"points": [[192, 160], [288, 160]]};
    var resultH4 = isOverlappingEE(edgeH4_1, edgeH4_2);
    if (resultH4 == true) { //Expected: true
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }

    testno = "H5";
    var edgeH5_1 = {"points": [[120, 160], [240, 160]]};
    var edgeH5_2 = {"points": [[240, 160], [360, 160]]};
    var resultH5 = isOverlappingEE(edgeH5_1, edgeH5_2);
    if (resultH5 == false) { //Expected: false
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: blue'>FALSE</span></p>";
        document.getElementById("res_" + testno).style.color = "green";
    } else {
        document.getElementById("test_" + testno).innerHTML = "<p>Actual: <span style='color: red'>TRUE</span></p>";
        document.getElementById("res_" + testno).style.color = "red";
    }