package gosu.cache

uses com.google.common.cache.LoadingCache

interface ICache<K, V> {

  /**
   *  Exposes a cache which is of type LoadingCache.
   */
  property get Cache(): LoadingCache<K, V>

  /**
   *  Returns the value for a given key.
   */
  function get(key: K): V

  /**
   *  Allows to invalidate all entries in cache.
  */
  function invalidateAll()
}