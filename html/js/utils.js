
function getText(id){
    return document.getElementById(id).value
}
function setText(id, val){
    document.getElementById(id).value = val
}

function setTextLabel(id, val){
    document.getElementById(id).innerHTML = "<span>" + val + "</span>"
}

function setTextLabelColor(id, val, warn) {
    if (warn == true) {
        document.getElementById(id).innerHTML = 
        '<span style="color:red">' + val + "</span>"
    }else{
        document.getElementById(id).innerHTML = 
        '<span style="color:green">' + val + "</span>"
    }
}

function getCheckbox(id){
    return document.getElementById(id).checked
}
function setCheckbox(id, val){
    document.getElementById(id).checked = val
}

function setDisabledInput(id) {
    document.getElementById(id).disabled = true;
}

function setEnabledInput(id) {
    document.getElementById(id).disabled = false;
}

function setComboIndex(id, idx) {
    document.getElementById(id).selectedIndex = idx;
}

function getContent(id) {
    return document.getElementById(id).value;    
}


function setStatus(val, warn) {
    if (warn == true) {
        console.log("connected")
        document.getElementById("id_connstatus").innerHTML = 
        '<span style="color:red">' + val + "</span>"
    }else{
        console.log("disconnected")
        document.getElementById("id_connstatus").innerHTML = 
        '<span style="color:green">' + val + "</span>"
    }
}

function setTextColor(val, warn) {
    if (warn == true) {
        document.getElementById("id_status_report").innerHTML = 
        '<span style="color:red">' + val + "</span>"
    }else{
        document.getElementById("id_status_report").innerHTML = 
        '<span style="color:green">' + val + "</span>"
    }
}

function setBarChartPercen(id, per, warn) {
    var percen = per
    if(percen > 100) percen = 100    
    document.getElementById(id).style.width = percen + '%'     
    if(warn) {
        document.getElementById(id).style.backgroundColor = 'red'
    } else {
        document.getElementById(id).style.backgroundColor = 'green'
    }
}


function setBack(username) {
    if(username == "") {
        window.location = "index.html";
    }
}


function forceBack() {
    localStorage.username_ = ""
    window.location = "index.html";
}