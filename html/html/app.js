function move() {
    console.log("start move")
    var elem = document.getElementById("bar");   
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
}


function setProgressValue(id, percen) {
    document.getElementById("bar").style.width = percen + '%'     
}


function set50() {
    setProgressValue("bar", 50)
}


function myFunction() {
    document.getElementById("mySelect").selectedIndex = "2";
}

function setText(id, val) {
    document.getElementById(id).innerText = val;
}


function getContent() {
    var value = document.getElementById("mySelect").value;
    setText("index_content", value)
}

function onChanged() {
    var value = document.getElementById("mySelect").value;
    setText("index_content", value)
}