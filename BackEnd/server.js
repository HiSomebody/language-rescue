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
	}
];


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
	}
	else if (type == "typing race")
	{
		res.sendFile(path.resolve(__dirname + '/../FrontEnd/GAMES/MultiplayerTypingRace.html'));
	}
});


/*
const Transform = require('stream').Transform;
const parser = new Transform();
parser._transform = function(data, encoding, done) {
	//console.log(data.toString());
	const str = data.toString().replace('<head><script>', '<head><script>var importantData = {"code": "'+tempCode+'", "username": "'+tempUsername+'"};');
	//console.log("STARTING NEW HTML" + str.substring(0,200) + "ENDING NEW HTML");
	this.push(str);
	done();
};
*/

/*
app.use('/index.html', (req, res) => {
	res.write('<!-- Begin stream -->\n');
	fs
	.createReadStream('../public/index.html')
	.pipe(parser)
	.on('end', () => {
	res.write('\n<!-- End stream -->')
	}).pipe(res);
});
*/

/*
app.get('/gamepage/:code/:username', function(req,res)
{
	tempCode = req.params.code;
	tempUsername = req.params.username;
	console.log("entered gamepage with params");
	res.write('<!-- Begin stream -->\n');
	var readStream = fs.createReadStream(__dirname + '/../FrontEnd/GAMES/GameParticipantPage.html');
	readStream.pipe(parser);
	readStream.on('end', function() {
		res.write('\n<!-- End stream -->');
	});
	readStream.pipe(res);
	/*

	res.send({
		result: 'success',
		err: '',
		code: code,
		username: username
	});
	
});
*/

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
	else if (type == "Typing Race")
	{
		playerGroups.push({
			code: gameCode,
			type: "typing race",
			currentlyWinning: 0,
			startedRace: false,
			typingText: "Ivysaur is a quadruped Pokemon similar to a dinosaur. It has blue-green skin with darker patches. On top of its head are pointed ears with black insides, and it has narrow red eyes. It has a short, rounded snout with a wide mouth. Two pointed teeth protrude from its upper jaw. Each of its feet has three claws on them. The bulb on its back has bloomed into a large pink bud. A short brown trunk surrounded by leafy green fronds supports the bud.",
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
		else if (gameDataForCode.type == "typing race")
		{
			
			var color = getRandomColor();
			gameDataForCode['players'].push({"name":userName, 
							 "distance":0, 
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
}
	 
app.post('/typing/restartRace/:code', function(req,res){
	var gameCode = req.params.code;
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		gameDataForCode['startedRace'] = false;
		var players = gameDataForCode['players'];
		for (var i = 0; i < players.length; i++)
		{
			players[i]['distance'] = 0;
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
}	 

app.post('/typing/setClientDistance/:code/:username/:distance', function(req,res){
	var gameCode = req.params.code;
	var userName = req.params.username;
	var distance = req.params.distance;
	//console.log("Game Code: " + gameCode);
	//console.log("user name: " + userName);
	var gameDataForCode = getGameDataForCode(gameCode);
	if (gameDataForCode != undefined && gameDataForCode != null)
	{
		console.log("success");
		var playerIndex = getIndexOfPlayerByName(gameCode,userName);
		gameDataForCode['players'][playerIndex]['distance'] = distance;
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

}

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
