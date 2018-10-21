// Note to self (and whoever else may be reading this):
// Starting September 6, 2018 I've been making changes directly to the 
// backend code on my server rather than committing and pulling from
// this github repo. Therefore, passwords and usernames included here
// are likely outdated.

var express = require('express')
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var xml = require('xml');
var mainHtml = 'Default html';
var tempCode = "9999";
var tempUsername = "mikey";
var connectionpool = mysql.createPool({
	host	: 'localhost',
	user	: 'root',
	password : 'nd888nd7',
	database : 'language_rescue_database'
});

var randomNames = ["Emma","Isabella","Emily","Madison","Ava","Olivia","Sophia","Abigail","Elizabeth","Chloe","Samantha","Addison","Natalie","Mia","Alexis","Alyssa","Hannah","Ashley","Ella","Sarah","Grace","Taylor","Brianna","Lily","Hailey","Anna","Victoria","Kayla","Lillian","Lauren","Kaylee","Allison","Savannah","Nevaeh","Gabriella","Sofia","Makayla","Avery","Riley","Julia","Leah","Aubrey","Jasmine","Audrey","Katherine","Morgan","Brooklyn","Destiny","Sydney","Alexa","Kylie","Brooke","Kaitlyn","Evelyn","Layla","Madeline","Kimberly","Zoe","Jessica","Peyton","Alexandra","Claire","Madelyn","Maria","Mackenzie","Arianna","Jocelyn","Amelia","Angelina","Trinity","Andrea","Maya","Valeria","Sophie","Rachel","Vanessa","Aaliyah","Mariah","Gabrielle","Katelyn","Ariana","Bailey","Camila","Jennifer","Melanie","Gianna","Charlotte","Paige","Autumn","Payton","Faith","Sara","Isabelle","Caroline","Genesis","Isabel","Mary","Zoey","Gracie","Megan","Haley","Mya","Michelle","Molly","Stephanie","Nicole","Jenna","Natalia","Sadie","Jada","Serenity","Lucy","Ruby","Eva","Kennedy","Rylee","Jayla","Naomi","Rebecca","Lydia","Daniela","Bella","Keira","Adriana","Lilly","Hayden","Miley","Katie","Jade","Jordan","Gabriela","Amy","Angela","Melissa","Valerie","Giselle","Diana","Amanda","Kate","Laila","Reagan","Jordyn","Kylee","Danielle","Briana","Marley","Leslie","Kendall","Catherine","Liliana","Mckenzie","Jacqueline","Ashlyn","Reese","Marissa","London","Juliana","Shelby","Cheyenne","Angel","Daisy","Makenzie","Miranda","Erin","Amber","Alana","Ellie","Breanna","Ana","Mikayla","Summer","Piper","Adrianna","Jillian","Sierra","Jayden","Sienna","Alicia","Lila","Margaret","Alivia","Brooklynn","Karen","Violet","Sabrina","Stella","Aniyah","Annabelle","Alexandria","Kathryn","Skylar","Aliyah","Delilah","Julianna","Kelsey","Khloe","Carly","Amaya","Mariana","Christina","Alondra","Tessa","Eliana","Bianca","Jazmin","Clara","Vivian","Josephine","Delaney","Scarlett","Elena","Cadence","Alexia","Maggie","Laura","Nora","Ariel","Elise","Nadia","Mckenna","Chelsea","Lyla","Alaina","Jasmin","Hope","Leila","Caitlyn","Cassidy","Makenna","Allie","Izabella","Eden","Callie","Haylee","Caitlin","Kendra","Karina","Kyra","Kayleigh","Addyson","Kiara","Jazmine","Karla","Camryn","Alina","Lola","Kyla","Kelly","Fatima","Tiffany","Kira","Crystal","Mallory","Esmeralda","Alejandra","Eleanor","Angelica","Jayda","Abby","Kara","Veronica","Carmen","Jamie","Ryleigh","Valentina","Allyson","Dakota","Kamryn","Courtney","Cecilia","Madeleine","Aniya","Alison","Esther","Heaven","Aubree","Lindsey","Leilani","Nina","Melody","Macy","Ashlynn","Joanna","Cassandra","Alayna","Kaydence","Madilyn","Aurora","Heidi","Emerson","Kimora","Madalyn","Erica","Josie","Katelynn","Guadalupe","Harper","Ivy","Lexi","Camille","Savanna","Dulce","Daniella","Lucia","Emely","Joselyn","Kiley","Kailey","Miriam","Cynthia","Rihanna","Georgia","Rylie","Harmony","Kiera","Kyleigh","Monica","Bethany","Kaylie","Cameron","Teagan","Cora","Brynn","Ciara","Genevieve","Alice","Maddison","Eliza","Tatiana","Jaelyn","Erika","Ximena","April","Marely","Julie","Danica","Presley","Brielle","Julissa","Angie","Iris","Brenda","Hazel","Rose","Malia","Shayla","Fiona","Phoebe","Nayeli","Paola","Kaelyn","Selena","Audrina","Rebekah","Carolina","Janiyah","Michaela","Penelope","Janiya","Anastasia","Adeline","Ruth","Sasha","Denise","Holly","Madisyn","Hanna","Tatum","Marlee","Nataly","Helen","Janelle","Lizbeth","Serena","Anya","Jaslene","Kaylin","Jazlyn","Nancy","Lindsay","Desiree","Hayley","Itzel","Imani","Madelynn","Asia","Kadence","Madyson","Talia","Jane","Kayden","Annie","Amari","Bridget","Raegan","Jadyn","Celeste","Jimena","Luna","Yasmin","Emilia","Annika","Estrella","Sarai","Lacey","Ayla","Alessandra","Willow","Nyla","Dayana","Lilah","Lilliana","Natasha","Hadley","Harley","Priscilla","Claudia","Allisson","Baylee","Brenna","Brittany","Skyler","Fernanda","Danna","Melany","Cali","Lia","Macie","Lyric","Logan","Gloria","Lana","Mylee","Cindy","Lilian","Amira","Anahi","Alissa","Anaya","Lena","Ainsley","Sandra","Noelle","Marisol","Meredith","Kailyn","Lesly","Johanna","Diamond","Evangeline","Juliet","Kathleen","Meghan","Paisley","Athena","Hailee","Rosa","Wendy","Emilee","Sage","Alanna","Elaina","Cara","Nia","Paris","Casey","Dana","Emery","Rowan","Aubrie","Kaitlin","Jaden","Kenzie","Kiana","Viviana","Norah","Lauryn","Perla","Amiyah","Alyson","Rachael","Shannon","Aileen","Miracle","Lillie","Danika","Heather","Kassidy","Taryn","Tori","Francesca","Kristen","Amya","Elle","Kristina","Cheyanne","Haylie","Patricia","Anne","Samara","Skye","Kali","America","Lexie","Parker","Halle","Londyn","Abbigail","Linda","Hallie","Saniya","Bryanna","Bailee","Jaylynn","Mckayla","Quinn","Jaelynn","Jaida","Caylee","Jaiden","Melina","Abril","Sidney","Kassandra","Elisabeth","Adalyn","Kaylynn","Mercedes","Yesenia","Elliana","Brylee","Dylan","Isabela","Ryan","Ashlee","Daphne","Kenya","Marina","Christine","Mikaela","Kaitlynn","Justice","Saniyah","Jaliyah","Ingrid","Marie","Natalee","Joy","Juliette","Simone","Adelaide","Krystal","Kennedi","Mila","Tamia","Addisyn","Aylin","Dayanara","Sylvia","Clarissa","Maritza","Virginia","Braelyn","Jolie","Jaidyn","Kinsley","Kirsten","Laney","Marilyn","Whitney","Janessa","Raquel","Anika","Kamila","Aria","Rubi","Adelyn","Amara","Ayanna","Teresa","Zariah","Kaleigh","Amani","Carla","Yareli","Gwendolyn","Paulina","Nathalie","Annabella","Jaylin","Tabitha","Deanna","Madalynn","Journey","Aiyana","Skyla","Yaretzi","Ada","Liana","Karlee","Jenny","Myla","Cristina","Myah","Lisa","Tania","Isis","Jayleen","Jordin","Arely","Azul","Helena","Aryanna","Jaqueline","Lucille","Destinee","Martha","Zoie","Arielle","Liberty","Marlene","Elisa","Isla","Noemi","Raven","Jessie","Aleah","Kailee","Kaliyah","Lilyana","Haven","Tara","Giana","Camilla","Maliyah","Irene","Carley","Maeve","Lea","Macey","Sharon","Alisha","Marisa","Jaylene","Kaya","Scarlet","Siena","Adyson","Maia","Shiloh","Tiana","Jaycee","Gisselle","Yazmin","Eve","Shyanne","Arabella","Sherlyn","Sariah","Amiya","Kiersten","Madilynn","Shania","Aleena","Finley","Kinley","Kaia","Aliya","Taliyah","Pamela","Yoselin","Ellen","Carlie","Monserrat","Jakayla","Reyna","Yaritza","Carolyn","Clare","Lorelei","Paula","Zaria","Gracelyn","Kasey","Regan","Alena","Angelique","Regina","Britney","Emilie","Mariam","Jaylee","Julianne","Greta","Elyse","Lainey","Kallie","Felicity","Zion","Aspen","Carlee","Annalise","Iliana","Larissa","Akira","Sonia","Catalina","Phoenix","Joslyn","Anabelle","Mollie","Susan","Judith","Destiney","Hillary","Janet","Katrina","Mareli","Ansley","Kaylyn","Alexus","Gia","Maci","Elsa","Stacy","Kaylen","Carissa","Haleigh","Lorena","Jazlynn","Milagros","Luz","Leanna","Renee","Shaniya","Charlie","Abbie","Cailyn","Cherish","Elsie","Jazmyn","Elaine","Emmalee","Luciana","Dahlia","Jamya","Belinda","Mariyah","Chaya","Dayami","Rhianna","Yadira","Aryana","Rosemary","Armani","Cecelia","Celia","Barbara","Cristal","Eileen","Rayna","Campbell","Amina","Aisha","Amirah","Ally","Araceli","Averie","Mayra","Sanaa","Patience","Leyla","Selah","Zara","Chanel","Kaiya","Keyla","Miah","Aimee","Giovanna","Amelie","Kelsie","Alisson","Angeline","Dominique","Adrienne","Brisa","Cierra","Paloma","Isabell","Precious","Alma","Charity","Jacquelyn","Janae","Frances","Shyla","Janiah","Kierra","Karlie","Annabel","Jacey","Karissa","Jaylah","Xiomara","Edith","Marianna","Damaris","Deborah","Jaylyn","Evelin","Mara","Olive","Ayana","India","Kendal","Kayley","Tamara","Briley","Charlee","Nylah","Abbey","Moriah","Saige","Savanah","Giada","Hana","Lizeth","Matilda","Ann","Jazlene","Gillian","Beatrice","Ireland","Karly","Mylie","Yasmine","Ashly","Kenna","Maleah","Corinne","Keely","Tanya","Tianna","Adalynn","Ryann","Salma","Areli","Karma","Shyann","Kaley","Theresa","Evie","Gina","Roselyn","Kaila","Jaylen","Natalya","Meadow","Rayne","Aliza","Yuliana","June","Lilianna","Nathaly","Ali","Alisa","Aracely","Belen","Tess","Jocelynn","Litzy","Makena","Abagail","Giuliana","Joyce","Libby","Lillianna","Thalia","Tia","Sarahi","Zaniyah","Kristin","Lorelai","Mattie","Taniya","Jaslyn","Gemma","Valery","Lailah","Mckinley","Micah","Deja","Frida","Brynlee","Jewel","Krista","Mira","Yamilet","Adison","Carina","Karli","Magdalena","Stephany","Charlize","Raelynn","Aliana","Cassie","Mina","Karley","Shirley","Marlie","Alani","Taniyah","Cloe","Sanai","Lina","Nola","Anabella","Dalia","Raina","Mariela","Ariella","Bria","Kamari","Monique","Ashleigh","Reina","Alia","Ashanti","Lara","Lilia","Justine","Leia","Maribel","Abigayle","Tiara","Alannah","Princess","Sydnee","Kamora","Paityn","Payten","Naima","Gretchen","Heidy","Nyasia","Livia","Marin","Shaylee","Maryjane","Laci","Nathalia","Azaria","Anabel","Chasity","Emmy","Izabelle","Denisse","Emelia","Mireya","Shea","Amiah","Dixie","Maren","Averi","Esperanza","Micaela","Selina","Alyvia","Chana","Avah","Donna","Kaylah","Ashtyn","Karsyn","Makaila","Shayna","Essence","Leticia","Miya","Rory","Desirae","Kianna","Laurel","Neveah","Amaris","Hadassah","Dania","Hailie","Jamiya","Kathy","Laylah","Riya","Diya","Carleigh","Iyana","Kenley","Sloane","Elianna","Jacob","Michael","Ethan","Joshua","Daniel","Alexander","Anthony","William","Christopher","Matthew","Jayden","Andrew","Joseph","David","Noah","Aiden","James","Ryan","Logan","John","Nathan","Elijah","Christian","Gabriel","Benjamin","Jonathan","Tyler","Samuel","Nicholas","Gavin","Dylan","Jackson","Brandon","Caleb","Mason","Angel","Isaac","Evan","Jack","Kevin","Jose","Isaiah","Luke","Landon","Justin","Lucas","Zachary","Jordan","Robert","Aaron","Brayden","Thomas","Cameron","Hunter","Austin","Adrian","Connor","Owen","Aidan","Jason","Julian","Wyatt","Charles","Luis","Carter","Juan","Chase","Diego","Jeremiah","Brody","Xavier","Adam","Carlos","Sebastian","Liam","Hayden","Nathaniel","Henry","Jesus","Ian","Tristan","Bryan","Sean","Cole","Alex","Eric","Brian","Jaden","Carson","Blake","Ayden","Cooper","Dominic","Brady","Caden","Josiah","Kyle","Colton","Kaden","Eli","Miguel","Antonio","Parker","Steven","Alejandro","Riley","Richard","Timothy","Devin","Jesse","Victor","Jake","Joel","Colin","Kaleb","Bryce","Levi","Oliver","Oscar","Vincent","Ashton","Cody","Micah","Preston","Marcus","Max","Patrick","Seth","Jeremy","Peyton","Nolan","Ivan","Damian","Maxwell","Alan","Kenneth","Jonah","Jorge","Mark","Giovanni","Eduardo","Grant","Collin","Gage","Omar","Emmanuel","Trevor","Edward","Ricardo","Cristian","Nicolas","Kayden","George","Jaxon","Paul","Braden","Elias","Andres","Derek","Garrett","Tanner","Malachi","Conner","Fernando","Cesar","Javier","Miles","Jaiden","Alexis","Leonardo","Santiago","Francisco","Cayden","Shane","Edwin","Hudson","Travis","Bryson","Erick","Jace","Hector","Josue","Peter","Jaylen","Mario","Manuel","Abraham","Grayson","Damien","Kaiden","Spencer","Stephen","Edgar","Wesley","Shawn","Trenton","Jared","Jeffrey","Landen","Johnathan","Bradley","Braxton","Ryder","Camden","Roman","Asher","Brendan","Maddox","Sergio","Israel","Andy","Lincoln","Erik","Donovan","Raymond","Avery","Rylan","Dalton","Harrison","Andre","Martin","Keegan","Marco","Jude","Sawyer","Dakota","Leo","Calvin","Kai","Drake","Troy","Zion","Clayton","Roberto","Zane","Gregory","Tucker","Rafael","Kingston","Dominick","Ezekiel","Griffin","Devon","Drew","Lukas","Johnny","Ty","Pedro","Tyson","Caiden","Mateo","Braylon","Cash","Aden","Chance","Taylor","Marcos","Maximus","Ruben","Emanuel","Simon","Corbin","Brennan","Dillon","Skyler","Myles","Xander","Jaxson","Dawson","Kameron","Kyler","Axel","Colby","Jonas","Joaquin","Payton","Brock","Frank","Enrique","Quinn","Emilio","Malik","Grady","Angelo","Julio","Derrick","Raul","Fabian","Corey","Gerardo","Dante","Ezra","Armando","Allen","Theodore","Gael","Amir","Zander","Adan","Maximilian","Randy","Easton","Dustin","Luca","Phillip","Julius","Charlie","Ronald","Jakob","Cade","Brett","Trent","Silas","Keith","Emiliano","Trey","Jalen","Darius","Lane","Jerry","Jaime","Scott","Graham","Weston","Braydon","Anderson","Rodrigo","Pablo","Saul","Danny","Donald","Elliot","Brayan","Dallas","Lorenzo","Casey","Mitchell","Alberto","Tristen","Rowan","Jayson","Gustavo","Aaden","Amari","Dean","Braeden","Declan","Chris","Ismael","Dane","Louis","Arturo","Brenden","Felix","Jimmy","Cohen","Tony","Holden","Reid","Abel","Bennett","Zackary","Arthur","Nehemiah","Ricky","Esteban","Cruz","Finn","Mauricio","Dennis","Keaton","Albert","Marvin","Mathew","Larry","Moises","Issac","Philip","Quentin","Curtis","Greyson","Jameson","Everett","Jayce","Darren","Elliott","Uriel","Alfredo","Hugo","Alec","Jamari","Marshall","Walter","Judah","Jay","Lance","Beau","Ali","Landyn","Yahir","Phoenix","Nickolas","Kobe","Bryant","Maurice","Russell","Leland","Colten","Reed","Davis","Joe","Ernesto","Desmond","Kade","Reece","Morgan","Ramon","Rocco","Orlando","Ryker","Brodie","Paxton","Jacoby","Douglas","Kristopher","Gary","Lawrence","Izaiah","Solomon","Nikolas","Mekhi","Justice","Tate","Jaydon","Salvador","Shaun","Alvin","Eddie","Kane","Davion","Zachariah","Dorian","Titus","Kellen","Camron","Isiah","Javon","Nasir","Milo","Johan","Byron","Jasper","Jonathon","Chad","Marc","Kelvin","Chandler","Sam","Cory","Deandre","River","Reese","Roger","Quinton","Talon","Romeo","Franklin","Noel","Alijah","Guillermo","Gunner","Damon","Jadon","Emerson","Micheal","Bruce","Terry","Kolton","Melvin","Beckett","Porter","August","Brycen","Dayton","Jamarion","Leonel","Karson","Zayden","Keagan","Carl","Khalil","Cristopher","Nelson","Braiden","Moses","Isaias","Roy","Triston","Walker","Kale","Jermaine","Leon","Rodney","Kristian","Mohamed","Ronan","Pierce","Trace","Warren","Jeffery","Maverick","Cyrus","Quincy","Nathanael","Skylar","Tommy","Conor","Noe","Ezequiel","Demetrius","Jaylin","Kendrick","Frederick","Terrance","Bobby","Jamison","Jon","Rohan","Jett","Kieran","Tobias","Ari","Colt","Gideon","Felipe","Kenny","Wilson","Orion","Kamari","Gunnar","Jessie","Alonzo","Gianni","Omari","Waylon","Malcolm","Emmett","Abram","Julien","London","Tomas","Allan","Terrell","Matteo","Tristin","Jairo","Reginald","Brent","Ahmad","Yandel","Rene","Willie","Boston","Billy","Marlon","Trevon","Aydan","Jamal","Aldo","Ariel","Cason","Braylen","Javion","Joey","Rogelio","Ahmed","Dominik","Brendon","Toby","Kody","Marquis","Ulises","Armani","Adriel","Alfonso","Branden","Will","Craig","Ibrahim","Osvaldo","Wade","Harley","Steve","Davin","Deshawn","Kason","Damion","Jaylon","Jefferson","Aron","Brooks","Darian","Gerald","Rolando","Terrence","Enzo","Kian","Ryland","Barrett","Jaeden","Ben","Bradyn","Giovani","Blaine","Madden","Jerome","Muhammad","Ronnie","Layne","Kolby","Leonard","Vicente","Cale","Alessandro","Zachery","Gavyn","Aydin","Xzavier","Malakai","Raphael","Cannon","Rudy","Asa","Darrell","Giancarlo","Elisha","Junior","Zackery","Alvaro","Lewis","Valentin","Deacon","Jase","Harry","Kendall","Rashad","Finnegan","Mohammed","Ramiro","Cedric","Brennen","Santino","Stanley","Tyrone","Chace","Francis","Johnathon","Teagan","Zechariah","Alonso","Kaeden","Kamden","Gilberto","Ray","Karter","Luciano","Nico","Kole","Aryan","Draven","Jamie","Misael","Lee","Alexzander","Camren","Giovanny","Amare","Rhett","Rhys","Rodolfo","Nash","Markus","Deven","Mohammad","Moshe","Quintin","Dwayne","Memphis","Atticus","Davian","Eugene","Jax","Antoine","Wayne","Randall","Semaj","Uriah","Clark","Aidyn","Jorden","Maxim","Aditya","Lawson","Messiah","Korbin","Sullivan","Freddy","Demarcus","Neil","Brice","King","Davon","Elvis","Ace","Dexter","Heath","Duncan","Jamar","Sincere","Irvin","Remington","Kadin","Soren","Tyree","Damarion","Talan","Adrien","Gilbert","Keenan","Darnell","Adolfo","Tristian","Derick","Isai","Rylee","Gauge","Harold","Kareem","Deangelo","Agustin","Coleman","Zavier","Lamar","Emery","Jaydin","Devan","Jordyn","Mathias","Prince","Sage","Seamus","Jasiah","Efrain","Darryl","Arjun","Mike","Roland","Conrad","Kamron","Hamza","Santos","Frankie","Dominique","Marley","Vance","Dax","Jamir","Kylan","Todd","Maximo","Jabari","Matthias","Haiden","Luka","Marcelo","Keon","Layton","Tyrell","Kash","Raiden","Cullen","Donte","Jovani","Cordell","Kasen","Rory","Alfred","Darwin","Ernest","Bailey","Gaige","Hassan","Jamarcus","Killian","Augustus","Trevin","Zain","Ellis","Rex","Yusuf","Bruno","Jaidyn","Justus","Ronin","Humberto","Jaquan","Josh","Kasey","Winston","Dashawn","Lucian","Matias","Sidney","Ignacio","Nigel","Van","Elian","Finley","Jaron","Addison","Aedan","Braedon","Jadyn","Konner","Zayne","Franco","Niko","Savion","Cristofer","Deon","Krish","Anton","Brogan","Cael","Coby","Kymani","Marcel","Yair","Dale","Bo","Jordon","Samir","Darien","Zaire","Ross","Vaughn","Devyn","Kenyon","Clay","Dario","Ishaan","Jair","Kael","Adonis","Jovanny","Clinton","Rey","Chaim","German","Harper","Nathen","Rigoberto","Sonny","Glenn","Octavio","Blaze","Keshawn","Ralph","Ean","Nikhil","Rayan","Sterling","Branson","Jadiel","Dillan","Jeramiah","Koen","Konnor","Antwan","Houston","Tyrese","Dereon","Leonidas","Zack","Fisher","Jaydan","Quinten","Nick","Urijah","Darion","Jovan","Salvatore","Beckham","Jarrett","Antony","Eden","Makai","Zaiden","Broderick","Camryn","Malaki","Nikolai","Howard","Immanuel","Demarion","Valentino","Jovanni","Ayaan","Ethen","Leandro","Royce","Yael","Yosef","Jean","Marquise","Alden","Leroy","Gaven","Jovany","Tyshawn","Aarav","Kadyn","Milton","Zaid","Kelton","Tripp","Kamren","Slade","Hezekiah","Jakobe","Nathanial","Rishi","Shamar","Geovanni","Pranav","Roderick","Bentley","Clarence","Lyric","Bernard","Carmelo","Denzel","Maximillian","Reynaldo","Cassius","Gordon","Reuben","Samson","Yadiel","Jayvon","Reilly","Sheldon","Abdullah","Jagger","Thaddeus","Case","Kyson","Lamont","Chaz","Makhi","Jan","Marques","Oswaldo","Donavan","Keyon","Kyan","Simeon","Trystan","Andreas","Dangelo","Landin","Reagan","Turner","Arnav","Brenton","Callum","Jayvion","Bridger","Sammy","Deegan","Jaylan","Lennon","Odin","Abdiel","Jerimiah","Eliezer","Bronson","Cornelius","Pierre","Cortez","Baron","Carlo","Carsen","Fletcher","Izayah","Kolten","Damari","Hugh","Jensen","Yurem"];

