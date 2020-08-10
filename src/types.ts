import { Store } from "redux"

export type MetaProperty = {
  '@@simple-cache:skip': boolean,
}

export type SimpleCacheBuiltinType = '@@SIMPLE_CACHE:PURGE' | '@@SIMPLE_CACHE:ENABLE' | '@@SIMPLE_CACHE:DISABLE'


export type StorageConfig = {
  [storageId: string]: Storage
}

export type CacheSetting<RootState, Record = any, StorageKey extends string =string> = {
  [storageKey in StorageKey]: {
    extract: string | ((state: RootState) => any)
    restore: ((deselializedRecord: any,store: Store) => void)
    storageId: string,
    serialize?: (record: Record) => any,
    deserialize?: (record: string) => any
  }
}

export type SimpleCacheMiddlewareConfig<RootState, Record = any, StateKey extends string = string> = {
  storage: StorageConfig,
  cache: CacheSetting<RootState, Record, StateKey>,
}

export type Storage = {
  getItem: (key:string, callback?:(string:string) => any) => any
  setItem: (key: string, value: string, callback?: (...args: any[]) => any) => any
  removeItem: (key: string, callback?: (...args: any[]) => any) => any
}
