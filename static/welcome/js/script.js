/* Attach button listeners */
var progressBar;
var progressText;
var flowPane0;
var flowPane1;
var flowPane2;
var url;
var shortString;
var flowPane0Cont;
var flowPane1Cont;
var backgroundUrl;
var redirectLink;
var error;

window.addEventListener('load', function() {
    progressBar = document.getElementById('progress');
    progressText = document.getElementById('progress-text');
    
    flowPane0 = document.getElementById('flow-pane-0');
    flowPane1 = document.getElementById('flow-pane-1');
    flowPane2 = document.getElementById('flow-pane-2');

    redirectLink = document.getElementById('redirectLink');

    url = document.getElementById('url');
    shortString = document.getElementById('short-string');

    flowPane0Cont = document.getElementById('flow-pane-0-continue');
    flowPane1Cont = document.getElementById('flow-pane-1-continue');

    flowPane0Cont.addEventListener('click', flow_pane_0_continue, false);
    flowPane1Cont.addEventListener('click', flow_pane_1_continue, false);

    error = document.getElementById('error');

    url.addEventListener('keypress', function(e) {
        if(e.which == 13) {
            e.preventDefault();
            flow_pane_0_continue();
            return false;
        }
    }, false);
    shortString.addEventListener('keypress', function(e) {
        if(e.which == 13) {
            e.preventDefault();
            flow_pane_1_continue();
            return false;
        }
    }, false);
});

/* Handle flow pane control */
function flow_pane_0_continue() {
    url_validation();
    return false;
}

function flow_pane_1_continue() {
    shortString_validation();
    return false;
}

/* Transition functions */
function refresh() {
    transitionToFlowPane0(0);
}

function about() {
    location.href = "/aboutcody";
}

function transitionToFlowPane0() {
    validating = false;

    progressBar.className = "progress stage-0";
    progressText.innerText = "Enter your URL";

    error.style.display = "none";

    url.value = null;
    url.className = "";

    flowPane0Cont.innerText = "Continue";
    flowPane1Cont.innerText = "Continue";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane0.className = "flow-pane show";
}

function transitionToFlowPane1() {
    validating = false;

    progressBar.className = "progress stage-1";
    progressText.innerText = "Enter an easy-to-remember extension";

    error.style.display = "none";

    shortString.value = null;
    shortString.className = "";

    flowPane0Cont.innerText = "Continue";
    flowPane1Cont.innerText = "Continue";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane1.className = "flow-pane show";

    shortString.focus();
}

function transitionToFlowPane2() {
    validating = false;

    redirectLink.innerText = "127.0.0.1:5000/" + shortString.value;

    progressBar.className = "progress stage-2";
    progressText.innerText = "All done! Check out your ShortLinx!";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane2.className = "flow-pane show";
}


/* Redirect functions */
function redirectToLink() {
    window.location = shortString.value;
}

/* Validation */
var validating = false;

function url_validation() {
    validating = true;
    validating_startAnimation(url);
    url_ReqCheck(url.value);
}

function url_ReqCheck(x) {
    x = fixUrlFormat(x);
    makeRec('GET', '/urlvalidation?url='+x, handleUrlResponse);
}

function fixUrlFormat(x) {
    if (x.substring(0,7) != "http://" && x.substring(0,8) != "https://") {
        x = "https://" + x;
    }
    backgroundUrl = x;
    return x;
}

function handleUrlResponse(response) {
    if (response.status != 200) {
        console.log(response);
        validation_failed(url, "Sorry! That URL isn't valid. Try another.");
    } else {
        validation_success(url);
        transitionToFlowPane1();
    }
}

function shortString_validation() {
    validating = true;
    validating_startAnimation(shortString);
    ss_reqCheck(shortString.value);
}

function ss_reqCheck(x) {
    x = fixSsFormat(x);
    makeRec('POST', '/setupredirect?url='+backgroundUrl+'&ss='+x, handleSsResponse);
}

function fixSsFormat(x) {
    return encodeURIComponent(x);
}

function handleSsResponse(response) {
    if (response.status != 200) {
        validation_failed(shortString, "Sorry! That extension is taken. Try another.");
    } else {
        validation_success(shortString);
        transitionToFlowPane2();
    }
}

/* Validation animation*/
var validating_animationState = 0; // not validating. 1 - validating_1, 2 - validating_2, 3 - validated 
function validating_startAnimation(x) {
    validating = true;
    x.className = "validating";
    startElipses(1);
}

function startElipses(x) {
    flowPane0Cont.innerText = "Validating" + ".".repeat(x);
    flowPane1Cont.innerText = "Validating" + ".".repeat(x);
    setTimeout(function() {
        if (validating) {
            if (x>2) x=1;
            else x++;
            startElipses(x);
        } else {
            flowPane0Cont.innerText = "Continue";
            flowPane1Cont.innerText = "Continue";
        }
    },500);
}

function validation_failed(x, errText) {
    validating = false;
    x.className = "validated-failed";
    x.style.color = "red";
    error.innerText = "Error: " + errText;
    error.style.display = "inline";
    setTimeout(function() {
        x.className = "not-validating";
        x.style.color = "";
    }, 750);
    setTimeout(function() {
        error.style.display = "none";
    },3500);
}

function validation_success(x) {
    validating = false;
    x.className = "validated-success";
}

/* AJAX Boilerplate */
function makeRec(method, target, handlerAction, data) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onreadystatechange = function() {
    if(httpRequest.readyState === XMLHttpRequest.DONE) {
        handlerAction(httpRequest);
    }
    }
    httpRequest.open(method, target);

    if (data) {
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(data);
    }
    else {
        httpRequest.send();
    }
  }