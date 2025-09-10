// models/callersStats.model.js
import pool from "../config/postgredb.js";

const CallersStats = {
  async getAllStats() {
    const query = `
      SELECT
        u.user_id AS caller_id,
        u.full_name,
        u.email,

        COALESCE(ac.total_contacts_assigned, 0) AS total_contacts_assigned,
        COALESCE(ad.total_contacts_added, 0) AS total_contacts_added,
        COALESCE(ad.approved_contacts_added, 0) AS approved_contacts_added,

        COALESCE(cl.total_call_logs, 0) AS total_call_logs,
        COALESCE(cl.connected_calls, 0) AS connected_calls,
        COALESCE(cl.not_reachable_calls, 0) AS not_reachable_calls,
        COALESCE(cl.follow_up_calls, 0) AS follow_up_calls,
        COALESCE(cl.positive_calls, 0) AS positive_calls,
        COALESCE(cl.negative_calls, 0) AS negative_calls

      FROM users u

      LEFT JOIN (
        SELECT assigned_to_user_id, COUNT(*) AS total_contacts_assigned
        FROM hr_contacts
        GROUP BY assigned_to_user_id
      ) ac ON ac.assigned_to_user_id = u.user_id

      LEFT JOIN (
        SELECT added_by_user_id,
               COUNT(*) AS total_contacts_added,
               COUNT(*) FILTER (WHERE is_approved = TRUE) AS approved_contacts_added
        FROM hr_contacts
        GROUP BY added_by_user_id
      ) ad ON ad.added_by_user_id = u.user_id

      LEFT JOIN (
        SELECT caller_id,
               COUNT(*) AS total_call_logs,
               COUNT(*) FILTER (WHERE call_outcome = 'connected') AS connected_calls,
               COUNT(*) FILTER (WHERE call_outcome = 'not_reachable') AS not_reachable_calls,
               COUNT(*) FILTER (WHERE call_outcome = 'follow_up') AS follow_up_calls,
               COUNT(*) FILTER (WHERE call_outcome = 'positive') AS positive_calls,
               COUNT(*) FILTER (WHERE call_outcome = 'negative') AS negative_calls
        FROM call_logs
        GROUP BY caller_id
      ) cl ON cl.caller_id = u.user_id

      WHERE u.role = 'caller'
      ORDER BY u.full_name;
    `;

    const result = await pool.query(query);

    // Convert bigint strings to numbers
    return result.rows.map(r => ({
      caller_id: r.caller_id,
      full_name: r.full_name,
      email: r.email,
      total_contacts_assigned: Number(r.total_contacts_assigned) || 0,
      total_contacts_added: Number(r.total_contacts_added) || 0,
      approved_contacts_added: Number(r.approved_contacts_added) || 0,
      total_call_logs: Number(r.total_call_logs) || 0,
      connected_calls: Number(r.connected_calls) || 0,
      not_reachable_calls: Number(r.not_reachable_calls) || 0,
      follow_up_calls: Number(r.follow_up_calls) || 0,
      positive_calls: Number(r.positive_calls) || 0,
      negative_calls: Number(r.negative_calls) || 0,
    }));
  }
};

export default CallersStats;
