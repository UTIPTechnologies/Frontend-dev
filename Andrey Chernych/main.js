/**
 * Добавляет нули перед числом для форматированного вывода
 * @param num - число
 * @param size - максимальная длина числа
 */
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * Возвращает текущую дату в формате 'HH:mm:ss'
 */
function getDateNowFormat() {
    var nowDate = new Date();
    return pad(nowDate.getHours(), 2) + ":" + pad(nowDate.getMinutes(), 2) + ":"+ pad(nowDate.getSeconds(), 2)
}

/**
 * Функция для обработки изменений в локальном хранилище
 */
function onStorage() {
    var managerObject = JSON.parse(localStorage.getItem('manager-object-id-7893'));
    var log = document.getElementById("log-textarea");

    if(managerObject.cmd === 'new-msg') {
        log.value += getDateNowFormat() + " " + managerObject.content + '\n';
    } else {
        if(managerObject.cmd === 'clear-log' && managerObject.content) {
            log.value = '';
        }
    }
}

//определяем движок
var webkit = !!navigator.userAgent.match(/AppleWebKit\/(\d+\.\d+)/);

if ('v'=='\v') { // IE слушает document
    document.attachEvent('onstorage', onStorage, false);
} else if (window.opera || webkit){ // Opera and WebKits слушают window
    window.addEventListener('storage', onStorage, false);
} else { // FF слушает document.body или document
    document.body.addEventListener('storage', onStorage, false);
}

/**
 * Фукнция для генерации UUID
 */
function generateUUID(){
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
}

/**
 * Сохранение в локально хранилище
 * @param cmd - команда действия (new-msg - сохранение нового сообщения, clear-log - очистка лога)
 * @param content - контент команды
 */
function broadcast(cmd, content){
    //Локально хранилище не реагирует на добавление того же элемента,
    //поэтому к каждому сохранению добавляем уникальный uuid
    var uuid = generateUUID();

    //manager-object-id-7893 - название переменной в локальном хранилище
    localStorage.setItem('manager-object-id-7893', JSON.stringify({ 'cmd': cmd, 'content': content, 'uuid': uuid}));

    if (window.opera || webkit) {
        // Opera and WebKits не выбрасывает в своем окне событие об изменнии локального хранилища
        // Делаем это вручную
        onStorage();
    }
}

/**
 * Отправка нового сообщения
 */
function sendTextMsg() {
    var msg = document.getElementById("msg-input");
    if(msg.value) {
        broadcast('new-msg', msg.value);
        msg.value = '';
    } else {
        alert("Введите текст отправляемого сообщения");
    }
}

/**
 * Очистка лога
 */
function clearLogs() {
    broadcast('clear-log', true);
}