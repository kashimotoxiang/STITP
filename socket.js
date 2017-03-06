/**
 * Created by kashi on 2016/10/11.
 */
// "use strict";

var ws;
//var timer1;
var START_FLAG=0;
var isStart = false;

function websocketInit() {
    ws = new WebSocket("ws://localhost:8181");
    ws.onopen = function (e) {
        console.log("start");
        sendMessage("start");
        //timer1=dataStart();
        START_FLAG=1;
    };

    ws.onmessage= function(event){
      console.log(event.data);
      console.log(event.timestamp);
    }
    ws.onclose = function(e){
      console.log("连接中断");
    }
}

function websocketShutdown() {
      console.log("stop");
    sendMessage("stop");
    ws.close();
}

function websocketContinue() {
    if (START_FLAG!==1)
      return;
    console.log("continue");
    sendMessage("continue");
    //timer1=dataStart(timer1);
}

function websocketSuspend() {
    if (START_FLAG!==1)
        return;
      console.log("suspend");
    sendMessage("suspend");
    //dataEnd(timer1);
}

//websocket发送消息
function sendMessage(data) {
    ws.send(data);
}

//设置状态，在 pop.js 运行
function setStatus(state){
  isStart = state;
}

// window.addEventListener("load", websocketInit, false);
