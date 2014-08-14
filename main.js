(function() {
	var enjoyjs = function() {
		var textarea = document.getElementById('show_text'),
			inputtext = document.getElementById('input_text'),
			sendbtn = document.getElementById('send_btn'),
			clearbtn = document.getElementById('clear_btn'),
			syncvar = 'syncvar';

		function test_local_storage() {
			var testvar = 'teststorage';
			try {
				localStorage.setItem(testvar, testvar);
				localStorage.removeItem(testvar);
				return true;
			} catch(e) {
				return false;
			}
		}

		function addEvent(elem, event, fn) {
		    if (elem.addEventListener) {
		        elem.addEventListener(event, fn, false);
		    } else {
		        elem.attachEvent("on" + event, function() {
		            return(fn.call(elem, window.event));
		        });
		    }
		}

		function sendbtn_click() {
			if(!inputtext.value) {
				alert("No text to input!");
				return;
			}
			localStorage.setItem(syncvar,inputtext.value);
			textarea.value = '';
			textarea.value = inputtext.value;
			inputtext.value = '';
		}

		function clearbtn_click() {
			console.log("clear btn");
			textarea.value = '';
			inputtext.value = '';
			localStorage.setItem(syncvar,'');
		}

		function handle_storage(e) {
			if(!e) e =	window.event;
			console.log(e.newValue);
			textarea.value = e.newValue;
		}

		return {
			run : function() {
				if(!test_local_storage()) {
					alert("Local storage is not supported!");
					return;
				}

				addEvent(window, "storage", handle_storage);
				addEvent(sendbtn, "click", sendbtn_click);
				addEvent(clearbtn, "click", clearbtn_click);
			}
		};
	}

	var myjoy = enjoyjs();
	myjoy.run();

})();
