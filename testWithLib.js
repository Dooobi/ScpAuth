var scpAuth = require("./lib/scpAuthJar");
var request = require("request");

var username = "t.stelzer@fis-gmbh.de",
	password = "C0nquer!";

scpAuth.authenticate(username, password)
	.then(authData => {
		console.log(authData);
		
		request.post(
		"https://account.hana.ondemand.com/ajax/triggerHtml5AppAction/a203bb997/traineereportscustomizing",
		{
			headers: {
				"Cookie": authData.cookieString,
				"X-ClientSession-Id": authData.clientSessionId
			},
			body: "START"
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("Successfully stopped the app 'traineereportscustomizing' of account 'a203bb997'.");
			} else {
				console.log("Error when trying to stop the app 'traineereportscustomizing' of account 'a203bb997'.");
			}
		});
		
	}
);
