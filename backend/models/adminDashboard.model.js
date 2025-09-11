import pool from "../config/postgredb.js";

// Get high-level stats
export const getStats = async () => {
  const query = `
    SELECT 
      COUNT(*) FILTER (WHERE call_timestamp >= NOW() - INTERVAL '7 days') AS total_calls,
      COUNT(*) FILTER (WHERE call_outcome = 'positive' AND call_timestamp >= NOW() - INTERVAL '7 days') AS positive_responses,
      COUNT(*) FILTER (WHERE next_follow_up_date >= NOW()) AS followups_pending,
      (SELECT COUNT(*) FROM hr_contacts WHERE created_at >= NOW() - INTERVAL '7 days') AS new_contacts
    FROM call_logs;
  `;
  const result = await pool.query(query);
  return result.rows[0];
};

// Weekly Call Activity
export const getWeeklyCallActivity = async () => {
  const query = `
    SELECT 
      TO_CHAR(call_timestamp, 'Dy') AS day,
      COUNT(*) FILTER (WHERE call_outcome = 'positive') AS positive,
      COUNT(*) FILTER (WHERE call_outcome = 'follow-up') AS follow_up,
      COUNT(*) FILTER (WHERE call_outcome = 'not reachable') AS not_reachable
    FROM call_logs
    WHERE call_timestamp >= NOW() - INTERVAL '7 days'
    GROUP BY day, DATE_TRUNC('day', call_timestamp)
    ORDER BY DATE_TRUNC('day', call_timestamp);
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Recent Activity
export const getRecentActivity = async () => {
  const query = `
    SELECT cl.log_id AS id, u.full_name AS user, 
           LEFT(u.full_name, 2) AS initials,
           'logged a call with' AS action,
           hc.full_name AS subject,
           c.company_name AS company,
           cl.call_outcome AS outcome,
           cl.call_timestamp
    FROM call_logs cl
    JOIN users u ON cl.caller_id = u.user_id
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    ORDER BY cl.call_timestamp DESC
    LIMIT 10;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Top Callers
export const getTopCallers = async () => {
  const query = `
    SELECT u.user_id AS id, u.full_name AS name, 
           LEFT(u.full_name, 2) AS initials,
           COUNT(cl.*) AS calls
    FROM call_logs cl
    JOIN users u ON cl.caller_id = u.user_id
    WHERE cl.call_timestamp >= NOW() - INTERVAL '7 days'
    GROUP BY u.user_id, u.full_name
    ORDER BY calls DESC
    LIMIT 5;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Action Items
export const getActionItems = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE is_approved = false) AS new_users,
      (SELECT COUNT(*) FROM hr_contacts WHERE is_approved = false) AS pending_contacts,
      (SELECT COUNT(*) FROM call_logs WHERE next_follow_up_date < NOW()) AS overdue_followups;
  `;
  const result = await pool.query(query);
  return result.rows[0];
};
