var scpAuth = require("../lib/scpAuthJar");

function auth({ username, password }) {
  console.log("Username:", username);
  console.log("Password:", password);
}

module.exports = {
	handler: auth
};