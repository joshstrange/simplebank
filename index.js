var request = require('request');
var Q = require('q');

function SimpleBank(username, password) {
	var self = this;
	self.username = username;
	self.password = password;
	self.cookies = request.jar();

    self.urls = {
    	Transactions: 'https://bank.simple.com/transactions/data',
    	Balances: 'https://bank.simple.com/account/balances',
    	NextPayments: 'https://bank.simple.com/payments/next_payments',
    	Goals: 'https://bank.simple.com/goals/data',
    	LinkedAccounts: 'https://bank.simple.com/linked-accounts',
    	Contacts: 'https://bank.simple.com/contacts/data',
    	Card: 'https://bank.simple.com/card',
    	Chats: 'https://bank.simple.com/chats/data',
    	Transfers: 'https://bank.simple.com/c2c/transfers',
    	Notifications: 'https://bank.simple.com/api/notifications'
    }
    self.cache = {};

	self.login = function() {
		var deferred = Q.defer();
		request.post({
			url: 'https://bank.simple.com/signin',
			form:{
				username: self.username,
				password: self.password
			},
			jar: self.cookies
		}, function(error, response) {
			if(error) {
				deferred.reject(new Error(error));
			}
			if(response.statusCode == 303) {
				deferred.resolve();
			}
		});
		return deferred.promise;
	}();


	self.fetch = function(url) {
		var deferred = Q.defer();
		request({
			url: url,
			jar: self.cookies
		}, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    deferred.resolve(JSON.parse(body));
		  } else {
			deferred.reject(new Error(error));
		  }
		});
		return deferred.promise;
	};

	function createFunction(type) {
		return function() {
			return self.get(type);
		};
	}

	for(type in self.urls)
	{
		self['get'+type] = createFunction(type);
		self.cache[type] = null;
	}

	self.getTransactionsFrom = function(from) {
		if(!from) {
			from = new Date().getTime();
		}
		return self.login.then(function(){
			return self.fetch('https://bank.simple.com/transactions/new_transactions?timestamp='+from);
		});
	};

	self.get = function(type) {
		var deferred = Q.defer();
		if(self.cache[type])
		{
			deferred.resolve(self.cache[type]);
		} else {
			self.login.then(function(){
				return self.fetch(self.urls[type]);
			}).then(function(body){
				self.cache[type] = body;
				deferred.resolve(body);
			});	
		}
		return deferred.promise;
	};

	return self;
}

module.exports = SimpleBank