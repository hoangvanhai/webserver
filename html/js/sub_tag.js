var SOCK = undefined


document.addEventListener("DOMContentLoaded", function(){
    
    setStatus('Đang chờ kết nối ...', true)

    if('WebSocket' in window) {
        SOCK = new WebSocket("ws://"+window.location.hostname+":8081", 'raw-protocol')
        if(SOCK) {
            SOCK.binaryType= "arraybuffer"
            SOCK.onopen = function() {
                setStatus('Đã kết nối', false);
                getTagSetting(Number(localStorage.currTag_))
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

    loadUiInput()
    setBack(localStorage.username_)
    setTextLabel("id_username", "Tài khoản: " + localStorage.username_)

})

function onMessage(event) {    
    try {        
        msg = JSON.parse(event.data)  
        console.log(msg)      
        if(msg != undefined) {
            if(msg["type"] == "control" && 
            msg["subtype"] == "get_tag_info") {
                setTagContent(msg["tag_id"], msg["data"])
            } else if(msg["type"] == "set_tag_info")  {
                if(msg["status"] == "success") {
                    setTextColor("Lưu thông số thành công")
                } else {
                    setTextColor("Lưu thông số thất bại " + msg["msg"])
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
    setCheckbox("tsqt_baocao", msg["enable"])
    setText("tsqt_thongsodo", msg["sw"])
    setText("tsqt_motathongso", msg["desc"])
    setText("tsqt_donvitho", msg["inter_unit"])
    setText("tsqt_donvitieuchuan", msg["final_unit"])
    setText("daido_a", msg["coef_a"])
    setText("daido_b", msg["coef_b"])
    setText("daido_duoi", msg["min"])
    setText("daido_tren", msg["max"])
    setText("daido_canhbao", msg["alarm"])

    setText("tc_gttc_oxy", msg["o2_comp"])
    setText("tc_gttc_apsuat", msg["press_comp"])
    setText("tc_gttc_nhietdo", msg["temp_comp"])

    setText("tc_donvi_oxy", msg["o2_unit"])
    setText("tc_donvi_nhietdo", msg["temp_unit"])
    setText("tc_donvi_apsuat", msg["press_unit"])

    setComboIndex("tieuchuan_oxy", msg["ai_o2"])
    setComboIndex("tieuchuan_nhietdo", msg["ai_temp"])
    setComboIndex("tieuchuan_apsuat", msg["ai_press"])
    
    setComboIndex("tinhieu_loi", msg["error"])
    setComboIndex("tinhieu_baotri", msg["calib"])

    setCheckbox("tinhieu_chonloi", msg["has_error"])
    setCheckbox("tinhieu_chonbaotri", msg["has_calib"])

    setPinInputStatus();

    if(msg["ntram"] > 1) {
        var rowlab = document.getElementsByClassName("class_tag_tram");
        rowlab[0].style.display = '';  
        console.log("show ", msg["ntram"])      
    } else {
        var rowlab = document.getElementsByClassName("class_tag_tram");
        rowlab[0].style.display = 'none';        
        console.log("hide ", msg["ntram"])      
    }

    setComboIndex("so_tram", msg["tram"] - 1);
    
    if(msg["report"] == true) {
        setCheckbox("tsqt_baocao", true)
    } else {
        setCheckbox("tsqt_baocao", false)
    }
    if(msg["report2"] == true) {
        setCheckbox("tsqt_baocao2", true)
    } else {
        setCheckbox("tsqt_baocao2", false)
    }
    if(msg["final_type"] == 0) {
        setCheckbox("tc_chon_oxy", false)
        setCheckbox("tc_chon_nhietdo", false)
        setCheckbox("tc_chon_apsuat", false)
        setOxyStatus()        
        setTempStatus()
        setPressStatus();
    }
    else if(msg["final_type"] == 1) {
        setCheckbox("tc_chon_oxy", true)
        setOxyStatus()
    } else if(msg["final_type"] == 2) {
        setCheckbox("tc_chon_nhietdo", true)
        setCheckbox("tc_chon_apsuat", true)
        setTempStatus()
        setPressStatus();
    }
    
    if(msg["cal_revert"] == true) {
        setCheckbox("tc_chon_nghichdao", true)
    } else {
        setCheckbox("tc_chon_nghichdao", false)
    }

    if(msg["alarm_en"] == true) {
        setCheckbox("daido_chophepcb", true)
    } else {
        setCheckbox("daido_chophepcb", false)
    }
}

function loadUiInput() {
    if(localStorage.role_ != "service" && 
        localStorage.role_ != "admin") {
        setDisabledInput("btn_savetag")
    }

    // console.log("role = " + localStorage.role_)
    // if(localStorage.role_ == "admin") {
    //     console.log("delete admin")
    //     deleteItem()
    // }
}



function onSaveTag() {
    if(SOCK == undefined) return

    if(confirm("Lưu dữ liệu xuống datalogger ?")) {
        var ftype = 0
        if(getCheckbox("tc_chon_oxy")) {
            ftype = 1
        }

        if(getCheckbox("tc_chon_nhietdo") ||
            getCheckbox("tc_chon_nhietdo")) {
            ftype = 2
        }

        msg = {
            type: 'control',
            subtype: 'set_tag_info',
            tag_id: Number(localStorage.currTag_),
            data: {
                report: getCheckbox("tsqt_baocao"),
                report2: getCheckbox("tsqt_baocao2"),
                sw: getText("tsqt_thongsodo"),
                unit: getText("tsqt_donvitho"),
                desc: getText("tsqt_motathongso"), 
                        
                final_unit: getText("tsqt_donvitieuchuan"),
                inter_unit: getText("tsqt_donvitho"),
                coef_a:  Number(getText("daido_a")), 
                coef_b:  Number(getText("daido_b")),
                min:  Number(getText("daido_duoi")),
                max:  Number(getText("daido_tren")),
                alarm: Number(getText("daido_canhbao")),
                o2_comp:  Number(getText("tc_gttc_oxy")),
                temp_comp:  Number(getText("tc_gttc_nhietdo")),
                press_comp:  Number(getText("tc_gttc_apsuat")),

                ai_o2: getContent("tieuchuan_oxy"),
                ai_temp: getContent("tieuchuan_nhietdo"),
                ai_press: getContent("tieuchuan_apsuat"),

                o2_unit: getText("tc_donvi_oxy"),
                temp_unit: getText("tc_donvi_nhietdo"),
                press_unit: getText("tc_donvi_apsuat"),          
                
                calib: getContent("tinhieu_baotri"),
                error: getContent("tinhieu_loi"),
                has_error: getCheckbox("tinhieu_chonloi"),
                has_calib: getCheckbox("tinhieu_chonbaotri"),
                final_type: ftype,
                cal_revert: getCheckbox("tc_chon_nghichdao"),
                alarm_en: getCheckbox("daido_chophepcb"),
                tram: Number(getContent("so_tram"))
            }        
        }

        SOCK.send(JSON.stringify(msg))

        console.log(msg)
    }
}


function setOxyStatus() {
    if(getCheckbox("tc_chon_oxy")) {        
        setEnabledInput("tieuchuan_oxy")
        setEnabledInput("tc_gttc_oxy")
        setEnabledInput("tc_donvi_oxy")

        setDisabledInput("tieuchuan_apsuat")
        setDisabledInput("tc_gttc_apsuat")
        setDisabledInput("tc_donvi_apsuat")
        setDisabledInput("tieuchuan_nhietdo")
        setDisabledInput("tc_gttc_nhietdo")
        setDisabledInput("tc_donvi_nhietdo")
        setDisabledInput("tieuchuan_apsuat")

        setCheckbox("tc_chon_nhietdo", false)
        setCheckbox("tc_chon_apsuat", false)
    } else {
        setDisabledInput("tieuchuan_oxy")
        setDisabledInput("tc_gttc_oxy")
        setDisabledInput("tc_donvi_oxy")
        
    }
}

function setTempStatus() {
    if(getCheckbox("tc_chon_nhietdo")){
        setCheckbox("tc_chon_oxy", false)
        setCheckbox("tc_chon_apsuat", true)
        
        setCheckbox("tc_chon_oxy", false)
        setEnabledInput("tieuchuan_apsuat")
        setEnabledInput("tc_gttc_apsuat")
        setEnabledInput("tc_donvi_apsuat")

        setEnabledInput("tieuchuan_nhietdo")
        setEnabledInput("tc_gttc_nhietdo")
        setEnabledInput("tc_donvi_nhietdo")

        setDisabledInput("tieuchuan_oxy")
        setDisabledInput("tc_gttc_oxy")
        setDisabledInput("tc_donvi_oxy")

    } else {

        setCheckbox("tc_chon_apsuat", false)
        setDisabledInput("tieuchuan_apsuat")
        setDisabledInput("tc_gttc_apsuat")
        setDisabledInput("tc_donvi_apsuat")

        setDisabledInput("tieuchuan_nhietdo")
        setDisabledInput("tc_gttc_nhietdo")
        setDisabledInput("tc_donvi_nhietdo")
    }
}

function setPressStatus() {
    if(getCheckbox("tc_chon_apsuat")) {
        setCheckbox("tc_chon_oxy", false)

        setCheckbox("tc_chon_nhietdo", true)

        setEnabledInput("tieuchuan_apsuat")
        setEnabledInput("tc_gttc_apsuat")
        setEnabledInput("tc_donvi_apsuat")

        setDisabledInput("tieuchuan_oxy")
        setDisabledInput("tc_gttc_oxy")
        setDisabledInput("tc_donvi_oxy")

        setEnabledInput("tieuchuan_nhietdo")
        setEnabledInput("tc_gttc_nhietdo")
        setEnabledInput("tc_donvi_nhietdo")

    } else {
        setCheckbox("tc_chon_nhietdo", false)

        setDisabledInput("tieuchuan_nhietdo")
        setDisabledInput("tc_gttc_nhietdo")
        setDisabledInput("tc_donvi_nhietdo")

        setDisabledInput("tieuchuan_apsuat")
        setDisabledInput("tc_gttc_apsuat")
        setDisabledInput("tc_donvi_apsuat")
    }
}


function setPinInputStatus() {
    if(getCheckbox("tinhieu_chonbaotri")) {
        setEnabledInput("tinhieu_baotri")
    } else {
        setDisabledInput("tinhieu_baotri")
    }

    if(getCheckbox("tinhieu_chonloi")) {
        setEnabledInput("tinhieu_loi")
    } else {
        setDisabledInput("tinhieu_loi")
    }
}

