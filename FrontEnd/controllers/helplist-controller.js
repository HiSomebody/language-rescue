//Define an angular module for our app
var app = angular.module("helpListApp", ["ngRoute","ui.bootstrap.modal"])
var port = 80;
var only = "first sequence";

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
	$http.get('http://104.236.169.62:' + port + '/selectall/help_list')
	.success(function(data){
		only = data.only;
		for (var i = 0; i<data.json.length; i++)
		{
			var entry = data.json[i];
			if (entry.show_entry != 1)
			{
				data.json.splice(i,1);
				i -= 1;
			}
		}
		mediaList.listed = data.json;
	}).error(function()
	{
		//$scope.somethingWentWrong = true;
		//alert('failed to retrieve data');
		console.error('failed to retrieve data initially from server');
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

/*
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
*/


app.controller('helpListController',

	function($scope, $http, myFactory) {
		$scope.entries = myFactory.entries;
		$scope.view = "mainView";
		$scope.selectedEntry = $scope.entries.listed[0];
		$scope.successMovieUpdate = false;
		$scope.successMovieEntry = false;
		$scope.failedToUpdate = false;
		$scope.failedToEnter = false;
		$scope.somethingWentWrong = false;
		$scope.showModal = false;
		$scope.onlyEntry = "";

		$scope.getAllMediaEntries = function()
		{
			$http.get('http://104.236.169.62:' + port + '/selectall/help_list')
			.success(function(data){
				only = data.only;
				for (var i = 0; i<data.json.length; i++)
				{
					var entry = data.json[i];
					if (entry.show_entry != 1)
					{
						data.json.splice(i,1);
						i -= 1;
					}
				}
				myFactory.entries.listed = data.json;
				$scope.entries = myFactory.entries;
			}).error(function()
			{
				$scope.somethingWentWrong = true;
				//alert('failed to retrieve data');
				console.error('failed to retrieve data from server');
			});
		}

		$scope.editingMovieEntry = false;

		setInterval(function(){
	
			 $scope.getAllMediaEntries();

		}, 30000);

	$scope.hideAlert = function(expression)
	{
		if (expression == "successMovieEntry")
		{
			$scope.successMovieEntry = false;
		}
		else if (expression == "successMovieUpdate")
		{
			$scope.successMovieUpdate = false;
		}
		else if (expression == "failedToEnter")
		{
			$scope.failedToEnter = false;
		}
		else if (expression == "failedToUpdate")
		{
			$scope.failedToUpdate = false;
		}
		else if (expression == "somethingWentWrong")
		{
			$scope.somethingWentWrong = false;
		}
	}


	$scope.setSelectedEntry = function(e)
	{
		//update css

		$scope.successUpdate = false;
		$scope.selectedEntry = e;
		$scope.editing = false;
	}


	$scope.setView = function(view)
	{
		if (view == "mainView")
		{
			fixChars($scope.entries);
		}
		$scope.view = view;
		$scope.successMovieUpdate = false;
		$scope.successMovieEntry = false;
		$scope.failedToUpdate = false;
		$scope.failedToEnter = false;
		$scope.somethingWentWrong = false;
	}

	$scope.editMovieEntry = function()
	{
		$scope.editingMovieEntry = true;

	}

	$scope.fixPosterURL = function(url)
	{
		var newURL = url;
		if (url.search("ia.media-imdb.com/images/M/") != -1)
		{
			var index = url.search("MV5");
			newURL = "MOVIEPOSTER" + "/" + url.substring(index);
		}
		return newURL;
	}

	$scope.addNameToList = function()
	{
		$scope.successUpdate = false;
		if ($scope.currentEntry == '' || $scope.currentEntry == null)
		{
			alert("Please enter your name.");
		}
		else
		{
			// CHECK IF ENTRY ALREADY EXISTS
			var changedString = change($scope.currentEntry);
			console.log(changedString);
			$http.get('http://104.236.169.62:'+port+'/check/help_list/student_name/'+changedString)
			.success(function(data){
				for (var i = 0; i < data.json.length; i++)
				{
					if (data.json[i].show_entry == 1)
					{
						alert("You're already in the list");
						return;
					}
				}
				console.log("good");
				/*var exists = false;
				var hidden = false;
				for (var i = 0; i < data.json.length; i++)
				{
					if (data.json[i].ownerName.toLowerCase() == change($scope.entryTitle.toLowerCase()) && data.json[i].show_entry == 1)
					{
						exists = true;
						hidden = false;
					}
					else if (data.json[i].ownerName.toLowerCase() == change($scope.entryTitle.toLowerCase()) && data.json[i].show_entry == 0)
					{
						exists = true;
						hidden = true;
					}
				}
				if (exists && !hidden)
				{
					alert("You're already in the list");
					return;
				}
				else if (exists && hidden)
				{
					$scope.unhide();
					$scope.successMovieEntry = true;
					return;
				}*/
				//else
				{
					// INSERT ENTRY INTO LIBRARY
					$http.post('http://104.236.169.62:'+port+'/insert/help_list',
						{	student_name: changedString,
							show_entry: 1
						}).
					success(function(data, status, headers, config) {
						//alert("Successfully added a new entry to the database!");
						console.log("successfully added a new entry")
						$scope.successMovieEntry = true;
						//$scope.view = "mainView";
						$scope.resetInput();
						$scope.getAllMediaEntries();
					}).
					error(function(data, status, headers, config) {
						//alert("Failed to add entry to library.");
						console.error("Failed to add entry to library.");
						$scope.failedToEnter = true;
					});
				}
			}).error(function()
			{
				//alert('failure');
				console.error('Failed to retrieve whether owner already entered that title.');
				$scope.failedToEnter = true;
			});
		}
	}


	$scope.removeEntry = function()
	{
		if ($scope.onlyEntry !== only)
		{
     	  		$scope.onlyEntry = "";
			return;
		}
		
				// Remove ENTRY
				$http.post('http://104.236.169.62:'+port+'/deleteNameFromHelpList',

					{id: $scope.selectedEntry.id,
					}).
				success(function(data, status, headers, config) {

					//$scope.successUpdate = true;
						//alert("Successfully updated entry in database!");
						console.log("Successfully removed (hid) entry in database!");
						$scope.selectedEntry.show_entry = 0;
						$scope.selectedEntry = null;
						$scope.getAllMediaEntries();
						$scope.editingMovieEntry = false;

					}).
				error(function(data, status, headers, config) {
					$scope.somethingWentWrong = true;
					//alert("Failed to update entry in database.");
					console.error("Failed to remove (hide) entry in database.");
				});
	     	  	$scope.onlyEntry = "";
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
							console.log("Successfully updated entry in database!");
							$scope.editingMovieEntry = false;

						}).
					error(function(data, status, headers, config) {
						$scope.failedToUpdate = true;
						//alert("Failed to update media entry in database.");
						console.error("Failed to update media entry in database.");
					});
		}
		if ($scope.selectedEntry.posterURL != '' && $scope.selectedEntry.posterURL != null)
		{
			$scope.addPoster();
		}
	}

$scope.cancelModal = function()
{
	$scope.showModal = false;
}

$scope.openModal = function(entry)
{
	$scope.selectedEntry = entry;
	$scope.showModal = true;
}

	var change = function(inString)
	{
		if (inString == null)
		{
			return "";
		}
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
	
	$scope.changeRight = function(inString)
	{
		if (inString == null)
		{
			return "";
		}
		var changed = "";
		for (var i = 0; i < inString.length; i++)
		{
			var c = inString[i];
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
		return changed;
	}



	$scope.unhide = function()
	{
				for (var i = 0; i < $scope.entries.listed.length; i++)
				{
					if ($scope.entries.listed[i].title == change($scope.entryTitle) || $scope.entries.listed[i].title == $scope.entryTitle)
					{
						$scope.selectedEntry = $scope.entries.listed[i];
						$http.post('http://104.236.169.62:'+port+'/unhideMedia',
							{
								id: $scope.selectedEntry.id,
							}).
						success(function(data, status, headers, config) {
								$scope.entries.listed[i].show_entry = 1;
									//alert("Successfully updated entry in database!");
									console.log("Successfully updated entry in database!");
							}).
						error(function(data, status, headers, config) {
							$scope.somethingWentWrong = true;
							//alert("Failed to update entry in database.");
							console.error("Failed to add entry (unhide entry) in database.");
						});
						return;
					}
				}
				$scope.editingMovieEntry = false;
	}


	$scope.addPoster = function()
	{
		$scope.successUpdate = false;
		if ($scope.selectedEntry.posterURL == '' || $scope.selectedEntry.posterURL == null)
		{
			// Do nothing
		}
		else
		{
			// Update poster for movie
			$http.post('http://104.236.169.62:'+port+'/addPoster',
			{	
				id: $scope.selectedEntry.id,
				Poster: $scope.selectedEntry.posterURL
			}).
			success(function(data, status, headers, config) {

				//alert("Successfully added a new entry to the database!");
				console.log("successfully added a poster")
				$scope.resetInput();
				$scope.getAllMediaEntries();
			}).
			error(function(data, status, headers, config) {

				//alert("Failed to add entry to library.");
				console.error("Failed to add poster to entry.");
				$scope.failedToEnter = true;
			});
		}
	}

	$('#yourForm').submit(function(event){

	  // prevent default browser behaviour
	  event.preventDefault();

	  //do stuff with your form here
	  $scope.removeEntry();
	  $('#myModal2').modal('hide');
	  $scope.onlyEntry = "";
	});

	$('#nameForm').submit(function(event){

	  // prevent default browser behaviour
	  event.preventDefault();

	  //do stuff with your form here
	  $scope.addNameToList();
	  $scope.currentEntry = "";
	});
	
	$scope.contributeEntry = function()
	{
		$scope.successUpdate = false;
		if ($scope.entryTitle == '' || $scope.entryTitle == null)
		{
			alert("Please enter a title.");
		}
		else if ($scope.entryOwner == '' || $scope.entryOwner == null)
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
				var hidden = false;
				for (var i = 0; i < data.json.length; i++)
				{
					if (data.json[i].ownerName.toLowerCase() == change($scope.entryOwner.toLowerCase()) && data.json[i].show_entry == 1)
					{
						exists = true;
						hidden = false;
					}
					else if (data.json[i].ownerName.toLowerCase() == change($scope.entryOwner.toLowerCase()) && data.json[i].show_entry == 0)
					{
						exists = true;
						hidden = true;
					}
				}
				if (exists && !hidden)
				{
					alert("You've already entered that movie.");
					return;
				}
				else if (exists && hidden)
				{
					$scope.unhide();
					$scope.successMovieEntry = true;
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
						//alert("Successfully added a new entry to the database!");
						console.log("successfully added a new entry")
						$scope.successMovieEntry = true;
						$scope.view = "splashPageView";
						$scope.resetInput();
						$scope.getAllMediaEntries();
					}).
					error(function(data, status, headers, config) {
						//alert("Failed to add entry to library.");
						console.error("Failed to add entry to library.");
						$scope.failedToEnter = true;
					});
				}
			}).error(function()
			{
				//alert('failure');
				console.error('Failed to retrieve whether owner already entered that title.');
				$scope.failedToEnter = true;
			});
		}
	}


	$scope.skip = function()
	{
		$scope.editing = false;
		$scope.adding = false;
		$scope.setView("mainView");
	}

	$scope.cancelEdit = function()
	{
		$scope.editingMovieEntry = false;
	}



	$scope.resetInput = function()
	{
		$scope.selectedEntry = {};
		$scope.successUpdate = false;
		$scope.currentEntry = null;
		$scope.additionalInfo = null;
		$scope.entryOwner = null;
		$scope.entryTitle = null;
	}



});
