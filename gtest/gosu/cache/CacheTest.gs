package gosu.cache

uses gw.testharness.RunLevel
uses gw.testharness.ServerTest
uses gw.testharness.TestBase
uses java.util.concurrent.atomic.AtomicInteger
uses java.lang.Integer
uses gosu.concurrent.ConcurrentRunner

@RunLevel(NONE)
@ServerTest
class CacheTest extends TestBase {

  var cache = SimpleCacheImpl.newInstance()

  function beforeClass() {
    var numberOfAccesses = 10
    (1..numberOfAccesses).each(\elm -> {
      cache.get(1)
    })
  }

  /**
   *  Tests whether the cache properly caches a result when accessed in a sequential fashion.
   */
  function testCacheMissHandlerCounter() {
    var expected = 1
    var actual = cache.MissHandlerCounter.get()
    assertEquals("Expect cache miss handler to be used only once", expected, actual)
  }

  /**
   *  Tests whether the cache statistics is properly updated when accessed in a sequential fashion.
   */
  function testCacheAccessStatistics() {
    var expected = 9
    var actual = cache.Cache.stats().hitCount()
    assertEquals("Testing cache hit count", expected, actual)
  }

  /**
   *  Tests the proper implementation of cache singleton in a concurrent environment.
   */
  function testConcurrentEnvCacheSingleton() {

    var cacheMissCounter = new AtomicInteger()
    var cacheMissCallbackHandler = \ -> cacheMissCounter.incrementAndGet()
    var concurrentCache: ICache<Integer, String> = null

    var getInstanceAndReturnValue = \ -> {
      concurrentCache = ConcurrentEnvCacheImpl.newInstance()
      (concurrentCache as ConcurrentEnvCacheImpl).CacheMissCallbackHandler = cacheMissCallbackHandler
      return concurrentCache.get(1)
    }

    var numberOfConcurrentThreads = 100
    var callables = (1..numberOfConcurrentThreads).map(\elm -> getInstanceAndReturnValue)

    var runner = new ConcurrentRunner()
    runner.run(callables)
    runner.collect()

    var expected = 1
    var actual = cacheMissCounter.get()
    assertEquals("Cache miss handler should be accessed once in concurrent environment", expected, actual)
  }
}