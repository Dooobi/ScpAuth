var request = require("request");
require('request-debug')(request);
var cheerio = require("cheerio");

var username = "t.stelzer@fis-gmbh.de",
	password = "C0nquer!";

var data = {};
	
firstRequest();

function thirdRequest() {

	var cookieString = buildCookiePart("XSRF_COOKIE", data._2.cookies["XSRF_COOKIE"]);
	cookieString += buildCookiePart("JSESSIONID", data._2.cookies["JSESSIONID"]);
	cookieString += buildCookiePart("ids", data._2.cookies["ids"]);
	
	request.post(
		"https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
		{
			headers: {
				"Cookie": cookieString
			},
			form: {
				"authenticity_token": data._2.authenticityToken,
				"xsrfProtection": data._2.cookies["XSRF_COOKIE"],
				"method": "POST",
				"idpSSOEndpoint": data._2.idpSSOEndpoint,
				"SAMLRequest": data._2.samlRequest,
				"RelayState": data._2.relayState,
				"targetUrl": data._2.targetUrl,
				"sourceUrl": data._2.sourceUrl,
				"org": data._2.org,
				"spId": data._2.spId,
				"spName": data._2.spName,
				"mobileSSOToken": data._2.mobileSSOToken,
				"tfaToken": data._2.tfaToken,
				"css": data._2.css,
				"j_username": username,
				"j_password": password
			}
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				data._3 = {};
				data._3.authenticityToken = $("input[name='authenticity_token']").attr("value");
				data._3.samlResponse = $("input[name='SAMLResponse']").attr("value");
				data._3.relayState = $("input[name='RelayState']").attr("value");
				data._3.response = response;
				data._3.cookies = makeCookieMap(response.headers["set-cookie"]);
			}
		}
	);
}

function secondRequest() {
	request.post(
		"https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
		{ 
			form: { 
				"SAMLRequest": data._1.samlRequest,
				"RelayState": data._1.relayState
			}
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				data._2 = {};
				data._2.authenticityToken = $("meta[name='csrf-token']").attr("content");
				data._2.idpSSOEndpoint = $("input[name='idpSSOEndpoint']").attr("value");
				data._2.samlRequest = $("input[name='SAMLRequest']").attr("value");
				data._2.relayState = $("input[name='RelayState']").attr("value");
				data._2.targetUrl = $("input[name='targetUrl']").attr("value");
				data._2.sourceUrl = $("input[name='sourceUrl']").attr("value");
				data._2.org = $("input[name='org']").attr("value");
				data._2.spId = $("input[name='spId']").attr("value");
				data._2.spName = $("input[name='spName']").attr("value");
				data._2.mobileSSOToken = $("input[name='mobileSSOToken']").attr("value");
				data._2.tfaToken = $("input[name='tfaToken']").attr("value");
				data._2.css = $("input[name='css']").attr("value");
				data._2.response = response;
				data._2.cookies = makeCookieMap(response.headers["set-cookie"]);
				
				thirdRequest();
			}
		}
	);
}

function firstRequest() {
	request.get(
		"https://account.hana.ondemand.com/cockpit",
		{ 
		},
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				data._1 = {};
				data._1.samlRequest = $("input[name='SAMLRequest']").attr("value");
				data._1.relayState = $("input[name='RelayState']").attr("value");
				data._1.response = response;
				data._1.cookies = makeCookieMap(response.headers["set-cookie"]);
				
				secondRequest();
			}
		}
	);
}

function buildCookiePart(key, value) {
	return key + "=\"" + value + "\";";
}

function makeCookieMap(cookieArray) {
	var cookieMap = {};
	
	for (var i = 0; i < cookieArray.length; i++) {
		var cookieString = cookieArray[i],
			indexOfEquals = cookieString.indexOf("="),
			indexOfSemicolon = cookieString.indexOf(";");
		
		var key = cookieString.slice(0, indexOfEquals),
			value = cookieString.slice(indexOfEquals+1, indexOfSemicolon);
			
		if (value.startsWith("\"")) {
			value = value.slice(1);
		}
		if (value.endsWith("\"")) {
			value = value.slice(0, value.length-2);
		}
		
		cookieMap[key] = value;
	}
	
	return cookieMap;
}