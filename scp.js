#!/usr/bin/env node

const argv = require("yargs")
	.version()
	.command(["login <username> <password>"], "Login to SCP", require("./commands/login"))
	.command(["logout <username> <password>"], "Logout from SCP", require("./commands/logout"))
	.command(["start <username> <password>"], "Start the app on the account", require("./commands/start"))
	.command(["stop <username> <password>"], "Stop the app on the account", require("./commands/stop"))
	.command(["deploy <account>"], "Deploy the app on the account", require("./commands/deploy"))
	.demandCommand(1, "You need at least one command before moving on")
	.help("h")
	.alias("h", "help")
	.argv;