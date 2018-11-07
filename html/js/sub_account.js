var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('Đã kết nối', false);                
                onLogin();
                loadUiInput();
            }

            SOCK.onclose = function() {
                setStatus('Không kết nối', true);
                SOCK=undefined
                forceBack()
            }

            SOCK.onmessage = onMessage
            SOCK.onerror = function() {
                setStatus('Lỗi kết nối', true);
                SOCK=undefined
                forceBack()
            }
            } else {
            setStatus('Tao ws khong thanh cong')
        }
    } else {
        setStatus('Trinh duyet khong ho tro ws')
    }
    setBack(localStorage.username_)
    removeHtmlTag(localStorage.role_)
    setTextLabel("id_username", "Tài khoản: " + localStorage.username_)
    
    console.log("role = " + localStorage.role_)
    if(localStorage.role_ == "admin") {
        console.log("delete admin")
        deleteItem()
    }

})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)  
        // console.log(msg)      
        if(msg != undefined) {
            if(msg["type"] == "login") {                
                if(msg["status"] == "success") {
                    console.log("set username = " + msg["username"])
                    setTextLabel("id_username", "Tài khoản: " + msg["username"])  
                    getListAccount();
                } else {
                    //alert ("Đăng nhập tài khoản thất bại " + msg["msg"])
                }            

            } else if (msg["type"] == "add_user") {
                if(msg["status"] == "success") {
                    setTextColor("Thêm tài khoản " + getText("acc_add_username") + 
                    " thành công !", false)    
                } else {
                    setTextColor ("Thêm tài khoản " + getText("acc_add_username") + 
                    " thất bại " + msg["msg"], true)
                }
            } else if (msg["type"] == "del_user") {
                if(msg["status"] == "success") {
                    setTextColor("Xóa tài khoản " + getText("acc_reset_del_username") + 
                    " thành công !", false)    
                } else {
                    setTextColor ("Xóa tài khoản thất bại " + msg["msg"], true)
                }
            } else if (msg["type"] == "change_password") {
                if(msg["status"] == "success") {
                    setTextColor("Đổi mật khẩu tài khoản thành công !", false)    
                } else {
                    setTextColor ("Đổi mật khẩu tài khoản thất bại " + msg["msg"], true)
                }
            } else if (msg["type"] == "reset_password") {
                if(msg["status"] == "success") {
                    setTextColor("Reset mật khẩu tài khoản thành công !", false)    
                } else {
                    setTextColor ("Reset mật khẩu tài khoản thất bại " + msg["msg"], false)
                }
            } else if (msg["type"] == "logout") {
                if(msg["status"] == "success") {
                    setTextColor("logout thành công !", false)    
                } else {
                    setTextColor ("logout thất bại " + msg["msg"], true)
                }
            }

            if(msg["type"] == "realtime_data") {
                smsg = msg["time"];
                if(smsg != undefined) {
                    setTextLabel("id_datetime", "Ngày: " + smsg["day"] + "-" + 
                    smsg["month"] + "-" + smsg["year"] + "&nbsp;&nbsp;" + 
                    smsg["hour"] + ":" + smsg["min"] + ":" + 
                    smsg["sec"])
                }
            } else if(msg["type"] == "control") {
                if(msg["subtype"] == 'get_list_account') {
                    console.log(msg)
                    smsg = msg["data"] 
                    var list_account = "";
                    for (i in smsg) {
                        list_account += smsg[i]["account"] + "\r\n";
                    }

                    setText("acc_list_all", list_account)
                }
            }

        }
    } catch(err) {        
        console.log("parser ", err)
    }
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

function getSystemStatus() {
    if(SOCK == undefined) return

    msg = {
        type: 'control',
        subtype: 'get_system_info',        
    }

    SOCK.send(JSON.stringify(msg))
}


function changePassword() {
    
    if(SOCK == undefined) {
        console.log("sock is null")
        return
    }
        

    if(getText("acc_chpw_newpw") != 
        getText("acc_chpw_renewpw")) {
            setTextColor("Mật khẩu mới không hợp lệ !", true)
        return
    }

    if(getText("acc_chpw_renewpw") == "" ||
        getText("acc_chpw_newpw") == "" ||
        getText("acc_chpw_oldpw") == "") {
            setTextColor("Thông tin chưa đủ !", true)
            return
    }
    
    if(confirm("Đổi mật khẩu ?")) {
        msg = {
            type: 'change_password',
            data: {
                oldpassword : getText("acc_chpw_oldpw"),
                newpassword : getText("acc_chpw_newpw")
            }
        }

        console.log(msg)

        SOCK.send(JSON.stringify(msg))
    }
}



function addUser() {
    if(localStorage.role_ == "user") {
        setTextColor("Không có quyền thêm tài khoản mới", true)
        return
    }

    if(SOCK == undefined) return

    if(getText("acc_add_username") == "" ||
        getText("acc_add_password") == "") {
            setTextColor("Thông tin chưa đủ !", true)
            return
    }


    if(confirm("Thêm tài khoản: " + 
        getText("acc_add_username") + " mật khẩu: " + 
        getText("acc_add_password") + " ?")) {
        msg = {
            type: 'add_user',
            data: {
                username : getText("acc_add_username"),
                password : getText("acc_add_password"),            
                role : getText("acc_type")
            }
        }

        SOCK.send(JSON.stringify(msg))
    }
}

function resetPassword(username) {
    
    if(localStorage.role_ == "user") {
        setTextColor("Không có quyền reset mật khẩu", true)
        return
    }

    if(SOCK == undefined) return

    if(getText("acc_reset_del_username") == "") {
        setTextColor("Thông tin chưa đủ !", true)
        return
    }

    if(confirm("Reset mật khẩu tài khoản: " + 
        getText("acc_reset_del_username") + " ?")){
        msg = {
            type: 'reset_password',
            data: {
                username : getText("acc_reset_del_username"),
            }
        }

        SOCK.send(JSON.stringify(msg))
    }
}


function deleteUser(username) {

    if(localStorage.role_ == "user") {
        setTextColor("Không có quyền xóa tài khoản", true)
        return
    }

    if(SOCK == undefined) return

    if(getText("acc_reset_del_username") == "") {
        setTextColor("Thông tin chưa đủ !", true)
        return
    }

    if(confirm("Xóa tài khoản: " + getText("acc_reset_del_username") + " ?")) {
        msg = {
            type: 'del_user',
            data: {
                username : getText("acc_reset_del_username"),
            }
        }

        SOCK.send(JSON.stringify(msg))
    }
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

function getListAccount() {
    if(SOCK == undefined) return

    msg = {
        type: 'control',
        subtype: 'get_list_account'
    }

    SOCK.send(JSON.stringify(msg))
}

function loadUiInput() {
    if(localStorage.role_ == "user") {
        setDisabledInput("btn_adduser")
        setDisabledInput("btn_resetpw")
        setDisabledInput("btn_delacc")
	setDisabledInput("acc_type")
    } else if(localStorage.role_ == "admin") {
        setDisabledInput("btn_resetpw")
        // setDisabledInput("btn_delacc")
    } if(localStorage.role_ == "service") {
        setDisabledInput("btn_changepw")
    }
}


function deleteItem() {
    var select= document.getElementById("acc_type");
    select.removeChild(select.options[0])
}
