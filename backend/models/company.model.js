import pool from "../config/postgredb.js";

const Company = {
  // Create company
  async createCompany({ company_name, website, industry_sector, address }) {
    const query = `
      INSERT INTO companies (company_name, website, industry_sector, address)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [company_name, website, industry_sector, address];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Get all companies
  async getAllCompanies() {
    const result = await pool.query(`SELECT * FROM companies ORDER BY created_at DESC;`);
    return result.rows;
  },

  // Get single company
  async getCompanyById(id) {
    const result = await pool.query(`SELECT * FROM companies WHERE company_id=$1;`, [id]);
    return result.rows[0];
  },

  // Update company
  async updateCompany(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key}=$${idx}`);
      values.push(value);
      idx++;
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE companies
      SET ${fields.join(", ")}, created_at=NOW()
      WHERE company_id=$${idx}
      RETURNING *;
    `;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete company
  async deleteCompany(id) {
    const result = await pool.query(
      `DELETE FROM companies WHERE company_id=$1 RETURNING *;`,
      [id]
    );
    return result.rows[0];
  }
};

export default Company;
