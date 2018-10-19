
var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('Không kết nối', true);    
    // if('WebSocket' in window){
    //     SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
    //     if(SOCK){
    //         SOCK.binaryType = "arraybuffer"
    //         SOCK.onopen = function(){
    //             setStatus('Kết nối thành công', false);
    //             getSystemStatus()
    //         }
    //         SOCK.onclose = function(){
    //             setStatus('Không kết nối', true);
    //             SOCK = undefined
    //         }
    //         SOCK.onmessage = onMessage
    //         SOCK.onerror = function(){
    //             setStatus('Lỗi kết nối', true);
    //             SOCK = undefined
    //         }
    //     }else{
    //         setStatus('Trình duyệt không hỗ trợ', true);
    //     }
    // }else{
    //     setStatus('Trình duyệt không hỗ trợ', true);
    // }

    setText("id_username", 'Tài khoản: root')
    setText("id_datetime", "Ngày: " + "20" + " - " + 
    "10" + " - " + "2018" + " Giờ: " + 
    "22" + " : " + "21" + " : " + "18")
    setText("id_status_tinh", 'Text')
    setText("id_status_coso", 'Text')
    setText("id_status_tram", 'Text')
    setText("id_status_ip", 'Text')
    setText("id_status_subnetmask", 'Text')
    setText("id_status_ftp_ip", 'Text')
    setText("id_status_ftp_username", 'Text')
    setText("id_status_ftp_logdur", 'Text')
})

function onMessage(event){
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_system_info") {
                smsg = msg["data"];
                setText("id_status_ip", smsg["ipaddress"])
                setText("id_status_subnetmask", smsg["netmask"])
                setText("id_status_tinh", smsg["tinh"])
                setText("id_status_coso", smsg["coso"])
                setText("id_status_tram", smsg["tram"])
                setText("id_status_ftp_ip", smsg["serverip"])
                setText("id_status_ftp_username", smsg["username"])                
                setText("id_status_ftp_logdur", smsg["logdur"])
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
    document.getElementById(id).innerHTML = '<span>' + val + "</span>"
}
function getCheckbox(id){
    return document.getElementById(id).checked
}
function setCheckbox(id, val){
    document.getElementById(id).checked = val
}
function setStatus(val, warn) {
    if (warn == true) {
        document.getElementById("id_connstatus").innerHTML = '<span style="color:red">' + val + "</span>"
    }else{
        document.getElementById("id_connstatus").innerHTML = '<span style="color:green">' + val + "</span>"
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