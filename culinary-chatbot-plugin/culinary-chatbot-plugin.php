<?php
/*
 * Plugin Name:       Culinary Argan Oil Chatbot
 * Plugin URI:        https://alisherturakulov.github.io/culinary-chatbot
 * Description:       Adds a chatbot to the Culinary Argan Oil website pages powered by the gemini api. Injects chatbot div into the footer. Enqueues CSS and client side JS files.
 * Version:           1.0
 * Author:            Alisherjon Turakulov
 */


if (!defined('ABSPATH')) exit; // Prevent direct access

// 1. Enqueue CSS and JS
function cac_enqueue_assets() {
    // load css file
    wp_enqueue_style('cac-style', plugin_dir_url(__FILE__) . 'chatbot-style.css');

    // load JS file (dependency jQuery, version 1.0, load in footer = true) loads after the body to ensure DOM loads
    wp_enqueue_script('cac-script', plugin_dir_url(__FILE__) . 'chatbot-script.js', array(), '1.0', true);

    // Create a bridge to pass data from PHP to JavaScript
    // This creates a JS object named 'cacData' available in the browser
    wp_localize_script('cac-script', 'cacData', array(
        'ajax_url' => admin_url('admin-ajax.php'), // The URL where WP listens for AJAX
        'nonce'    => wp_create_nonce('cac_chat_nonce') // A security token
    ));
}
// Hook/add this function into the script loading process
add_action('wp_enqueue_scripts', 'cac_enqueue_assets');


// 2. Inject Chatbot HTML into Footer
function cac_add_chatbot_html() {
    ?>
    <div class="chatBotBox">
        <div class="chatBotTab">Open Chatbot</div>
        <div class="chatBotMessageBox">
            <p class="botMessage">Hello, ask me any questions about Culinary Argan Oil!</p>
        </div>
        <div class="chatBotInputBox">
            <input type="text" name="chatBotInput" class="chatBotInput" placeholder="Example: what are the benefits of Argan Oil?">
            <button class="chatBotButton" type="button">Enter</button>
        </div>
    </div>
    <?php
}
// Hook this into footer so it appears on every page, 
add_action('wp_footer', 'cac_add_chatbot_html');//to load last to avoid slowing down other elements



