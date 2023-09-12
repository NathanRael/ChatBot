import {chatData, dictionary, existedDataName, onlineUsersData} from './chatData.js';

// let chatBox = document.getElementById("reply");
let userInput = document.getElementById("userInputEl");
let reply = document.getElementById("reply");

let sendMessageBtn = document.getElementById("sendMessage");
let ellipsis = document.getElementById("ellipsis");
let profilPopup = document.querySelector(".profilPopup");
let mobileEl = document.querySelector(".mobile");
let chatTitle = document.querySelector(".chatTitle");

let trashIcon = document.querySelector("#trash");


// let onlineUserNode = document.querySelector
let userBox ;//les utilisateur en ligne


let canType = true;
let is_messageNotSeen = true;//l'utilisateur n'a pas encore cliqué au message non lu
let notSeenMessageCount = 0;



let dataType;
let dataIndictionary;
let messageDataHtml = ``;
let messageData = {
    user : [],
    bot :[]
};
// let is_dataSaved = false;


ellipsis.addEventListener("click", ()=>{
    profilPopup.classList.toggle("toggleProfilpopup");
});

chatTitle.addEventListener("click",()=>{
    mobileEl.classList.toggle("togglemobile");
    
});

trashIcon.addEventListener("click", ()=>{
    clearData();
});



/***refreh functions*********** */

function refreshMessageCount(){//afficher le nombre de message non lu

    let messageCountText = document.querySelector("#messageCount");
    // let allMessages = 0;

    if (is_messageNotSeen){//en début
        for (let i=0; i<=onlineUsersData.length-1 ;i++){
            if (onlineUsersData[i].class.includes("notSeenMessage")){
                notSeenMessageCount +=1;
            }
            // allMessages +=1;
        }
        messageCountText.textContent = notSeenMessageCount;
    }else if (notSeenMessageCount === 0){
        messageCountText.style.visibility = "hidden";
    }else{
        messageCountText.style.visibility = "visible";
        messageCountText.textContent = notSeenMessageCount;
    }
   

    // messageCountText.textContent = ;
}



function refreshMessage(){//affiche le dernier message du bot dans l'onglet message

    let botMessageText = document.querySelector("#botMessage");

    
    let lastmessageDataHtml = messageData["bot"][messageData["bot"].length-1];
    console.log("last m dta : " + lastmessageDataHtml)
    if (lastmessageDataHtml.length > 30){
        let partMessage = lastmessageDataHtml.replace(lastmessageDataHtml.slice(20), "...");
        botMessageText.textContent = partMessage ;
        console.log("Message coupé :" + partMessage)
    }else{
        botMessageText.textContent = lastmessageDataHtml;
        console.log("Message coupé :" + lastmessageDataHtml)
    }

    
}

function refreshOnlineUser(){//afficher les utilisateurs en ligne

    let onlineUsersBox = document.querySelector(".onlineUsers");
    

    for ( let i = 0 ; i <= onlineUsersData.length-1;i++){
        onlineUsersBox.innerHTML += `
        <div class="userBox ${onlineUsersData[i].class}">
            <div class="content">
                <div class="image">
                    <img src="${onlineUsersData[i].imageProfile}" alt="">
                    <div class="onlineIcon"></div>
                </div>
                <div class="userText">
                    <h4 class="name">${onlineUsersData[i].names}</h4>
                    <p class="message">${onlineUsersData[i].message}</p>
                </div>

            </div>
        
            <div class="hours">${onlineUsersData[i].hours}</div>
        </div>
        
        `
    }

    userBox = document.querySelectorAll(".userBox");//car on va utiliser la fonction forEach

    userBox.forEach(element=>{ //pour savoir si le message est lu par l'user


        element.addEventListener("click", ()=>{
            
            if (element.classList.contains("notSeenMessage")){

                element.classList.replace("notSeenMessage","seenMessage");
                notSeenMessageCount -=1;
                is_messageNotSeen = false;
                refreshMessageCount();
                console.log("Element : Vu")
            }
        });
    });
}





