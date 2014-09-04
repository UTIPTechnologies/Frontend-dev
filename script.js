(function () {
    var sendMessageKey = 'send-message-key';
    var newMessage = document.getElementById('message'),
        viewer = document.getElementById('viewer'),
        sendBtn = document.getElementById('send'),
        clearBtn = document.getElementById('clear');

    var addMessage = function () {
        var currentValue = localStorage.getItem(sendMessageKey) || '',
            newValue = currentValue + newMessage.value + '\n';

        localStorage.setItem(sendMessageKey, newValue);
        newMessage.value = '';
    };

    var innerUpdate = function (newText, breakline) {
        viewer.innerHTML = newText + (breakline ? '\n' : '');
    };

    var externalUpdate = function (event) {
        if (!event) { event = window.event; }

        if (event.key == sendMessageKey) {
            innerUpdate(event.newValue, true);
        }
    };

    var sendMessage = function () {
        if (newMessage.value){
            var currentValue = localStorage.getItem(sendMessageKey) || '',
                newValue = currentValue + newMessage.value + '\n';

            localStorage.setItem(sendMessageKey, newValue);
            innerUpdate(newValue, true);
            newMessage.value = '';
        }
    };

    var sendOnEnter = function (event) {
        if (event.keyCode == 13){   // Enter
            sendMessage();
            event.preventDefault();
        }
    };

    var clearMessages = function () {
        localStorage.setItem(sendMessageKey, '');
        innerUpdate('', false);
    };

    var initLastMessages = function () {
        var currentValue = localStorage.getItem(sendMessageKey) || '';
        innerUpdate(currentValue, false);
    };

    if (window.addEventListener) {
        window.addEventListener('storage', externalUpdate, false);
        sendBtn.addEventListener('click', sendMessage, false);
        clearBtn.addEventListener('click', clearMessages, false);
        newMessage.addEventListener('keypress', sendOnEnter, false);
    }
    else {
        window.attachEvent('onstorage', externalUpdate);
        sendBtn.attachEvent('onclick', sendMessage);
        clearBtn.attachEvent('onclick', clearMessages);
        newMessage.attachEvent('keypress', sendOnEnter);
    }

    initLastMessages();

})();
