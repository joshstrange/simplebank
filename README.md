# SimpleBank
## A very basic interface to fetch data from your Simple bank account using promises


### Install

````
npm install simplebank
````


### Example

````js
var SimpleBank = require('simplebank');

var mySimple = Simplebank('username', 'password');

mySimple.getTransactions().then(function(transactions){
	console.log(transactions);
});
````

### Methods

#### getBalances


#### getCard


#### getContacts


#### getChats


#### getGoals


#### getLinkedAccounts


#### getNextPayments


#### getNotifications


#### getTransactions


#### getTransactionsFrom(unixtime)


#### getTransfers
