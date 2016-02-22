package gosu.cache

uses com.google.common.cache.LoadingCache
uses gosu.logging.Logger

abstract class AbstractCache<K, V>  implements ICache<K, V> {

  protected var _cache: com.google.common.cache.LoadingCache<K, V> = null
  protected static var _logger: gosu.logging.Logger = Logger.finder.API

  /**
   *  Returns cache.
   */
  override property get Cache(): LoadingCache<K, V> {
    return _cache
  }

  /**
   *  Returns a value for a given key.
   */
  override function get(key: K): V {
    return _cache.get(key)
  }

  /**
   *  Invalidates all entries in cache.
   */
  override function invalidateAll() {
    _cache.invalidateAll()
  }
}