var schoolStoreInventory = [];


var playerGroups = [
	{
		code: 3333,
		type: "discussion",
		commentList:[],
		players:
		[
			{name:"Daniel",text:"Hi everyone",image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"},
			{name:"Rachel",text:"Is this working?",image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"},
			{name:"Amy",text:"I think so",image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"}
		]
	},
	{
		code: 4444,
		type: "tictactoe",
		gameState: [["","",""],["","",""],["","",""]],
		currentTurn: "X",
		players:[]
	},
	{
		code: 'JJJJ',
		type: "uno",
		numActions: 0,
		numAnimations: 0,
		players:[],
		currentTurn: 0,
		isReversed: false
	}
];

makeDeck('JJJJ');


app.use(bodyParser.json());
fs.readFile('../FrontEnd/index.html', function(err, html){
	if (err) {
		console.error('COULDN\'T OPEN FILE', err);
		res.send({
			result: 'error',
			err: err.code
		});
		mainHtml = 'THERE WAS AN ERROR RETRIEVING THE FILE';
	}
	else
	{
		mainHtml = html;
	}
});

function makeDeck(code)
{
	// following code should be run once immediately when the game is created in the hub
	// instead of this code here we should simply GET the totalCards list
	var gameDataForCode = getGameDataForCode(code);
	
	gameDataForCode['totalCards'] = [];
	//prints out black speical cards
	for(var i = 0; i <= 3; i++)
	{
		for(var j = 13; j <= 14; j++)
		{
			var filename = "http://104.236.169.62/UnoCards/black_wild";
			if (j == 14) filename += "&+4";
			filename += ".png";
			var c = new Card(j, "Black", filename);
			gameDataForCode['totalCards'].push(c);
		}
	}
	//Makes Special Color Cards
	for(var i = 10; i <= 12; i++)
	{
		for(var j = 0; j < 8; j++)
		{
			var filename = "http://104.236.169.62/UnoCards/"
			if (j == 0 || j == 4) filename += "red_";
			if (j == 1 || j == 5) filename += "yellow_";
			if (j == 2 || j == 6) filename += "blue_";
			if (j == 3 || j == 7) filename += "green_";
			if (i == 10) filename += "skip.png";
			if (i == 11) filename += "reverse.png";
			if (i == 12) filename += "+2.png";
			var c = new Card(i, j,filename);
			gameDataForCode['totalCards'].push(c);
		}
	}
	//Creating 4 0's
	for(var i = 0; i < 4; i++)
	{
		var filename = "http://104.236.169.62/UnoCards/"
		if (i == 0) filename += "red_";
		if (i == 1) filename += "yellow_";
		if (i == 2) filename += "blue_";
		if (i == 3) filename += "green_";
		filename += "0.png";
		var c = new Card(0, i, filename);
		gameDataForCode['totalCards'].push(c);
	}
	//Creating Rest of Uno Deck
	for (var i = 1; i <= 9; i++)
	{
		for (var j = 0; j < 8; j++) 
		{
			var filename = "http://104.236.169.62/UnoCards/"
			if (j == 0 || j == 4) filename += "red_";
			if (j == 1 || j == 5) filename += "yellow_";
			if (j == 2 || j == 6) filename += "blue_";
			if (j == 3 || j == 7) filename += "green_";
			filename += i + ".png";
			var c = new Card(i, j, filename);
			gameDataForCode['totalCards'].push(c);
		}
	}
	var copyOfDeck = gameDataForCode['totalCards'];
	gameDataForCode['totalCards'] = [];
	for (var i = 0; i < 108; i++)
	{
		var RanNum1 = Math.floor(Math.random() * copyOfDeck.length);
		gameDataForCode['totalCards'].push(copyOfDeck[RanNum1]);
		copyOfDeck.splice(RanNum1, 1);
	}
}

app.post('/dealUnoCards/:code/:numPlayers', function(req,res){
	var gameCode = req.params.code;
	var totalPlayers = req.params.numPlayers;
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		dealUnoDeck(gameDataForCode,totalPlayers);
		gameDataForCode.startedGame = true;
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});


app.post('/unoChangeTurn/:code/:turnChanges', function(req,res){
	
	var gameCode = req.params.code;
	var turnChanges = req.params.turnChanges;
	console.log("changing turn");
	console.log(turnChanges);
	var gameDataForCode = getGameDataForCode(gameCode);
	console.log(gameCode);
	console.log(turnChanges);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		changeUnoTurn(gameDataForCode,turnChanges);
		gameDataForCode['numActions'] += 1;
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});



app.post('/unoAction/:code/:action/:CardIndex/:color', function(req,res){
	var gameCode = req.params.code;
	var action = req.params.action;
	var CardIndex = req.params.CardIndex;
	var color = req.params.color;
	var gameDataForCode = getGameDataForCode(gameCode);
	console.log(gameCode);
	console.log(action);
	console.log(CardIndex);
	console.log(color);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		// set up card and action for animation to be done on all clients
		gameDataForCode['CardIndex'] = CardIndex;
		gameDataForCode['action'] = action;
		
		// trigger animation event on all clients
		gameDataForCode['numAnimations'] += 1;
		
		// in 1000 milis, let clients know they should update
		setTimeout(function() {

			var currentTurn = gameDataForCode['currentTurn'];

			
			if (action == 'play' || action == 'playWild')
			{
				var Playable_Deck = gameDataForCode['Playable_Deck'];
				var Players = gameDataForCode['players'];
				var card = Players[currentTurn].Cards[CardIndex];
				var totalCards = gameDataForCode['totalCards'];
				
				Players[currentTurn].Cards[CardIndex].Color_Of_Wild = color;
				Playable_Deck.push(Players[currentTurn].Cards[CardIndex]);
				Players[currentTurn].Cards.splice(CardIndex, 1);
				
				if (card.Value == "Skip")
				{
					changeUnoTurn(gameDataForCode,2);
				}
				else if (card.Value === "+2")
				{
					var nextIndex;
					if (gameDataForCode['isReversed'])
					{
						nextIndex = (currentTurn+(Players.length-1))%Players.length;
					}
					else
					{
						nextIndex = (currentTurn+1)%Players.length;
					}
					for (var i = 0; i < 2; i++)
					{
						Players[nextIndex].Cards.push(totalCards[0]);
						totalCards.splice(0, 1);
					}
					changeUnoTurn(gameDataForCode,2);
				}
				else if (card.Value == "Reverse")
				{
					if (Players.length == 2)
					{
						changeUnoTurn(gameDataForCode,2);
					}
					else
					{
						gameDataForCode['isReversed'] = !gameDataForCode['isReversed'];
						changeUnoTurn(gameDataForCode,1);
					}
				}
				else if (card.Value == "Wild")
				{
					changeUnoTurn(gameDataForCode,1);
				}
				else if (card.Value == "Wild & + 4")
				{
					var nextIndex;
					if (gameDataForCode['isReversed'])
					{
						nextIndex = (currentTurn+(Players.length-1))%Players.length;
					}
					else
					{
						nextIndex = (currentTurn+1)%Players.length;
					}
					for (var i = 0; i < 4; i++)
					{
						Players[nextIndex].Cards.push(totalCards[0]);
						totalCards.splice(0, 1);
					}
					changeUnoTurn(gameDataForCode,2);
				}
				else // number card
				{
					changeUnoTurn(gameDataForCode,1);
				}
			}
			else  //if (action == 'draw')
			{
				var topCard = gameDataForCode['totalCards'][0];
				gameDataForCode['players'][currentTurn].Cards.push(topCard);
				gameDataForCode['totalCards'].splice(0 ,1);
			}
			
			if (gameDataForCode['totalCards'].length - 1 <= 10)
			{
				ReShuffleTotalCards(gameDataForCode);
			}
			
			gameDataForCode['numActions'] += 1;
			//console.log("when updated");
			//console.log(gameDataForCode);
		},1000);
		
		
		//console.log("when animating");
		//console.log(gameDataForCode);
		
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});

function changeUnoTurn(gameData,turnChanges)
{
	console.log("now really changing turn");
	console.log("turn argument:");
	console.log(turnChanges);
	console.log("current turn started as:");
	console.log(gameData['currentTurn']);
	if (gameData['isReversed'])
	{
		gameData['currentTurn'] = (Number(gameData['currentTurn']) + Number(gameData['players'].length)-Number(turnChanges))%gameData['players'].length;
	}
	else
	{
		var currentTurn = gameData['currentTurn'];
		var numPlayers = gameData['players'].length;
		console.log("numPlayers:");
		console.log(numPlayers);
		var newTurnBeforeMod = Number(currentTurn) + Number(turnChanges);
		console.log("before Mod:");
		console.log(newTurnBeforeMod);
		var newTurn = newTurnBeforeMod%numPlayers;
		console.log("new Turn:");
		console.log(newTurn);
		gameData['currentTurn'] = newTurn;
	}
	console.log("changed to:");
	console.log(gameData['currentTurn']);
}

function ReShuffleTotalCards(gameData)
{
	var Playable_Deck = gameData['Playable_Deck'];
	var ShuffledDeck = [];
	for (var i = 1; i <= copyOfDeck.length - 1; i++)
	{
		var RanNum1 = Math.floor(Math.random() * Playable_Deck.length);
		ShuffledDeck.push(Playable_Deck[RanNum1]);
		Playable_Deck.splice(RanNum1, 1);
	}
	for (var i = 0; i <= ShuffledDeck.length - 1; i++)
	{
		gameData['totalCards'].push(ShuffledDeck[i]);
	}
}

function getRandomName()
{
	var randIndex = Math.floor(Math.random() * randomNames.length);
	console.log(randomNames[randIndex]);
	return randomNames[randIndex];
}

function dealUnoDeck(gameData,totalPlayers)
{
	var realPlayers = [];
	for (var i = 0; i < gameData['players'].length; i++)
	{
		realPlayers.push(gameData['players'][i].name);
	}
	gameData['players'] = [];
	
	
	for (var i = 0; i < totalPlayers; i++)
	{
		var List_Of_Cards = [];
		for (var j = 1; j <= 7; j++)
		{
			var RanNum = Math.floor(Math.random() * gameData['totalCards'].length);
			List_Of_Cards.push(gameData['totalCards'][RanNum]);
			gameData['totalCards'].splice(RanNum, 1);   //First Number Is Index You Want To Remove, Second is the number of elements to remove 
			if (j == 7)
			{
				var isAI = false;
				var playerName;
				if (i < realPlayers.length)
				{
					playerName = realPlayers[i];
					isAI = false;
				}
				else
				{
					playerName = "A.I. " + getRandomName();
					isAI = true;
				}
				var p = new Player (playerName, List_Of_Cards, i, isAI);
				gameData['players'].push(p);
			}
		}
	}
	gameData['Playable_Deck'] = [];
	gameData['currentTurn'] = 0;
	gameData['Playable_Deck'].push(gameData['totalCards'][0]);
	gameData['totalCards'].splice(0, 1);
}

function Card (Value, Color, filename)
{
	this.filename = filename;
	if (Value == 10) 
	{
		this.Value = "Skip";
	}
	else if (Value == 11) 
	{
		this.Value = "Reverse";
	}
	else if (Value == 12) 
	{
		this.Value = "+2";
	}
	else if (Value == 13) 
	{
		this.Value = "Wild";
		this.Color_Of_Wild = "Red";
	} 
	else if (Value == 14) 
	{
		this.Value = "Wild & + 4";
		this.Color_Of_Wild = "Red";
	} 
	else 
	{
		this.Value = Value;
	}

	if (Color == 0 || Color == 4) 
	{
		this.Color = "Red";
	}
	else if (Color == 1 || Color == 5) 
	{
		this.Color = "Yellow";
	} 
	else if (Color == 2 || Color == 6) 
	{
		this.Color = "Blue";
	}
	else if (Color == 3 || Color == 7) 
	{
		this.Color = "Green";
	}
	else
	{
		this.Color = Color;
	}		
}

function Player (Name, Cards, OrginalNumber, isAI)
{
	this.Name = Name;
	this.Cards = Cards;
	this.OrginalNumber = OrginalNumber;
	this.isAI = isAI;
}

app.post('/schoolStore/sell', function(req,res){
	console.log("Sell Params:");
	var params = req.params;
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("sell params: ");
	console.log(params);
	console.log("input body: ");
	console.log(input);

	var numberToAdd = input['quantity'];
	var barcode = input['barcode'];
	var item = getItemByBarcode(barcode);
	if (item != null)
	{
		var currentQuantity = item['quantity'];
	
		item['quantity'] = currentQuantity - numberToAdd;
	
		res.send({
			result: 'success',
			err: ''
		});
	}
	else
	{
		res.send('{ result: "error", err: "couldn\'t find an item by that barcode"}');
	}
});

app.post('/schoolStore/return', function(req,res){
	var params = req.params;
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("return params: ");
	console.log(params);
	console.log("input body: ");
	console.log(input);
	
	var numberToAdd = input['quantity'];
	var barcode = input['barcode'];
	var item = getItemByBarcode(barcode);
	if (item != null)
	{
		var currentQuantity = item['quantity'];
	
		item['quantity'] = currentQuantity + numberToAdd;
	
		res.send({
			result: 'success',
			err: ''
		});
	}
	else
	{
		res.send('{ result: "error", err: "couldn\'t find an item by that barcode"}');
	}
});

app.post('/schoolStore/restock', function(req,res){
	var params = req.params;
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("restock params: ");
	console.log(params);
	console.log("input body: ");
	console.log(input);

	var numberToAdd = input['quantity'];
	var barcode = input['barcode'];
	var item = getItemByBarcode(barcode);
	if (item != null)
	{
		var currentQuantity = item['quantity'];
	
		item['quantity'] = currentQuantity + numberToAdd;
	
		res.send({
			result: 'success',
			err: ''
		});
	}
	else
	{
		res.send('{ result: "error", err: "couldn\'t find an item by that barcode"}');
	}
});

function getItemByBarcode(barcode)
{
	for (var i = 0; i < schoolStoreInventory.length; i++)
	{
		var item = schoolStoreInventory[i];
		if (item['barcode'] == barcode)
		{
			return item;
		}
	}
	return null;
}

app.post('/schoolStore/addProduct', function(req,res){
	var params = req.params;
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("add product params: ");
	console.log(params);
	console.log("input body: ");
	console.log(input);
	
	var foundBarcode = false;
	for (var i = 0; i < schoolStoreInventory.length; i++)
	{
		var item = schoolStoreInventory[i];
		if (item['barcode'] == barcode)
		{
			foundBarcode = true;
		}
	}
	
	if (!foundBarcode)
	{
		schoolStoreInventory.push({ 
					barcode: input['barcode'], 
					productName: input['productName'], 
					size: input['size'], 
					salePrice: input['salePrice'], 
					manufacturedPrice: input['manufacturedPrice'],
					quantity: input['quantity']
				});
		res.send({
			result: 'success',
			err: '',
			items: schoolStoreInventory
		});
	}
	else
	{
		res.send({
			result: 'error',
			err: 'There is already an item with that barcode'
		});
	}
});


function setSchoolStoreFieldValue(barcode,field,value)
{
	for (var i = 0; i < schoolStoreInventory.length; i++)
	{
		var item = schoolStoreInventory[i];
		if (item['barcode'] == barcode)
		{
			schoolStoreInventory[i][field] = value;
		}
	}
}

app.post('/schoolStore/modifySalePrice', function(req,res){
	var params = req.params;
	var input = JSON.parse(JSON.stringify(req.body));
	console.log("modify sale price params: ");
	console.log(params);
	console.log("input body: ");
	console.log(input);
	var barcode = input['barcode'];
	var newPrice = input['salePrice'];
	setSchoolStoreFieldValue(barcode,'salePrice',newPrice);
	
	res.send({
		result: 'success',
		err: ''
	});
});

app.get('/schoolStore/getItemInfo/:barcode', function(req,res){
	var barcode = req.params.barcode;
	console.log("get item info barcode before decoded:");	
	console.log(barcode);
	barcode = barcode.replace(/\+/g, '%20');
	barcode = decodeURIComponent(barcode);   
	console.log("get item info barcode after decoded:");
	console.log(barcode);
	console.log("inventory:");
	console.log(schoolStoreInventory);
	for (var i = 0; i < schoolStoreInventory.length; i++)
	{
		var item = schoolStoreInventory[i];
		if (item['barcode'] == barcode)
		{
			res.send({result: "success", barcode: item['barcode'], productName: item['productName'], size: item['size'], salePrice: item['salePrice'], manufacturedPrice: item['manufacturedPrice'], err: "" });
			return;
		}    
	}
	if (barcode == "Vintage Karate - M - 15.00")
	{
		res.send('{ result: "success", barcode: "' + barcode + '", productName: "Vintage Karate", size: "M", salePrice: 15.00, manufacturedPrice: 15.00, err: "" }');
	}
	else
	{
		res.send('{ result: "error", err: "couldn\'t find an item by that barcode"}');
	}
});

app.get('/schoolStore/getInventory', function(req,res){
	console.log("get current prices");	
	if (schoolStoreInventory.length > 0)
	{
	    res.send({
			result: "success",
			err: "",
			items: schoolStoreInventory
	    });
	}
	else
	{
		res.send({
			result: "success",
			err: "",
			items:
			[
				{ 
					result: "success", 
					barcode: "Vintage Karate - M - 15.00", 
					productName: "Vintage Karate", 
					size: "M", 
					salePrice: 15.00, 
					manufacturedPrice: 15.00, err: "",
					quantity: 10
				},
				{ 
					result: "success", 
					barcode: "Falcons - L - 15.00", 
					productName: "Falcons", 
					size: "M", 
					salePrice: 15.00, 
					manufacturedPrice: 15.00, err: "",
					quantity: 30
				}
			]
		});
	}
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/unravel', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/unravelit.html'));
});

app.get('/gamehub', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/MultiplayerHub.html'));
});


