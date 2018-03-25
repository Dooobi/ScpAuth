var rp = require("request-promise-native");
var cheerio = require("cheerio");

var ids = "rd3o00000000000000000000ffffac12211do443";
var idsr = "rd3o00000000000000000000ffffac12239do443";
var pkId = "71f4fbbff7b9fb45.1521840837.0.1521844183..";
var swaId = "f41c90bfa4a29cb3.1521840837.1.1521844196.1521840837.";

var data = {};

var firstOptions = {
	method: "GET",
	uri: "https://account.hana.ondemand.com/cockpit",
	resolveWithFullResponse: true,
	headers: {
		"Host": "account.hana.ondemand.com",
		"Connection": "close",
		"Upgrade-Insecure-Requests": "1",
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
		"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
		"Accept-Encoding": "*",
		"Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7"
	}
};

module.exports = {
	authenticate: async function(username, password) {
		
		var data = {},
			optionsNext = firstOptions;
			
		try {
			
			var response = await rp(optionsNext);
			optionsNext = handleFirstResponse(response);
			response = await rp(optionsNext);
			optionsNext = handleSecondResponse(response, username, password);
			response = await rp(optionsNext);
			optionsNext = handleThirdResponse(response);
			response = await rp(optionsNext);
			optionsNext = handleFourthResponse(response);
			response = await rp(optionsNext);
			return handleFifthResponse(response);
			
		} catch (error) {
			
			if (error.statusCode == 302) {
				optionsNext = handleFourthResponse(error);
				response = await rp(optionsNext);
				return handleFifthResponse(response);
			}
			
			return error;
		}
	}
}

function buildCookiePart(key, value) {
	return key + "=" + value + ";";
}

function makeCookieMap(cookieArray) {
	var cookieMap = {};
	
	if (!cookieArray) {
		return cookieMap;
	}
	
	for (var i = 0; i < cookieArray.length; i++) {
		var cookieString = cookieArray[i],
			indexOfEquals = cookieString.indexOf("="),
			indexOfSemicolon = cookieString.indexOf(";");
		
		var key = cookieString.slice(0, indexOfEquals),
			value = cookieString.slice(indexOfEquals+1, indexOfSemicolon);
			
		value = trim("\"", value);
		
		if (!cookieMap[key]) {
			// Key doesn't exist yet or its value is falsey
			cookieMap[key] = value;
		}
	}
	
	return cookieMap;
}

function trim(character, string) {
	if (string.startsWith(character)) {
		string = string.slice(1);
	}
	if (string.endsWith(character)) {
		string = string.slice(0, string.length-2);
	}
	return string;
}

function handleFirstResponse(response) {
	if (response.statusCode != 200) {
		throw new Error(response);
	}
	if (response.response) {
		response = response.response;
	}
	
	var $ = cheerio.load(response.body);
	data._1 = {};
	data._1.samlRequest = $("input[name='SAMLRequest']").attr("value");
	data._1.relayState = $("input[name='RelayState']").attr("value");
	data._1.response = response;
	data._1.cookies = makeCookieMap(response.headers["set-cookie"]);
	
	var optionsNext = {
		method: "POST",
		uri: "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
		resolveWithFullResponse: true,
		headers: {
			"Host": "accounts.sap.com",
			"Connection": "close",
			"Cache-Control": "max-age=0",
			"Origin": "https://account.hana.ondemand.com",
			"Upgrade-Insecure-Requests": "1",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
			"Referer": "https://account.hana.ondemand.com/cockpit",
			"Accept-Encoding": "*",
			"Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7"
		},
		form: {
			"SAMLRequest": data._1.samlRequest,
			"RelayState": data._1.relayState
		}
	};
	
	return optionsNext;
}

