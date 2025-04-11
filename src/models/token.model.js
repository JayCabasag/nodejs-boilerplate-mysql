const db = require('../config/db');

exports.create = async ({ token, userId, type, expires, blacklisted = false }) => {
  const [result] = await db.execute(
    `INSERT INTO tokens (token, user_id, type, expires, blacklisted) 
     VALUES (?, ?, ?, ?, ?)`,
    [token, userId, type, expires, blacklisted],
  );
  return result.insertId;
};

exports.getByToken = async (token, type) => {
  const [rows] = await db.execute(`SELECT * FROM tokens WHERE token = ? AND type = ? AND blacklisted = false`, [
    token,
    type,
  ]);
  return rows[0];
};

exports.deleteByToken = async (token) => {
  const [result] = await db.execute(`DELETE FROM tokens WHERE token = ?`, [token]);
  return result.affectedRows > 0;
};

exports.blacklistByToken = async (token) => {
  const [result] = await db.execute(`UPDATE tokens SET blacklisted = true WHERE token = ?`, [token]);
  return result.affectedRows > 0;
};

exports.updateById = async (id, updateData) => {
  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) return null;

  const setClause = fields.map((field) => `${field} = ?`).join(', ');

  await db.execute(`UPDATE tokens SET ${setClause} WHERE id = ?`, [...values, id]);

  const [rows] = await db.execute(`SELECT * FROM tokens WHERE id = ?`, [id]);
  return rows[0];
};
