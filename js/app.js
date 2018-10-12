var SOCK = undefined

document.addEventListener("DOMContentLoaded", function(){
    setStatus('CONNECTING ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('REALTIME STREAMING', false);
                onReload()
                
            }

            SOCK.onclose = function() {
                setStatus('OFFLINE', true);
                SOCK=undefined
            }

            SOCK.onmessage = onMessage
            SOCK.onerror = function() {
                setStatus('CONNECTTION ERROR', true);
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
            

        }
    } catch(err) {        
        console.log("parser ", err)
    }
}


function onUpdate(){
    if(SOCK == undefined) return

    // check input
    if (!getCheckbox("net_dhcp") && getText("net_address").length == 0 && getText("net_mask").length == 0){
        alert("Nhập địa chỉ IP mà Mask của thiết bị")
        return
    }

    var secret = prompt("Mật khẩu")

    msg = {
        action: "post",
        secret: secret,
        data :{
            network: {
                dhcp: getCheckbox("net_dhcp"),
                address: getText("net_address"),
                mask: getText("net_mask"),
                router: getText("net_router")
            }            
        }
    }
    SOCK.send(JSON.stringify(msg))
}

function onReload(){
    if(SOCK == undefined) return


    SOCK.send(JSON.stringify(msg))
}

function onReset(){
    if(SOCK == undefined) return
    var secret = prompt("Mật khẩu")
    msg = {
        action: 'reset',
        secret: secret
    }

    SOCK.send(JSON.stringify(msg))
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











