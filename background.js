/**
 * Created by kashi on 2016/10/11.
 */
// "use strict";

var ws;
//var timer1;
var START_FLAG=0;
var isStart = false;
var dataArray=[];
function websocketInit() {
    ws = new WebSocket("ws://localhost:8181");
    ws.binaryType="arraybuffer";//set the type of received data:array, teh default type is bolb
    ws.onopen = function (event) {
        dataArray=[];// clear the array stored gaze data
        sendMessage("start");
        //timer1=dataStart();
        START_FLAG=1;
    };

    ws.onmessage= function(event){
          if (event.data instanceof ArrayBuffer)  {
                var aDataArray = new Int32Array(event.data);
                    dataArray.push(aDataArray);
                    console.log("Receive Array:"+aDataArray);
                 //   for (var i = 0; i < aDataArray.length; ++i) {
                         //aDataArray[i];
                 //   }
         }
      else console.log("Receive:"+event.data);
    }
    ws.onclose = function(event){
      console.log("Connection Stopped");
      START_FLAG=0;
    }
}

function websocketShutdown() {
    sendMessage("stop");
    ws.close();
}

function websocketContinue() {
    if (START_FLAG!==1)
      return;
    sendMessage("continue");
    //timer1=dataStart(timer1);
}
//query information from the server
function websocketQuery(){
    if (START_FLAG!==1)
      return;
    sendMessage("query");
}
function websocketSuspend() {
    if (START_FLAG!==1)
        return;
    sendMessage("suspend");
    //dataEnd(timer1);
}

//websocket发送消息
function sendMessage(data) {
    console.log("Send:"+data);
    ws.send(data);
}

//设置状态，在 pop.js 运行
function setStatus(state){
  isStart = state;
}

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    console.log('holla');
    chrome.tabs.captureVisibleTab(
        null,
       {"format":"png"},
       function(dataUrl)
        {
            sendResponse({imgSrc:dataUrl});
            chrome.tabs.create({
    url:dataUrl,
    active:true
});
        }
    ); //remember that captureVisibleTab() is a statement
    return true;
});

// window.addEventListener("load", websocketInit, false);
setInterval(function(){websocketQuery();},100);
