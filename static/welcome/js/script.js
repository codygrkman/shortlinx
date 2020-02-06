/* Attach button listeners */
var progressBar;
var progressText;
var flowPane0;
var flowPane1;
var flowPane2;
var url;
var shortString;

window.addEventListener('load', function() {
    progressBar = document.getElementById('progress');
    progressText = document.getElementById('progress-text');
    
    flowPane0 = document.getElementById('flow-pane-0');
    flowPane1 = document.getElementById('flow-pane-1');
    flowPane2 = document.getElementById('flow-pane-2');

    url = document.getElementById('url');
    shortString = document.getElementById('short-string');

    document.getElementById('flow-pane-0-continue').addEventListener('click', flow_pane_0_continue, false);
    document.getElementById('flow-pane-1-continue').addEventListener('click', flow_pane_1_continue, false);
});

/* Handle flow pane control */
function flow_pane_0_continue() {
    transitionToFlowPane1();
    console.log("Flow pane 0 continue");
}

function flow_pane_1_continue() {
    console.log("Flow pane 1 continue");
    transitionToFlowPane2();
}

/* Transition functions */
function transitionToFlowPane0() {
    progressBar.className = "progress stage-0";
    progressText.innerText = "Enter your URL";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane0.className = "flow-pane show";
}

function transitionToFlowPane1() {
    progressBar.className = "progress stage-1";
    progressText.innerText = "Setup your ShortLinx";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane1.className = "flow-pane show";
}

function transitionToFlowPane2() {
    progressBar.className = "progress stage-2";
    progressText.innerText = "All done! Check out your ShortLinx!";

    flowPane0.className = "flow-pane hidden";
    flowPane1.className = "flow-pane hidden";
    flowPane2.className = "flow-pane hidden";

    flowPane2.className = "flow-pane show";
}

/* Redirect functions */
function redirectToLink() {
    location.href = "http://www.shortlinx.herokuapp.com/testlink";
}