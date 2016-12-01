/**
 * Created by kashi on 2016/10/11.
 */
// "use strict";

var ws;
var timer1;
var START_FLAG=0;
function websocketInit() {
    ws = new WebSocket("ws://localhost:8181");
    ws.onopen = function (e) {
        sendMessage("start");
        timer1=dataStart();
        START_FLAG=1;
    };
}

function websocketShutdown() {
    sendMessage("stop");
    dataEnd(timer1);
    START_FLAG=0;
}

function websocketContinue() {
    if (START_FLAG!==1)
        return;
    sendMessage("continue");
    timer1=dataStart(timer1);
}

function websocketSuspend() {
    if (START_FLAG!==1)
        return;
    sendMessage("suspend");
    dataEnd(timer1);
}

//websocket发送消息
function sendMessage(data) {
    ws.send(data);
}

// window.addEventListener("load", websocketInit, false);