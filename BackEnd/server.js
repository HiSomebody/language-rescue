var express = require('express')
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var connectionpool = mysql.createPool({
	host	: 'localhost',
	user	: 'root',
	password : 'nd888nd7',
	database : 'language_rescue_database'
});
	app.use(bodyParser.json());


app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
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
					length: rows.length
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
				contributions : input.contributions
			
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
				first_contributed_user : input.first_contributed_user
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
			connection.query('INSERT INTO ' + req.params.table + ' SET ?', data, function (err, result) {
				if (err) throw err;
				res.send('User added to the database with ID: ' + result.insertID);
			});
		}
	});
});
app.put('/:table/:id', function(req,res){});
app.delete('/:table/:id', function(req,res){});
app.listen(4244);
console.log('Paul\'s Rest API listening on port 4244');
