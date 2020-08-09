import type { AnyAction, Dispatch, MiddlewareAPI, Store } from 'redux'
import { CacheSetting,MetaProperty } from "./types";

const readStorage = () => {

}

const syncStore = (store: Store,config:CacheSetting, action) => {

}

export default function createMiddleWare<S>(config: CacheSetting) {
  return (store: MiddlewareAPI<Dispatch<AnyAction>,S>) => (next: Dispatch<A>) => (action: AnyAction & {meta?: MetaProperty}) => {
    try {
      readStorage
      next(action)
      syncStore
    } catch (err) {
      console.error('Caught an exception!', err)
      throw err
    }
  }
}

function warnIfRemoveError(err) {
  if (err && process.env.NODE_ENV !== 'production') {
    console.error(
      'redux-simple-cache/purgeStoredState: Error purging data stored state',
      err
    )
  }
}

export function purgeStoredState(config: PersistConfig) {
  const storage = config.storage
  const storageKey = `${config.key}`
  return storage.removeItem(storageKey, warnIfRemoveError)
}
