import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface GetUserByUidData {
  users: ({
    id: UUIDString;
    displayName: string;
    email: string;
    highScore?: number | null;
    uid: string;
  } & User_Key)[];
}

export interface GetUserByUidVariables {
  uid: string;
}

export interface ListTopScorersData {
  topScorers: ({
    displayName: string;
    highScore: number;
  })[];
}

export interface RegisterUserData {
  user_insert: User_Key;
}

export interface RegisterUserVariables {
  displayName: string;
  email: string;
  password: string;
  uid: string;
}

export interface TopScorer_Key {
  id: UUIDString;
  __typename?: 'TopScorer_Key';
}

export interface UpdateHighScoreData {
  user_update?: User_Key | null;
}

export interface UpdateHighScoreVariables {
  id: UUIDString;
  highScore: number;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface RegisterUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterUserVariables): MutationRef<RegisterUserData, RegisterUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterUserVariables): MutationRef<RegisterUserData, RegisterUserVariables>;
  operationName: string;
}
export const registerUserRef: RegisterUserRef;

export function registerUser(vars: RegisterUserVariables): MutationPromise<RegisterUserData, RegisterUserVariables>;
export function registerUser(dc: DataConnect, vars: RegisterUserVariables): MutationPromise<RegisterUserData, RegisterUserVariables>;

interface GetUserByUidRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByUidVariables): QueryRef<GetUserByUidData, GetUserByUidVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByUidVariables): QueryRef<GetUserByUidData, GetUserByUidVariables>;
  operationName: string;
}
export const getUserByUidRef: GetUserByUidRef;

export function getUserByUid(vars: GetUserByUidVariables): QueryPromise<GetUserByUidData, GetUserByUidVariables>;
export function getUserByUid(dc: DataConnect, vars: GetUserByUidVariables): QueryPromise<GetUserByUidData, GetUserByUidVariables>;

interface UpdateHighScoreRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHighScoreVariables): MutationRef<UpdateHighScoreData, UpdateHighScoreVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateHighScoreVariables): MutationRef<UpdateHighScoreData, UpdateHighScoreVariables>;
  operationName: string;
}
export const updateHighScoreRef: UpdateHighScoreRef;

export function updateHighScore(vars: UpdateHighScoreVariables): MutationPromise<UpdateHighScoreData, UpdateHighScoreVariables>;
export function updateHighScore(dc: DataConnect, vars: UpdateHighScoreVariables): MutationPromise<UpdateHighScoreData, UpdateHighScoreVariables>;

interface ListTopScorersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTopScorersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTopScorersData, undefined>;
  operationName: string;
}
export const listTopScorersRef: ListTopScorersRef;

export function listTopScorers(): QueryPromise<ListTopScorersData, undefined>;
export function listTopScorers(dc: DataConnect): QueryPromise<ListTopScorersData, undefined>;

