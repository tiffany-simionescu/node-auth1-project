const bcrypt = require("bcryptjs");
const router = require('express').Router();

const Users = require('./users-model');

function restricted() {
  const authError = {
    message: "Invalid Credentials"
  };

  return async (req, res, next) => {
    try {
      const { username, password } = req.headers;
      if (!username || !password) {
        return res.status(401).json(authError);
      }

      const user = await Users.findBy({ username }).first();
      if (!user) {
        return res.status(401).json(authError);
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json(authError);
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}

// GET - /api/users
router.get('/', restricted(), (req, res, next) => {
  try {
    const users = await Users.find()
    res.json(users);

  } catch (err) {
    next(err);
  }
})

module.exports = router;