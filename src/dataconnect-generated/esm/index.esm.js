import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'heart-game',
  location: 'us-east4'
};

export const registerUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RegisterUser', inputVars);
}
registerUserRef.operationName = 'RegisterUser';

export function registerUser(dcOrVars, vars) {
  return executeMutation(registerUserRef(dcOrVars, vars));
}

export const getUserByUidRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByUid', inputVars);
}
getUserByUidRef.operationName = 'GetUserByUid';

export function getUserByUid(dcOrVars, vars) {
  return executeQuery(getUserByUidRef(dcOrVars, vars));
}

export const updateHighScoreRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateHighScore', inputVars);
}
updateHighScoreRef.operationName = 'UpdateHighScore';

export function updateHighScore(dcOrVars, vars) {
  return executeMutation(updateHighScoreRef(dcOrVars, vars));
}

export const listTopScorersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTopScorers');
}
listTopScorersRef.operationName = 'ListTopScorers';

export function listTopScorers(dc) {
  return executeQuery(listTopScorersRef(dc));
}

