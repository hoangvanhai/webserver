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
                forceBack()
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
    setBack(localStorage.username_)
    setTextLabel("id_username", "Tài khoản: " + localStorage.username_)
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)   
    
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_system_info") {
                smsg = msg["data"];
                setTextLabel("system_ip", smsg["ipaddress"])                
                setTextLabel("system_netmask", smsg["netmask"])
                setText("system_tinh", smsg["tinh"])
                setText("system_coso", smsg["coso"])
                setText("system_tram", smsg["tram"])
                setText("system_tram_2", smsg["tram2"])
                switch(smsg["ntram"]) {
                    case 0:
                    case 1: {
                    setComboIndex("system_so_tram", "0")
                    var elements = document.getElementsByClassName('class_sub_system');
                    elements[0].style.display = 'none';
                    }
                    break;
                    case 2: {
                    setComboIndex("system_so_tram", "1")
                    var elements = document.getElementsByClassName('class_sub_system');
                    elements[0].style.display = '';            
                    }
                    break;
                }
                setText("system_ftp_ip", smsg["serverip"])
                setText("system_folder", smsg["prefix"])
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


                setText("system_ftp_ip2", smsg["serverip2"])
                setText("system_folder2", smsg["prefix2"])
                setText("system_ftp_username2", smsg["username2"])
                setText("system_ftp_password2", smsg["password2"])              
                switch(smsg["logdur2"]) {
                    case 0.5 :
                    setComboIndex("system_ftp_logdur2", "0.5")
                    break;
                    case 1 :
                    setComboIndex("system_ftp_logdur2", "1")
                    break;
                    case 2 :
                    setComboIndex("system_ftp_logdur2", "2")
                    break;
                    case 3 :
                    setComboIndex("system_ftp_logdur2", "3")
                    break;
                    case 4 :
                    setComboIndex("system_ftp_logdur2", "4")
		            break;
                    case 5 :
                    setComboIndex("system_ftp_logdur2", "5")
                    break;
                    default:
                    setComboIndex("system_ftp_logdur2", "5")
                    break;
                }

                if(smsg["enable"] == true) {
                    setCheckbox("system_ftp_active", true)
                } else {
                    setCheckbox("system_ftp_active", false)
                }
    
                if(smsg["enable2"] == true) {
                    setCheckbox("system_ftp_active2", true)
                } else {
                    setCheckbox("system_ftp_active2", false)
                }


            } else if(msg["type"] == "set_system_info") {
                if(msg["status"] == "success") {
                    setTextColor("Lưu tham số thành công", false)
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

    if(confirm("Lưu cấu hình ?")) {
        if(getText("system_ftp_password") == "") {
            setTextColor("Chưa nhập mật khẩu", true)
            return
        }

        var logdurval= Number(getContent("system_ftp_logdur"))
        var logdurval2= Number(getContent("system_ftp_logdur2"))

        msg = {
            type: 'control',
            subtype: 'set_system_info',
            data: {
                // ipaddress: getText("system_ip"),
                // netmask: getText("system_netmask"),
                tinh: getText("system_tinh"),
                coso: getText("system_coso"),
                tram: getText("system_tram"),
                tram2: getText("system_tram_2"),
                ntram: Number(getContent("system_so_tram")),
                enable: getCheckbox("system_ftp_active"),
                serverip: getText("system_ftp_ip"),
                prefix: getText("system_folder"),
                username: getText("system_ftp_username"),
                password: getText("system_ftp_password"),            
                logdur: logdurval,

                enable2: getCheckbox("system_ftp_active2"),
                serverip2: getText("system_ftp_ip2"),
                prefix2: getText("system_folder2"),
                username2: getText("system_ftp_username2"),
                password2: getText("system_ftp_password2"),            
                logdur2: logdurval2,
            }        
        }

        console.log(msg)
        SOCK.send(JSON.stringify(msg))   
    } 
}


function onReset() {
    if(confirm("Khởi động lại logger ?")) {        

        if(SOCK == undefined) return

        msg = {
            type: 'control',
            subtype: 'system_reboot',        
        }

        SOCK.send(JSON.stringify(msg))
    }
}



function loadUiInput() {
    if(localStorage.role_ != "service" && 
        localStorage.role_ != "admin") {
        setDisabledInput("btn_update")
        setDisabledInput("btn_reset")
    }
}


function statOnchange() {    
    if(document.getElementById("system_so_tram").value == 1) {
        var elements = document.getElementsByClassName('class_sub_system');
        elements[0].style.display = 'none';
        console.log("hidden")    
    } else {
        var elements = document.getElementsByClassName('class_sub_system');
        elements[0].style.display = '';

        console.log("show")    
    }
}




