var scpAuth = require("../lib/scpAuthJar");
var rp = require("request-promise-native");

async function start({ username, password }) {
	var authData = await scpAuth.login(username, password);
	
	if (!authData
		|| !authData.cookieString
		|| !authData.clientSessionId) 
	{			
		console.log("Error during login to SCP!");
		return;
	}
	
	try {
		var response = await rp({
			method: "POST",
			uri: "https://account.hana.ondemand.com/ajax/triggerHtml5AppAction/a203bb997/traineereportscustomizing",
			resolveWithFullResponse: true,
			headers: {
				"Cookie": authData.cookieString,
				"X-ClientSession-Id": authData.clientSessionId
			},
			body: "START"
		});
		console.log("Successfully started the app 'traineereportscustomizing' of account 'a203bb997'.");
	} catch (error) {
		console.log("Error when trying to start the app 'traineereportscustomizing' of account 'a203bb997'.");
		
		return error;
	}

	try {
		// Logout
		await scpAuth.logout();
		console.log("Successfully logged out from SCP.");
		
	} catch (error) {
		console.log("Error when logging out from SCP.");
		
		console.log(error);
		return error;
	}
}

module.exports = {
	handler: start,
	builder: _ => _
    .default('dir', '.')
    .option('engine', { alias: 'x', default: 'regular' })
};