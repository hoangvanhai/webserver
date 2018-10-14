var SOCK = undefined
localStorage.username_
localStorage.password_
localStorage.role_

document.addEventListener("DOMContentLoaded", function(){
    // setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {                                
            }

            SOCK.onclose = function() {
                // setStatus('không kết nối', true);
                SOCK=undefined
            }

            SOCK.onmessage = onMessage
            SOCK.onerror = function() {
                // setStatus('lỗi kết nối', true);
                SOCK=undefined
            }
            } else {
            // setStatus('Tao ws khong thanh cong')
        }
    } else {
        // setStatus('Trinh duyet khong ho tro ws')
    }
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            if(msg["type"] == "login") {
                if(msg["status"] == "success") {
                    localStorage.username_ = msg["username"]
                    localStorage.role_ = msg["role"]

                    window.location = "sytem_status.html"; // Redirecting to other page.

                } else {
                    alert(msg["msg"])
                }
            }
        }
    } catch(err) {        
        console.log("parser ", err)
    }
}

function onLogin() {
    if(SOCK == undefined) return

    msg = {
        type: 'login',
        data: {
            username: getText("login_username"),
            password: getText("login_password")
        }        
    }

    SOCK.send(JSON.stringify(msg))
}

function getText(id){
    return document.getElementById(id).value
}