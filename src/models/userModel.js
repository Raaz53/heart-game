// src/models/userModel.js  
export const UserModel = {
  uid: "",
  display_name: "",
  email: "",
  high_score: 0,
  created_at: null,
};

/**
 * Helper to create a new user record for insertion into the DB.
 * @param {Object} params
 * @param {string} params.uid - custom unique ID
 * @param {string} params.display_name - user's display name
 * @param {string} params.email - user's email
 * @returns {Object} user data ready for insertion
 */
export function createUserModel({ uid, display_name, email }) {
  return {
    uid,
    display_name,
    email,
    high_score: 0,
    created_at: new Date().toISOString(),
  };
}
