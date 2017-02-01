/**
 * Created by kashi on 2016/10/11.
 */
"use strict";

//启动&停止
function Button1() {
    var str1, str2, m_switch;
    m_switch = $('#start');
    str1 = "启动";
    str2 = "停止";
    if (m_switch.val() == str1) {
        m_switch.val(str2);
        websocketInit();//启动
    }
    else {
        m_switch.val(str1);
        websocketShutdown();//停止

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
        websocketContinue();//继续
    }
    else {
        m_switch.val(str1);
        websocketSuspend();//暂停
    }
}

//图片输出
function Button3() {
    chrome.tabs.create({
        url: "src/58971162_p0.png",
        active: true
    });
}

$(document).ready(function () {
    var listbox;
    listbox = $('#start');
    listbox.on('click', function () {
        Button1();
    });
    listbox = $('#suspend');
    listbox.on('click', function () {
        Button2();
    });
    listbox = $('#generate');
    listbox.on('click', function () {
        Button3();
    });
});

