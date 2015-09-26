function on_load() {
    set_brush('red');
    set_brush('small');
    window.canvas_element = document.getElementById("canvas");
    window.ctx = window.canvas_element.getContext('2d');
    window.ctx.lineCap = 'round';
    window.canvas_element.addEventListener('mousedown', begin_draw);
    window.canvas_element.addEventListener('mousemove', continue_draw);
    window.canvas_element.addEventListener('mouseup', end_draw);
    load_image_data();
    window.addEventListener("storage", storage_handler);
}

function storage_handler() {
    load_image_data();
}

function set_brush(sender_id) {

    var set_color_selection = function () {
        ['red', 'green', 'blue', 'black', 'gray'].forEach(function (color) {
            var button = document.getElementById(color);
            if (button) {
                if (color == window.selected_color)
                    button.style.borderStyle = 'solid';
                else
                    button.style.borderStyle = 'inset';
            }
        });
    };

    var set_brush_size_selection = function () {
        ['small', 'medium', 'large'].forEach(function (color) {
            var button = document.getElementById(color);
            if (button) {
                if (color == window.selected_brush)
                    button.style.borderStyle = 'solid';
                else
                    button.style.borderStyle = 'inset';
            }
        });
    };

    switch (sender_id) {
        case 'red':
        case 'green':
        case 'blue':
        case 'black':
        case 'gray':
            window.selected_color = sender_id;
            set_color_selection();
            break;
        case 'small':
        case 'medium':
        case 'large':
            window.selected_brush = sender_id;
            set_brush_size_selection();
            break;
    }
}

function begin_draw(e) {
    var size = 0;
    switch (window.selected_brush) {
        case 'small':
            size = 4;
            break;
        case 'medium':
            size = 10;
            break;
        case 'large':
            size = 20;
            break;
    }
    window.ctx.strokeStyle = window.selected_color;
    window.drawing = true;
    window.ctx.beginPath();
    window.ctx.lineWidth = 1;
    window.ctx.arc(e.x - window.canvas_element.offsetLeft, e.y - window.canvas_element.offsetTop, size / 2, 0, 2 * Math.PI);
    window.ctx.fillStyle = window.selected_color;
    window.ctx.fill();
    window.ctx.stroke();
    window.ctx.beginPath();
    window.ctx.moveTo(e.x - window.canvas_element.offsetLeft, e.y - window.canvas_element.offsetTop);
    window.ctx.lineWidth = size;
}

function continue_draw(e) {
    if (window.drawing) {
        window.ctx.lineTo(e.x - window.canvas_element.offsetLeft, e.y - window.canvas_element.offsetTop);
        window.ctx.stroke();
        window.ctx.beginPath();
        window.ctx.moveTo(e.x - window.canvas_element.offsetLeft, e.y - window.canvas_element.offsetTop);
    }
}

function end_draw(e) {
    window.ctx.fillStyle = window.selected_color;
    window.ctx.lineTo(e.x - window.canvas_element.offsetLeft, e.y - window.canvas_element.offsetTop);
    window.ctx.stroke();
    window.drawing = false;
}

function save_canvas() {
    var image_data = window.ctx.getImageData(0, 0, window.canvas_element.width, window.canvas_element.height);
    localStorage['utip.canvas'] = image_data.data.toString();
}

function clear_canvas() {
    window.ctx.clearRect(0, 0, window.canvas_element.width, window.canvas_element.height);
}

function load_image_data() {
    var saved_image_data = localStorage['utip.canvas'];
    if (saved_image_data) {
        var image_data = window.ctx.getImageData(0, 0, window.canvas_element.width, window.canvas_element.height);
        var array = saved_image_data.split(',');
        if (array.length == image_data.data.length) {
            for (var i = 0; i < array.length; i += 4) {
                if (array[i] != '0' || array[i + 1] != '0' || array[i + 2] != '0') {
                    image_data.data[i] = parseInt(array[i]); //red
                    image_data.data[i + 1] = parseInt(array[i + 1]); // blue
                    image_data.data[i + 2] = parseInt(array[i + 2]); // green
                    image_data.data[i + 3] = parseInt(array[i + 3]); // alpha
                }
            }
            window.ctx.putImageData(image_data, 0, 0);
        }
    }
}
