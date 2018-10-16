var SOCK = undefined

var username_
var password_
var role_

document.addEventListener("DOMContentLoaded", function(){
       
    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('đã kết nối', false);
                getSystemStatus()                          
            }

            SOCK.onclose = function() {
                setStatus('không kết nối', true);
                SOCK=undefined
            }

            SOCK.onmessage = onMessage
            SOCK.onerror = function() {
                setStatus('lỗi kết nối', true);
                SOCK=undefined
            }
            } else {
            setStatus('Tao ws khong thanh cong')
        }
    } else {
        setStatus('Trinh duyet khong ho tro ws')
    }

    setText("account_info", 'username')
    // console.log("username = " + localStorage.username_)
    
    // setText("time_info", 'this is time')
    
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_system_info") {
                smsg = msg["data"];
                setText("status_ip", smsg["ipaddress"])
                setText("status_subnet", smsg["netmask"])
                setText("status_tinh", smsg["tinh"])
                setText("status_coso", smsg["coso"])
                setText("status_tram", smsg["tram"])
                setText("status_ftp_ip", smsg["serverip"])
                setText("status_ftp_username", smsg["username"])
                setText("status_ftp_port", smsg["port"])
                setText("status_ftp_logdur", smsg["logdur"])

            }
        }
    } catch(err) {        
        console.log("parser ", err)
    }
}


function getText(id){
    return document.getElementById(id).value
}
function setText(id, val){
    document.getElementById(id).value = val
}
function getCheckbox(id){
    return document.getElementById(id).checked
}
function setCheckbox(id, val){
    document.getElementById(id).checked = val
}

function setStatus(val, warn) {
    if (warn == true) {
        console.log("connected")
        document.getElementById("connecttion_status").innerHTML = '<span style="color:red">' + val + "</span>"
    }else{
        console.log("disconnected")
        document.getElementById("connecttion_status").innerHTML = '<span style="color:green">' + val + "</span>"
    }
}

function getSystemStatus() {
    if(SOCK == undefined) return

    msg = {
        type: 'control',
        subtype: 'get_system_info',        
    }

    SOCK.send(JSON.stringify(msg))
}




function displayUsername() {
    // console.log("username = " + localStorage.username_)
    // setText("system_username", localStorage.username_)
}




