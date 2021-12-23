const jwt = require("jsonwebtoken");

//Generating token
function generateVerifyToken(validEmail) {
  const access_token = jwt.sign(
    { email: validEmail },
    process.env.JWT_SECRET_KEY
  );
  return access_token;
}

//auth-guard
function authGuard(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

//admin-guard
function admin(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied.");
  next();
}

exports.generateVerifyToken = generateVerifyToken;
exports.authGuard = authGuard;
exports.admin = admin;
