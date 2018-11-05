
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

function setTextBarColor(id, val, warn) {
    if (warn == true) {
        document.getElementById(id).innerHTML = 
        '<span style="color:red">' + val + "</span>"
    }else{
        document.getElementById(id).innerHTML = 
        '<span style="color:white">' + val + "</span>"
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
    select = document.getElementById(id);
    var percen = per
    select.style.width = percen + '%'     
    if(warn) {
        select.style.backgroundColor = 'red'
    } else {
        select.style.backgroundColor = 'rgb(40, 250, 50)'
    }
}


function setBack(username) {
    if(username == "") {
        window.location = "index.html";
    }
    if(username == undefined) {
        window.location = "index.html";
    }
}


function forceBack() {
    localStorage.username_ = ""
    window.location = "index.html";
}

function removeTag(id) {
    document.getElementById(id).remove();
}


function removeHtmlTag(userrole) {
    if(userrole != "admin" && userrole != "supperuser") {
        removeTag("a_raw")
        removeTag("a_subsystem")
        removeTag("a_p1")
        removeTag("a_p2")
        removeTag("a_p3")
        removeTag("a_p4")
        removeTag("a_p5")
        removeTag("a_p6")
        removeTag("a_p7")
        removeTag("a_p8")        
    }
}
