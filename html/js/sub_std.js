var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('Đã kết nối', false);
                setStreaming("on")
            }

            SOCK.onclose = function() {
                setStatus('Không kết nối', true);
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

    setTextLabel("id_username", "Tài khoản: " + localStorage.username_)
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            console.log(msg)
            if(msg["type"] == "realtime_data") {
                smsgdata =  msg["data"]
                if(smsgdata != undefined) {
                    setDataRawRow(smsgdata[0], 1)
                    setDataRawRow(smsgdata[1], 2)
                    setDataRawRow(smsgdata[2], 3)
                    setDataRawRow(smsgdata[3], 4)
                    setDataRawRow(smsgdata[4], 5)
                    setDataRawRow(smsgdata[5], 6)
                    setDataRawRow(smsgdata[6], 7)
                    setDataRawRow(smsgdata[7], 8)
                }
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


function setDataRawRow(msg, row) {
    
    setTextLabel("data_std_sw_name_p" + row, msg["sw"])

    var final_value = msg["final"];
    var alarm_value = msg["alarm"];

    if(final_value < 0) final_value = 0

    
    if(final_value < alarm_value) {
        setTextLabelColor("data_std_value_p" + row, final_value.toFixed(2), false)
        setBarChartPercen("bar_p" + row, 100 * final_value / msg["max"], false)
    } else {
        setTextLabelColor("data_std_value_p" + row, final_value.toFixed(2), true)
        setBarChartPercen("bar_p" + row, 100 * final_value / msg["max"], true)
    }


    setTextLabel("bar_value_unit_p" + row, final_value.toFixed(2) + " " + msg["final_unit"])
    setTextLabel("bar_min_p" + row, msg["min"])
    setTextLabel("bar_max_p" + row, msg["max"])    

    setTextLabel("data_std_unit_p" + row, msg["final_unit"])
    setTextLabel("data_std_status_p" + row, msg["status"]) 

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



function onChangedUpdateRate() {
    if(SOCK == undefined) return

    msg = {
        type: 'control',
        subtype: 'update_rate',
        data: {
            rate: Number(getContent("std_update_time"))
        }
    }

    SOCK.send(JSON.stringify(msg))
}


