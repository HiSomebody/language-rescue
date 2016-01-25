//Define an angular module for our app
var app = angular.module("libraryApp", ["ngRoute"])
var port = 80;

var fixChars = function(entries)
{
	for (var j = 0; j < entries.listed.length; j++)
	{
		var titleStr = entries.listed[j].title;
		var ownerStr = entries.listed[j].ownerName;
		var descriptionStr = entries.listed[j].description;
		if (titleStr != null && (titleStr.indexOf("~") != -1 || titleStr.indexOf("`") != -1))
		{
			var changed = "";
			for (var i = 0; i < titleStr.length; i++)
			{
				var c = titleStr[i];
				if (c == '~')
				{
					changed += "\'";
				}
				else if (c == '`')
				{
					changed += "\"";
				}
				else
				{
					changed += c;
				}
			}
			entries.listed[j].title = changed;
		}
		if (ownerStr != null && (ownerStr.indexOf("~") != -1 || ownerStr.indexOf("`") != -1))
		{
			var changed = "";
			for (var i = 0; i < ownerStr.length; i++)
			{
				var c = ownerStr[i];
				if (c == '~')
				{
					changed += "\'";
				}
				else if (c == '`')
				{
					changed += "\"";
				}
				else
				{
					changed += c;
				}
			}
			entries.listed[j].ownerName = changed;
		}

		if (descriptionStr != null && (descriptionStr.indexOf("~") != -1 || descriptionStr.indexOf("`") != -1))
		{
			var changed = "";
			for (var i = 0; i < descriptionStr.length; i++)
			{
				var c = descriptionStr[i];
				if (c == '~')
				{
					changed += "\'";
				}
				else if (c == '`')
				{
					changed += "\"";
				}
				else
				{
					changed += c;
				}
			}
			entries.listed[j].description = changed;
		}
	}
}

app.factory('myFactory', function($http){

	var instance = {};
	var languages = {};
	var mediaList = {};
	$http.get('http://104.236.169.62:' + port + '/selectall/media_library')
	.success(function(data){
		mediaList.listed = data.json;
	}).error(function()
	{
		alert('failure');
		console.error('failed to retrieve data');
	});


	languages.listed = [
	{
	}
	];


	mediaList.listed = [
	{
	}
	];

	var entries = {};

	entries.listed = [
	{
	}
	];



	instance.entries = mediaList;
	fixChars(instance.entries);
	instance.languages = languages;

	return instance;
})


app.config(function($routeProvider) {
	$routeProvider.when('/ChooseQuiz', {
		templateUrl: 'views/choose_quiz.html',
		controller: 'MainController'
	}).when('/PreQuiz', {
		templateUrl: 'views/pre_quiz.html',
		controller: 'MainController'
	}).when('/Quiz', {
		templateUrl: 'views/quiz.html',
		controller: 'MainController'
	}).when('/Results', {
		templateUrl: 'views/results.html',
		controller: 'MainController'
	}).
	otherwise({
		redirectTo: '/ChooseQuiz'
	})
})



