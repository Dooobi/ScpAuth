var program = require("commander");
var scpAuth = require("./lib/scpAuthJar");
var request = require("request");

/*
program
.version("0.0.1")
.command("stop <account>", "Stops this HTML5 application on the specified account")
.command("start <account>", "Starts this HTML5 application on the specified account")
.command("deploy <account>", "Deploys this HTML5 application on the specified account")
.parse(process.argv);
*/
program
  .command("stop <account>", "Stops this HTML5 application on the specified account")
  .option("-u, --username <username>", "Username for authentication to SCP")
  .option("-p, --password <password>", "Password for authentication to SCP")
  .option("--client-session <client-session>", "The X-ClientSession-Id header")
  .option("--jsessionid <jsessionid>", "The JSESSIONID cookie value")
  .option("--jtenantsessionid <jtenantsessionid>", "The JTENANTSESSIONID cookie value")
  .action((account, command) => {
	console.log("stop");
	console.log(command);
	console.log("account:", account);
	console.log("user:", program.username);
	console.log("password:", program.password);
	console.log("client-session: ", program.clientSession);
	console.log("jsessionid: ", program.jsessionid);
	console.log("jtenantsessionid: ", program.jtenantsessionid);
  });

program
  .command("start <account>", "Starts this HTML5 application on the specified account")
  .option("-u, --username <username>", "Username for authentication to SCP")
  .option("-p, --password <password>", "Password for authentication to SCP")
  .option("--client-session <client-session>", "The X-ClientSession-Id header")
  .option("--jsessionid <jsessionid>", "The JSESSIONID cookie value")
  .option("--jtenantsessionid <jtenantsessionid>", "The JTENANTSESSIONID cookie value")
  .action((account, command) => {
	console.log("start");
	console.log("account:", account);
	console.log("user:", program.username);
	console.log("password:", program.password);
	console.log("client-session: ", program.clientSession);
	console.log("jsessionid: ", program.jsessionid);
	console.log("jtenantsessionid: ", program.jtenantsessionid);
  });

program.parse(process.argv);

/*
program
  .version("0.1.0", "-v, --version")
  .command("	
  .arguments("<action> <account>")
  .option("-u, --username <username>", "Username for authentication to SCP")
  .option("-p, --password <password>", "Password for authentication to SCP")
  .option("--client-session <client-session>", "The X-ClientSession-Id header")
  .option("--jsessionid <jsessionid>", "The JSESSIONID cookie value")
  .option("--jtenantsessionid <jtenantsessionid>", "The JTENANTSESSIONID cookie value")
  .parse(process.argv);
*/

 
var username = "t.stelzer@fis-gmbh.de",
	password = "C0nquer!";
/*
scpAuth.login(username, password)
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
					console.log("Successfully stopped the app "traineereportscustomizing" of account "a203bb997".");
				} else {
					console.log("Error when trying to stop the app "traineereportscustomizing" of account "a203bb997".");
				}
			}
		);
		
	}
);
*/