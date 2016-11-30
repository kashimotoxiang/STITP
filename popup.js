/**
 * Created by kashi on 2016/10/11.
 */
"use strict";

function switchProcess(par) {
    var str1, str2, m_switch;
    switch (par) {
        case 'start':
            m_switch = $('#start');
            str1 = "启动";
            str2 = "停止";
            //TODO

            break;
        case 'suspend':
            m_switch = $('#suspend');
            str1 = "暂停";
            str2 = "继续";
            //TODO

            break;
        default:
            break;
    }
    if (m_switch.val() == str1) {
        m_switch.val(str2);
    }
    else {
        m_switch.val(str1);
    }
}

function PicGener(){
                chrome.tabs.create({
                    url: "src/58971162_p0.png" ,
                    active: true
                });
}

$(document).ready(function () {
    var listbox;
    listbox = $('#start');
    listbox.on('click', function () {
        switchProcess('start');
    });
    listbox = $('#suspend');
    listbox.on('click', function () {
        switchProcess('suspend');
    });
    listbox = $('#generate');
    listbox.on('click', function () {
        PicGener();
    });
    websocketInit();
});