app.get('/gamepage/:code', function(req,res){
	console.log("entered gamepage with no params");
	var code = req.params.code;
	var type = getGameDataForCode(code)['type'];
	if (type == "discussion")
	{
		res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/GameParticipantPage.html'));
	}
	else if (type == "tictactoe")
	{
		res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/tictactoe.html'));
	}
	else if (type == "uno")
	{
		res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/Uno_Card_Game_Multiplayer.html'));
	}
	else if (type == "typing race")
	{
		res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/typeRace.html'));
	}
});



function getRandomAlphaNumeric()
{
	var index = Math.floor(Math.random()*36);
	var char;
	if (index <= 25)
	{
		char = String.fromCharCode(index+65);
	}
	else
	{
		index -= 26;
		char = index.toString();
	}
	return char;
}

app.post('/addGameToServer/:type', function(req,res){
	var type = req.params.type;
	var gameCode = "";
	do
	{
		gameCode = "";
		for (var i = 0; i < 4; i++)
		{
			gameCode += getRandomAlphaNumeric();
		}
		gameCode = gameCode.toUpperCase();
	} while (getGameDataForCode(gameCode) != null && getGameDataForCode(gameCode) != undefined);
	if (type == "Discussion")
	{
		playerGroups.push({
			code: gameCode,
			type: "discussion",
			commentList:[],
			players:[]
		});
	}
	else if (type == "Tic-Tac-Toe")
	{
		playerGroups.push({
			code: gameCode,
			type: "tictactoe",
			gameState: [["","",""],["","",""],["","",""]],
			currentTurn: "X",
			players:[]
		});
	}
	else if (type == "UNO")
	{
		playerGroups.push({
			code: gameCode,
			type: "uno",
			numActions: 0,
			players:[],
			numAnimations: 0,
			currentTurn: 0,
			isReversed: false
		});
		makeDeck(gameCode);
	}
	else if (type == "Typing Race")
	{
		playerGroups.push({
			code: gameCode,
			type: "typing race",
			currentlyWinning: 0,
			startedRace: false,
			typingText: "When the road looks rough ahead and you're miles and miles from your nice warm bed, you just remember what your old pal said, boy, you've got a friend in me",
			typingText2: "Ivysaur is a quadruped Pokemon similar to a dinosaur. It has blue-green skin with darker patches. On top of its head are pointed ears with black insides, and it has narrow red eyes. It has a short, rounded snout with a wide mouth.",
			players:[]
		});
	}
	res.send({
		result: 'success',
		err: '',
		gameCode: gameCode
	});
});

