
//Define an angular module for our app
var app = angular.module("languageApp", ["ngRoute"])
var port = 80;

app.factory('myFactory', function($http){
	
	var instance = {};
	var languages = {};
	$http.get('http://104.236.169.62:' + port + '/selectall/languages')
	.success(function(data){
		languages.listed = data.json;
	}).error(function()
	{
		alert('failure');
		console.error('failed to retrieve data');
	});
	

	languages.listed = [
	{
	}
	];
	
	
	
	
	var entries = {};

	entries.listed = [
	{
	}
	];
	


	instance.entries = entries;
	
	
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



app.controller('MainController', 
	
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
		if (view == "loginView" && $scope.loggedIn)
		{
			alert("You are already logged in!")
			$scope.view = "mainView";
		}
		else if (view == "mainView" && !$scope.loggedIn)
		{
			$scope.nologin();
		}
		else
		{
			$scope.view = view;

		}

	}
	
	$scope.contribute = function()
	{
		$scope.successUpdate = false;
		if ($scope.contribution == '')
		{
			alert("Please enter a definition.");
		}
		else
		{
			// CHECK IF ENTRY ALREADY EXISTS IN CURRENT LANGUAGE
			$http.get('http://104.236.169.62:'+port+'/check/entries/term/'+ $scope.selectedEntry.term)
			.success(function(data){

				//var exists = data.exists;
				var exists = false;
				console.log(data.json.length);
				for (var i = 0; i < data.json.length; i++)
				{

					if (data.json[i].language_id == $scope.selectedLanguage.id)
					{
						exists = true;
					}
				}
				if (!exists)
				{
					alert("That entry doesn't exist in the current language.");
					return;
				}
				else
				{
					// UPDATE ENTRY INTO CURRENT LANGUAGE
					$http.post('http://104.236.169.62:'+port+'/update/'+ $scope.selectedEntry.term, 

						{language_id: $scope.selectedLanguage.id,
							term: $scope.selectedEntry.term,
							definition: $scope.contribution,
							last_contributed_user: $scope.user.username
						}).
					success(function(data, status, headers, config) {

						$scope.successUpdate = true;
							//alert("Successfully updated entry in database!");
							$scope.setSelectedLanguage($scope.selectedLanguage);
							$scope.view = "mainView";
							$scope.adding = false;
							$scope.editing = false;
							$scope.resetInput();
							$scope.user.contributions++;
						}).
					error(function(data, status, headers, config) {
						alert("Failed to update entry in database.");
					});
				}
			}).error(function()
			{
				alert('failure');
				console.error('Failed to retrieve whether language already exists.');
			});			
		}

	}
	
	$scope.contributeEntry = function()
	{
		$scope.successUpdate = false;
		if ($scope.entryTerm == '')
		{
			alert("Please enter a term.");
		}
		else if ($scope.entryDefinition == '')
		{
			alert("Please enter a definition.");
		}
		else
		{
			// CHECK IF ENTRY ALREADY EXISTS IN CURRENT LANGUAGE
			$http.get('http://104.236.169.62:'+port+'/check/entries/term/'+$scope.entryTerm)
			.success(function(data){
				//var exists = data.exists;
				var exists = false;
				for (var i = 0; i < data.json.length; i++)
				{
					if (data.json[i].language_id == $scope.selectedLanguage.id)
					{
						exists = true;
					}
				}
				if (exists)
				{
					alert("That entry already exists in the current language.");
					return;
				}
				else
				{
					// INSERT ENTRY INTO CURRENT LANGUAGE
					$http.post('http://104.236.169.62:'+port+'/insert/entries', 
						{language_id: $scope.selectedLanguage.id,
							term: $scope.entryTerm,
							definition: $scope.entryDefinition,
							part_of_speech: $scope.entryType,
							first_contributed_user: $scope.user.username,
							last_contributed_user: $scope.user.username
						}).
					success(function(data, status, headers, config) {
						$scope.setSelectedLanguage($scope.selectedLanguage);
						$scope.setSelectedEntry($scope.entries.listed[$scope.entries.listed.size-1])
						alert("Successfully added a new entry to the database!");
						$scope.view = "mainView";
						$scope.adding = false;
						$scope.editing = false;
						$scope.resetInput();
						$scope.user.contributions++;
					}).
					error(function(data, status, headers, config) {
						alert("Failed to add entry to database.");
					});
				}
			}).error(function()
			{
				alert('failure');
				console.error('Failed to retrieve whether language already exists.');
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
		$scope.view = "mainView";
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
