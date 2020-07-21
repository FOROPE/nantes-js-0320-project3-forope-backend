require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;

const authToken = (role) => (req, res, next) => {
  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json(err);
      }
      if (role == decoded.role) {
        console.log(decoded);
        return next();
      } else {
        return res.status(401).json({ msg: "t'as pas le droit" });
      }
    });
  } else {
    res.sendStatus(403);
  }
};

module.exports = { authToken };
