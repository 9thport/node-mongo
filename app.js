
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var EmployeeProvider = require('./employeeprovider').EmployeeProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var employeeProvider= new EmployeeProvider('localhost', 27017);

//Routes

// app.get('/', routes.index);
// app.get('/users', user.list);

app.get('/', function(req, res){
  employeeProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Employees',
            employees:emps
        });
  });
});

app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an employee
app.get('/employee/:id/edit', function(req, res) {
        employeeProvider.findById(req.param('_id'), function(error, employee) {
                res.render('employee_edit',
                { 
                        employee: employee
                });
        });
});

//save updated employee
app.post('/employee/:id/edit', function(req, res) {
        employeeProvider.update(req.param('_id'),{
                title: req.param('title'),
                name: req.param('name')
        }, function(error, docs) {
                res.redirect('/')
        });
});

//delete an employee
app.post('/employee/:id/delete', function(req, res) {
        employeeProvider.delete(req.param('_id'), function(error, docs) {
                res.redirect('/')
        });
});

// Server

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
