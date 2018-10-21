var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('Đã kết nối', false);
                getSystemStatus()
                loadUiInput()                
            }

            SOCK.onclose = function() {
                setStatus('Không kết nối', true);
                SOCK=undefined
            }

            SOCK.onmessage = onMessage
            SOCK.onerror = function() {
                setStatus('Lỗi kết nối', true);
                SOCK=undefined
            }
            } else {
            setStatus('Tao ws khong thanh cong')
        }
    } else {
        setStatus('Trinh duyet khong ho tro ws')
    }

    setTextLabel("id_username", "Tài khoản: " + localStorage.username_)
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)   
            
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_system_info") {
                smsg = msg["data"];
                setText("system_ip", smsg["ipaddress"])
                setText("system_netmask", smsg["netmask"])
                setText("system_tinh", smsg["tinh"])
                setText("system_coso", smsg["coso"])
                setText("system_tram", smsg["tram"])
                setText("system_ftp_ip", smsg["serverip"])
                setText("system_ftp_username", smsg["username"])
                setText("system_ftp_password", smsg["password"])              
                switch(smsg["logdur"]) {
                    case 1 :
                    setComboIndex("system_ftp_logdur", "0")
                    break;
                    case 2 :
                    setComboIndex("system_ftp_logdur", "1")
                    break;
                    case 3 :
                    setComboIndex("system_ftp_logdur", "2")
                    break;
                    case 4 :
                    setComboIndex("system_ftp_logdur", "3")
                    break;
                    case 5 :
                    setComboIndex("system_ftp_logdur", "4")
                    break;
                    default:
                    setComboIndex("system_ftp_logdur", "4")
                    break;
                }
            } else if(msg["type"] == "set_system_info") {
                if(msg["status"] == "success") {
                    setTextColor("Lưu tham số thành công", false)
                }
            }

            if(msg["type"] == "realtime_data") {
                smsg = msg["time"];
                if(smsg != undefined) {
                    setTextLabel("id_datetime", "Ngày: " + smsg["day"] + " - " + 
                    smsg["month"] + " - " + smsg["year"] + " Giờ: " + 
                    smsg["hour"] + " : " + smsg["min"] + " : " + 
                    smsg["sec"])
                }
            }
        }
    } catch(err) {        
        console.log("parser ", err)
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

    if(confirm("Lưu xuống logger ?")) {
        if(getText("system_ftp_password") == "") {
            setTextColor("Chưa nhập mật khẩu", true)
            return
        }

        var logdurval= Number(getContent("system_ftp_logdur"))

        msg = {
            type: 'control',
            subtype: 'set_system_info',
            data: {
                ipaddress: getText("system_ip"),
                netmask: getText("system_netmask"),
                tinh: getText("system_tinh"),
                coso: getText("system_coso"),
                tram: getText("system_tram"),
                serverip: getText("system_ftp_ip"),
                username: getText("system_ftp_username"),
                password: getText("system_ftp_password"),            
                logdur: logdurval,
            }        
        }

        console.log(msg)
        SOCK.send(JSON.stringify(msg))   
    } 
}


function onReset() {
    if(confirm("Khởi động lại logger ?")) {
        if(localStorage.password_ == secret) {
            if(SOCK == undefined) return
            msg = {
                type: 'control',
                subtype: 'system_reboot',        
            }

            SOCK.send(JSON.stringify(msg))
        } else {
            setTextColor("Mật khẩu không đúng", true)   
        } 
    }
}


function loadUiInput() {
    if(localStorage.role_ != "supperuser" && 
        localStorage.role_ != "admin") {
        setDisabledInput("btn_update")
        setDisabledInput("btn_reset")
    }
}





