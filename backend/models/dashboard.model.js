import pool from "../config/postgredb.js";

// Get caller stats
export const getCallerStats = async (callerId) => {
  const query = `
    SELECT 
      COUNT(*) FILTER (WHERE hc.assigned_to_user_id = $1) AS total_contacts,
      COUNT(*) FILTER (WHERE hc.added_by_user_id = $1 AND hc.is_approved = true) AS approved_contacts,
      COUNT(cl.*) FILTER (WHERE cl.caller_id = $1) AS total_call_logs,
      COUNT(cl.*) FILTER (WHERE cl.caller_id = $1 AND cl.call_outcome = 'connected') AS connected_calls,
      COUNT(cl.*) FILTER (WHERE cl.caller_id = $1 AND cl.next_follow_up_date IS NOT NULL) AS follow_up_calls
    FROM hr_contacts hc
    LEFT JOIN call_logs cl ON hc.contact_id = cl.caller_id;
  `;
  const result = await pool.query(query, [callerId]);
  return result.rows[0];
};

// Get recent call logs
export const getRecentCallLogs = async (callerId, limit = 5) => {
  const query = `
    SELECT cl.log_id, hc.full_name AS contact_name, c.company_name, cl.call_outcome, cl.call_timestamp
    FROM call_logs cl
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE cl.caller_id = $1
    ORDER BY cl.call_timestamp DESC
    LIMIT $2;
  `;
  const result = await pool.query(query, [callerId, limit]);
  return result.rows;
};

// Get upcoming follow-ups
export const getUpcomingFollowUps = async (callerId, limit = 5) => {
  const query = `
    SELECT cl.log_id, hc.full_name AS contact_name, c.company_name, cl.next_follow_up_date, cl.remarks
    FROM call_logs cl
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE cl.caller_id = $1
      AND cl.next_follow_up_date >= CURRENT_DATE
    ORDER BY cl.next_follow_up_date ASC
    LIMIT $2;
  `;
  const result = await pool.query(query, [callerId, limit]);
  return result.rows;
};

// Get assigned HR contacts
export const getAssignedHRContacts = async (callerId, limit = 5) => {
  const query = `
    SELECT hc.contact_id, hc.full_name, c.company_name, hc.designation, hc.status
    FROM hr_contacts hc
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE hc.assigned_to_user_id = $1
    LIMIT $2;
  `;
  const result = await pool.query(query, [callerId, limit]);
  return result.rows;
};
