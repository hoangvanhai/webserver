var SOCK = undefined

var username_
var password_
var role_

document.addEventListener("DOMContentLoaded", function(){
    
    

    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('đã kết nối', false);
                getTagSetting(1)
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

    // console.log("username: " + localStorage.username_ + " role: " + localStorage.role_)
    //setText("user_name", localStorage.username)
})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)        
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_tag_info") {
                setTagContent(msg["tag_id"], msg["data"])
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

function getTagSetting(tag) {
    if(SOCK == undefined) return

    msg = {
        type: 'control',
        subtype: 'get_tag_info',                
        tag_id: tag
    }

    SOCK.send(JSON.stringify(msg))
}



function setTagContent(tag, msg) {
    setCheckbox("baocao_p" + tag, msg["enable"])
    setText("thongsodo_p" + tag, msg["sw"])
    setText("mota_thongso_p" + tag, "day là mô tả thông số")
    setText("donvido_p" + tag, msg["unit"])
    setText("gioihantren_p" + tag, "gioi han tren")
    setText("gioihanduoi_p" + tag, "gioi han duoi")
    setText("hamtinh_p" + tag, "Ax+B")
    setText("A_p" + tag, msg["coeff"])
    setText("B_p" + tag, msg["start"])
    setText("daidoduoi_p" + tag, msg["min"])
    setText("daidotren_p" + tag, msg["max"])
    setText("baotri_p" + tag, msg["calib"])
    setText("error_p" + tag, msg["error"])
}





