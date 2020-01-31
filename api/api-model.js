const bcrypt = require('bcryptjs');
const db = require('../database/db-config');

module.exports = {
  add, 
  find, 
  findBy,
  findById,
};

function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users")
    .select("id", "username", "password")
    .where(filter);
}

async function add(user) {
  user.password = await bcrypt.hash(user.password, 14);

  const [id] = await db("users").insert(user);

  return findById(id);
}

function findById(id) {
  return db("users")
    .select("id", "username")
    .where({ id })
    .first()
}