app.post('/setTicTacToeMark/:code/:mark/:locX/:locY', function(req,res){
	var gameCode = req.params.code;
	var mark = req.params.mark;
	var locX = req.params.locX;
	var locY = req.params.locY;
	console.log("Game Code: " + gameCode);
	console.log("mark: " + mark);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		gameDataForCode['gameState'][locY][locX] = mark;
		if (mark == "X")
		{
			gameDataForCode['currentTurn'] = "O";
		}
		else
		{
			gameDataForCode['currentTurn'] = "X";
		}
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});

app.post('/resetTicTacToe/:code/:mark', function(req,res){
	var gameCode = req.params.code;
	var mark = req.params.mark;
	
	console.log("Game Code: " + gameCode);
	console.log("mark: " + mark);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		gameDataForCode['gameState'] = [["","",""],["","",""],["","",""]];
		
		gameDataForCode['currentTurn'] = mark;
		
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});

function getGameDataForCode(code)
{
	//console.log("input code: " + code);
	for (var i = 0; i < playerGroups.length; i++)
	{
		//console.log("element code: " + playerGroups[i]['code']);
		if (playerGroups[i]['code']==code)
		{
			//console.log("found and returning it");
			return playerGroups[i];
		}
	}
	return null;
}

app.get('/loadGameForClient/:code', function(req,res)
{
	var gameDataForCode = getGameDataForCode(req.params.code);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
});

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

