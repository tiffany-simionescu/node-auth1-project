const router = require('express').Router();
const bcrypt = require('bcryptjs');
const restricted = require('./restricted-middleware');

const Users = require('./api-model');

// GET - /api
router.get('/', (req, res) => {
  res.json({ api: "Hello from the API!" });
})

// POST - /api/register
router.post('/register', (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(err => {
      next(err);
    })
})

// POST - /api/login
// router.post('/login', async (req, res, next) => {
//   let { username, password } = req.body;
//   const user = await Users.findBy({ username }).first();
//   const passwordValid = await bcrypt.compare(password, user.password);

//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (user && passwordValid) {
//         res.status(200).json({
//           message: `Welcome ${user.username}!`
//         })
//       } else {
//         res.status(401).json({
//           message: "Invalid Credentials"
//         })
//       }
//     })
//     .catch(err => {
//       next(err);
//     })
// })
router.post('/login', (req, res, next) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;

        res.status(200).json({
          message: `Welcome ${user.username}!`,
        })
      } else {
        res.status(401).json({
          message: "Invalid Credentials"
        })
      }
    })
    .catch(err => {
      next(err);
    })
})

// GET - /api/users
router.get('/users', restricted(), (req, res, next) => {
  Users.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      next(err);
    })
})

// GET - /api/logout
router.get('/logout', restricted(), (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.json({
        message: "You are logged out."
      })
    }
  })
})

module.exports = router;