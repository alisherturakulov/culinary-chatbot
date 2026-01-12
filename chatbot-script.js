//Script for chatbot

console.log("Hello World");

const chatBoxTab = document.getElementById("chatBotTab");
chatBoxTab.addEventListener("click", toggleChatBox);


//function definitions

/**
 * adds/removes the openedChatBox class from styles to make the chatBox
 * visible or not
 */
function toggleChatBox(){
    const chatBox = document.getElementById("chatBotBox");
    chatBox.classList.toggle("openedChatBox");
    console.log("openedChatBox");
}

