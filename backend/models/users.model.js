import pool from "../config/postgredb.js";

const Users = {
  // Get users with optional filters
  async getUsers({ status, role }) {
    let query = `SELECT user_id, full_name, email, role, is_approved, is_verified, created_at, last_active_at
                 FROM users WHERE 1=1`;
    const values = [];
    let idx = 1;

    if (status === "approved") {
      query += ` AND is_approved = true`;
    } else if (status === "pending") {
      query += ` AND is_approved = false`;
    }

    if (role) {
      query += ` AND role = $${idx}`;
      values.push(role);
      idx++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  },

  // Approve user
  async approveUser(user_id) {
    const query = `
      UPDATE users 
      SET is_approved = true, updated_at = NOW() 
      WHERE user_id = $1 RETURNING user_id, full_name, email, is_approved
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  },

   // Revoke user
  async revokeUser(user_id) {
    const query = `
      UPDATE users 
      SET is_approved = false, updated_at = NOW() 
      WHERE user_id = $1 RETURNING user_id, full_name, email, is_approved
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  },

  // Delete (reject) user
  async deleteUser(user_id) {
    const query = `DELETE FROM users WHERE user_id = $1 RETURNING user_id`;
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  }
};

export default Users;
