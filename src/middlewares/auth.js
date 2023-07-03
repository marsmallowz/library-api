const jwt = require("jsonwebtoken");
const secret = "qaqa";

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Akses ditolak",
    });
  }
  try {
    token = token.split(" ")[1];

    if (token === null || !token) {
      return res.status(401).json({
        message: "Akses ditolak",
      });
    }

    let verifiedUser = jwt.verify(token, secret);
    req.user = verifiedUser;

    next();
  } catch (error) {
    return res.status(401).json({
      message: error,
    });
  }
};

module.exports = { verifyToken };
