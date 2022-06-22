const { verify } = require("jsonwebtoken");
const env = require("../database/env");

function ensureAuthenticated(request, response, next) {
    if(process.env.NODE_ENV === 'test') return next()
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid",
        });
    }

    const [bearer, token] = authToken.split(" ");

    try {
        const secret = env.JWT_SECRET;
        const { subject } = verify(token, secret);

        request.username = subject;

        return next();
    }
    catch (err) {
        return response.status(401).json({
            errorCode: "token.expired"
        });
    }
}

module.exports = { ensureAuthenticated };