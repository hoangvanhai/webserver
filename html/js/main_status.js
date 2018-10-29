
var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('Đang kết nối ...', true);    
    if('WebSocket' in window){
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK){
            SOCK.binaryType = "arraybuffer"
            SOCK.onopen = function(){
                setStatus('Đã kết nối', false);
                getSystemStatus()
            }
            SOCK.onclose = function(){
                setStatus('Không kết nối', true);
                SOCK = undefined
            }
            SOCK.onmessage = onMessage
            SOCK.onerror = function(){
                setStatus('Lỗi kết nối', true);
                SOCK = undefined
            }
        }else{
            setStatus('Trình duyệt không hỗ trợ', true);
        }
    }else{
        setStatus('Trình duyệt không hỗ trợ', true);
    }

    setTextLabel("id_username", "Tài khoản: " + localStorage.username_)
})

function onMessage(event){
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_system_info") {
                smsg = msg["data"];
                setTextLabel("id_status_ip", smsg["ipaddress"])
                setTextLabel("id_status_subnetmask", smsg["netmask"])
                setTextLabel("id_status_tinh", smsg["tinh"])
                setTextLabel("id_status_coso", smsg["coso"])
                setTextLabel("id_status_tram", smsg["tram"])
                setTextLabel("id_status_ftp_ip", smsg["serverip"])
                setTextLabel("id_status_ftp_username", smsg["username"])                
                setTextLabel("id_status_ftp_logdur", smsg["logdur"] + " phút")
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