app.post('/addClientToGame/:code/:username', function(req,res){
	var gameCode = req.params.code;
	var userName = req.params.username;
	console.log("Game Code: " + gameCode);
	console.log("user name: " + userName);
	var gameDataForCode = getGameDataForCode(gameCode);
	console.log(gameDataForCode);
	console.log(playerGroups);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		if (gameDataForCode.type == "discussion")
		{
			var color = getRandomColor();
					//gameData['players'][i]['color']=color;
			console.log("Number of players: " + gameDataForCode['players'].length);
			gameDataForCode['players'].push({"name":userName,"text":"I just joined","image":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png", "color":color});
			console.log("Number of players after adding " + userName + ": " + getGameDataForCode(gameCode)['players'].length);
			res.send({
				result: 'success',
				err: '',
				gameData: gameDataForCode
			});
		}
		else if (gameDataForCode.type == "tictactoe")
		{
			if (gameDataForCode['players'].length < 2)
			{
				gameDataForCode['players'].push({"name":userName,"wins":0});
				res.send({
					result: 'success',
					err: '',
					gameData: gameDataForCode
				});
			}
			else
			{
				res.send({
					result: 'error',
					err: 'There are already two players in that game'
				});
			}
		}
		else if (gameDataForCode.type == "uno")
		{
			if (gameDataForCode['players'].length < 10)
			{
				gameDataForCode['players'].push({"name":userName});
				res.send({
					result: 'success',
					err: '',
					gameData: gameDataForCode
				});
			}
			else
			{
				res.send({
					result: 'error',
					err: 'There are already two players in that game'
				});
			}
		}
		else if (gameDataForCode.type == "typing race")
		{
			
			var color = getRandomColor();
			gameDataForCode['players'].push({"name":userName, 
							 "charactersTyped":0, 
							 "wpm":0, 
							 "image":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png",
							 "wins":0,
							 "color":color});
			res.send({
				result: 'success',
				err: '',
				gameData: gameDataForCode
			});
		}
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});

app.post('/ticTacToeWin/:code/:mark', function(req,res){
	var gameCode = req.params.code;
	var mark = req.params.mark;
	
	console.log("Game Code: " + gameCode);
	console.log("mark: " + mark);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		if (mark == "X")
		{
			gameDataForCode['players'][0].wins += 1;
		}
		else if (mark == "O")
		{
			gameDataForCode['players'][1].wins += 1;
		}
		
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});

function getIndexOfPlayerByName(code,name)
{
	var gameDataForCode = getGameDataForCode(code);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		for (var i = 0; i < gameDataForCode['players'].length; i++)
		{
			var player = gameDataForCode['players'][i];
			if (player['name'] == name)
			{
				return i;
			}
		}
	}
	return -1;
}

app.post('/typing/startRace/:code', function(req,res){
	var gameCode = req.params.code;
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		gameDataForCode['startedRace'] = true;
		var players = gameDataForCode['players'];
		for (var i = 0; i < players.length; i++)
		{
			players[i]['charactersTyped'] = 0;
			players[i]['wpm'] = 0;
		}
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
});
	 
app.post('/typing/resetRace/:code', function(req,res){
	var gameCode = req.params.code;
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		gameDataForCode['startedRace'] = false;
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
});	 

app.post('/typing/setClientDistance/:code/:username/:charactersTyped', function(req,res){
	var gameCode = req.params.code;
	var userName = req.params.username;
	var charsTyped = req.params.charactersTyped;
	//console.log("Game Code: " + gameCode);
	//console.log("user name: " + userName);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		var playerIndex = getIndexOfPlayerByName(gameCode,userName);
		gameDataForCode['players'][playerIndex]['charactersTyped'] = charsTyped;
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}

});