/*********Bot controller */

sendMessageBtn.addEventListener("click", (e)=>{
    const userMessage = userInput.value.trim();
    if (canType === true){
        
        renderMessage(userMessage,"user");
        generateBotMessage(userMessage);
        userInput.value = "";
    }
})

userInput.addEventListener("keypress", (e)=>{
    const userMessage = e.target.value.trim();

    if (e.key == "Enter" && canType === true){ 
        console.log("User :" + userMessage);
        renderMessage(userMessage,"user");
        generateBotMessage(userMessage);
        userInput.value = "";
    }
});

function generateBotMessage(userMessage){ //La reponse du bot 
    let lowerCaseMessage = userMessage.toLowerCase();

    function verifyExistedDataName(){//verifie si les données sont dans le chatData pour que le bot puisent répondre ()

        for (let dataName of existedDataName){//amélioration des if et else 
            if (lowerCaseMessage.includes(verifyDictionary(dataName))){
                // renderMessage(getRandomMessage(dataName),"bot");
                dataIndictionary = verifyDictionary(dataName);
                return dataName;
                break;
            }
        }
    };

    function verifyDictionary(dataName){//Pour verifier que si les mots utilisées par l'user est dans le dicos( ex : bonjour est dans salutation)
        for (let data of dictionary[dataName]){
            if (lowerCaseMessage.includes(data)){
                return data;
                break;
            }  
        }
    };
    

    // verifyExistedDataName();

    dataType = verifyExistedDataName();
    console.log("Data in dic : "+ dataIndictionary)
    console.log("dataType : " + dataType)

    if (lowerCaseMessage.includes(dataIndictionary)){
        renderMessage(getRandomMessage(dataType),"bot");
        
    }else{
        renderMessage(getRandomMessage("general"),"bot");
    }
    userMessage = "";
};


function getRandomMessage(type){
    const response = chatData[type];
    return  response[Math.floor(Math.random() * response.length)];
};


function renderMessage(message,generator){//afficher les messages à l'ecran

    canType = false;//l'utilisateur ne peut pas encpore envoyer d'autres messages

    if (generator === "user"){
        setTimeout(()=>{
            reply.innerHTML += `<li class="userQuestion"><span> ${message}</span></li>`
            // console.log("message Data :" + messageDataHtml);
            // reply.scrollTo(0,reply.scrollHeight);
            reply.scrollTop = reply.scrollHeight;
            saveData("user",reply.innerHTML,message);
        }, 500);
        
    }else if (generator === "bot"){
        setTimeout(()=>{
            reply.innerHTML += `<li class="botReply"><span>Bot : rechreche ...</span></li>`
            reply.scrollTop = reply.scrollHeight;
        },800)
        setTimeout(()=>{
            
            reply.innerHTML += `<li class="botReply"><span>Bot : ${message}</span></li>`
            // reply.scrollTo(0,reply.scrollHeight);
            reply.scrollTop = reply.scrollHeight;
            saveData("bot",reply.innerHTML,message);
            canType = true;

        }, 2000);   
    }

    

    
   
}

/*******data funtions */

function saveData(name, htmlData, data){
    if (name === "user"){
        messageData["user"].push(data);
        
    }else if (name === "bot"){
        messageData["bot"].push(data);
        refreshMessage();
    }

    messageDataHtml = htmlData;
    
    localStorage.setItem("messageDataHtml", messageDataHtml); // if string JSON.stringnify(lowerCaseMessage)
    
}

function loadData(){
    messageDataHtml = localStorage.getItem("messageDataHtml");
    reply.innerHTML = messageDataHtml;
    
}


function clearData(){
    localStorage.clear();
    reply.innerHTML = "";
    console.log("Data cleaned succesfully");

}



loadData();

if (is_messageNotSeen){
    refreshMessageCount();
}

refreshOnlineUser();



