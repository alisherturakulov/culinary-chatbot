# Chatbot for Culinary Argan Oil Website

## WordPress Plugin Instructions:  
 - use the `culinary-chatbot-plugin.zip` file to install through wp admin; or copy the plugin folder into the plugins/ directory  
 - add: `define( 'GEMINI_API_KEY', '<Key>');` to wp-config.php 
 - Activate the plugin from the Plugins tab of wp admin
 - To use the OpenAI version, replace `culinary-chatbot-plugin.php` with `culinary-chatbot-pluginOpenAI.php` and define `OPENAI_API_KEY` instead
  
## Instrucitons To Test  
 - For running server side js files: Nodejs 24
 	- packages: dotenv, google/genai, openai
 	- install by running npm install in the project directory
 - To run the scripts, API keys are required
 	- Gemini api key for chatbot-script2.js
 	- OpenAI api key for chatbot-script.js
 	- Add then to .env file as GEMINI_API_KEY="key" or OPENAI_API_KEY="key" on newlines
 - To run server scripts: node chatbot-script.js
 - Then, go to the form page: (https://alisherturakulov.github.io/culinary-chatbot/nodejs_chatbot/form-page.html)[https://alisherturakulov.github.io/culinary-chatbot/nodejs_chatbot/form-page.html] and you can enter questions into the chat
 
## Features
 - Chatbot UI behaves like the accessibility tool UI
 - Gemini API used for the model in chatbot-script2; OpenAI used in chatbot-script.js
 - Company info for the chatbot is provided as instructions in a string
 - Instructions include guidelines and guardrails for behavior


## Timeline
  
-  Implement the basic HTML of the form popup page  
  
-  Implement the backend api script  
  
-  Implement frontend script for sending inputs via requests  
  
-  Backend sends back model response and checks for errors  
  
-  Gemini and OpenAI api model scripts work with api keys  
  
-  Rate limiting on the frontend; questions cant be submitted until the most recent request is answered  
  
-  In progress: Backend rate limiting using cookies to track requests from a given client; request quota resets every hour  

 ## Sample Question Answer:
 - Question: what is argan oil?
  
 - Response: Culinary Argan Oil is a high-quality, extra virgin, org
 anic cold-pressed oil made from kernels wild-harvested in the Arg
 an Bio-Reservoir around Taroudant. The process involves hand-crac
 king the fruits, artisanal roasting by a 'maître torréfacteur,' a
 nd small-batch cold pressing with rigorous filtration. This resul
 ts in a luminous oil with rich hazelnut and pistachio notes and a
 crisp finish, intended to enhance cooking experiences with its f
 lavor and health benefits.
