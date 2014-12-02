
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
	$scope.view = "main view";
	$scope.selectedLanguage = $scope.languages.listed[0];
	$scope.selectedEntry = $scope.entries.listed[0];
	
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
	}
	
	$scope.contribute = function()
	{
		alert($scope.contribution);
		$scope.editing = false;
	}

	$scope.cancel = function()
	{
		$scope.editing = false;
	}
	
	$scope.chooseLanguage = function()
	{
		$scope.view = "choosing language";
	}
	
	
	
	
	
	
	
	
	
	
	$scope.toJSON = "";
	$scope.quizName = myFactory.quizName;
		$scope.questionList = myFactory.questionList;
		$scope.Qnum = 0;
		$scope.Anum = 0;
		$scope.quizes = myFactory.quizes;
		$scope.questions = myFactory.questions;
	  	$scope.quizChoice = myFactory.quizChoice;
		$scope.quizPath = myFactory.quizPath
		$scope.question = myFactory.question;
		$scope.selected = myFactory.selected;
		$scope.displayType = myFactory.displayType;
		$scope.displayText = myFactory.displayText;
		$scope.showMessage = myFactory.showMessage;
		$scope.correctAnswers = myFactory.correctAnswers;
		$scope.quizFinished = myFactory.quizFinished;
		$scope.perfectScore = myFactory.perfectScore;
	
		$scope.changeCorrect = function(q,correct)
		{
			var i = myFactory.questionList.indexOf(q);
			myFactory.questionList[i].correctAnswer = correct;
		}
		
		$scope.addQuestion = function()
		{
			$scope.Qnum++;
			var elem = {"id":$scope.Qnum};
			var answers = [];
			elem.answers = answers;
			elem.questionText = "";
			elem.correctAnswer = "Choose Answer";
			myFactory.questionList.push(elem);
			$scope.questionList = myFactory.questionList;
		}
		
		$scope.addAnswer = function(q)
		{
			$scope.Anum++;
			var elem = {"id":$scope.Anum};
			elem.text = "";
			var i = myFactory.questionList.indexOf(q);
			//delete myFactory.questionList[i];
			if(i != -1) {
				var list = myFactory.questionList[i];
				myFactory.questionList[i].answers.push(elem);
			}
			$scope.questionList = myFactory.questionList;
		}
	
		$scope.removeQuestion = function(q)
		{
			var i = myFactory.questionList.indexOf(q);
			//delete myFactory.questionList[i];
			if(i != -1) {
				myFactory.questionList.splice(i, 1);
				$scope.questionList = myFactory.questionList;
			}
			$scope.questionList = myFactory.questionList;
		}
		
		$scope.removeAnswer = function(q, a)
		{
			var i = myFactory.questionList.indexOf(q);
			//delete myFactory.questionList[i];
			if(i != -1) {
				var j = myFactory.questionList[i].answers.indexOf(a);
				myFactory.questionList[i].answers.splice(j, 1);
				$scope.questionList = myFactory.questionList;
			}
			$scope.questionList = myFactory.questionList;
		}
	
		$scope.hideAlert = function() 
		{
			$scope.showMessage = false;
		}
	
		$scope.reset = function()
		{
			$scope.question = "1";
			$scope.selected = "Choose Answer";
			$scope.displayType = "alert alert-success";
			$scope.displayText = "Good Job!";
			$scope.showMessage = false;
			myFactory.correctAnswers = 0;
			$scope.quizFinished = false;
			$scope.perfectScore = false;
		}
	
		$scope.changeQuiz = function(s1, s2)
		{
			myFactory.quizPath = s1;
			myFactory.quizChoice = s2;
			$scope.quizPath = myFactory.quizPath;
			$scope.quizChoice = myFactory.quizChoice;
			$http.get(myFactory.quizPath).success(
			function(data) 
			{
	   			myFactory.questions = data;
				$scope.questions = myFactory.questions;
			});
		}

		$scope.checkAnswer = function(n) 
		{
			if (n == $scope.questions[$scope.question-1].correct)
			{
				$scope.displayType = "alert alert-success"
				$scope.displayText = "Good Job!";
				myFactory.correctAnswers++;
				$scope.correctAnswers++;
			}
			else
			{
				$scope.displayType = "alert alert-danger"
				$scope.displayText = "Incorrect";
			}
			if ($scope.question < $scope.questions.length)
			{
	    		$scope.question++;
			}
			else if ($scope.question == $scope.questions.length)
			{
				$scope.question++;
				if ($scope.correctAnswers == $scope.questions.length)
				{
					myFactory.perfectScore = true;
					$scope.perfectScore = myFactory.perfectScore;
				}
				$scope.quizFinished = true;
			}
			$scope.showMessage = true;
		}
		
		$scope.getJSON = function()
		{
			var text = "";
			text += '\n[\n';
			for (var i = 0; i < myFactory.questionList.length; i++) { 
			    text += '\t{\n';
				var question = myFactory.questionList[i];
				text += '\t\t\"question\": \"';
				text += question.questionText;
				text += '\",\n'
				text += '\t\t\"correct\": \"';
				text += question.correctAnswer;
				text += '\",\n'
				text += '\t\t\"answers\": [\n';
				for (var j = 0; j < myFactory.questionList[i].answers.length; j++) { 
				    var answer = myFactory.questionList[i].answers[j];
					text += '\t\t\t\"';
					text += answer.text;
					text += '\"';
					if (j < myFactory.questionList[i].answers.length-1)
					{
						text += ',';
					}
					text += '\n';
				}
				text += '\t\t]\n';
				text += '\t}';
				if (i < myFactory.questionList.length-1){
					text += ",";
				}
				text += '\n';
			}
			text += ']\n';
			$scope.toJSON = text;
		}

});