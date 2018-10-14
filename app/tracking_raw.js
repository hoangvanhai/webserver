var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('đã kết nối', false);
                setStreaming("on")
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
            console.log(msg)
            if(msg["type"] == "realtime_data") {
                smsg =  msg["data"]
                if(msg != undefined) {
                    setDataRawRow(smsg[0], 1)
                    setDataRawRow(smsg[1], 2)
                    setDataRawRow(smsg[2], 3)
                    setDataRawRow(smsg[3], 4)
                    setDataRawRow(smsg[4], 5)
                    setDataRawRow(smsg[5], 6)
                    setDataRawRow(smsg[6], 7)
                    setDataRawRow(smsg[7], 8)
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

function setStatus(val, warn) {
    if (warn == true) {
        console.log("connected")
        document.getElementById("connecttion_status").innerHTML = '<span style="color:red">' + val + "</span>"
    }else{
        console.log("disconnected")
        document.getElementById("connecttion_status").innerHTML = '<span style="color:green">' + val + "</span>"
    }
}


function setDataRawRow(msg, row) {
    document.getElementById("data_raw_sw_name_p" + row).innerHTML = '<span>' + msg["sw"] + "</span>"
    document.getElementById("data_raw_value_p" + row).innerHTML = '<span>' + msg["raw"] + "</span>"
    document.getElementById("data_raw_unit_p" + row).innerHTML = '<span>' + msg["unit"] + "</span>"
    document.getElementById("data_raw_status_p" + row).innerHTML = '<span>' + msg["status"] + "</span>"    
}


function setStreaming(stream) {
    if(SOCK == undefined) return

    msg = {
        type: 'control',
        subtype: 'streaming',
        data: {
            streaming: stream
        }
    }

    SOCK.send(JSON.stringify(msg))
}







