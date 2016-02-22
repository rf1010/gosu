package gosu.cache

uses java.lang.Integer
uses java.util.concurrent.TimeUnit
uses java.util.concurrent.atomic.AtomicInteger

class SimpleCacheImpl extends AbstractCache<Integer, String> {

  final var _cacheMissHandlerCounter: AtomicInteger as readonly MissHandlerCounter = new AtomicInteger()

  private construct() {
  }

  /**
   *  Returns a singleton instance of Cache.
   */
  static function newInstance(): SimpleCacheImpl {
    return CacheHolder.Instance
  }

  private static class CacheHolder {
    final static var _instance: SimpleCacheImpl as Instance = new SimpleCacheImpl () {
        :_cache = CacheBuilder
            .newBuilder<Integer, String>()
            .withExpireAfterAccess(15, TimeUnit.MINUTES)
            .withMaxSize(10)
            .withRecordCacheStatistics()
            .withCacheMissHandler(\key: Integer -> handleCacheMiss(key))
            .build()
    }

    private static function handleCacheMiss(key: Integer): String {
      _instance._cacheMissHandlerCounter.incrementAndGet()
      return key as String
    }
  }
}