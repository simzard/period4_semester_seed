var app = angular.module('seed', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "views/guest/guest.html"                
            })
            .when("/login", {
                templateUrl: "views/guest/login.html",
                controller: "Controller as ctrl"
                
            })
            .when("/signup", {
                templateUrl: "views/guest/signup.html",
                controller: "Controller as ctrl"
                
            })
            .otherwise({
                redirectTo: "/"
            })
});

app.controller('Controller', ['$http', function($http) {
	var self = this;
	
	self.role = "user";
	
	self.authenticate = function() {
		var data = {
			username: self.username,
			password: self.password
		}
		$http.post("/api/authenticate", data).success(function(data){
		}).error(function(err) {
		});
				
	}
	
	self.signup = function() {
		
		var data = {
			username: self.username,
			password: self.password,
			role: self.role
		}		
		
		$http.post("/api/signup", data).success(function(data) {
			if (data.success) {
				self.result = "Success: " + data.msg;
			} else {
				self.result = "Error: " + data.msg;
			}
		}).error(function(err) {
		});
	}
}])

