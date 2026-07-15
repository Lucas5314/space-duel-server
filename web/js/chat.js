const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const messages = document.getElementById("messages");



button.onclick = ()=>{


    let text = input.value.trim();


    if(text === "") return;



    let div = document.createElement("div");


    div.className = "message me";


    div.innerHTML = text;



    messages.appendChild(div);



    input.value="";



    messages.scrollTop = messages.scrollHeight;


};





input.addEventListener("keydown",(e)=>{


    if(e.key==="Enter"){

        button.click();

    }


});