import pool from "../config/postgredb.js";

const PreapprovedEmail = {
  async getAll() {
    const query = `SELECT * FROM preapproved_emails ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
  },

  async bulkInsert(emails) {
    const query = `
      INSERT INTO preapproved_emails (email)
      SELECT UNNEST($1::text[])
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [emails]);
    return result.rows;
  },

  async bulkDelete(emails) {
    const query = `DELETE FROM preapproved_emails WHERE email = ANY($1::text[]);`;
    await pool.query(query, [emails]);
  }
};

export default PreapprovedEmail;
