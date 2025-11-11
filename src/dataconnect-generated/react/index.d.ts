import { RegisterUserData, RegisterUserVariables, GetUserByUidData, GetUserByUidVariables, UpdateHighScoreData, UpdateHighScoreVariables, ListTopScorersData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useRegisterUser(options?: useDataConnectMutationOptions<RegisterUserData, FirebaseError, RegisterUserVariables>): UseDataConnectMutationResult<RegisterUserData, RegisterUserVariables>;
export function useRegisterUser(dc: DataConnect, options?: useDataConnectMutationOptions<RegisterUserData, FirebaseError, RegisterUserVariables>): UseDataConnectMutationResult<RegisterUserData, RegisterUserVariables>;

export function useGetUserByUid(vars: GetUserByUidVariables, options?: useDataConnectQueryOptions<GetUserByUidData>): UseDataConnectQueryResult<GetUserByUidData, GetUserByUidVariables>;
export function useGetUserByUid(dc: DataConnect, vars: GetUserByUidVariables, options?: useDataConnectQueryOptions<GetUserByUidData>): UseDataConnectQueryResult<GetUserByUidData, GetUserByUidVariables>;

export function useUpdateHighScore(options?: useDataConnectMutationOptions<UpdateHighScoreData, FirebaseError, UpdateHighScoreVariables>): UseDataConnectMutationResult<UpdateHighScoreData, UpdateHighScoreVariables>;
export function useUpdateHighScore(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateHighScoreData, FirebaseError, UpdateHighScoreVariables>): UseDataConnectMutationResult<UpdateHighScoreData, UpdateHighScoreVariables>;

export function useListTopScorers(options?: useDataConnectQueryOptions<ListTopScorersData>): UseDataConnectQueryResult<ListTopScorersData, undefined>;
export function useListTopScorers(dc: DataConnect, options?: useDataConnectQueryOptions<ListTopScorersData>): UseDataConnectQueryResult<ListTopScorersData, undefined>;
