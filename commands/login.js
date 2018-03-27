var scpAuth = require("../lib/scpAuthJar");

async function login({ username, password }) {

	var authData = await scpAuth.login(username, password);
	
	if (!authData) {
		authData = "";
	}
	console.log(authData);
}

module.exports = {
	handler: login,
	builder: _ => _
    .default('dir', '.')
    .option('engine', { alias: 'x', default: 'regular' })
};