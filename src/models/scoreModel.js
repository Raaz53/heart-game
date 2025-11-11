// src/models/scoreModel.js
export const ScoreModel = {
  id: "",
  user_uid: "",
  display_name: "",
  top_score: 0,
  created_at: null,
};

/**
 * Helper to create a leaderboard entry for insertion or upsert.
 * @param {Object} params
 * @param {string} params.user_uid - the user's uid
 * @param {string} params.display_name - user's display name
 * @param {number} params.top_score - user's highest score
 * @returns {Object} leaderboard entry ready for insertion
 */
export function createScoreModel({ user_uid, display_name, top_score }) {
  return {
    user_uid,
    display_name,
    top_score,
    created_at: new Date().toISOString(),
  };
}
