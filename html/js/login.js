
var SOCK = undefined

localStorage.username_
localStorage.password_
localStorage.role_
localStorage.currTag_

document.addEventListener("DOMContentLoaded", function(){
    
    if('WebSocket' in window){
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK){
            SOCK.binaryType = "arraybuffer"
            SOCK.onopen = function(){
    
            }
            SOCK.onclose = function(){
    
                SOCK = undefined
            }
            SOCK.onmessage = onMessage
            SOCK.onerror = function(){    
                SOCK = undefined
            }
        }else{
            setStatus('Trình duyệt không hỗ trợ', true);
        }
    }else{
        setStatus('Trình duyệt không hỗ trợ', true);
    }
    
    //setText("id_datetime", 'this is time')
    localStorage.username_ = ""
    localStorage.password_ = ""
    localStorage.role_ = ""
})

function onMessage(event){
    try {        
        msg = JSON.parse(event.data)     
          
        if(msg != undefined) {
            console.log(msg) 
            if(msg["type"] == "login") {
                if(msg["status"] == "success") {
                    localStorage.username_ = msg["username"]
                    localStorage.role_ = msg["role"]
                    
                    window.location = "main_status.html"; // Redirecting to other page.

                } else {
                    setTextColor("id_login_status", "tài khoản hoặc mật khẩu không đúng", true)
                }
            }
            
            if(msg["type"] == "realtime_data") {
                smsg = msg["time"];
                if(smsg != undefined) {
                    setText("id_datetime", "Ngày: " + smsg["day"] + "-" + 
                    smsg["month"] + "-" + smsg["year"] + "&nbsp;&nbsp;" + 
                    smsg["hour"] + ":" + smsg["min"] + ":" + 
                    smsg["sec"])
                }
            }

        }
    } catch(err) {        
        console.log("parser ", err)
    }
}


function onLogin(){
    if(getText("id_login_username") == "" || 
        getText("id_login_password") == "") {
        setTextColor("id_login_status", "Vui lòng nhập đủ thông tin", true)
        return
    } else {
        setTextColor("id_login_status", "", false)
    }
    if(SOCK == undefined) {
        setTextColor("id_login_status", 
        "Không thể kết nối tới thiết bị", true)
        return
    }   

    msg = {
        type: 'login',
        data: {
            username: getText("id_login_username"),
            password: getText("id_login_password")
        }        
    }

    localStorage.password_ = getText("id_login_password")

    SOCK.send(JSON.stringify(msg))
}

function getText(id){
    return document.getElementById(id).value
}
function setText(id, val){ // set text for label
    document.getElementById(id).innerHTML = '<span>' + val + "</span>"
}
function getCheckbox(id){
    return document.getElementById(id).checked
}
function setCheckbox(id, val){
    document.getElementById(id).checked = val
}
function setStatus(val, warn) {
    alert(val)
}

function setTextColor(id, val, warn) {
    if (warn == true) {
        document.getElementById(id).innerHTML = '<span style="color:red">' + val + "</span>"
    }else{
        document.getElementById(id).innerHTML = '<span style="color:black">' + val + "</span>"
    }
}
