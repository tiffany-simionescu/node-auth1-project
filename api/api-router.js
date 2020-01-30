const router = require('express').Router();

const authRouter = require('../auth/auth-router');
const usersRouter = require('../users/users-router');

router.use('/auth', authRouter);
router.use('/users', usersRouter);

// GET - /api
router.get('/', (req, res) => {
  res.json({ api: "Hello from the API!" });
})

module.exports = router;