app.post('/setClientMessage/:code/:username/:message', function(req,res){
	var gameCode = req.params.code;
	var userName = req.params.username;
	var newMessage = req.params.message;
	console.log("Game Code: " + gameCode);
	console.log("user name: " + userName);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		var playerIndex = getIndexOfPlayerByName(gameCode,userName);
		gameDataForCode['players'][playerIndex]['text'] = newMessage;
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});

app.post('/setClientImageUrl/:code/:username/:url', function(req,res){
	var gameCode = req.params.code;
	var userName = req.params.username;
	var url = req.params.url;
	console.log("Game Code: " + gameCode);
	console.log("user name: " + userName);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		var playerIndex = getIndexOfPlayerByName(gameCode,userName);
		gameDataForCode['players'][playerIndex]['image'] = url;
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});

app.post('/addPlayerCommentToList/:code/:username/:message', function(req,res){
	var gameCode = req.params.code;
	var userName = req.params.username;
	var message = req.params.message;
	console.log("Game Code: " + gameCode);
	console.log("user name: " + userName);
	console.log("message: " + message);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		gameDataForCode['commentList'].push({userName:userName,message:message});
		res.send({
			result: 'success',
			err: '',
			gameData: gameDataForCode
		});
	}
	else
	{
		console.log("player group is undefined");
		console.log("Here is what playerGroups looks like: ");
		console.log(playerGroups);
		res.send({
			result: 'error',
			err: 'There is no game open using that code'
		});
	}
	
});


