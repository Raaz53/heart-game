# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUserByUid*](#getuserbyuid)
  - [*ListTopScorers*](#listtopscorers)
- [**Mutations**](#mutations)
  - [*RegisterUser*](#registeruser)
  - [*UpdateHighScore*](#updatehighscore)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUserByUid
You can execute the `GetUserByUid` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserByUid(vars: GetUserByUidVariables): QueryPromise<GetUserByUidData, GetUserByUidVariables>;

interface GetUserByUidRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByUidVariables): QueryRef<GetUserByUidData, GetUserByUidVariables>;
}
export const getUserByUidRef: GetUserByUidRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByUid(dc: DataConnect, vars: GetUserByUidVariables): QueryPromise<GetUserByUidData, GetUserByUidVariables>;

interface GetUserByUidRef {
  ...
  (dc: DataConnect, vars: GetUserByUidVariables): QueryRef<GetUserByUidData, GetUserByUidVariables>;
}
export const getUserByUidRef: GetUserByUidRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByUidRef:
```typescript
const name = getUserByUidRef.operationName;
console.log(name);
```

### Variables
The `GetUserByUid` query requires an argument of type `GetUserByUidVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByUidVariables {
  uid: string;
}
```
### Return Type
Recall that executing the `GetUserByUid` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByUidData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByUidData {
  users: ({
    id: UUIDString;
    displayName: string;
    email: string;
    highScore?: number | null;
    uid: string;
  } & User_Key)[];
}
```
### Using `GetUserByUid`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByUid, GetUserByUidVariables } from '@dataconnect/generated';

// The `GetUserByUid` query requires an argument of type `GetUserByUidVariables`:
const getUserByUidVars: GetUserByUidVariables = {
  uid: ..., 
};

// Call the `getUserByUid()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByUid(getUserByUidVars);
// Variables can be defined inline as well.
const { data } = await getUserByUid({ uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByUid(dataConnect, getUserByUidVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByUid(getUserByUidVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetUserByUid`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByUidRef, GetUserByUidVariables } from '@dataconnect/generated';

// The `GetUserByUid` query requires an argument of type `GetUserByUidVariables`:
const getUserByUidVars: GetUserByUidVariables = {
  uid: ..., 
};

// Call the `getUserByUidRef()` function to get a reference to the query.
const ref = getUserByUidRef(getUserByUidVars);
// Variables can be defined inline as well.
const ref = getUserByUidRef({ uid: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByUidRef(dataConnect, getUserByUidVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## ListTopScorers
You can execute the `ListTopScorers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTopScorers(): QueryPromise<ListTopScorersData, undefined>;

interface ListTopScorersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTopScorersData, undefined>;
}
export const listTopScorersRef: ListTopScorersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTopScorers(dc: DataConnect): QueryPromise<ListTopScorersData, undefined>;

interface ListTopScorersRef {
  ...
  (dc: DataConnect): QueryRef<ListTopScorersData, undefined>;
}
export const listTopScorersRef: ListTopScorersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTopScorersRef:
```typescript
const name = listTopScorersRef.operationName;
console.log(name);
```

### Variables
The `ListTopScorers` query has no variables.
### Return Type
Recall that executing the `ListTopScorers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTopScorersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTopScorersData {
  topScorers: ({
    displayName: string;
    highScore: number;
  })[];
}
```
### Using `ListTopScorers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTopScorers } from '@dataconnect/generated';


// Call the `listTopScorers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTopScorers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTopScorers(dataConnect);

console.log(data.topScorers);

// Or, you can use the `Promise` API.
listTopScorers().then((response) => {
  const data = response.data;
  console.log(data.topScorers);
});
```

### Using `ListTopScorers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTopScorersRef } from '@dataconnect/generated';


// Call the `listTopScorersRef()` function to get a reference to the query.
const ref = listTopScorersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTopScorersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.topScorers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.topScorers);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## RegisterUser
You can execute the `RegisterUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
registerUser(vars: RegisterUserVariables): MutationPromise<RegisterUserData, RegisterUserVariables>;

interface RegisterUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterUserVariables): MutationRef<RegisterUserData, RegisterUserVariables>;
}
export const registerUserRef: RegisterUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
registerUser(dc: DataConnect, vars: RegisterUserVariables): MutationPromise<RegisterUserData, RegisterUserVariables>;

interface RegisterUserRef {
  ...
  (dc: DataConnect, vars: RegisterUserVariables): MutationRef<RegisterUserData, RegisterUserVariables>;
}
export const registerUserRef: RegisterUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the registerUserRef:
```typescript
const name = registerUserRef.operationName;
console.log(name);
```

### Variables
The `RegisterUser` mutation requires an argument of type `RegisterUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RegisterUserVariables {
  displayName: string;
  email: string;
  password: string;
  uid: string;
}
```
### Return Type
Recall that executing the `RegisterUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RegisterUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RegisterUserData {
  user_insert: User_Key;
}
```
### Using `RegisterUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, registerUser, RegisterUserVariables } from '@dataconnect/generated';

// The `RegisterUser` mutation requires an argument of type `RegisterUserVariables`:
const registerUserVars: RegisterUserVariables = {
  displayName: ..., 
  email: ..., 
  password: ..., 
  uid: ..., 
};

// Call the `registerUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await registerUser(registerUserVars);
// Variables can be defined inline as well.
const { data } = await registerUser({ displayName: ..., email: ..., password: ..., uid: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await registerUser(dataConnect, registerUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
registerUser(registerUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `RegisterUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, registerUserRef, RegisterUserVariables } from '@dataconnect/generated';

// The `RegisterUser` mutation requires an argument of type `RegisterUserVariables`:
const registerUserVars: RegisterUserVariables = {
  displayName: ..., 
  email: ..., 
  password: ..., 
  uid: ..., 
};

// Call the `registerUserRef()` function to get a reference to the mutation.
const ref = registerUserRef(registerUserVars);
// Variables can be defined inline as well.
const ref = registerUserRef({ displayName: ..., email: ..., password: ..., uid: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = registerUserRef(dataConnect, registerUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateHighScore
You can execute the `UpdateHighScore` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateHighScore(vars: UpdateHighScoreVariables): MutationPromise<UpdateHighScoreData, UpdateHighScoreVariables>;

interface UpdateHighScoreRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHighScoreVariables): MutationRef<UpdateHighScoreData, UpdateHighScoreVariables>;
}
export const updateHighScoreRef: UpdateHighScoreRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateHighScore(dc: DataConnect, vars: UpdateHighScoreVariables): MutationPromise<UpdateHighScoreData, UpdateHighScoreVariables>;

interface UpdateHighScoreRef {
  ...
  (dc: DataConnect, vars: UpdateHighScoreVariables): MutationRef<UpdateHighScoreData, UpdateHighScoreVariables>;
}
export const updateHighScoreRef: UpdateHighScoreRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateHighScoreRef:
```typescript
const name = updateHighScoreRef.operationName;
console.log(name);
```

### Variables
The `UpdateHighScore` mutation requires an argument of type `UpdateHighScoreVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateHighScoreVariables {
  id: UUIDString;
  highScore: number;
}
```
### Return Type
Recall that executing the `UpdateHighScore` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateHighScoreData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateHighScoreData {
  user_update?: User_Key | null;
}
```
### Using `UpdateHighScore`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateHighScore, UpdateHighScoreVariables } from '@dataconnect/generated';

// The `UpdateHighScore` mutation requires an argument of type `UpdateHighScoreVariables`:
const updateHighScoreVars: UpdateHighScoreVariables = {
  id: ..., 
  highScore: ..., 
};

// Call the `updateHighScore()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateHighScore(updateHighScoreVars);
// Variables can be defined inline as well.
const { data } = await updateHighScore({ id: ..., highScore: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateHighScore(dataConnect, updateHighScoreVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateHighScore(updateHighScoreVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateHighScore`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateHighScoreRef, UpdateHighScoreVariables } from '@dataconnect/generated';

// The `UpdateHighScore` mutation requires an argument of type `UpdateHighScoreVariables`:
const updateHighScoreVars: UpdateHighScoreVariables = {
  id: ..., 
  highScore: ..., 
};

// Call the `updateHighScoreRef()` function to get a reference to the mutation.
const ref = updateHighScoreRef(updateHighScoreVars);
// Variables can be defined inline as well.
const ref = updateHighScoreRef({ id: ..., highScore: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateHighScoreRef(dataConnect, updateHighScoreVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

