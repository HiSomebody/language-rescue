
//Define an angular module for our app
var app = angular.module("languageApp", ["ngRoute"])
 

app.factory('myFactory', function($http){
	
	
	var instance = {};
	
		var languages = {};
	languages.listed = [
		{
			title: "Hiligaynon",
			numEntries: 11
		},
		{
			title: "Aklanon",
			numEntries: 197
		},
		{
			title: "Karay-a",
			numEntries: 233
		},
		{
			title: "Samoan",
			numEntries: 244
		},
		{
			title: "Tongan",
			numEntries: 756
		},
		{
			title: "Navajo",
			numEntries: 43
		},
		{
			title: "Ilokano",
			numEntries: 56
		},
		{
			title: "Ati",
			numEntries: 23
		},
		{
			title: "Maori",
			numEntries: 87
		},
		{
			title: "Rotuman",
			numEntries: 57
		},
		{
			title: "Fijian",
			numEntries: 398
		}
	];
	
	var entries = {};
	entries.listed = [
		{
			entry: "Kumusta",
			definitions: [
			"Hello",
			"How are you?",
			"How is it?"
			],
			type: "Greeting"
		},
		{
			entry: "Kumusta ka?",
			definitions: [
			"How are you?"
			],
			type: "Greeting"
		},
		{
			entry: "Oy",
			definitions: [
			"Hey"
			],
			type: "Interjection"
		},
		{
			entry: "Maayo",
			definitions: [
			"Good",
			"Well",
			"Great"
			],
			type: "Adjective"
		},
		{
			entry: "Maayong aga",
			definitions: [
			"Good Morning"
			],
			type: "Greeting"
		},
		{
			entry: "Maayong udto",
			definitions: [
			"Good noon"
			],
			type: "Greeting"
		},
		{
			entry: "Maayong gab-i",
			definitions: [
			"Good evening"
			],
			type: "Greeting"
		},
		{
			entry: "Karabao",
			definitions: [
			"Water buffalo"
			],
			type: "Noun"
		},
		{
			entry: "hatag",
			definitions: [
			"give"
			],
			type: "Verb"
		},
		{
			entry: "Diin ka magkadto?",
			definitions: [
			"Where are you going?"
			],
			type: "Greeting"
		},
		{
			entry: "Diin ka naghalin?",
			definitions: [
			"Where are you coming from?"
			],
			type: "Greeting"
		}
	];
	
	
	
	instance.entries = entries;
	
	
	instance.languages = languages;
	
	


	
    /*
	$http.get('quizes/quizes.json').success(function(data) {
      	instance.quizes = data;
    });
	
  	$http.get(instance.quizPath).success(function(data) {
   	  	instance.questions = data;
  	});
	*/
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
	$scope.view = "log in";
	$scope.selectedLanguage = $scope.languages.listed[0];
	$scope.selectedEntry = $scope.entries.listed[0];

	$scope.user = null;
	$scope.password = null;
	$scope.newUser = null;
	$scope.newPassword = null;
	$scope.confirmPassword = null;
	$scope.email = null;
	
	$scope.setSelectedLanguage = function(l)
	{
		$scope.selectedLanguage = l;
		$scope.view = "main view";
		$scope.editing = false;
	}
	
	$scope.setSelectedEntry = function(e)
	{
		$scope.selectedEntry = e;
		$scope.editing = false;
	}
	
	$scope.startEditing = function()
	{
		$scope.contribution = $scope.selectedEntry.definitions[0];
		$scope.editing = true;
		$scope.adding = false;
	}
	
	$scope.startAdding = function()
	{
		$scope.newEntry = "temp";
		$scope.contribution = $scope.selectedEntry.definitions[0];
		$scope.adding = true;
		$scope.editing = false;

	}
	
	$scope.contribute = function()
	{
		alert($scope.contribution);
		$scope.editing = false;
		$scope.adding = false;

	}

	$scope.showGoal = function()
	{
		alert("To save languages.");
	}

	$scope.cancel = function()
	{
		$scope.editing = false;
		$scope.adding = false;

	}

	$scope.cancelCreate = function()
	{
		$scope.resetInput();
		$scope.view = "log in";
	}

	$scope.createAccount = function()
	{
		$scope.resetInput();
		$scope.view = "create view";
	}

	$scope.addUser = function()
	{
		if ($scope.newUser == null)
		{
			alert("Username is invalid!");
			return;
		}

		//This should ping the server to check name availability
		if ($scope.newUser == "admin")
		{
			alert("Username is taken!");
			return;
		}

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
			$scope.view = "main view";
			$scope.user = $scope.newUser 
			alert("Created new User!\n\nPlease contribute responsibly.");

		}
        else
        	alert("Passwords do not match!");

	}

	$scope.login = function()
	{
		//This is where a call to the server then database should be made
        if ($scope.user === 'admin' && $scope.password === 'admin') {
			$scope.view = "main view";
			alert("Login Successful");
        }
        else
        	alert("Login Failed");
	}

	$scope.logout = function()
	{
		$scope.resetInput();
		$scope.view = "log in";
	}

	$scope.nologin = function()
	{

		$scope.resetInput();
		$scope.user = "Guest";
		$scope.view = "main view";
	}
	
	$scope.chooseLanguage = function()
	{
		$scope.view = "choosing language";
	}

	$scope.resetInput = function()
	{
		$scope.user = null;
		$scope.password = null;
		$scope.newUser = null;
		$scope.newPassword = null;
		$scope.confirmPassword = null;
		$scope.email = null;
	}


});