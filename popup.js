/**
 * Created by kashi on 2016/10/11.
 */
"use strict";

var switchInput = document.getElementById("start");

function switchProcess() {
    if (switchInput.value == "启动") {
        switchInput.value = "暂停";
    }
    else {
        switchInput.value = "启动";
    }
}

$(document).ready(function () {
    websocketInit();
});

