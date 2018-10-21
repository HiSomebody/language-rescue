			
	// In order to do HTTP calls (requests) to the server	
	var HttpClient = function() {
	    this.get = function(aUrl, aCallback) {
	        var anHttpRequest = new XMLHttpRequest();
	        anHttpRequest.onreadystatechange = function() { 
	            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
	                aCallback(anHttpRequest.responseText);
	        }
	        anHttpRequest.open( "GET", aUrl, true );            
	        anHttpRequest.send( null );
	    }
	
		this.post = function(aUrl, aCallback) {
		var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		      	aCallback(xhttp.responseText);
		    }
		  };
		  xhttp.open("POST", aUrl, true);
		  xhttp.send();
	  }
	}
	
	// making it multiplayer
	// * defined, maintained in a game object **encapsulated** object on server
	var gameDataFromServer;
	
	var totalCards; // *
	var Players; // *
	var Playable_Deck; // *
	var Whos_Turn = -1; // *
	var CardIndex; // *
	var RealPlayer0 = 0; // This should be assigned when the player joins game
	var NeedsToSayUno = false; // This should be associated with a player on server
	var SomeOneWon = false; // *
	
	// Keep on Client
	var DevloperMode;
	var AITime = 1500;
	var checkbox;
	var checkbox2;
	var checkbox3;
	var checkbox4;
	var checkbox5;
	var checkbox6;
	var button;
	var button2;
	var label;
	var label2;
	var label3;
	var label4;
	var label5;
	var AITIMER;
	var AITimeInput;
	var modal; 
	var deck;
	var hand
	var UNObutton;
	var textArea;
	var playDelay = 1500 // *
	var code;
	var username;
	var numPlayers = 1;
	var startedGame = false;
	var shiftAmount = 0;
	var numActionsHappened = 0;
	var numAnimationsHappened = 0;
	


	
	// Keep on client
	window.onload = function()
	{		
		code = GetURLParameter("gameCode");
		username = decodeURIComponent(GetURLParameter("username"));
		
		
		// get gamedata from server
		getGameData(function(gameData){
				// on success
				
		});
		
		
		setUpDevControls();
		addNumberPlayersListener();
		//makeDeck(); // server task
		configureColorChooserModal();
		getElements();
		/*Prints Out Deck
		for(var i = 0; i < totalCards.length; i ++)
		{
			console.log(totalCards[i]);
		}
		console.log(totalCards.length);*/
	}
	
	setInterval(function(){
		getGameData(function(gameData){
			if (startedGame)
			{
				// get gamedata from server to update players list			
				var newNumActions = gameData['numActions'];
				var newNumAnimations = gameData['numAnimations'];
				
				if (newNumAnimations != numAnimationsHappened) // Server says there's an animation to do
				{
					numAnimationsHappened = newNumAnimations;	
					doAnimationAction(gameData);
				}
				if (newNumActions != numActionsHappened) // Server says the master deck and hands changed
				{
					numActionsHappened = newNumActions;

					// Shift this client to be front of list in this view only
					Players = gameData['players'];
					for (var i = 0; i < Players.length; i++)
					{
						if (Players[i].Name == username)
						{
							shiftAmount = i;
						}
					}
					for (var i = 0; i < shiftAmount; i++)
					{
						var firstElement = Players.shift();
						Players.push(firstElement);
					}
					
					// Update game state variables from server
					Whos_Turn = (gameData['currentTurn'] + shiftAmount)%gameData['players'].length;
					totalCards = gameData['totalCards'];
					Playable_Deck = gameData['Playable_Deck'];
					SomeOneWon = gameData['SomeOneWon'];
					
					// redraw game with updates
					Update_Cards();
				}
				return;
			}
			else if (gameData.startedGame == true)
			{
				// Starting game
				startedGame = true;
				startGame(gameData);
			}
			else
			{
				// Checking if others have joined before we start
				var waitingDiv = document.getElementById("waitingText");
				waitingDiv.innerHTML = "Waiting for Other Players to Join with Game Code: " + code;
				var joinedDiv = document.getElementById("joined");
				var players = gameData['players'];
				joinedDiv.innerHTML = "JOINED: ";
				numPlayers = players.length;
				for (var i = 0; i < players.length; i++)
				{
					var p = players[i];
					var playerName = p.name;
					joinedDiv.innerHTML += playerName;
					if (i < players.length-1)
					{
						joinedDiv.innerHTML += ", "
					}
				}
			}
		});
	},1000);
	
	
	var GetURLParameter = function(sParam)
	{
		var sPageURL = window.location.search.substring(1);
		//console.log("URL to check: " + sPageURL);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	}
	
	function getGameData(callback)
	{
		// do an http GET
		// on success perform callback function
		var client = new HttpClient();
		client.get('http://104.236.169.62:80/loadGameForClient/'+code, function(response) {
			var parsedJSON = (JSON.parse(response));
			
			if (parsedJSON["result"] == "success")
			{
				var gameData = parsedJSON['gameData'];
				callback(gameData);
			}
			else
			{
					// unable to get data from server
			}
		});	
	}
	
	
	// keep on client
	function setUpDevControls()
	{
		//Makes Developer Buttons
		checkbox = document.createElement('input');
		checkbox.type = "checkbox";
				
		label = document.createTextNode('Unlimited Drawing');
				
		checkbox2 = document.createElement('input');
		checkbox2.type = "checkbox";
				
		label2 = document.createTextNode('Can Play Any Card');
				
		checkbox3 = document.createElement('input');
		checkbox3.type = 'checkbox';
			
		label3 = document.createTextNode('Don\'t Have to Click Uno');
	
		checkbox4 = document.createElement('input');
		checkbox4.type = 'checkbox';
			
		label4 = document.createTextNode('AI Can Play Any Card');
				
		AITimeInput = document.createElement('input');
		AITimeInput.placeholder = ("# Of Seconds In AI Timer");
				
		button = document.createElement('Button');
		button.innerHTML = 'Update';                   //MAKE ME A REGULAR BUTTON
		AITIMER = Math.floor(AITimeInput.value);
		button.onclick = function()
		{
			AITime = AITIMER * 1000;
		}
				
		button2 = document.createElement('Button');
		button2.innerHTML = 'Get Out Of Devoloper mode';
		button2.onclick = function()
		{
			var DM = document.getElementById('DM');
			checkbox.checked = false;
			checkbox2.checked = false;
			checkbox3.checked = false;
			checkbox4.checked = false;
			AITime = 1500;
			DevloperMode = false;
			document.getElementById("ta").style.display = "none";
			while (DM.hasChildNodes()) {                                //Removes All DevloperMode stuff
				DM.removeChild(DM.lastChild);
			}
			var toggleShowData = document.getElementById("toggleShowData").disabled = false;
			Update_Cards();
		}
	}
		
	// keep on client	
	function addNumberPlayersListener()
	{
		var input = document.getElementById("numberPlayersTextField");
		// Execute a function when the user releases a key on the keyboard
		input.addEventListener("keyup", function(event) {
		  	// Cancel the default action, if needed
			event.preventDefault();
		 	// Number 13 is the "Enter" key on the keyboard
		  	if (event.keyCode === 13) {
				// Trigger the button element with a click
				document.getElementById("ShuffleAndDealButton").click();
		  	}
		});
	}	
		
		
	// Keep with Client	
	function configureColorChooserModal()
	{
		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];
		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none";
		}
		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}
	}
	
	// keep on client
	function getElements()
	{
		modal = document.getElementById('myModal');
		UNObutton = document.getElementById("UNO");
		deck = document.getElementById("deck");
		hand = document.getElementById("hand");
		checkbox5 = document.getElementById('NoPopUps');
		checkbox6 = document.getElementById('No_Animation');
		textArea = document.getElementById("ta");
		textArea.style.color = "black";
	}
	
	// Ideally this only runs once per client
	function startGame(gameData)
	{
		startedGame = true;
		var gameControls = document.getElementById('gameControls');
		gameControls.style.display = "block";
		var gameConfig= document.getElementById('gameConfig');
		gameConfig.style.display = "none";	
		var Error = document.getElementById("Error");
		Error.style.display = "none";
		Players = gameData['players'];
		for (var i = 0; i < Players.length; i++)
		{
			if (Players[i].Name == username)
			{
				shiftAmount = i;
			}
		}
		for (var i = 0; i < shiftAmount; i++)
		{
			var firstElement = Players.shift();
			Players.push(firstElement);
		}
		Whos_Turn = (gameData['currentTurn'] + shiftAmount)%gameData['players'].length;
		
		
		//if (checkbox5.checked == false) //alert(Players.length + " Players will be dealt");
		totalCards = gameData['totalCards'];
		Playable_Deck = gameData['Playable_Deck'];
		Update_Cards();
	}
	
	// Both Client and Server mix	
	function ShuffleAndDealCards()
	{
		// Client
		var ShuffleAndDealButton = document.getElementById("ShuffleAndDealButton");
		var textField = document.getElementById("numberPlayersTextField");
		var numberAIs = Math.floor(textField.value);
		var controls = document.getElementById("controlPanel");
		var Error = document.getElementById("Error");
		var node = document.createTextNode("Only a maxumuim of 10 people and a minimum of 2 players");
		controls.appendChild(Error);
		
		
		// Server code. But players should already be initialized as they join in waiting period before anything is dealt  
		
		// Instead here there should be GET code to retrieve up-to-date gameData object
		var totalPlayers = numPlayers + numberAIs;
		if (totalPlayers <= 10 && totalPlayers >= 2)
		{
			//SERVER Call -------------
			// POST DealUnoCards
			var client = new HttpClient();
			client.post('http://104.236.169.62:80/dealUnoCards/'+code+'/'+totalPlayers, function(response) {
				var parsedJSON = (JSON.parse(response));
			    //console.log(parsedJSON);
				if (parsedJSON["result"] == "success")
				{
					var gameData = parsedJSON['gameData'];
					startGame(gameData);
				}
				else
				{
					console.log("failed to deal cards");
					//document.appendChild(failedDiv);
				}
			});		
			
			//END SERVER ---------
			
		} else {
			Error.style.color = "red";
			Error.style.display = "block";
		}
	}
	
	// client
	function getOtherPlayerCardDiv(card_filename)
	{
		var playerDeckId = "Player " + (Players[Whos_Turn].OrginalNumber + 1);
		var cardDivs = document.getElementById(playerDeckId).childNodes;
		var cardDiv = cardDivs[CardIndex]
		return cardDiv;
		/*for (var i = 0; i < cardDivs.length; i++)
		{
			var cardDiv = cardDivs[i];
			if (parseFilename(cardDiv.src) == card_filename)
			{
				return cardDiv;
			}
		}*/
		return null;
	}
	
	// client
	function getMyCardDiv(card_filename)
	{
		var cardDivs = document.getElementById("hand").childNodes;
		for (var i = 0; i < cardDivs.length; i++)
		{
			var cardDiv = cardDivs[i];
			if (parseFilename(cardDiv.src) == parseFilename(card_filename))
			{
				return cardDiv;
			}
		}
		return null;
	}
		
	// client	
	function drawOtherPlayersCards()
	{
		var OtherPlayersDecks = document.getElementById("OtherPlayers");
		while (OtherPlayersDecks.hasChildNodes()) {                                //Removes All Card Imgs
			OtherPlayersDecks.removeChild(OtherPlayersDecks.lastChild);
		}
		
		
		for (var i = 0; i < Players.length-1; i++)
		{
			
			var aPlayer;
			var highlightedIndex = i;
			if (RealPlayer0 == 0)        //If not reversed start drawing other players with index 1
			{
				aPlayer = Players[i+1];
				highlightedIndex = i + 1;
			}
			else
			{							// If reversed start drawing other players with index 0 (this client is the last index)
				aPlayer = Players[i];
			}
			
			var otherPlayerHand = document.createElement("div");
			otherPlayerHand.setAttribute("id","Player " + (aPlayer.OrginalNumber + 1));
			var PlayerLabel = document.createTextNode(aPlayer.Name);
			
			var linebreak6 = document.createElement("br");

			otherPlayerHand.style.display = 'inline';
						
			if (highlightedIndex == Whos_Turn)
			{
				otherPlayerHand.style.border = 'solid 5px';
			}
			
			OtherPlayersDecks.appendChild(PlayerLabel);
			OtherPlayersDecks.appendChild(linebreak6);
			
			for(var j = 0; j < aPlayer.Cards.length; j++)
			{
				var DOM_img = document.createElement("img");
				if (DevloperMode != true)
				{
					DOM_img.src = "http://104.236.169.62/UnoCards/back_of_card.png";
				}
				else
				{
					DOM_img.src = aPlayer.Cards[j].filename;
				}
				DOM_img.width = "25";
				
				otherPlayerHand.appendChild(DOM_img);
			}
			
			OtherPlayersDecks.appendChild(otherPlayerHand);
			var linebreak6 = document.createElement("br");
			var linebreak7 = document.createElement("br");
			
			OtherPlayersDecks.appendChild(linebreak6);
			OtherPlayersDecks.appendChild(linebreak7);
		}
		
	}
	
	// client and server mix
	function drawDrawAndDiscardPile()
	{
		while (deck.hasChildNodes()) {                                //Removes All Card Imgs from deck
			deck.removeChild(deck.lastChild);
		}
		while (hand.hasChildNodes()) {                                //Removes All Card Imgs from hand
			hand.removeChild(hand.lastChild);
		}
		
		// if wild was played last this will tell people what the current color is
		if (Playable_Deck[Playable_Deck.length - 1].Color == "Black") {
			var Wild_Color = document.createTextNode(Playable_Deck[Playable_Deck.length - 1].Color_Of_Wild);
			deck.appendChild(Wild_Color);
		}
		
			
		var linebreak3 = document.createElement("br");
			deck.appendChild(linebreak3);
			
		var DOM_img = document.createElement("img");                  //Creates Playable_Deck Pile
		DOM_img.setAttribute("id","playableDeck");
		DOM_img.src = Playable_Deck[Playable_Deck.length - 1].filename;
		deck.appendChild(DOM_img);
			
		DOM_img = document.createElement("img");                      //Creates Back of Uno Card/Draw Pile
		DOM_img.src = "http://104.236.169.62/UnoCards/back_of_card.png";
		DOM_img.setAttribute("id", "drawPile");
		deck.appendChild(DOM_img);
		DOM_img.onclick = function()
		{
			// server call for draw - should notify all clients that a card was drawn by this player to start their animation
			if (DevloperMode == true && Whos_Turn != RealPlayer0 && checkbox.checked == true) 
			{
				Draw(false);
			}
			if (Whos_Turn == RealPlayer0){
				// post "play" and card index (the server should already know whose turn it is, and therefore who is playing the card)
				// This should increase the number of actions taken, also update the cardIndex
				var client = new HttpClient();
				client.post('http://104.236.169.62:80/unoAction/'+code+'/draw/-1/NA', function(response) {
					var parsedJSON = (JSON.parse(response));
					if (parsedJSON["result"] == "success")
					{
						console.log("succeeded in adding draw card action");
					}
					else
					{
						console.log("failed to add play card action");
						//document.appendChild(failedDiv);
					}
				});		
				/*
				var card_filename = Draw(false);
				setTimeout(function(){
					
					var card_div = getMyCardDiv(card_filename);
					setCardIndex(card_div);
					if (CanPlayCard())
					{
						setTimeout(function() {
							var r = confirm("Would you like to play the card you just drew?")
							if (r == true)
							{
								if (document.getElementById("hand").childNodes.length == 2)
								{
									// remove most of this surrounding check stuff and make say uno depend on other players' click rather than number cards
									setTimeout(function() {
										card_div.onclick();
									},2500);
								}
								else
								{
									card_div.onclick();
								}
							}
							else
							{
								PlayGame(); // send notification for next turn
							}
						}, 500);
					}
					else
					{
						PlayGame(); // send notification for next turn
					}
				},playDelay);
				*/
			}
		}
			
		var linebreak = document.createElement("br");
		deck.appendChild(linebreak);
			
		var linebreak2 = document.createElement("br");
		deck.appendChild(linebreak2);
		if(Whos_Turn == RealPlayer0)
		{
			var t = document.createTextNode("Yore Turn");//"Yore cards, (Yore Turn)");
		} else {
			if (Whos_Turn == -1)
			{
				var t = document.createTextNode("");//Yore cards, (Player " + (Players[0].OrginalNumber + 1) + " Turn)");
			} else {
				var t = document.createTextNode("");//Yore cards, (Player " + (Players[Whos_Turn].OrginalNumber + 1) + " Turn)");
			}
		}
		deck.appendChild(t);
			
		var linebreak1 = document.createElement("br");
		deck.appendChild(linebreak1);
	}	
	
	// change this to be a server call on a click
	function unoPenaltyCheck(thisPlayer)
	{
		if (thisPlayer.Cards.length == 2 && UNObutton.disabled == false && checkbox3.checked == false)
		{
			NeedsToSayUno = true;
			//if (checkbox5.checked == false) alert("You have been dealt 2 extra cards for not clicking Uno Button");
		}
		else 
		{
			NeedsToSayUno = false;
			UNObutton.disabled = false;
		}
		if (NeedsToSayUno)
		{
			for (var i = 0; i < 2; i++)
			{
				thisPlayer.Cards.push(totalCards[0]);
				totalCards.splice(0, 1);
			}
		}
	}
	
	
	function doAnimationAction(gameData)
	{
		var card_index = gameData['CardIndex'];
		var action = gameData['action'];
		
		if (action == 'draw')
		{
			// someone drew a card
			drawAnimation(gameData);
		}
		else //if (action == 'play' || action == 'playWild')
		{
			// someone played a card
			playAnimation(gameData);
		}		
	}
	
	
	
	function playAnimation(gameData)
	{
		var calledByOtherPlayer = true;
		if (gameData['currentTurn'] == shiftAmount) // It's this client's turn
		{
			calledByOtherPlayer = false;
		}
		else
		{
			calledByOtherPlayer = true;
		}
		CardIndex = gameData['CardIndex'];
		var filename = Players[Whos_Turn].Cards[CardIndex].filename;
		var cardImgDiv;
		
		if (!calledByOtherPlayer)
		{
			cardImgDiv = getMyCardDiv(filename);
		}
		else
		{
		 	// IF OTHER PLAYER, THIS NEEDS TO GRAB THE BACKWARD FACING
			// DIV ACCORDING TO THE INDEX
			cardImgDiv = getOtherPlayerCardDiv(filename);
		}
		 
		if (checkbox6.checked == false)
		{				
			var deckElement = document.getElementById("playableDeck");
			var rectDestination = deckElement.getBoundingClientRect();
			cardImgDiv.setAttribute("class","playable");
			
			var rectOrigin = cardImgDiv.getBoundingClientRect();
			
			var startPointX = rectOrigin.left;
			var startPointY = rectOrigin.top-5;	
			
			var endPointX = rectDestination.left;
			var endPointY = rectDestination.top-10;
			
			cardImgDiv.style.left = startPointX +"px";
			cardImgDiv.style.top = startPointY +"px";
			
			setTimeout(function() {
				
				// IF OTHER PLAYER, THIS SHOULD CHANGE IT TO BE FACE FORWARD SRC
				if (calledByOtherPlayer)
				{
					cardImgDiv.src = filename;
				}
				
				cardImgDiv.style.left = endPointX +"px";
				cardImgDiv.style.top = endPointY +"px";
				cardImgDiv.width = "51";
				setTimeout(function() {
					//if (function1 == doWild)
					{
						//doWild(cardType);
						// ADD Post here to do the real action of the card
					}
					//else
					{
						//function1();
						// ADD POST here
					}
				},playDelay/3)
			},playDelay/3);
		}
		else
		{
			//if (function1 == doWild)
			{
				//doWild(cardType);
				// ADD POST HERE
			}
			//else
			{
				//function1();
				// ADD POST HERE
			}
		}
		return true;	
	}
	
	function drawAnimation(gameData)
	{
		var calledByOtherPlayer = true;
		if (gameData['currentTurn'] == shiftAmount) // It's this client's turn
		{
			calledByOtherPlayer = false;
		}
		else
		{
			calledByOtherPlayer = true;
		}
		var topCard = totalCards[0];
		
		
		
		if (checkbox6.checked == false)
		{
			var filename = topCard.filename;
			var cardImgDiv = document.createElement("img"); // Create a new div
			
			if (!calledByOtherPlayer)
			{
				cardImgDiv.src = filename;
			}
			else
			{
				cardImgDiv.src = "http://104.236.169.62/UnoCards/back_of_card.png";
			}
			
			deck.appendChild(cardImgDiv);
			cardImgDiv.setAttribute("class","playable");
													
			var deckElement = document.getElementById("drawPile");
			var rectOrigin = deckElement.getBoundingClientRect();		
			var rectDestination = getCurrentPlayerLastCardDiv().getBoundingClientRect();
			
			var startPointX = rectOrigin.left;
			var startPointY = rectOrigin.top-5;	
			
			var endPointX = rectDestination.left;
			var endPointY = rectDestination.top-10;
			
			cardImgDiv.style.left = startPointX +"px";
			cardImgDiv.style.top = startPointY +"px";
			
			setTimeout(function() {
				
				if (!calledByOtherPlayer)
				{
					cardImgDiv.src = filename;
				}
				
				cardImgDiv.style.left = endPointX +"px";
				cardImgDiv.style.top = endPointY +"px";
				if (calledByOtherPlayer)
				{
					cardImgDiv.width = "38";
				}
				
				/*
				setTimeout(function() {
					if (!calledByOtherPlayer)
					{      //If i clicked it
						Players[RealPlayer0].Cards.push(topCard);
						totalCards.splice(0 ,1);
						// Client that drew card sends post to change turn
						//changeTurnOnServer(1); I'll just let the server do this after all
					}
					else 
					{              //If AI called function
						Players[Whos_Turn].Cards.push(topCard);
						totalCards.splice(0 ,1);
					}
			
					Update_Cards();
				},playDelay/3);
				*/
			},playDelay/3);
		}
		else
		{
			/*
			if (!calledByOtherPlayer)
			{      //If i clicked it
				Players[RealPlayer0].Cards.push(topCard);
				totalCards.splice(0 ,1);
			}
			else 
			{              //If AI called function
				Players[Whos_Turn].Cards.push(topCard);
				totalCards.splice(0 ,1);
			}

			Update_Cards();
			*/
		}
		
		
		return topCard.filename;
	}
	
	/*
	function changeTurnOnServer(turnChanges)
	{
		var client = new HttpClient();
		client.post('http://104.236.169.62:80/unoChangeTurn/'+code+'/'+turnChanges, function(response) {
			var parsedJSON = (JSON.parse(response));
			if (parsedJSON["result"] == "success")
			{
				console.log("succeeded in changing turn on server " + turnChanges + " times");
			}
			else
			{
				console.log("failed to change turn");
				//document.appendChild(failedDiv);
			}
		});		
	}
	*/
	
	// mostly client with server calls
	function configureCardClick(aCard, DOM_img, thisPlayer)
	{
		var aCardValue = aCard.Value;
		
		DOM_img.onclick = function() 
		{
			if (Whos_Turn == RealPlayer0)
			{
				//unoPenaltyCheck(thisPlayer);
				setCardIndex(this);
				
				if (CanPlayCard() == true)
				{				
					if (aCard.Color == "Black")       //If Wild Card
					{
						// When the user clicks the button, open the modal 
						modal.style.display = "block";
					}
			
					else
					{
						// post "play" and card index (the server should already know whose turn it is, and therefore who is playing the card)
						// This should increase the number of actions taken, also update the cardIndex
						var client = new HttpClient();
						client.post('http://104.236.169.62:80/unoAction/'+code+'/play/'+CardIndex+"/NA", function(response) {
							var parsedJSON = (JSON.parse(response));
							if (parsedJSON["result"] == "success")
							{
								console.log("succeeded in adding play card action");
							}
							else
							{
								console.log("failed to add play card action");
								//document.appendChild(failedDiv);
							}
						});		
					}
		 
					/*
					if (aCardValue == "Skip")      //If Skip Card		
					{
						if (playCard('Skip',false) == true) setTimeout(function() {PlayGame()},playDelay); // call server
					} 
					else if (aCardValue === "+2")      //If +2 Card
					{
						if (playCard('Plus2',false) == true) setTimeout(function() {PlayGame()},playDelay); // call server
					}
					else if (aCardValue == "Reverse")      //If reverse Card
					{
						if (playCard('Reverse',false) == true) setTimeout(function() {PlayGame()},playDelay); // call server
					} 
					else 									//If Number Card
					{
						if (playCard('Number',false) == true) setTimeout(function() {PlayGame()},playDelay); // call server
					}
					*/
				}
				else
				{
					alert("Cannot Play Card");
				}
			}
		}
		return DOM_img;
	}
	
	function clickedColor(color)
	{
		// post "play" and card index (the server should already know whose turn it is, and therefore who is playing the card)
		// This should increase the number of actions taken, also update the cardIndex
		var client = new HttpClient();
		client.post('http://104.236.169.62:80/unoAction/'+code+'/playWild/'+CardIndex+"/"+color, function(response) {
			var parsedJSON = (JSON.parse(response));
			if (parsedJSON["result"] == "success")
			{
				console.log("succeeded in adding action");
			}
			else
			{
				console.log("failed to deal cards");
				//document.appendChild(failedDiv);
			}
		});		
	}
	
		
	function Update_Cards()
	{
		drawOtherPlayersCards();
		drawDrawAndDiscardPile();
		
		var thisPlayer = Players[RealPlayer0];
		for (var i = 0; i < thisPlayer.Cards.length; i++)
		{
			DOM_img = document.createElement("img");
			DOM_img.src = thisPlayer.Cards[i].filename;
			var aCard = thisPlayer.Cards[i];
			DOM_img = configureCardClick(aCard,DOM_img,thisPlayer);
		
			hand.appendChild(DOM_img);
		}
		
		//PRINTS OUT PlAYERS HANDS
		textArea.value = "For Real List Of Players Cards \n\r";
		for (var i = 0; i <= Players.length - 1; i++)
		{
			textArea.value += (Players[i].Name + ": ");					
			for (var j = 0; j <= Players[i].Cards.length - 1; j++)
			{
				textArea.value += (Players[i].Cards[j].Color + " " + Players[i].Cards[j].Value + ", ");
				if (j == Players[i].Cards.length - 1) textArea.value += "  SIZE: " + Players[i].Cards.length + "\n\r"; 
			}
		}
		textArea.value += "\n\r";
		textArea.value += "Size Of Playable Deck: " + Playable_Deck.length;
		textArea.value += "\n\r";
		textArea.value += "Size Of Total Cards: " + totalCards.length;
		textArea.value += "\n\r";
		textArea.value += "You Are Player " + (RealPlayer0 + 1);
	}
		
	function parseFilename(absolutePath)
	{
		var filename = absolutePath.substring(absolutePath.indexOf('UnoCards/'));
		return filename;
	}
		
	function setCardIndex(card_img)
	{
		//Finds Card In Hand, Saves Index of that card as CardIndex			
		for (var i = 0; i < Players[RealPlayer0].Cards.length; i++)
		{
			if (parseFilename(card_img.src) == parseFilename(Players[RealPlayer0].Cards[i].filename)) {
				CardIndex = i;
			}
		}
	}
		
	function getCurrentPlayerLastCardDiv()
	{
		if (Whos_Turn == RealPlayer0)
		{
			// it's me
			var hand = document.getElementById("hand");
			var children = hand.childNodes;
			return children[children.length-1];
		}
		else
		{
			// it's someone else
			var deckId = "Player " + (Players[Whos_Turn].OrginalNumber + 1);
			var hand = document.getElementById(deckId);
			var children = hand.childNodes;
			return children[children.length-1];
		}
	}
		
	/*	
	function Draw(gameData,calledByOtherPlayer)
	{
		var topCard = totalCards[0];
		
		if (checkbox6.checked == false)
		{
			var filename = topCard.filename;
			var cardImgDiv = document.createElement("img"); // Create a new div
			
			if (!calledByOtherPlayer)
			{
				cardImgDiv.src = filename;
			}
			else
			{
				cardImgDiv.src = "http://104.236.169.62/UnoCards/back_of_card.png";
			}
			
			deck.appendChild(cardImgDiv);
			cardImgDiv.setAttribute("class","playable");
													
			var deckElement = document.getElementById("drawPile");
			var rectOrigin = deckElement.getBoundingClientRect();		
			var rectDestination = getCurrentPlayerLastCardDiv().getBoundingClientRect();
			
			var startPointX = rectOrigin.left;
			var startPointY = rectOrigin.top-5;	
			
			var endPointX = rectDestination.left;
			var endPointY = rectDestination.top-10;
			
			cardImgDiv.style.left = startPointX +"px";
			cardImgDiv.style.top = startPointY +"px";
			
			setTimeout(function() {
				
				if (!calledByOtherPlayer)
				{
					cardImgDiv.src = filename;
				}
				
				cardImgDiv.style.left = endPointX +"px";
				cardImgDiv.style.top = endPointY +"px";
				if (calledByOtherPlayer)
				{
					cardImgDiv.width = "38";
				}
				
				setTimeout(function() {
					if (!calledByOtherPlayer)
					{      //If i clicked it
						Players[RealPlayer0].Cards.push(topCard);
						totalCards.splice(0 ,1);
					}
					else 
					{              //If AI called function
						Players[Whos_Turn].Cards.push(topCard);
						totalCards.splice(0 ,1);
					}
			
					Update_Cards();
				},playDelay/3)
			},playDelay/3);
		}
		else
		{
			if (!calledByOtherPlayer)
			{      //If i clicked it
				Players[RealPlayer0].Cards.push(topCard);
				totalCards.splice(0 ,1);
			}
			else 
			{              //If AI called function
				Players[Whos_Turn].Cards.push(topCard);
				totalCards.splice(0 ,1);
			}

			Update_Cards();
		}
		
		
		return topCard.filename;
	}
	*/
	
	/*
	function playCard(cardType,calledByOtherPlayer)
	{
		if (CanPlayCard() == true)
		{	
			var function1;
			if (cardType == 'Skip')	function1 = doSkip;
			else if (cardType == 'Plus2') function1 = doPlus2;
			else if (cardType == 'Reverse') function1 = doReverse;
			else if (cardType == 'Number') function1 = doNumber;
			else if (cardType == "Red" || cardType == "Blue" || cardType == "Green" || cardType == "Yellow" || cardType == null)
				{ function1 = doWild; }
			
			var filename = Players[Whos_Turn].Cards[CardIndex].filename;
			var cardImgDiv;
			
			if (!calledByOtherPlayer)
			{
				cardImgDiv = getMyCardDiv(filename);
			}
			else
			{
			 	// IF OTHER PLAYER, THIS NEEDS TO GRAB THE BACKWARD FACING
				// DIV ACCORDING TO THE INDEX
				cardImgDiv = getOtherPlayerCardDiv(filename);
			}
			 
			if (checkbox6.checked == false)
			{				
				var deckElement = document.getElementById("playableDeck");
				var rectDestination = deckElement.getBoundingClientRect();
				cardImgDiv.setAttribute("class","playable");
				
				var rectOrigin = cardImgDiv.getBoundingClientRect();
				
				var startPointX = rectOrigin.left;
				var startPointY = rectOrigin.top-5;	
				
				var endPointX = rectDestination.left;
				var endPointY = rectDestination.top-10;
				
				cardImgDiv.style.left = startPointX +"px";
				cardImgDiv.style.top = startPointY +"px";
				
				setTimeout(function() {
					
					// IF OTHER PLAYER, THIS SHOULD CHANGE IT TO BE FACE FORWARD SRC
					if (calledByOtherPlayer)
					{
						cardImgDiv.src = filename;
					}
					
					cardImgDiv.style.left = endPointX +"px";
					cardImgDiv.style.top = endPointY +"px";
					cardImgDiv.width = "51";
					setTimeout(function() {
						if (function1 == doWild)
						{
							doWild(cardType);
						}
						else
						{
							function1();
						}
					},playDelay/3)
				},playDelay/3);
			}
			else
			{
				if (function1 == doWild)
				{
					doWild(cardType);
				}
				else
				{
					function1();
				}
			}
			return true;				
		}
		else
		{
			//if (Whos_Turn == RealPlayer0) //alert("Cannot Play Card");
			return false;
		}
	}
	*/
		 	 
	function doWild(Color)
	{
		var draw_4 = false;
		var modal = document.getElementById('myModal');
		if (Color != null)
		{  //if goes into else statment means AI is placing a wild
			if (Players[RealPlayer0].Cards[CardIndex].Value == "Wild & + 4")
			{
				draw_4 = true;
				//Code That Deals Out 4 Cards To Next Player
				for (var i = 0; i <= 3; i++)
				{
					if (RealPlayer0 == Players.length - 1) Players[0].Cards.push(totalCards[0]);
					if (RealPlayer0 != Players.length - 1) Players[(RealPlayer0 + 1)].Cards.push(totalCards[0]);
					totalCards.splice(0, 1);
				}
				if (RealPlayer0 == 0)
				{  //If Not Reversed
					//if (checkbox5.checked == false) //alert("Player 2 has been delt 4 extra cards");
				}
				else
				{
					//if (checkbox5.checked == false) //alert(Players[Players.length-1].Name + " has been delt 4 extra cards");
				}
			}
			Players[RealPlayer0].Cards[CardIndex].Color_Of_Wild = Color;
			Playable_Deck.push(Players[RealPlayer0].Cards[CardIndex]);
			Players[RealPlayer0].Cards.splice(CardIndex, 1);
	
		}
		else
		{
			if (Players[Whos_Turn].Cards[CardIndex].Value == "Wild & + 4")
			{
				draw_4 = true;
				//Code That Deals Out 4 Cards To Next Player
				if (Whos_Turn == Players.length -1)
				{
					for (var i = 0; i <= 3; i++)
					{
						Players[RealPlayer0].Cards.push(totalCards[0]);
						totalCards.splice(0, 1);
					}
				}
				else
				{
					for (var i = 0; i <= 3; i++)
					{
						Players[Whos_Turn + 1].Cards.push(totalCards[0]);
						totalCards.splice(0, 1);
					}
					if (RealPlayer0 == 0)
					{  //If Not Reversed
						//if (checkbox5.checked == false) //alert(Players[Whos_Turn + 1].Name + " has been delt 4 extra cards because player "
						//	 + Players[Whos_Turn].Name + " put down a +4 wild");
					}
					else
					{
						//if (checkbox5.checked == false) //alert(Players[Whos_Turn + 1].Name + " has been delt 4 extra cards because player " 
						//	 + Players[Whos_Turn].Name + " put down a +4 wild");
					}
				}
			}
			var RandomColor = Math.floor(Math.random() * 4);
			if (RandomColor == 0) RandomColor = "Red";
			if (RandomColor == 1) RandomColor = "Blue";
			if (RandomColor == 2) RandomColor = "Green";
			if (RandomColor == 3) RandomColor = "Yellow";
			Players[Whos_Turn].Cards[CardIndex].Color_Of_Wild = RandomColor;
			Playable_Deck.push(Players[Whos_Turn].Cards[CardIndex]);
			Players[Whos_Turn].Cards.splice(CardIndex, 1);
	
		}
		// Skipping to next player's turn if +4
		if (draw_4)
		{
			if (Players.length - 1 == Whos_Turn)
			{
				if (RealPlayer0 == 0)
					{  //If Not Reversed
					Whos_Turn = RealPlayer0;
				}
				else
				{
					Whos_Turn = 0;
				}
			}
			else
			{
				Whos_Turn++;
			}
		}
		modal.style.display = "none";
		
		if (Color != null) PlayGame();
	}
		
	function doSkip()
	{
		Playable_Deck.push(Players[Whos_Turn].Cards[CardIndex]);
		Players[Whos_Turn].Cards.splice(CardIndex, 1);
		if (Players.length - 1 == Whos_Turn)
		{
			if (RealPlayer0 == 0)
			{  //If Not Reversed
				//if (checkbox5.checked == false) //alert(Players[Whos_Turn].Name + " skipped Player 1");
				Whos_Turn = RealPlayer0;
			}
			else
			{
				//if (checkbox5.checked == false) //alert("Player " + (Players[Whos_Turn].OrginalNumber + 1) + " skipped player " + (Whos_Turn + 1));
				Whos_Turn = 0;
			}
		}
		else
		{
			if (RealPlayer0 == 0) 
			{   //If Not Reversed
				//if (checkbox5.checked == false) //alert("Player " + (Whos_Turn + 1) + " skipped Player "+ (Whos_Turn + 2));
			}
			else
			{
				//if (checkbox5.checked == false) //alert("Player " + (Players[Whos_Turn].OrginalNumber + 1) + " skipped player " + (Players[Whos_Turn + 1].OrginalNumber + 1));
			}
			Whos_Turn++;
		}
		Update_Cards();
	}	
		
	function doPlus2()
	{
		Playable_Deck.push(Players[Whos_Turn].Cards[CardIndex]);
		Players[Whos_Turn].Cards.splice(CardIndex, 1);
		if (Players.length - 1 == Whos_Turn)
		{
			if (RealPlayer0 == 0)
			{  //If Not Reversed
				//if (checkbox5.checked == false) //alert("Player " + (Whos_Turn + 1) + " has given player 1, 2 extra cards");
				for (var i = 0; i < 2; i++)
				{
					Players[RealPlayer0].Cards.push(totalCards[0]);
					totalCards.splice(0, 1);
				}
				Whos_Turn = RealPlayer0;
			}
			else
			{
				//if (checkbox5.checked == false) //alert("Player " + (Players[Whos_Turn].OrginalNumber + 1) + " had given player " + (Whos_Turn + 1) + ", 2 extra cards");
				for (var i = 0; i < 2; i++)
				{
					Players[0].Cards.push(totalCards[0]);
					totalCards.splice(0, 1);
				}
				Whos_Turn = 0;
			}
		}
		else
		{
			if (RealPlayer0 == 0)
			{  //If Not Reversed
				//if (checkbox5.checked == false) //alert("Player " + (Whos_Turn + 1) + " has given player " + (Whos_Turn + 2) + ", 2 extra cards");
			}
			else
			{
				//if (checkbox5.checked == false) //alert("Player " + (Players[Whos_Turn].OrginalNumber + 1) + " had given player " + (Players[Whos_Turn + 1].OrginalNumber + 1) + ", 2 extra cards");
			}
			for (var i = 0; i < 2; i++)
			{
				Players[(Whos_Turn + 1)].Cards.push(totalCards[0]);
				totalCards.splice(0, 1);
			}
			Whos_Turn++;
		}
		Update_Cards();
	}
		
	function doReverse()
	{
		Playable_Deck.push(Players[Whos_Turn].Cards[CardIndex]);
		Players[Whos_Turn].Cards.splice(CardIndex, 1);
			
		Players.reverse();
		if (Players.length == 2)
		{
			Whos_Turn = ((Players.length - 2) - Whos_Turn);
		}
		else
		{
			Whos_Turn = ((Players.length - 1) - Whos_Turn);
		}
		if (RealPlayer0 == 0)
		{
			RealPlayer0 = Players.length - 1;
		}
		else
		{
			RealPlayer0 = 0;
		}
		//if (checkbox5.checked == false) //alert("Reversed Order Of Players!");
	}
		
	function doNumber()	
	{
		Playable_Deck.push(Players[Whos_Turn].Cards[CardIndex]);
		Players[Whos_Turn].Cards.splice(CardIndex, 1);
		Update_Cards();
	}
		
		
	function PlayGame()
	{
		
		for (var i = 0; i < Players.length; i++)
		{
			if (Players[i].Cards.length == 0)
			{			
				Winning(); 
				SomeOneWon = true;
				break;
			}
		}
		if (Whos_Turn != Players.length - 1)
		{
			Whos_Turn++;
		}
		else
		{
			Whos_Turn = 0;
		}
		//if (Whos_Turn != RealPlayer0 && SomeOneWon == false) setTimeout(function(){ AI(); }, AITime);  //If not my turn and no one has won
		if (totalCards.length - 1 <= 10) ReShuffleTotalCards();                                         // if need re-shuffling
		if (SomeOneWon == false) Update_Cards();                                                       //If no one has won
	}
		
	function Winning()
	{
		//alert("Player " + (Players[Whos_Turn].OrginalNumber + 1) + " Won!");
		while (deck.hasChildNodes()) 
		{                                //Removes All Card Imgs
			deck.removeChild(deck.lastChild);
		}
		var OtherPlayersDecks = document.getElementById("OtherPlayers");
		while (OtherPlayersDecks.hasChildNodes()) {                                //Removes All Card Imgs
			OtherPlayersDecks.removeChild(OtherPlayersDecks.lastChild);
		}
	}
		
	/*	
	function ReShuffleTotalCards()
	{
		var copyOfDeck = Playable_Deck;
		var ShuffledDeck = [];
		for (var i = 1; i <= copyOfDeck.length - 1; i++)
		{
			var RanNum1 = Math.floor(Math.random() * Playable_Deck.length);
			ShuffledDeck.push(Playable_Deck[RanNum1]);
			Playable_Deck.splice(RanNum1, 1);
		}
		for (var i = 0; i <= ShuffledDeck.length - 1; i++)
		{
			totalCards.push(ShuffledDeck[i]);
		}
	}
	*/
		
	function AI()
	{
		var NeedToDraw = true;
		for (var i = 0; i <= Players[Whos_Turn].Cards.length - 1; i++)
		{
			if (Players[Whos_Turn].Cards[i].Color == Playable_Deck[Playable_Deck.length - 1].Color //If Same Color
				|| Players[Whos_Turn].Cards[i].Value === Playable_Deck[Playable_Deck.length - 1].Value  //if Same number
				|| Players[Whos_Turn].Cards[i].Color == Playable_Deck[Playable_Deck.length - 1].Color_Of_Wild //if wild already there
				|| Players[Whos_Turn].Cards[i].Color == "Black" || checkbox4.checked == true) //if wild card or if AI can play any card is checked
			{
				CardIndex = i;
				if (Players[Whos_Turn].Cards[i].Color == "Black")
				{
					playCard(null,true);
				}
				else if (Players[Whos_Turn].Cards[i].Value == "Skip")
				{
					playCard('Skip',true);
				}
				else if (Players[Whos_Turn].Cards[i].Value === "+2")
				{
					playCard('Plus2',true);
				} 
				else if (Players[Whos_Turn].Cards[i].Value == "Reverse")
				{
					playCard('Reverse',true);
				}
				else
				{
					playCard('Number',true);
				}
				NeedToDraw = false;
				break;
			}
		}
		if (NeedToDraw == true) Draw(true);
		setTimeout(function() {
			Update_Cards();
			PlayGame()
		},playDelay);
	}
		
	function developerMode()
	{
		var passwordGuess = prompt("Please enter your admin password", "");
		var client = new HttpClient();
		client.get('http://104.236.169.62:80/checkHaddensPassword/'+passwordGuess, function(response) {
			var parsedJSON = (JSON.parse(response));
			if (parsedJSON["result"] == "success")
			{
				var wasCorrect = parsedJSON['correct'];
				if (wasCorrect)
				{
					document.getElementById("ta").style.display = "block";
					DevloperMode = true;
					var toggleShowData = document.getElementById("toggleShowData").disabled = true;
					var DM = document.getElementById('DM');
					var linebreak4 = document.createElement("br");
					DM.appendChild(linebreak4);
					var linebreak5 = document.createElement("br");
					DM.appendChild(linebreak5);
					
					DM.appendChild(checkbox);
					checkbox.checked = true;
					DM.appendChild(label);
					DM.appendChild(document.createTextNode("  ,  "));
					DM.appendChild(checkbox2);
					checkbox2.checked = true;
					DM.appendChild(label2);
					DM.appendChild(document.createTextNode("  ,  "));
					DM.appendChild(checkbox3);
					checkbox3.checked = true;
					DM.appendChild(label3);
					DM.appendChild(document.createTextNode("  ,  "))
					DM.appendChild(checkbox4);
					DM.appendChild(label4);
					DM.appendChild(document.createTextNode("  ,  "))
					DM.appendChild(AITimeInput);
					DM.appendChild(button);
					DM.appendChild(document.createTextNode("  ,  "))
					DM.appendChild(button2);
					AITime = 500;
					Update_Cards();
				}
			}
			else
			{
					// unable to get data from server
			}
		});				
	}
	
	function sayUno()
	{
		var button = document.getElementById("UNO");
		if (Players[RealPlayer0].Cards.length == 2 && Whos_Turn == RealPlayer0)
		{
			NeedsToSayUno = false;
			button.disabled = true;
		}
	}
		
	function CanPlayCard()
	{
		if (Players[Whos_Turn].Cards[CardIndex].Color == "Black") return true;
		if (Players[Whos_Turn].Cards[CardIndex].Color == Playable_Deck[Playable_Deck.length - 1].Color //If Same Color
			|| Players[Whos_Turn].Cards[CardIndex].Value === Playable_Deck[Playable_Deck.length - 1].Value  //if Same number
			|| Players[Whos_Turn].Cards[CardIndex].Color == Playable_Deck[Playable_Deck.length - 1].Color_Of_Wild) //if wild already there
		{
			return true;
		}
		else
		{
			if (Whos_Turn == RealPlayer0 && checkbox2.checked == true)   //IF I CAN PLAY ANY CARD IS CHECKED AND IS MY TURN
			{
				return true;
			} else {
				if (checkbox4.checked == true && Whos_Turn != RealPlayer0) //If AI can play any card is checked and not my turn
				{
					return true;
				} else {
					return false;
				}
			}
		}
	}
		
	function Reaload()
	{
		if (confirm("You Sure?")) {
			document.location.reload(true);
		}
	}
	
	/*	
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
		
	function Player (Name, Cards, OrginalNumber)
	{
		this.Name = Name;
		this.Cards = Cards;
		this.OrginalNumber = OrginalNumber;
	}
	*/