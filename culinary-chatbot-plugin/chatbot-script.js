// //Script for chatbot to be enqueued in php


document.addEventListener("DOMContentLoaded", () => {
    const chatBoxTab = document.querySelector(".chatBotTab");
    const sendButton = document.querySelector(".chatBotButton");
    const inputField = document.querySelector(".chatBotInput");

    // Toggle Chat
    chatBoxTab.addEventListener("click", () => {
        const chatBox = document.querySelector(".chatBotBox");
        chatBox.classList.toggle("openChatBox");
        
        let tabText = chatBoxTab.textContent;
        chatBoxTab.textContent = tabText.includes("Open") ? "Close Chatbot" : "Open Chatbot";
    });

    // Send Message Logic
    async function handleSend() {
        const questionText = inputField.value.trim();
        if (!questionText) return;

        // Add User Message to UI
        addMessage(questionText, "userMessage");
        inputField.value = ""; // Clear input
        sendButton.disabled = true; // Prevent double click

        //Send to WordPress Backend
        try {
            const formData = new FormData(); //formdata object hodls key value pairs to send via fetch request
            formData.append('action', 'cac_send_message'); //set action to wp_ajax hook which handles api request
            formData.append('message', questionText);
            formData.append('security', cacData.nonce);    // Security nonce

            const response = await fetch(cacData.ajax_url, {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                addMessage(result.data.reply, "botMessage");
            } else {
                addMessage("Error: " + (result.data.message || "Unknown error"), "botMessage");
            }

        } catch (err) {
            console.error("Network Error:", err);
            addMessage("Error: Could not reach the server.", "botMessage");
        } finally {
            sendButton.disabled = false;
        }
    }

    /**
	 * adds a p element as a user or bot message to the chat 
	 * param {string} questionText
	 * param {string} className 
	*/
    function addMessage(text, className) {
        const p = document.createElement("p");
        p.classList.add(className);
        p.textContent = text;
        document.querySelector(".chatBotMessageBox").appendChild(p);
        
        // Auto scroll to bottom
        const box = document.querySelector(".chatBotMessageBox");
        box.scrollTop = box.scrollHeight;
    }
	
	

    // Event Listeners
    sendButton.addEventListener("click", handleSend);
    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });
});