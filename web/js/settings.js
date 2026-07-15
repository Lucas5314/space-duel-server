const music=document.getElementById("music");
const sound=document.getElementById("sound");
const vibration=document.getElementById("vibration");
const quality=document.getElementById("quality");

music.checked=localStorage.getItem("music")!=="false";
sound.checked=localStorage.getItem("sound")!=="false";
vibration.checked=localStorage.getItem("vibration")!=="false";

quality.value=localStorage.getItem("quality") || "high";

music.onchange=()=>{

    localStorage.setItem("music",music.checked);

};

sound.onchange=()=>{

    localStorage.setItem("sound",sound.checked);

};

vibration.onchange=()=>{

    localStorage.setItem("vibration",vibration.checked);

};

quality.onchange=()=>{

    localStorage.setItem("quality",quality.value);

};

document.getElementById("back").onclick=()=>{

    location.href="profile.html";

};