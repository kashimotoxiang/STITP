/**
 * Created by kashi on 2016/10/11.
 */
"use strict";

function switchProcess(par) {
    var str1, str2, m_switch;
    switch (par) {
        case 'start':
            m_switch = document.getElementById("start");
            str1 = "启动";
            str2 = "停止";
            break;
        case 'suspend':
            m_switch = document.getElementById("suspend");
            str1 = "暂停";
            str2 = "继续";
            break;
        default:
            break;
    }
    if (m_switch.value == str1) {
        m_switch.value = str2;
    }
    else {
        m_switch.value = str1;
    }
}

$(document).ready(function () {
    var listbox;
    listbox = document.getElementById("start");
    listbox.onclick = function () {
        switchProcess('start');
    };
    listbox = document.getElementById("suspend");
    listbox.onclick = function () {
        switchProcess('suspend');
    };
    websocketInit();
});

