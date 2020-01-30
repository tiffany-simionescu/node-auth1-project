const bcrypt = require('bcryptjs');
const router = require('express').Router();

const Users = require('../users/users-model');

// POST - /api/auth/register
router.post('/register', (req, res) => {
  let user = req.body;

  Users.add(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

// POST - /api/auth/login
router.post('/login', async (req, res) => {
  let { username, password } = req.body;
  const user = await Users.findBy({ username }).first();
  const passwordValid = await bcrypt.compare(password, user.password);

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && passwordValid) {
        res.status(200).json({
          message: `Welcome ${user.username}!`
        })
      } else {
        res.status(401).json({
          message: "Invalid Credentials"
        })
      }
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

module.exports = router;