app.controller('libraryController',

	function($scope, $http, myFactory) {
		$scope.languages = myFactory.languages;
		$scope.entries = myFactory.entries;
		$scope.view = "splashPageView";
		$scope.selectedLanguage = $scope.languages.listed[0];
		$scope.selectedEntry = $scope.entries.listed[0];

		$scope.user = {};
		$scope.password = null;
		$scope.newUser = null;
		$scope.newPassword = null;
		$scope.confirmPassword = null;
		$scope.email = null;
		$scope.entryTerm = "";
		$scope.entryDefinition = "";
		$scope.loggedIn = false;


		$scope.getAllMediaEntries = function()
		{
			$http.get('http://104.236.169.62:' + port + '/selectall/media_library')
			.success(function(data){
				myFactory.mediaList.listed = data.json;
				$scope.entries = myFactory.mediaList;
			}).error(function()
			{
				alert('failure');
				console.error('failed to retrieve data');
			});
		}

		$scope.editingMovieEntry = false;

		$scope.getAllLanguages = function()
		{
			$http.get('http://104.236.169.62:' + port + '/selectall/languages')
			.success(function(data){
				myFactory.languages.listed = data.json;
				$scope.languages = myFactory.languages;
			}).error(function()
			{
				alert('failure');
				console.error('failed to retrieve data');
			});
		}

		$scope.setSelectedLanguage = function(l)
		{
			console.log(l);
			$scope.selectedLanguage = l;
			$http.get('http://104.236.169.62:'+port+'/selectwhere/entries/language_id/'+l.id)
			.success(function(data){
				myFactory.entries.listed = data.json;
				fixChars(myFactory.entries);
				$scope.entries = myFactory.entries;
			//$scope.selectedEntry = $scope.entries.listed[0];

			//alert('success');
			//alert(data);
		}).error(function()
		{
			alert('failure');
			console.error('failed to retrieve data');
		});


		$scope.view = "mainView";
		$scope.editing = false;
	}

	$scope.setSelectedEntry = function(e)
	{
		$scope.successUpdate = false;
		$scope.selectedEntry = e;
		$scope.editing = false;
	}

	$scope.startEditing = function()
	{
		$scope.contribution = $scope.selectedEntry.definition;
		$scope.editing = true;
		$scope.adding = false;
	}


	$scope.startAdding = function()
	{
		$scope.successUpdate = false;
		$scope.view = "addingEntryView";
		$scope.newEntry = "temp";
		//$scope.contribution = $scope.selectedEntry.definition;
		$scope.adding = true;
		$scope.editing = false;

	}

	$scope.setView = function(view)
	{
		$scope.badUsername = false;
		$scope.badPassword = false;
		if (view == "mainView" && !$scope.loggedIn)
		{
			fixChars($scope.entries);
			$scope.view = view;
		}
		else
		{
			$scope.view = view;
		}

	}

	$scope.editMovieEntry = function()
	{
		$scope.editingMovieEntry = true;

	}

	$scope.removeEntry = function()
	{
				// Remove ENTRY
				$http.post('http://104.236.169.62:'+port+'/deleteMedia',

					{id: $scope.selectedEntry.id,
					}).
				success(function(data, status, headers, config) {

					//$scope.successUpdate = true;
						//alert("Successfully updated entry in database!");
						$scope.selectedEntry.show_entry = 0;
						$scope.selectedEntry = null;

						$scope.editingMovieEntry = false;

					}).
				error(function(data, status, headers, config) {
					alert("Failed to update entry in database.");
				});

	}

	$scope.editContribution = function()
	{
		console.log($scope.selectedEntry);
		$scope.successUpdate = false;
		if ($scope.selectedEntry.title == '' || $scope.selectedEntry.title == null)
		{
			alert("Please enter a title.");
		}
		else if ($scope.selectedEntry.ownerName == '' || $scope.selectedEntry.ownerName == null)
		{
			alert("Please enter a name.");
		}
		else
		{
					// UPDATE ENTRY
					$http.post('http://104.236.169.62:'+port+'/updateMedia',
						{id: $scope.selectedEntry.id,
							title: change($scope.selectedEntry.title),
							ownerName: change($scope.selectedEntry.ownerName),
							description: change($scope.selectedEntry.description),
							type: "movie",
							available: 1,
							show_entry: 1
						}).
					success(function(data, status, headers, config) {

						$scope.successMovieUpdate = true;
							//alert("Successfully updated entry in database!");
							$scope.editingMovieEntry = false;

						}).
					error(function(data, status, headers, config) {
						alert("Failed to update media entry in database.");
					});
		}

	}

	var change = function(inString)
	{
		var changed = "";
		for (var i = 0; i < inString.length; i++)
		{
			var c = inString[i];
			if (c == '\'')
			{
				changed += "~";
			}
			else if (c == '\"')
			{
				changed += "`";
			}
			else
			{
				changed += c;
			}
		}
		return changed;
	}

	$scope.contributeEntry = function()
	{
		$scope.successUpdate = false;
		if ($scope.entryTitle == '')
		{
			alert("Please enter a title.");
		}
		else if ($scope.entryOwner == '')
		{
			alert("Please enter your name.");
		}
		else
		{
			// CHECK IF ENTRY ALREADY EXISTS BY SAME OWNER
			var changedString = change($scope.entryTitle);
			console.log(changedString);
			$http.get('http://104.236.169.62:'+port+'/check/media_library/title/'+changedString)
			.success(function(data){
				var exists = false;
				for (var i = 0; i < data.json.length; i++)
				{
					if (data.json[i].ownerName.toLowerCase() == change($scope.entryOwner.toLowerCase()))
					{
						exists = true;
					}
				}
				if (exists)
				{
					alert("You've already entered that movie.");
					return;
				}
				else
				{
					// INSERT ENTRY INTO LIBRARY
					$http.post('http://104.236.169.62:'+port+'/insert/media_library',
						{	title: changedString,
							ownerID: 0,
							ownerName: change($scope.entryOwner),
							description: change($scope.additionalInfo),
							type: "movie",
							available: 1,
							show_entry: 1
						}).
					success(function(data, status, headers, config) {
						alert("Successfully added a new entry to the database!");
						$scope.view = "splashPageView";
						$scope.resetInput();
						$scope.getAllMediaEntries();
					}).
					error(function(data, status, headers, config) {
						alert("Failed to add entry to library.");
					});
				}
			}).error(function()
			{
				alert('failure');
				console.error('Failed to retrieve whether owner already entered that title.');
			});
		}
	}

	$scope.createLanguage = function()
	{
		$scope.view = "addingLanguageView";
	}

	$scope.addLanguage = function()
	{
		if ($scope.languageBeingAdded == '')
		{
			alert("Please enter a name for the language.");
		}
		else
		{
			// CHECK IF LANGUAGE ALREADY EXISTS IN CURRENT LANGUAGE
			$http.get('http://104.236.169.62:'+port+'/check/languages/language_name/'+$scope.languageBeingAdded)
			.success(function(data){
				var exists = data.exists;
				if (exists)
				{
					alert("That language already exists in the database.");
					return;
				}
				else
				{
					// INSERT LANGUAGE INTO DATABASE
					$http.post('http://104.236.169.62:'+port+'/insert/languages',
						{language_name: $scope.languageBeingAdded
						}).
					success(function(data, status, headers, config) {
						$scope.getAllLanguages();
						alert("Successfully added a new language to the database!");
						$scope.view = "choosingLanguageView";
						$scope.resetInput();
					}).
					error(function(data, status, headers, config) {
						alert("Failed to add language to database.");
					});
				}
			}).error(function()
			{
				alert('failure');
				console.error('Failed to retrieve whether language already exists');
			});
		}
	}

	$scope.showGoal = function()
	{
		alert("To save lots of languages.");
	}

	$scope.cancel = function()
	{
		$scope.editing = false;
		$scope.adding = false;
		fixChars($scope.entries);
		$scope.view = "mainView";
	}

	$scope.cancelEdit = function()
	{
		$scope.editingMovieEntry = false;
	}

	$scope.cancelCreate = function()
	{
		$scope.resetInput();
		$scope.view = "loginView";
	}

	$scope.createAccount = function()
	{
		$scope.resetInput();
		$scope.view = "createView";

	}

	$scope.addUser = function()
	{
		if ($scope.newUser == null)
		{
			alert("Username is invalid!");
			return;
		}

		//This should ping the server to check name availability
		$http.get('http://104.236.169.62:'+port+'/check/users/username/'+$scope.newUser)
		.success(function(data){
			var exists = data.exists;
			if (exists)
			{
				alert("That username already exists!");
				return;
			}
			else
			{
				if ($scope.email == null)
				{
					alert("Email is invalid!");
					return;
				}

				if ($scope.newPassword == null)
				{
					alert("Password is invalid!");
					return;
				}

				if ($scope.newPassword == $scope.confirmPassword) {

					//This should hit the server to add the new User to database

					$http.post('http://104.236.169.62:'+port+'/insert/users',
						{username:$scope.newUser,
							password:$scope.newPassword,
							email:$scope.email,
							contributions:0,
							abuse_strikes:0,
							edits:0

						}).
					success(function(data, status, headers, config) {
						alert("Created a new User!\n\nPlease contribute responsibly.");
						$scope.view = "mainView";
						$scope.loggedIn = true;

						$scope.user.username = $scope.newUser;
						$scope.resetInput();
						$scope.user.contributions = 0;
					}).
					error(function(data, status, headers, config) {
						alert("Failed to create new user.");
					});

				}
				else
					alert("Passwords do not match!");

			}


		}).error(function()
		{
			alert('failure');
			console.error('Failed to retrieve whether username already exists');
		});

	}

	$scope.login = function()
	{
		$scope.loggedIn = false;

		$scope.successUpdate = false;
		//This is where a call to the server then database should be made
		$http.get('http://104.236.169.62:'+port+'/login/'+$scope.user.username+'/'+$scope.user.password)
		.success(function(data){
			var valid_username = data.valid_username;
			var valid_password = data.valid_password;
			$scope.badUsername = false;
			$scope.badPassword = false;
			if (!valid_username)
			{
				//alert('Username doesn\'t exist');
				$scope.badUsername = true;
				return;
			}
			else if (valid_username && !valid_password)
			{
				//alert("incorrect password for user " + $scope.user.username);
				$scope.badPassword = true;
				return;
			}
			else if (valid_username && valid_password)
			{
				$scope.view = "mainView";
				$scope.badPassword = false;
				$scope.badUsername = false;
				$scope.user = data.user;
				$scope.setSelectedLanguage($scope.languages.listed[0]);
				$scope.resetInput();
				$scope.loggedIn = true;
				return;
			}
		}).error(function()
		{
			alert('failure');
			console.error('Failed to retrieve whether username already exists');
		});
	}

	$scope.logout = function()
	{
		$scope.resetInput();
		$scope.view = "loginView";
		$scope.user = {};
		$scope.user.username = null;
		$scope.loggedIn = false;
	}

	$scope.nologin = function()
	{
		$scope.setSelectedLanguage($scope.languages.listed[0]);
		$scope.successUpdate = false;
		alert('Continuing as a Guest. For full user privileges please create an account');
		$scope.resetInput();
		$scope.user = {};
		$scope.user.username = "Guest";
		$scope.view = "mainView"
	}

	$scope.chooseLanguage = function()
	{
		$scope.successUpdate = false;
		$scope.view = "choosingLanguageView";
		$scope.selectedEntry.definition = null;
		$scope.selectedEntry.term = null;
		$scope.currentEntry = null;
	}

	$scope.resetInput = function()
	{
		$scope.password = null;
		$scope.newUser = null;
		$scope.newPassword = null;
		$scope.confirmPassword = null;
		$scope.email = null;
		$scope.entryTerm = null;
		$scope.entryDefinition = null;
		$scope.entryType = null;
		$scope.selectedEntry = {};
		$scope.selectedEntry.definition = null;
		$scope.selectedEntry.term = null;
		$scope.successUpdate = false;
		$scope.currentEntry = null;
		$scope.additionalInfo = null;
		$scope.entryOwner = null;
		$scope.entryTitle = null;
	}

	$scope.flag = function()
	{
		// FLAG USER WHO LAST EDITED ENTRY
		$http.post('http://104.236.169.62:'+port+'/flag/'+ $scope.selectedEntry.term,

			{language_id: $scope.selectedLanguage.id,
				term: $scope.selectedEntry.term,
			}).
		success(function(data, status, headers, config) {
			alert("Successfully flagged the last editor of the entry in the database!");
			$scope.view = "mainView";
			$scope.adding = false;
			$scope.editing = true;
			//$scope.resetInput();
		}).
		error(function(data, status, headers, config) {
			alert("Failed to flag editor of entry in database.");
		});
	}


});
