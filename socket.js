/**
 * Created by kashi on 2016/10/11.
 */
// "use strict";

var wsUri = 'ws://localhost:8080';
var output;

function websocketInit() {
    output = document.getElementById("output");
    updataGaze(20, 20);
    // testWebSocket();
}

function testWebSocket() {
    m_websocket = new WebSocket(wsUri);
    m_websocket.onopen = function (evt) {
        onOpen(evt);
    };
    m_websocket.onclose = function (evt) {
        onClose(evt);
    };
    m_websocket.onmessage = function (evt) {
        onMessage(evt);
    };
    m_websocket.onerror = function (evt) {
        onError(evt);
    };
}

function onOpen(evt) {
    writeToScreen("CONNECTED");
    doSend("WebSocket rocks");
}

function onClose(evt) {
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data + '</span>');
    m_websocket.close();
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
    writeToScreen("SENT: " + message);
    m_websocket.send(message);
}

function writeToScreen(message) {
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

function updataGaze(gazeXData, gazeYData) {
    $("span[id='gazeXid']").html(gazeXData);
    $("span[id='gazeYid']").html(gazeYData);
}


window.addEventListener("load", websocketInit, false);