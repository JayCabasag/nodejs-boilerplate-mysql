const db = require('../config/db');
const paginate = require('../utils/sql');

exports.create = async ({ name, email, password, role = 'user' }) => {
  const [result] = await db.execute(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, [
    name,
    email,
    password,
    role,
  ]);
  return result.insertId;
};

exports.getByEmail = async (email) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
};

exports.getById = async (id) => {
  const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
};

exports.isEmailTaken = async (email, excludeUserId = null) => {
  const [rows] = await db.execute(
    excludeUserId ? `SELECT 1 FROM users WHERE email = ? AND id != ?` : `SELECT 1 FROM users WHERE email = ?`,
    excludeUserId ? [email, excludeUserId] : [email],
  );
  return rows.length > 0;
};

exports.updateById = async (id, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) return null;

  const setClause = fields.map((field) => `${field} = ?`).join(', ');

  await db.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);

  const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
};

exports.paginate = async (filter = {}, options = {}, db) => {
  const users = await paginate('users', filter, options, db);
  const { limit = 10, page = 1 } = options;

  const countQuery = `SELECT COUNT(*) as total FROM users WHERE ${Object.keys(filter)
    .map((key) => `\`${key}\` = ?`)
    .join(' AND ')}`;
  const [countResult] = await db.execute(countQuery, Object.values(filter));

  const totalResults = countResult[0].total;
  const totalPages = Math.ceil(totalResults / limit);

  return {
    results: users,
    page,
    limit,
    totalPages,
    totalResults,
  };
};
