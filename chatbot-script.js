//Script for chatbot backend
require("dotenv").config();
const OpenAI = require("openai");

const http = require('http');//to listen for post requests from frontend


//const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
//console.log(process.env);
//console.log(OPENAI_API_KEY);
 

const botInstructions = `
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
                        `;
    
    const server = http.createServer((req, res) => {
        //let ans="placeholder";
        //console.log("url:" + req.url + "\nbody:"+req.body);
         
        const allowedOrigins = [
            'null',//only for testing; is unsafe otherwise
            'https://alisherturakulov.github.io',
            'https://culinaryarganoil.com',
        ];
        const originReceived = req.headers.origin;
        //console.log("\noriginReceived: " + req.headers.origin);
        if(allowedOrigins.includes(originReceived)){
            res.setHeader('Access-Control-Allow-Origin', originReceived);
            // res.setHeader('Access-Control-Allow-Credentials', true);
            // res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
            // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Set-Cookie, Cookie');
        }
       
        //ans = getAnswer(req.body);
        //console.log(ans);
        let body= '';
        req.on( "data", (data) => {//because await is used in asych functions
            body += data;
            // if(body.toString().length() > 1000){
            //     console.error("Request body too large, cut off at 1000");
            //     throw error;
            // }
        });

        req.on("end", () => {//once body is received
            // try{
            //     const tooMany = tooManyRequests(req, res);
            //     if(tooMany){
            //         console.log("tooMany returned: " + tooMany);
            //         console.log("cookies: " + req.headers.cookie);
            //         res.writeHead(429, {'Content-Type':'text/plain'});
            //         res.end("Error: Too Many Requests", 'utf-8');
            //         return;
            //     }
            // }catch(error){
            //     console.error("error:" + error.message);
            //     res.writeHead(500, {'Content-Type':'text/plain'});
            //     res.end('error accessing cookie store', 'utf-8');
            // }
            // //console.log("created cookies: " + res.getHeader("Set-Cookie"));
            const userInput =  body.toString();
            

            getAnswer(userInput).then((ans) => {
                //res.setHeader('Access-Control-Allow-Origin', 'null'); null for local file origin
                res.writeHead(200, {'Content-Type':'text/plain'});
                res.end(ans, 'utf-8');
                //console.log("res.closed and sent: " + res.closed +res.headersSent);
            }).catch((error) => {
                console.error("error getting response: "+ error.message);
                res.writeHead(500, {'Content-Type': "text/plain"});
                res.end("There was an error getting a response from the server", 'utf-8');
            });

        });
    });

    const PORT = 3000;
    const HOST ="127.0.0.1";
    server.listen(PORT,HOST, () =>{
        console.log('Server listening on: http://localhost:3000');
    });


//function definitions

    /**
     * Gets the models response to the question
     * @param {string} question 
     */
    async function getAnswer(question){
        //return "commented out getAns, received question: " + question; //during debugging
        try{
            await question;
            const client = new OpenAI();
            const response = await client.responses.create({
                model:"gpt-5-nano",
                input: question,
                instructions: botInstructions,
            });
            
            const ans = await response.output_text;
            //console.log("\nquestion: " + question + "\nresponse: " +ans);
           
            //console.log(response.output_text);
            return ans;
        }catch(error){
            console.error("Error in openai respnonse" + error.message);
            return error.message;
        }
    }

    /**
     * checks the requests cookie in the cookie store; if it exists, increment its value
     * if it doesnt exist, set a requests cookie that expires in an hour. The limit is 11 requests per hour.
     * @param  {http.IncomingMessage} req request
     * @param {http.ServerResponse<http.IncomingMessage>} res response
     * @return {boolean} true if >11 requests in an hour; false otherwise
     */
     function tooManyRequests(req, res){
               //console.log("entered function tooManyRequests");
        let foundCookies = false;
        let cookieStr = req.headers.cookie;
        console.log(req.headers);
        const rHeaders = req.headers;
        for(const item in rHeaders){
            console.log(item);
        }
        console.log("cookieStr: " + cookieStr);
        
        if(cookieStr === undefined){
            const millisecondsInAnHour = 3600000;
            let expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + millisecondsInAnHour); 
            expirationDate = expirationDate.toUTCString();  //to pass into Expires option    
            const initRequests = 1;        
            res.setHeader('Set-Cookie', 
                            [ `ChatRequests=${initRequests}; Expires=${expirationDate}; path=/; Secure; HttpOnly; SameSite=Lax`, 
                            `ExpiryDate=${expirationDate}; Expires=${expirationDate}; path=/; Secure; HttpOnly; SameSite=Lax`]
                            );//httponly to guard against client side cookie editing
            console.log("created cookies: " + res.getHeader("Set-Cookie"));
            return false;
        }else if(cookieStr.includes("ChatRequests")){
            console.log('cookieStr includes: '+ cookieStr);
            const secondsInAHour = 3600;
            const cookieMap = {};
            const cookieList = cookieStr.split(';');//cookies name=value separated by semicolons
            for(const item of cookieList){
                if(item.includes("Chat") || item.includes("Expiry")){
                    item=item.trim();//incase theres a space after the semicolon
                    item = item.split('=');
                    cookieMap[item[0].trim()] = item[1];
                }
            }
            
            const ExpiryDate = cookieMap['ExpiryDate'];// UTC string
            const ChatRequests = cookieMap['ChatRequests']; // string count
            
            const currentRequests = parseInt(ChatRequests, 10);
            currentRequests++;
            if(currentRequests >11){
                console.log("too many requests");
                return true;//will be limited until the cookie expires
            }
            res.setHeader('Set-Cookie', `ChatRequests=${currentRequests}; Expires=${ExpiryDate}; Secure; HttpOnly; SameSite=Strict`);
            res.setHeader('Set-Cookie', `ExpiryDate=${ExpiryDate}; Expires=${ExpiryDate}; Secure; HttpOnly; SameSite=Strict`);
            console.log("not too many; header incremneted");
            return false;
        }
    }

