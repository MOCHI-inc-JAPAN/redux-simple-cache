// @flow

export type MetaProperty = {
  '@@simple-cache:skip': boolean,
  '@@simple-cache:storage': 'default' | string,
  '@@simple-cache:': string
}

export type StorageConfig = {
  [storageId: string]: string
} | string

export type CacheSetting<RootState, Record, StateKey extends string> = {
  [stateKey in StateKey]: {
    extract: string | ((state: RootState) => any),
    storageId?: string,
    serialize?: (record: Record) => any,
    deserialize?: (record: JSON) => any
  } | true
}

export type SimpleCacheMiddlewareConfig<RootState, Record, StateKey extends string> = {
  storage: StorageConfig,
  cache: CacheSetting<RootState, Record, StateKey>,
}

export type Storage = {
  getItem: (key:string, callback?:(string:string) => any) => any
  setItem: (key: string, value: string, callback?: () => any) => any
  removeItem: (key: string, callback?: () => any) => any
}

// export type Persistor = {
//   purge: () => Promise<any>,
//   flush: () => Promise<any>,
//   +dispatch: PersistorAction => PersistorAction,
//   +getState: () => PersistorState,
//   +subscribe: PersistorSubscribeCallback => () => any,
// }
