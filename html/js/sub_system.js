var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    // setStatus('Đang chờ kết nối ...', true)

    // if('WebSocket' in window) {
    //     SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
    //     if(SOCK) {
    //         SOCK.binaryType= "arraybuffer"
    //         SOCK.onopen = function() {
    //             setStatus('đã kết nối', false);
    //             getSystemStatus()
    //             loadUiInput()                
    //         }

    //         SOCK.onclose = function() {
    //             setStatus('không kết nối', true);
    //             SOCK=undefined
    //         }

    //         SOCK.onmessage = onMessage
    //         SOCK.onerror = function() {
    //             setStatus('lỗi kết nối', true);
    //             SOCK=undefined
    //         }
    //         } else {
    //         setStatus('Tao ws khong thanh cong')
    //     }
    // } else {
    //     setStatus('Trinh duyet khong ho tro ws')
    // }
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_system_info") {
                smsg = msg["data"];
                setText("system_ip", smsg["ipaddress"])
                setText("system_subnet", smsg["netmask"])
                setText("system_tinh", smsg["tinh"])
                setText("system_coso", smsg["coso"])
                setText("system_tram", smsg["tram"])
                setText("system_ftp_ip", smsg["serverip"])
                setText("system_ftp_username", smsg["username"])
                setText("system_ftp_password", "*****")
                setText("system_ftp_port", smsg["port"])
                setText("system_logdur", smsg["logdur"])

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
    document.getElementById(id).disabled = true;
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


function onReload() {
    getSystemStatus()
}


function onUpdate() {
    if(SOCK == undefined) return

    if(getText("system_ftp_password") == "")
    alert("chưa nhập password ")
    return

    msg = {
        type: 'control',
        subtype: 'set_system_info',
        data: {
            ipaddress: getText("system_ip"),
            netmask: getText("system_subnet"),
            tinh: getText("system_tinh"),
            coso: getText("system_coso"),
            tram: getText("system_tram"),
            serverip: getText("system_ftp_ip"),
            username: getText("system_ftp_username"),
            password: getText("system_ftp_password"),
            port: Number(getText("system_ftp_port")),
            logdur: Number(getText("system_logdur")),
            dhcp: getCheckbox("system_dhcp")
        }        
    }

    SOCK.send(JSON.stringify(msg))    
}


function onReset() {

    // if(localStorage.role_ == "supperuser" || 
    //     localStorage.role_ == "admin") {   

        var secret = prompt("Mật khẩu")
        if(localStorage.password_ == secret) {
            if(SOCK == undefined) return
            msg = {
                type: 'control',
                subtype: 'system_reboot',        
            }

            SOCK.send(JSON.stringify(msg))
        } else {
            alert("Mật khẩu không đúng")    
        } 
    // } else {
    //     alert("Không có quyền thực hiện !" + localStorage.username_)
    // }
}


function loadUiInput() {
    if(localStorage.role_ != "supperuser" && 
        localStorage.role_ != "admin") {
        setDisabledInput("btn_dongbo")
        setDisabledInput("btn_reset")
        setDisabledInput("btn_update")
        setDisabledInput("system_tinh")
        setDisabledInput("system_coso")
        setDisabledInput("system_tram")
        setDisabledInput("system_ip")
        setDisabledInput("system_subnet")
        setDisabledInput("system_dhcp")
        setDisabledInput("system_ftp_ip")
        setDisabledInput("system_ftp_username")
        setDisabledInput("system_ftp_password")
        setDisabledInput("system_ftp_port")
        setDisabledInput("system_logdur")
    }
}





