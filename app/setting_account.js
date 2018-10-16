var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('đã kết nối', false);                
                onLogin();
                loadUiInput();
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
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            if(msg["type"] == "login") {                
                if(msg["status"] == "success") {
                    //alert("Đăng nhập tài khoản thành công !")    
                } else {
                    //alert ("Đăng nhập tài khoản thất bại " + msg["msg"])
                }            

            } else if (msg["type"] == "add_user") {
                if(msg["status"] == "success") {
                    alert("Thêm tài khoản " + getText("account_add_username") + 
                    " thành công !")    
                } else {
                    alert ("Thêm tài khoản " + getText("account_add_username") + 
                    " thất bại " + msg["msg"])
                }
            } else if (msg["type"] == "del_user") {
                if(msg["status"] == "success") {
                    alert("Xóa tài khoản " + getText("account_reset_delelte") + 
                    " thành công !")    
                } else {
                    alert ("Xóa tài khoản thất bại " + msg["msg"])
                }
            } else if (msg["type"] == "change_password") {
                if(msg["status"] == "success") {
                    alert("Đổi mật khẩu tài khoản thành công !")    
                } else {
                    alert ("Đổi mật khẩu tài khoản thất bại " + msg["msg"])
                }
            } else if (msg["type"] == "reset_password") {
                if(msg["status"] == "success") {
                    alert("Reset mật khẩu tài khoản thành công !")    
                } else {
                    alert ("Reset mật khẩu tài khoản thất bại " + msg["msg"])
                }
            } else if (msg["type"] == "logout") {
                if(msg["status"] == "success") {
                    alert("logout thành công !")    
                } else {
                    alert ("logout thất bại " + msg["msg"])
                }
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

function setDisabledInput(id) {
    document.getElementById(id).disabled = true
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


function changePassword(username, oldpw, newpw) {
    if(SOCK == undefined) {
        console.log("sock is null")
        return
    }
        

    if(getText("account_man_new_password") != getText("account_man_conf_password")) {
        alert("Mật khẩu mới không hợp lệ !")
        return
    }

    if(getText("account_man_new_password") == "" ||
        getText("account_man_conf_password") == "" ||
        getText("account_man_curr_password") == "") {
            alert("Thông tin chưa đủ !")
            return
    }
    

    msg = {
        type: 'change_password',
        data: {
            oldpassword : getText("account_man_curr_password"),
            newpassword : getText("account_man_new_password")
        }
    }

    console.log(msg)

    SOCK.send(JSON.stringify(msg))
}


function resetPassword(username) {
    
    if(localStorage.role_ != "supperuser") {
        alert("Không có quyền reset mật khẩu")
        return
    }

    if(SOCK == undefined) return

    if(getText("account_reset_delelte") == "") {
        alert("Thông tin chưa đủ !")
        return
    }

    msg = {
        type: 'reset_password',
        data: {
            username : getText("account_reset_delelte"),
        }
    }

    SOCK.send(JSON.stringify(msg))
}


function deleteUser(username) {

    if(localStorage.role_ != "supperuser") {
        alert("Không có quyền xóa tài khoản")
        return
    }

    if(SOCK == undefined) return

    if(getText("account_reset_delelte") == "") {
        alert("Thông tin chưa đủ !")
        return
    }


    msg = {
        type: 'del_user',
        data: {
            username : getText("account_reset_delelte"),
        }
    }

    SOCK.send(JSON.stringify(msg))
}

function addUser(username, passwd, role) {
    if(localStorage.role_ != "supperuser") {
        alert("Không có quyền thêm tài khoản mới")
        return
    }

    if(SOCK == undefined) return

    if(getText("account_add_password") != getText("account_add_conf_password")) {
        alert("Mật khẩu không hợp lệ !")
        return
    }

    if(getText("account_add_password") == "" ||
        getText("account_add_conf_password") == "" ||
        getText("account_add_role") == "") {
            alert("Thông tin chưa đủ !")
            return
    }

    msg = {
        type: 'add_user',
        data: {
            username : getText("account_add_username"),
            password : getText("account_add_password"),            
            role : getText("account_add_role")
        }
    }

    SOCK.send(JSON.stringify(msg))
}


function onLogin() {
    if(SOCK == undefined) return

    msg = {
        type: 'login',
        data: {
            username: localStorage.username_,
            password: localStorage.password_
        }        
    }

    SOCK.send(JSON.stringify(msg))
}



function loadUiInput() {
    if(localStorage.role_ == "supperuser") {

    } else {
        setDisabledInput("account_reset_delelte")
        setDisabledInput("account_add_username")
        setDisabledInput("account_add_password")
        setDisabledInput("account_add_conf_password")
        setDisabledInput("account_add_role")
    }
}