app.get('/unoAIHadden', function(req,res){
	//res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/Uno_Card_Game_AI.html'));

res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/Uno_Card_Game_AI_With_Updates.html'));
});

app.get('/Uno_Card_Script.js', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/Uno_Card_Script_Obfuscated.js'));
});

app.get('/Uno_Card_Script_Multiplayer.js', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/Uno_Card_Script_Multiplayer.js'));
});

app.get('/image4x4', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/imageSort.html'));
});


app.get('/image5x5', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/imageSort5x5.html'));
});


app.get('/sortit4x4', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/sortit4x4.html'));
});

app.get('/sortit5x5', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/sortit5x5.html'));
});

app.get('/', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/index.html'));
});

app.get('/doubleit', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/DoubleIt/index.html'));
});

app.get('/ilonggo', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/The_Giant_Ilonggo_Phrasebook_Second_Edition.pdf'));
});

app.get('/ilonggo3', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/The Giant Ilonggo Phrasebook Third Edition.pdf'));
});

app.get('/how-will-they-know-medley', function(req,res){
res.sendFile(path.resolve(__dirname + '/../SheetmusicDownload/___ How Will They Know - We\'ll Bring the World His Truth.pdf'));
});

app.get('/how-will-they-know-medley-midi', function(req,res){
res.sendFile(path.resolve(__dirname + '/../SheetmusicDownload/___ How Will They Know - We\'ll Bring the World His Truth.mid'));
});

app.get('/doubleitrush/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/DoubleItRush/'+req.params.filename));
});

app.get('/doubleitrush', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/DoubleItRush/index.html'));
});

app.get('/doubleiteasy', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/DoubleEasy/index.html'));
});

app.get('/friendsinabox', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/index.html'));
});

app.get('/band', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/index.html'));
});

app.get('/hannah', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/hannah/index.html'));
});

app.get('/library', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/CommunityLibrary/index.html'));
});

app.get('/helplist', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/helplist.html'));
});

app.get('/giant-ilonggo-phrasebook', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/Ilonggo.html'));
});

app.get('/videos/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/hannah/videos/'+req.params.filename));
});

app.get('/UnoCards/:cardname', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/images/UnoCards/'+req.params.cardname));
});

app.get('/BAND/MAINFILES/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/BAND/MAINFILES/'+req.params.filename));
});

app.get('/BAND/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/BAND/'+req.params.filename));
});

app.get('/BAND/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/band/BAND/MAINFILES/'+req.params.filename));
});

app.get('/MOVIEPOSTER/:filename', function(req,res){
res.sendFile(path.resolve(__dirname + '/../FrontEnd/images/MoviePosters/'+req.params.filename));
});


app.get('/enterPassword/:entry', function(req,res)
{
	var guess = req.params.entry;
	if (guess == "mano")
	{
		res.send({
			result: 'success',
			err: '',
			only: '1'
		});
	}
	else if (guess == "lyle")
	{
		res.send({
			result: 'success',
			err: '',
			only: '2'
		});
	}
	else
	{
		res.send({
			result: 'success',
			err: '',
			only: 'nope'
		});
	}
});

app.get('/checkHaddensPassword/:entry', function(req,res)
{
	var guess = req.params.entry;
	if (guess == "nd888nd7")
	{
		res.send({
			result: 'success',
			err: '',
			correct: true
		});
	}
	else
	{
		res.send({
			result: 'success',
			err: '',
			correct: false
		});
	}
});


