var SOCK = undefined


document.addEventListener("DOMContentLoaded", function(){
    
    loadUiInput()

    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('đã kết nối', false);
                getTagSetting(Number(localStorage.currTag_))
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
        console.log(msg)      
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
    setCheckbox("baocao", msg["enable"])
    setText("thongsodo", msg["sw"])
    setText("mota_thongso", "day là mô tả thông số")
    setText("donvido", msg["unit"])
    setText("gioihantren", "gioi han tren")
    setText("gioihanduoi", "gioi han duoi")
    setText("hamtinh", "Ax+B")
    setText("A_p", msg["coeff"])
    setText("B_p", msg["start"])
    setText("daidoduoi", msg["min"])
    setText("daidotren", msg["max"])
    setText("baotri", msg["calib"])
    setText("error", msg["error"])

    if(msg["calib"] != "") {
        setCheckbox("checkbaotri", true)
    } else {
        setCheckbox("checkbaotri", false)
    }

    if(msg["error"] != "") {
        setCheckbox("checkerror", true)
    } else {
        setCheckbox("checkerror", false)
    }
}




function loadUiInput() {
    if(localStorage.role_ != "supperuser" && 
        localStorage.role_ != "admin") {
            setDisabledInput("btn_save_tag")
        }
}



function onSaveTag() {
    if(SOCK == undefined) return

    var str_baotri, str_error

    if(getCheckbox("checkbaotri")) {
        str_baotri = getText("baotri")
    } else {
        str_baotri = ""
    }

    if(getCheckbox("checkerror")) {
        str_error = getText("error")
    } else {
        str_error = ""
    }

    

    msg = {
        type: 'control',
        subtype: 'set_tag_info',
        tag_id: Number(localStorage.currTag_),
        data: {
            enable: getCheckbox("baocao"),
            sw: getText("thongsodo"),
            unit: getText("donvido"),
            desc: getText("mota_thongso"),            
            limup: Number(getText("gioihantren")),
            limdown: Number(getText("gioihanduoi")),
            func: getText("hamtinh"),
            coeff: Number(getText("A_p")),
            start: Number(getText("B_p")),
            max: Number(getText("daidotren")),
            min: Number(getText("daidoduoi")),            
            calib: str_baotri,
            error: str_error            
        }        
    }

    SOCK.send(JSON.stringify(msg))

    console.log(msg)
}