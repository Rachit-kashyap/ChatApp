const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Token not found. Please log in again." });
        }

        let decrypt = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decrypt; 
        next(); 

    } catch (error) {
        return res.status(403).json({ success: false, message: "Invalid token. Try again." });
    }
};

module.exports = auth;