app.get('/selectall/:table', function(req,res){
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('SELECT * FROM '+req.params.table+' ORDER BY id', req.params.id, function(err, rows, fields)
			{
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				res.send({
					result: 'success',
					err: '',
					fields: fields,
					json: rows,
					length: rows.length,
					only: 'more',
					fire: 'gulp',
					checker: '55',
					q1a: '499275',
					q1b: '499,275',
					q2a: '4603',
					q2b: '4,603',
					q3a: '1414',
					q3b: '1,414',
					q4a: '1134903170',
					q4b: '1,134,903,170',
					q5: 'ice cream sundaes were invented when it became illegal to sell ice cream sodas on a sunday in evanston illinois soda was replaced with syrup and the sundae was born'
				});
				connection.release();
			});
		}
	});
});
app.get('/selectwhere/:table/:field/:field_value', function(req,res){
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('SELECT * FROM ' + req.params.table+' WHERE ' + req.params.field+' = ' + req.params.field_value, function(err, rows, fields)
			{
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				res.send({
					result: 'success',
					err: '',
					fields: fields,
					json: rows,
					length: rows.length
				});
				connection.release();
			});
		}
	});
});
app.get('/check/:table/:field/:field_value', function(req,res) {
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('SELECT * FROM ' + req.params.table+' WHERE ' + req.params.field+' = \'' + req.params.field_value + '\'', function(err, rows, fields)
			{
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				else
				{
					var exists = true;
					if (rows.length < 1)
					{
						exists = false;
					}
				}
				res.send({
					result: 'success',
					err: '',
					fields: fields,
					json: rows,
					length:rows.length,
					exists: exists
				});
				connection.release();
			});
		}
	});
});
app.get('/login/:username/:password', function(req,res) {
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('SELECT * FROM users WHERE username = \''+req.params.username+'\'', function(err, rows, fields)
			{
				if (err) {
					console.error(err);
					res.statusCode = 500;
					res.send({
						result: 'error',
						err: err.code
					});
				}
				else
				{
					var valid_username = false;
					var valid_password = false;
					if (rows.length > 0)
					{
						valid_username = true;
						if (rows[0].password == req.params.password)
						{
							valid_password = true;
						}
					}
				}
				res.send({
					result: 'success',
					error: '',
					valid_username : valid_username,
					valid_password : valid_password,
					user: rows[0]
				});
				connection.release();
			});
		}
	});
});
app.post('/insert/:table', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		var data = {};
		if (req.params.table == 'users')
		{

			data = {
				username : input.username,
				password : input.password,
				email : input.email,
				contributions : input.contributions,
				abuse_strikes : input.abuse_strikes

			};
		}
		else if (req.params.table == 'languages')
		{
			data = {
				language_name : input.language_name
			};
		}
		else if (req.params.table == 'entries')
		{
			data = {
				language_id : input.language_id,
				term : input.term,
				definition : input.definition,
				part_of_speech : input.part_of_speech,
				first_contributed_user : input.first_contributed_user,
				last_contributed_user: input.last_contributed_user
			};
		}
		else if (req.params.table == 'media_library')
		{
			data = {
				title : input.title,
				description : input.description,
				type : input.type,
				ownerID : input.ownerID,
				ownerName: input.ownerName,
				available: input.available,
				show_entry: input.show_entry
			};
		}
		else if (req.params.table == 'help_list')
		{
			data = {
				student_name : input.student_name,
				show_entry: input.show_entry,
				ip_info: input.ip_info,
				time_stamp: input.time_stamp
			};
		}
		else if (req.params.table == 'discussion')
		{
			data = {
				text : input.text,
				show_entry: input.show_entry,
				ip_info: input.ip_info,
				time_stamp: input.time_stamp
			};
		}
		else if (req.params.table == 'leader_board')
		{
			data = {
				name : input.name,
				time_entered : input.time_entered,
				show_entry: input.show_entry
			};
		}
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			if (req.params.table == 'entries'){
				connection.query('UPDATE users SET contributions = contributions+1 WHERE username = \'' + input.first_contributed_user + '\'', function (err, result) {
					if (err) throw err;
				//res.send('User contribution count has increased.');
				connection.release();
			});
			}
			connection.query('INSERT INTO ' + req.params.table + ' SET ?', data, function (err, result) {
				if (err) throw err;
				res.send('User added to the database with ID: ' + result.insertID);
				connection.release();
			});
		}
	});
});

app.post('/deleteAllFromHelpList', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE help_list SET show_entry = 0 WHERE 1 = 1', function (err, result) {
				if (err) console.error('delete all from helplist error: ', err);
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});


app.post('/deleteNameFromHelpList', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE help_list SET show_entry = 0 WHERE id = \'' + input.id + '\'', function (err, result) {
				if (err) console.error('delete one from help list error: ', err);
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});

app.post('/deleteAllComments', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE discussion SET show_entry = 0 WHERE 1 = 1', function (err, result) {
				if (err) console.error('delete all comments error: ', err);
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});


app.post('/deleteCommentFromDiscussion', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE discussion SET show_entry = 0 WHERE id = \'' + input.id + '\'', function (err, result) {
				if (err) console.error('delete one comment error: ', err);
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});

app.post('/deleteLeader', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE leader_board SET show_entry = 0 WHERE id = \'' + input.id + '\'', function (err, result) {
				if (err) console.error('delete a leader error', err);
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});

app.post('/deleteMedia', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE media_library SET show_entry = 0 WHERE id = \'' + input.id + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});

app.post('/unhideMedia', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE media_library SET show_entry = 1 WHERE id = \'' + input.id + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});


app.post('/addPoster', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			//console.log(input.Poster);
			connection.query('UPDATE media_library SET Poster = \'' + input.Poster + '\' WHERE id = \'' + input.id + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});


app.post('/updateMedia', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE media_library SET title = \'' + input.title + '\', ownerName = \'' + input.ownerName +
				'\', description = \'' + input.description + '\'' + ' WHERE id = \'' + input.id + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});

		}
	});
});


app.post('/update/:entry', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE users SET contributions = contributions+1 WHERE username = \'' + input.last_contributed_user + '\'', function (err, result) {
				if (err) throw err;
				connection.release();
			});

			connection.query('UPDATE entries SET definition = \'' + input.definition + '\', last_contributed_user = \'' + input.last_contributed_user + '\' WHERE term = \'' + input.term + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});
		}
	});
});

app.post('/flag/:entry', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE users JOIN entries ON entries.last_contributed_user = users.username SET users.abuse_strikes = users.abuse_strikes+1 WHERE entries.term = \'' + input.term + '\'', function (err, result) {
				if (err) throw err;
				res.send('User updated the database with ID: ' + result.insertID);
				process.stdout.write("responded postively: ");
				connection.release();
			});
		}
	});
});

app.post('/increment/:game', function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	connectionpool.getConnection(function(err, connection) {
		if (err) {
			console.error('CONNECTION error: ', err);
			res.statusCode = 503;
			res.send({
				result: 'error',
				err: err.code
			});
		}
		else
		{
			connection.query('UPDATE games SET game_count = game_count+1 WHERE game_title = \'' + req.params.game + '\'', function (err, result) {
				if (err) throw err;
				else {
					connection.query('SELECT game_count FROM games WHERE game_title = \''+req.params.game+'\'', function(err, rows, fields) {
						if (err)
						{
							console.log("ERROR!!!");
						}

						var numViews = rows[0].game_count;
						var xmlObj = [{ views: numViews }];
						res.set('Content-Type', 'text/xml');
						res.send(xml(xmlObj));
						console.log("ROWS[0]: " + rows[0]);
						console.log("ROWS[0].game_count: " + rows[0].game_count);
						//res.send(
						//rows[0].game_count
						//);
						connection.release();
					});
				};


				process.stdout.write("responded postively: ");
				connection.release();
			});
		}
	});
});

app.get('/:folder/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/' + req.params.folder + '/' + req.params.filename));
});

app.get('/GAMES/FriendsInABox/Avatars/:folder/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/Avatars/' + req.params.folder + '/' + req.params.filename));
});

app.get('/GAMES/FriendsInABox/Avatars/:folder1/:folder2/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/Avatars/' + req.params.folder1 + '/' + req.params.folder2 + '/' + req.params.filename));
});

app.get('/GAMES/FriendsInABox/Backgrounds/:filename', function(req,res){
	res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/FriendsInABox/Backgrounds/' + req.params.filename));
});

app.post('/inbound', function(request, response) {
    response.type('text/xml');
    response.send('<Response><Say>Hello there! Thanks for calling Paul\'s Server.</Say></Response>');
});

app.post('/incomingtext', function(request, response) {
    response.type('text/xml');
    response.send('<Response><h1>Hello there! Thanks for texting Paul\'s Server.</h1></Response>');
});

app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){});
app.listen(80);
console.log('Paul and Mitch\'s Rest API listening on port 80');
