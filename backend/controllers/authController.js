const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { users } = require("../config/store");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await users.findByEmail(email);

  const passwordMatches =
    user?.matchPassword !== undefined
      ? await user.matchPassword(password)
      : await bcrypt.compare(password, user?.password || "");

  if (!user || !passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return res.json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      email: user.email
    }
  });
};

module.exports = { login };
