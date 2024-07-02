const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, userData) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.userData = userData;
    next();
  });
};

module.exports = authenticateToken;
