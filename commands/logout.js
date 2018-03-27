var scpAuth = require("../lib/scpAuthJar");

async function logout({ whatever }) {

}

module.exports = {
	handler: logout,
	builder: _ => _
    .default('dir', '.')
    .option('engine', { alias: 'x', default: 'regular' })
};