function handleSecondResponse(response, username, password) {
	if (response.statusCode != 200) {
		throw new Error(response);
	}
	if (response.response) {
		response = response.response;
	}
	
	var $ = cheerio.load(response.body);
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
	
	var cookieString = buildCookiePart("XSRF_COOKIE", data._2.cookies["XSRF_COOKIE"]);
	cookieString += buildCookiePart("JSESSIONID", data._2.cookies["JSESSIONID"]);
	cookieString += buildCookiePart("ids", data._2.cookies["ids"]);
//	cookieString += buildCookiePart("ids", ids);
//	cookieString += buildCookiePart("idsr", idsr);
//	cookieString += buildCookiePart("_swa_ref.1f27c1eb-778f-4cbe-83f5-e9aab5b7f148.d1fd", "%5B%22%22%2C%22%22%2C1521835113%2C%22https%3A%2F%2Faccount.hana.ondemand.com%2Fcockpit%22%5D");
//	cookieString += buildCookiePart("_swa_ses.1f27c1eb-778f-4cbe-83f5-e9aab5b7f148.d1fd", "*");
//	cookieString += buildCookiePart("_pk_id.1f27c1eb-778f-4cbe-83f5-e9aab5b7f148.d1fd", pkId);
//	cookieString += buildCookiePart("_swa_id.1f27c1eb-778f-4cbe-83f5-e9aab5b7f148.d1fd", swaId);
	
	var optionsNext = {
		method: "POST",
		uri: "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
		resolveWithFullResponse: true,
		headers: {
			"Host": "accounts.sap.com",
			"Connection": "close",
			"Cache-Control": "max-age=0",
			"Origin": "https://accounts.sap.com",
			"Upgrade-Insecure-Requests": "1",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
			"Referer": "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
			"Accept-Encoding": "*",
			"Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
			"Cookie": cookieString
		},
		form: {
			"utf8": "%E2%9C%93",
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
	};
	
	return optionsNext;
}

function handleThirdResponse(response) {
	if (response.statusCode != 200) {
		throw new Error(response);
	}
	if (response.response) {
		response = response.response;
	}
	
	var $ = cheerio.load(response.body);
	data._3 = {};
	data._3.authenticityToken = $("input[name='authenticity_token']").attr("value");
	data._3.samlResponse = $("input[name='SAMLResponse']").attr("value");
	data._3.relayState = $("input[name='RelayState']").attr("value");
	data._3.response = response;
	data._3.cookies = makeCookieMap(response.headers["set-cookie"]);
	
	var cookieString = buildCookiePart("BIGipServeraccount.hana.ondemand.com", data._1.cookies["BIGipServeraccount.hana.ondemand.com"]);
	cookieString += buildCookiePart(data._1.relayState, data._1.cookies[data._1.relayState]);
	
	var optionsNext = {
		method: "POST",
		uri: "https://account.hana.ondemand.com/cockpit",
		resolveWithFullResponse: true,
		headers: {
			"Host": "account.hana.ondemand.com",
			"Connection": "close",
			"Cache-Control": "max-age=0",
			"Origin": "https://accounts.sap.com",
			"Upgrade-Insecure-Requests": "1",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
			"Referer": "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
			"Accept-Encoding": "*",
			"Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
			"Cookie": cookieString
		},
		form: {
			"utf8": "%E2%9C%93",
			"authenticity_token": data._3.authenticityToken,
			"SAMLResponse": data._3.samlResponse,
			"RelayState": data._3.relayState
		}
	};
	
	return optionsNext;
}

function handleFourthResponse(response) {
	if (response.statusCode != 200 && response.statusCode != 302) {
		throw new Error(response);
	}
	if (response.response) {
		response = response.response;
	}
		
	var $ = cheerio.load(response.body);
	data._4 = {};
	data._4.response = response;
	data._4.cookies = makeCookieMap(response.headers["set-cookie"]);
	
	var cookieString = buildCookiePart("BIGipServeraccount.hana.ondemand.com", data._1.cookies["BIGipServeraccount.hana.ondemand.com"]);
	cookieString += buildCookiePart("JSESSIONID", data._4.cookies["JSESSIONID"]);
	cookieString += buildCookiePart("JTENANTSESSIONID_services", data._4.cookies["JTENANTSESSIONID_services"]);
	
	var optionsNext = {
		method: "GET",
		uri: "https://account.hana.ondemand.com/cockpit",
		resolveWithFullResponse: true,
		headers: {
			"Host": "account.hana.ondemand.com",
			"Connection": "close",
			"Cache-Control": "max-age=0",
			"Upgrade-Insecure-Requests": "1",
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
			"Referer": "https://accounts.sap.com/saml2/idp/sso/accounts.sap.com",
			"Accept-Encoding": "*",
			"Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
			"Cookie": cookieString
		}
	};
	
	return optionsNext;
}

function handleFifthResponse(response) {
	if (response.statusCode != 200) {
		throw new Error(response);
	}
	if (response.response) {
		response = response.response;
	}
	
	var $ = cheerio.load(response.body);
	data._5 = {};
	data._5.clientSessionId = $("script[id='loadCockpit']").attr("data-csrftoken");
	data._5.response = response;
	data._5.cookies = makeCookieMap(response.headers["set-cookie"]);
	
	var refinedCookieString = buildCookiePart("BIGipServeraccount.hana.ondemand.com", data._1.cookies["BIGipServeraccount.hana.ondemand.com"]);
	refinedCookieString += buildCookiePart("JSESSIONID", data._4.cookies["JSESSIONID"])
	refinedCookieString += buildCookiePart("JTENANTSESSIONID_services", data._4.cookies["JTENANTSESSIONID_services"])
	
	var refinedData = {
		cookieString: refinedCookieString,
		clientSessionId: data._5.clientSessionId
	};
	
	return refinedData;
}
