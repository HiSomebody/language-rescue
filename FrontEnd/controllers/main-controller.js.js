
//Define an angular module for our app
var creatorApp = angular.module("creatorApp", ["ngRoute"])
 

creatorApp.factory('myFactory', function($http){
	
	
	var instance = {};
	instance.questionList = [];


	instance.quizName = "";
	instance.quizChoice = "Geography";
	instance.quizPath = "quizes/geography.json";
	instance.question = "1";
	instance.selected = "Choose Answer";
	instance.displayType = "alert alert-success";
	instance.displayText = "Good Job!";
	instance.showMessage = false;
	instance.correctAnswers = 0;
	instance.quizFinished = false;
	instance.perfectScore = false;
    
	$http.get('quizes/quizes.json').success(function(data) {
      	instance.quizes = data;
    });
	
  	$http.get(instance.quizPath).success(function(data) {
   	  	instance.questions = data;
  	});
	
	return instance;
}) 
 
 
creatorApp.config(function($routeProvider) {
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
 
 

creatorApp.controller('MainController', 
	
function($scope, $http, myFactory) {
  	
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