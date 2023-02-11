var lastReqNo = 0; // global last reqNo variable

function doAJAX(elementIdentifier, callback, requestURL, params) {
    // this function takes an elementID, a callback = f(elementIdentifier, response),
    // and a request URL. It will wait until the data from the request is ready to update
    // NOTE: elementIdentifier could be an element OR an elementID
=    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false; // Firefox is way too pedantic about CORS
    xhr.onreadystatechange = function(e) { 
            if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = xhr.responseText;
                    if (response) { // why is the response sometimes null?
                            callback(elementIdentifier, response);
                    }
            }
    }
    var method;
    if (params) {
            // while it is possible to configure your backend server to accept JSON payloads with a GET request,
            // Chrome does not like to send payloads unless it is a POST request
            method = "POST";
            var payload = JSON.stringify(params); // Serialze the payload
    } else {
            method = "GET";
            var payload = null;
    }
    xhr.open(method, requestURL, true); // true for asynchronous 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', '*/*'); // Is this too liberal?
    xhr.send(payload);
}


function addToChat(message, req_no) {
    // add a message to the chat history 
    // if it is a question, set req_no to null
    // if it is a response from the machine, set req_no to whatever was provided in the response
    var chatArea = document.getElementById('chatArea'); // this is the chat area that has a scrollbar 
    var box = document.createElement('div');            // this is the "bubble" box with one chat question/response
    var icon = document.createElement('img');           // the brain or person icon
    var para = document.createElement('p');
    var dateSpan = document.createElement('span');
    // set variables to a default state for a human question....
    var respClass = 'respHuman'; 
    var iconSrc = 'images/human_icon.png';
    var iconClass = 'right';
    var paraId = 'human' + lastReqNo;
    var delay = 0;
    var duration = 500
    var scale = 1;
    var dateClass = 'time-right';
    if (req_no) {
        // ... and override them if this is a mahine response instead
        lastReqNo = req_no; // increment the global variable on machine response. This allows element identification for user questions that get no req_id from python 
        respClass = 'respMachine'; 
        iconSrc = 'images/brain_icon.png';
        iconClass = 'left';
        paraId = 'machine' + req_no;
        delay = 150;  // make it look like the machine has to think longer
        duration = 1000;
        scale = 6;    // make the letters really big and get smaller as they fly in
        dateClass = 'time-left';
    }
    // finish applying things
    box.classList.add('container');                                         // apply W3 formatting rules
    box.classList.add(respClass); // apply respHuman or respMachine formatting
    icon.setAttribute('src', iconSrc);
    icon.classList.add(iconClass);
    para.innerText = message;
    para.setAttribute('id', paraId);
    var d = new Date();
    var timeString = d.toLocaleTimeString();
    dateSpan.innerText = timeString;
    dateSpan.classList.add(dateClass);
    // assign parents
    box.appendChild(icon);
    box.appendChild(para);
    box.appendChild(dateSpan)
    chatArea.appendChild(box);
    // AFTER the box has been added to the chat area, make the text enter gradually with a cool effect
    chatArea.scrollTop = chatArea.scrollHeight;
    anime.timeline().add({
        targets: document.getElementById(paraId),
        scale: [scale,1],
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: duration,
        delay: delay
    });

}


function machineRespCallback(_ele, response) {
    // when you get a response back from the server to a query, add a new response box
    var jz = JSON.parse(response);
    addToChat(jz.message, jz.req_no)
}

/*<div class="container respMachine">
                <img src="images/brain_icon.png" alt="Brain Icon">
                <h1 class="ml2">Sunny mornings</h1>
                <span class="time-right">11:00</span>
            </div>
             */

function execQuery(question) {
    // This function is invoked when the user hits enter to submit a query
    var url = '/api/?q='+question.replaceAll(' ','%20').replaceAll('?','');
    addToChat(question, null);
    doAJAX("", machineRespCallback, url);

}

document.getElementById('question').addEventListener('keypress', function(e){
    if (e.key === 'Enter') {
        // When the user is typing and hits enter/reutrn, execute the query
        execQuery(this.value);
        this.value = ''; // clear the contents of the text field
    }
});

var textWrapper = document.querySelector('.ml2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

/*anime.timeline()
    .add({
        targets: '.ml2 .letter',
        scale: [4,1],
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70*i
    });
*/