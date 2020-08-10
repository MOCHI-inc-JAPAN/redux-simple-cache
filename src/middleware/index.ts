import type { AnyAction, Dispatch, Store } from 'redux'
import { useDispatch } from 'react-redux'
import { SimpleCacheMiddlewareConfig,MetaProperty,SimpleCacheBuiltinType } from '../types';
import { DISABLE, ENABLE, PURGE } from '../constants';

type SimpleCacheAction = {type: SimpleCacheBuiltinType; [key: string]: any} | AnyAction & {meta?: MetaProperty}

function defaultDeserialize(serial: string) {
  return JSON.parse(serial)
}

function defaultSerialize(data: object) {
  return JSON.stringify(data)
}

const syncStore = <S>(store: Store<S, SimpleCacheAction>,config:SimpleCacheMiddlewareConfig<S>, action: SimpleCacheAction) => {
  const state = store.getState()
  const resultPromises = Object.keys(config.cache).map(storageKey => {
    const cacheSetting = config.cache[storageKey]
    let storeData;
    if(typeof cacheSetting.extract === 'string') {
      const keyExtractors = cacheSetting.extract.split(/\/|\./)
      storeData = keyExtractors.reduce((result: any,key)=> {
        return result[key]
      },state)
    }else {
      storeData = cacheSetting.extract(state)
    }
    const serialize = cacheSetting.serialize || defaultSerialize
    const storage = config.storage[cacheSetting.storageId]
    return storage.setItem(storageKey,serialize(storeData))
  })
  return Promise.all(resultPromises)
}

const readStorage = <S>(store: Store<S, SimpleCacheAction>,config:SimpleCacheMiddlewareConfig<S>) => {
  const resultPromises = Object.keys(config.cache).map(storageKey => {
    const cacheSetting = config.cache[storageKey]
    const storage = config.storage[cacheSetting.storageId]
    return storage.getItem(storageKey).then((serialized: string | undefined) => {
      if (!serialized) return undefined
      else {
        try {
          const deserialize = cacheSetting.deserialize || defaultDeserialize
          const record = deserialize(serialized)
          return cacheSetting.restore(record, store)
        } catch (err) {
          throw err
        }
      }
    })
  })
  return Promise.all(resultPromises)
}

function checkActionEnableSimpleCache(enabeled: boolean,action: SimpleCacheAction) {
  if(action.type === DISABLE) {
    return [false, true]
  }
  if(action.type === ENABLE) {
    return [true, false]
  }
  return [enabeled, true]
}

function skip(action: SimpleCacheAction) {
  return action.meta && (action.meta as MetaProperty)["@@simple-cache:skip"]
}
export default function createMiddleware<S>(config: SimpleCacheMiddlewareConfig<S>) {
  let enabled = false
  let hydrated = false
  return (store: Store<S, SimpleCacheAction>,) => (next: Dispatch<SimpleCacheAction>) => async (action: SimpleCacheAction ) => {
    if(action.type === PURGE) {
      if (action.all) purgeCacheAll(config)
      else {
        purgeCache(config,action.cacheKey)
      }
      return
    }
    [enabled, hydrated] = checkActionEnableSimpleCache(enabled,action)
    if(enabled && !hydrated) {
      await readStorage(store, config)
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          'redux-simple-cache/hydrated'
        )
      }
    } else {
      next(action)
    }
    if(enabled && hydrated && !skip(action)) syncStore(store, config, action)
    else hydrated = true
  }
}

function warnIfRemoveError(err: Error) {
  if (err && process.env.NODE_ENV !== 'production') {
    console.error(
      'redux-simple-cache/purgeStoredState: Error purging data stored state',
      err
    )
  }
}

function purgeCacheAll<S>(config: SimpleCacheMiddlewareConfig<S>) {
  for(let [cacheKey, cacheSetting] of Object.entries(config.cache)) {
    const storage = config.storage[cacheSetting.storageId]
    return storage.removeItem(cacheKey, warnIfRemoveError)
  }
}

function purgeCache<S>(config: SimpleCacheMiddlewareConfig<S>,cacheKey: string) {
  if(cacheKey in config.cache) {
    const storage = config.storage[config.cache[cacheKey].storageId]
    return storage.removeItem(cacheKey, warnIfRemoveError)
  }
}

export function useCache<StoreKey extends string = string>() {
  const dispatch = useDispatch()
  return {
    purgeAll() {
      dispatch({
        type: PURGE,
        all: true
      })
    },
    purge(key: StoreKey) {
      dispatch({
        type: PURGE,
        cacheKey: key
      })
    },
    enable(enable: boolean) {
      dispatch({
        type: enable ? ENABLE : DISABLE
      })
    }
  }
}
