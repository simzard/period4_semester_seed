module.exports.jwtConfig = {
    secret: "ChangeMeToARealSecretOrIWillBeHacked",
    tokenExpirationTime: 20, // seconds
    audience: "yoursite.net",
    issuer: "yourcompany@somewhere.com"
}
