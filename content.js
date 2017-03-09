 window.addEventListener("message", function(event) {
        chrome.runtime.sendMessage(event.data);
        console.log(event.data);
    }, false);