package gosu.cache

uses java.lang.Integer
uses java.util.concurrent.TimeUnit

class ConcurrentEnvCacheImpl extends AbstractCache<Integer, String> {

  var _cacheMissCallbackHandler: block() = null

  private construct() {
  }

  /**
   *  Returns a singleton instance of Cache.
   */
  static function newInstance(): ConcurrentEnvCacheImpl {
    return CacheHolder.Instance
  }

  /**
   *  Allows to set the cache miss callback handler to be called externally
   */
  property set CacheMissCallbackHandler(handler: block()) {
    _cacheMissCallbackHandler = handler
  }

  private static class CacheHolder {
    final static var _instance: ConcurrentEnvCacheImpl as Instance = new ConcurrentEnvCacheImpl() {
      :_cache = CacheBuilder
        .newBuilder<Integer, String>()
        .withExpireAfterAccess(15, TimeUnit.MINUTES)
        .withMaxSize(10)
        .withRecordCacheStatistics()
        .withCacheMissHandler(\key: Integer -> handleCacheMiss(key))
        .build()
    }

    private static function handleCacheMiss(key: Integer): String {
      _instance._cacheMissCallbackHandler()
      return key as String
    }
  }
}