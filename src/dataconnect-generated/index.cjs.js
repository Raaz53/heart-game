const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'heart-game',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const registerUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterUser', inputVars);
}
registerUserRef.operationName = 'RegisterUser';
exports.registerUserRef = registerUserRef;

exports.registerUser = function registerUser(dcOrVars, vars) {
  return executeMutation(registerUserRef(dcOrVars, vars));
};

const getUserByUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByUid', inputVars);
}
getUserByUidRef.operationName = 'GetUserByUid';
exports.getUserByUidRef = getUserByUidRef;

exports.getUserByUid = function getUserByUid(dcOrVars, vars) {
  return executeQuery(getUserByUidRef(dcOrVars, vars));
};

const updateHighScoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateHighScore', inputVars);
}
updateHighScoreRef.operationName = 'UpdateHighScore';
exports.updateHighScoreRef = updateHighScoreRef;

exports.updateHighScore = function updateHighScore(dcOrVars, vars) {
  return executeMutation(updateHighScoreRef(dcOrVars, vars));
};

const listTopScorersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTopScorers');
}
listTopScorersRef.operationName = 'ListTopScorers';
exports.listTopScorersRef = listTopScorersRef;

exports.listTopScorers = function listTopScorers(dc) {
  return executeQuery(listTopScorersRef(dc));
};
