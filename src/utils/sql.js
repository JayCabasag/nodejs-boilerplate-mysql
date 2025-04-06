/**
 * Generic SQL query with pagination and filtering.
 *
 * @param {string} tableName - The name of the table to query.
 * @param {Object} filter - Key-value pairs for WHERE clause.
 * @param {Object} options - Pagination and sort options.
 * @param {string} [options.sortBy='id:asc'] - Format: field:asc|desc.
 * @param {number} [options.limit=10] - Items per page.
 * @param {number} [options.page=1] - Page number.
 * @param {Object} db - MySQL connection (using mysql2/promise).
 * @returns {Promise<Array>} - Array of results.
 */
const paginate = async (tableName, filter, options, db) => {
  const { sortBy = 'id:asc', limit = 10, page = 1 } = options;
  const [sortField, sortOrder] = sortBy.split(':');
  const offset = (page - 1) * limit;

  let whereClauses = [];
  let values = [];

  for (const key in filter) {
    whereClauses.push(`\`${key}\` = ?`);
    values.push(filter[key]);
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const sql = `
      SELECT * FROM \`${tableName}\`
      ${whereSQL}
      ORDER BY \`${sortField}\` ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?;
    `;

  values.push(limit, offset);

  const [rows] = await db.execute(sql, values);
  return rows;
};

module.exports = paginate;
