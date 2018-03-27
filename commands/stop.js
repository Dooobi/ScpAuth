var scpAuth = require("../lib/scpAuthJar");
var request = require("request");

async function stop({ username, password }) {
	var authData = await scpAuth.login(username, password);
	
	if (!authData
		|| !authData.cookieString
		|| !authData.clientSessionId) 
	{			
		console.log("Error during login to SCP!");
		return;
	}
	
	request.post(
		"https://account.hana.ondemand.com/ajax/triggerHtml5AppAction/a203bb997/traineereportscustomizing",
		{
			headers: {
				"Cookie": authData.cookieString,
				"X-ClientSession-Id": authData.clientSessionId
			},
			body: "STOP"
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("Successfully stopped the app 'traineereportscustomizing' of account 'a203bb997'.");
			} else {
				console.log("Error when trying to stop the app 'traineereportscustomizing' of account 'a203bb997'.");
			}
		}
	);
}

module.exports = {
	handler: stop,
	builder: _ => _
    .default('dir', '.')
    .option('engine', { alias: 'x', default: 'regular' })
};