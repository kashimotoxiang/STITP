/**
 * Created by kashi on 2016/10/11.
 */
"use strict";
chrome.tabs.insertCSS(null,{file:"drawing.css"});
var str1, str2;
//得到从后台运行的 js 文件里的东西，即 socket.js
var bgscrpt = chrome.extension.getBackgroundPage();
//让变量存在后台，启动时检查变量来给页面赋值
var isStart = bgscrpt.isStart;
str1 = "启动";
str2 = "停止";
var m_switch = $('#start');
//js 文件加载时就启动
changeState();

//启动&停止
function Button1() {

  if (m_switch.val() == str1) {
    //调用 sokcet.js的方法
    bgscrpt.websocketInit(); //启动
    m_switch.val(str2);
    bgscrpt.setStatus(true);
  } else {
    bgscrpt.websocketShutdown(); //停止
    m_switch.val(str1);
    bgscrpt.setStatus(false);
  }
}

//判断状态的方法
function changeState() {
  if (!isStart) {
    m_switch.val(str1);
  } else {
    m_switch.val(str2);
  }
}
//暂停&继续
function Button2() {
  var str1, str2, m_switch;
  m_switch = $('#suspend');
  str1 = "继续";
  str2 = "暂停";
  if (m_switch.val() == str1) {
    m_switch.val(str2);
    bgscrpt.websocketContinue(); //继续
  } else {
    m_switch.val(str1);
    bgscrpt.websocketSuspend(); //暂停
  }
}

//图片输出
function Button3() {
  handlePage();
}

$(document).ready(function() {
  var listbox;
  listbox = $('#start');
  listbox.on('click', function() {
    Button1();
  });
  listbox = $('#suspend');
  listbox.on('click', function() {
    Button2();
  });
  listbox = $('#generate');
  listbox.on('click', function() {
    Button3();
  });
});

function getScroll() {
  // 获取滚动条到顶部的垂直高度
  var height = $(document).scrollTop();
}

function handlePage() {
 chrome.tabs.executeScript({
    file: "drawing.js"
  });//在当前浏览页面注入js绘图
}
//保存图片
function saveImage(canvas) {
  var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  window.location.href = image;

}