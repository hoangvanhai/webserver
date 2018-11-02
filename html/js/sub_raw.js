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


function setDataRawRow(msg, row) {

    var inter_value = msg["inter"];
    var alarm_value = msg["alarm"];

    if(inter_value < 0) inter_value = 0


    if(inter_value < alarm_value) {
        setBarChartPercen("bar_p" + row, 100 * inter_value / msg["max"], false)
        
    } else {
        if(msg["alarm_en"] == true) {
            setBarChartPercen("bar_p" + row, 100 * inter_value / msg["max"], true)
        }
    }
    setTextLabel("bar_name_p" + row, msg["sw"])
    setTextLabel("bar_value_p" + row, msg["inter"].toFixed(2))
    setTextLabel("bar_unit_p" + row, msg["inter_unit"])        
    
    setTextLabel("bar_min_p" + row, msg["min"])
    setTextLabel("bar_max_p" + row, msg["max"])    

    // if(msg["status"] == "00") {
    //     setTextBarColor("bar_p" + row, "", false) 
    // } else if(msg["status"] == "01") {
    //     setTextBarColor("bar_p" + row, 'Đang hiệu chỉnh', false) 
    // } else if(msg["status"] == "02") {
    //     setTextBarColor("bar_p" + row, "Lỗi", true) 
    // }   

    setTextBarColor("bar_p" + row, "Lỗi", true) 
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
            rate: Number(getContent("raw_update_time"))
        }
    }

    SOCK.send(JSON.stringify(msg))
}