// 4. The server logic to handle FormData requests from the enqueued JS cac_handle_chat_request() 
function cac_handle_chat_request() {
    // Security: Verify the request came from the wp site and not a hacker outside
    check_ajax_referer('cac_chat_nonce', 'security');

    // Get the user's message from the POST request and clean it
    $question = sanitize_text_field($_POST['message']);

    // Retrieve the API Key from the wp-config.php constant
    $api_key = defined('GEMINI_API_KEY') ? GEMINI_API_KEY : '';

	//send json error if GEMINI_API_KEY not defined
    if (empty($api_key)) {
        wp_send_json_error(['message' => 'GEMINI_API_KEY is not configured in wp-config.php.']);
    }

 
    $bot_instructions = "
                            you are a customer support chatbot for culinary argan oil, 
                        answer customer questions based on the info and FAQ given below. 
                        Dont answer questions outside the scope of whats covered in the FAQ or About Us; if these questions are still 
                        relevant answer them using your knowledge (for questions such as what are antioxidants/their benefits or the meanings of other terms), dont answer dangerous/harmful questions, or ones asking private info that can't be disclosed, for other questions you cant answer point them to the email: Hello@culinaryarganoil.com.
                        For bulk or private label, clients should contact: b2b@culinaryarganoil.com.
                        Maintain a professional, respectful, and friendly attitude when answering; respond in less than 150 words.
                        
                        -About Us info for Culinary Argan Oil:
                        The Idea: From the heart.
                        Wild harvested in the Argan Bio-Reservoir around Taroudant, where the terroir is hilly and the argan trees have to root deep and the sun and winds have positive effects on the quality of the argan fruits.
                        Cracked by hand, the kernels are selected for artisan roasting by our ‘maître torréfacteur’ monitoring temperature, time and texture. After quality control, small batches are cold pressed produced, with a rigid filtration process to provide top quality culinary argan oil.
                        Tests on the chemical composition -acidity-, texture, and taste ensures only the best quality, Extra Virgin, is released for bottling into our black colored bottles. The result is a luminous oil balancing layers of rich hazelnut and pistachio with a crisp and pleasant robust finish.
                        
                        Mission
                        Our mission is to provide high-quality, extra virgin, organic cold-pressed culinary argan oil. We aim to create amazing and healthy cooking by offering pure, culinary oils with real health benefits.

                        Vision
                        “Our vision is to improve cooking experiences by introducing the world to organic culinary argan oil’s delicious, nutty flavors and health benefits. We envision a future where every kitchen embraces this versatile ingredient, enhancing food’s unique taste and nutritional value.”
                        
                        Our Values:
                        Quality: We prioritize sourcing the best organic argan kernels and using minimally processed methods to produce high-quality culinary oil.
                        Sustainability: Our commitment to sustainable practices ensures the preservation of the Argan forest and supports local communities.
                        Health: We believe in promoting wellness by offering a healthy oil rich in antioxidants, vitamins, and balanced essential fatty acids. We support independent research and studies.
                        Culinary Creativity: We engage and encourage chefs and home cooks to explore new flavor profiles and elevate their dishes using our oils.
                        Transparency: Honesty, accountability, and transparency guide our interactions with customers, partners, and stakeholders.
                        These values inspire our mission to make culinary argan oil a delightful addition to kitchens worldwide!

                        -FAQ (Questions followed by their answers):
                        What are the benefits of culinary argan oil?
                        the fatty acids, antioxidants and vitamin E; the % of these healthy components are the highest of any edible vegetable oil. 
                        More info on benefits: infographic benefits and quality infographic
                        More info on the sustainable process on the FAQ of the webiste

                        Why does Culinary Argan oil costs more than olive oil?
                        The whole process is much more time consuming than for any other vegetable oil. The collection of argan fruits is by hand, and not by a ‘tree-shaking machine’. 
                        The fruits are then dried to remove the outer ‘flesh’. Most tedious is the crushing of the argan fruit, by hand, every-nut-is-cracked-by-hand… 
                        Kernels are sorted, rigorous quality control, Artisanal roasted, continuous monitoring and assessing the process. Small batch production, cold pressed, highly filtered. 
                        The sustainable sourcing and the artisanal production is another benefit of argan oil, a very ‘green process’. 
                        To see the production process, where 30kg raw material results in 1 liter argan oil: https://www.youtube.com/embed/823XEXfhWfw.
                        The argan tree, the tree of life as Berbers call it, is a very versatile tree, nothing goes to waste; the residue of the kernels is used to feed animals.
                        
                        I'm allergic to nuts. What about Culinary Argan oil?
                        The Argan kernel is actually a stone fruit, just like peach, mango, cherry.

                        So no worries about nut allergy.

                        Why is there no first pressing quality?
                        Because it’s ‘one pressed and done’.. We produce artisanal, cold pressed, in small batches

                        What's the difference between Virgin and Extra Virgin?
                        the most relevant component: EVAO is much higher in Oleic Acid (omega 3)

                        What's the difference between Culinary and Cosmetic Argan?
                        for Culinary argan the kernels are roasted, than cold pressed. Cosmetic argan oil is not roasted

                        Is there a difference between the culinary oils available in the US?
                        Sure. The difference is in taste, quality, certification and sustainability. Ours is always best quality (EVAO), USDA 100% organic certified, artisanal made with continuous control of temperature, height  and time. 
                        Compare it to processed beer versus handmade beer, with a master brewer. Our experts use all sensory tools: they can hear, smell and see the kernels; they know perfection. 
                        Also, we source sustainable, and the argan fruits are wild harvested and sundried. It’s expertise with love.

                        Could you use culinary argan on your hair and body?
                        Absolutely, but only if you love smelling like nuts.

                        Is it a cooking or a finishing oil?
                        It’s versatile, a mix of both, due to its smoke point. The smoke point, at 170 Celcius comparable to the best quality extra virgin Olive oil, is the deciding factor in cooking, so don’t wok or deep-fry with it since that requires very high heat. 
                        But you can bake with it; ‘baum cake’, in Japan was one of the first uses, and our chocolatier makes delicious chocolate bars with nuts and sea salt. In normal culinary use the smoke point is not a concern. There are three important temperatures to remember when cooking: 
                        Eggs and all ground meats must be cooked to 160°F; poultry and fowl to 165°F; and fresh meat steaks, chops and roasts to 145°F. See www.health.state.mn.us/foodsafety/cook/cooktemp.html :
                        Recipes available on the website.

                        Can you backup the benefits?
                        Of course. for independent scientific info regarding Argan oil please check out the abstracts of research on the ‘benefits’ section of the blogs on www.culinaryarganoil.com and www.sulanyc.com

                        Does roasting has an effect on the quality?
                        No, science has proven the quality stays excellent.

                        Is the oil vegan?
                        Yes. It comes from a tree and zero additions during the process.Pure as pure can be.   

                        Omega's?
                        It is all about the balance between them. Our body needs food to extract  omega 3; it can’t make omega without food. (linoleic is the fatty component); omega 6 is close to omega 3, and provides energy. The body can produce omega 9, important to reduce bad cholesterol.

                        Vitamin E and antioxidants?
                        Of all vegetable oils in the world, Argan has the most Vitamin E and is very high in antioxidants, both great properties for a healthy lifestyle. Prickly pear oil, cold pressed, has slightly more vitamin E, 
                        but it’s hardly commercially available as culinary and at exponential higher prices.

                        What about smoke point and flash point?
                        Smoke point is the temperature where oil goes bad while heating: every vegetable oil has a maximum temperature; for Extra Virgin Argan Oil it is about 170 Celsius /338 Fahrenheit. 
                        This is comparable to the best quality of Extra Virgin Olive Oil, about 183 celcius. Flash point is the temp where oil combusts and for vegetable oils thats not a concern at all; those flashpoints are far over 440 Fahrenheit.

                        How can you compare the nutty flavor of culinary argan to other oils:
                        Think words like: gourmet/couture/connoisseur/gastronomic/epicure; so special.
                        Like saying ‘tomato paste’ instead of ‘ketchup’.

                        How do I know you are allowed to use the USDA seal?
                        check the USDA organic integrity database: https://organic.ams.usda.gov/integrity/Search.aspx

                        What does 'pharmaceutical grade' mean?
                        For Argan oil: a creative marketing term, so just nonsense really. There are 4 grades of Argan oil; Extra Virgin Argan Oil: EVAO(ours) is the best quality. Tested by lab, regulated by government.

    ";

    // Prepare URL and Body for Gemini API (https://ai.google.dev/gemini-api/docs/text-generation#rest_2)
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';//api key not passed into url string directly
	
    $body = json_encode([
        "contents" => [
            [ "parts" => [ ["text" => $question] ] ]
        ],
        "system_instruction" => [
            "parts" => [ ["text" => $bot_instructions] ]
        ]
    ]);
	
	$args = [
		//'method' => 'POST'//wp_remote_post defaults to post 
		'headers' => [
			'x-goog-api-key' => $api_key,//apikey passed in as header
			'Content-Type' => 'application/json'
		],
		'body' => $body,
		'timeout' => 30,
	];


    // Send the POST request to Google (Standard WP HTTP function)
    $response = wp_remote_post($url, $args);

    // model Error Handling
    if (is_wp_error($response)) {
        wp_send_json_error(['message' => 'Connection to Gemini failed.']);
    }
	
	$statuscode = wp_remote_retrieve_response_code($response);
	
	//if response not ok
	if($statuscode !== 200){
		wp_send_json_error(['message' => 'Error with model reponse: '. $statuscode]);
	}

    // Decode the JSON response from Google
    $data = json_decode(wp_remote_retrieve_body($response), true);
    
    // Extract the text answer or otherwise send 
    $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? "Sorry, I'm having trouble connecting right now.";

    // Send the answer back to the JavaScript frontend
    wp_send_json_success(['reply' => $reply]);
}

//admin and user requests handled separately
// Hook for handling admins sending requests while logged in
add_action('wp_ajax_cac_send_message', 'cac_handle_chat_request');

// hook handling all other users sending requests
add_action('wp_ajax_nopriv_cac_send_message', 'cac_handle_chat_request');