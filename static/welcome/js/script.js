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

window.addEventListener('load', function() {
    progressBar = document.getElementById('progress');
    progressText = document.getElementById('progress-text');
    
    flowPane0 = document.getElementById('flow-pane-0');
    flowPane1 = document.getElementById('flow-pane-1');
    flowPane2 = document.getElementById('flow-pane-2');

    url = document.getElementById('url');
    shortString = document.getElementById('short-string');

    flowPane0Cont = document.getElementById('flow-pane-0-continue');
    flowPane1Cont = document.getElementById('flow-pane-1-continue');

    flowPane0Cont.addEventListener('click', flow_pane_0_continue, false);
    flowPane1Cont.addEventListener('click', flow_pane_1_continue, false);
});

/* Handle flow pane control */
function flow_pane_0_continue() {
    url_validation();
}

function flow_pane_1_continue() {
    shortString_validation();
}

/* Transition functions */
function refresh() {
    resetFlowPane0_Reset();
    resetFlowPane1_Reset();
    resetFlowPane2_Reset();
    transitionToFlowPane0();
}

function transitionToFlowPane0() {
    validating = false;

    progressBar.className = "progress stage-0";
    progressText.innerText = "Enter your URL";

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
    progressText.innerText = "Setup your ShortLinx";

    flowPane0Cont.innerText = "Continue";
    flowPane1Cont.innerText = "Continue";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane1.className = "flow-pane show";
}

function transitionToFlowPane2() {
    validating = false;

    progressBar.className = "progress stage-2";
    progressText.innerText = "All done! Check out your ShortLinx!";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane2.className = "flow-pane show";
}

var resetCount=3;
function resetFlowPane0() {
    url.style.color = "red";
    flowPane0Cont.innerText = "Invalid URL. Resetting in " + resetCount;
    setTimeout(function() {
        if (resetCount > 0) {
            resetCount--;
            resetFlowPane0();
        } else {
            resetCount = 3;
            resetFlowPane0_Reset();
        }
    }, 1000);
}

function resetFlowPane0_Reset() {
    url.style.color = "";
    url.value = null;
    url.className = "";
    flowPane0Cont.innerText = "Continue";
}

function resetFlowPane1() {
    //todo
}

function resetFlowPane1_Reset() {
    shortString.style.color = "";
    shortString.value = null;
    shortString.className = "";
    flowPane1Cont.innerText = "Continue";
}

function resetFlowPanel2_Reset() {
    //todo
}


/* Redirect functions */
function redirectToLink() {
    window.location = "http://shortlinx.herokuapp.com/testlink";
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
    x = encodeURI(x);

    return x;
}

function handleUrlResponse(response) {
    if (response.status != 200) {
        validation_failed(url);
        resetFlowPane0();
    } else {
        validation_success(url);
        transitionToFlowPane1();
    }
}

function shortString_validation(event) {
    validating = true;
    validating_startAnimation(shortString);
    ss_ReqCheck(shortString.value);
}

function ss_ReqCheck(x) {
    x = fixSsFormat(x);
    makeRec('PUT', '/setupredirect?url='+url.value+'&ss='+x, handleSsResponse);
}

function fixSsFormat(x) {
    console.log("Need to fix " + x + " to be whatever");
    return "toaster";
}

function handleSsResponse(response) {
    console.log(response);
    if (response.status != 200) {
        validation_failed(shortString);
        resetFlowPane1();
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
        }
    },500);
}

function validation_failed(x) {
    validating = false;
    x.className = "validated-failed";
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