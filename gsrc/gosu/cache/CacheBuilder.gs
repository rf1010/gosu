package gosu.cache

uses com.google.common.cache.CacheLoader
uses com.google.common.cache.RemovalListener
uses gosu.functional.adt.Tuple2

uses java.lang.IllegalArgumentException
uses java.lang.Integer
uses java.lang.Long
uses java.util.concurrent.TimeUnit

/**
 *  A wrapper around Guava CacheBuilder to behave like a Gosu/Guidewire builder.
 */
class CacheBuilder<K, V> {

  private construct() {
  }

  var _concurrencyLevel: Integer = null
  var _initialCapacity: Integer = null
  var _maxSize: Long = null
  var _maxWeight: Long = null
  var _isWeakKeys: Boolean = null
  var _isWeakValues: Boolean = null
  var _isSoftValues: Boolean = null
  var _isRecordingStats: Boolean = null
  var _removalListener: RemovalListener<K, V> = null
  var _expireAfterAccess: Tuple2<Long, TimeUnit> = null
  var _expireAfterWrite: Tuple2<Long, TimeUnit> = null
  var _refreshAfterWrite: Tuple2<Long, TimeUnit> = null

  var _cacheMissHandler: block(key: K): V = null

  /**
   *  Returns a new instance of CacheBuilder.
   */
  static function newBuilder<K1, V1>(): CacheBuilder<K1, V1> {
    return new CacheBuilder<K1, V1>()
  }

  /**
   *  Sets the concurrency level.
   */
  function withConcurrencyLevel(concurrencyLevel: int): CacheBuilder<K, V> {
    _concurrencyLevel = concurrencyLevel
    return this
  }

  /**
   *  Sets the initial capacity.
   */
  function withInitialCapacity(initialCapacity: int): CacheBuilder<K, V> {
    _initialCapacity = initialCapacity
    return this
  }

  /**
   *  Sets the max size.
   */
  function withMaxSize(maxSize: long): CacheBuilder<K, V> {
    _maxSize = maxSize
    return this
  }

  /**
   *  Sets the max weight.
   */
  function withMaxWeight(maxWeight: long): CacheBuilder<K, V> {
    _maxWeight = maxWeight
    return this
  }

  /**
   *  Sets the weak keys property.
   */
  function withWeakKeys(): CacheBuilder<K, V> {
    _isWeakKeys = true
    return this
  }

  /**
   *  Sets the weak values property.
   */
  function withWeakValues(): CacheBuilder<K, V> {
    _isWeakValues = true
    return this
  }

  /**
   *  Sets the soft values property.
   */
  function withSoftValues(): CacheBuilder<K, V> {
    _isSoftValues = true
    return this
  }

  /**
   *  Sets the indicator to record cache statistics. Without this being set to true, cache stats won't be recorded;
   *  however, the cache operation introduces a performance penalty.
   */
  function withRecordCacheStatistics(): CacheBuilder<K, V> {
    _isRecordingStats = true
    return this
  }

  /**
   *   Sets the removal listener.
   */
  function withRemovalListener(removalListener: RemovalListener<K, V>): CacheBuilder<K, V> {
    _removalListener = removalListener
    return this
  }

  /**
   *  Sets the expire after access property.
   */
  function withExpireAfterAccess(numberOfUnits: long, timeUnit: TimeUnit): CacheBuilder<K, V> {
    _expireAfterAccess = new Tuple2<Long, TimeUnit>(numberOfUnits, timeUnit)
    return this
  }

  /**
   *  Sets the expire after write property.
   */
  function withExpireAfterWrite(numberOfUnits: long, timeUnit: TimeUnit): CacheBuilder<K, V> {
    _expireAfterWrite = new Tuple2<Long, TimeUnit>(numberOfUnits, timeUnit)
    return this
  }

  /**
   *  Sets the refresh after write property.
   */
  function withRefreshAfterWrite(numberOfUnits: long, timeUnit: TimeUnit): CacheBuilder<K, V> {
    _refreshAfterWrite = new Tuple2<Long, TimeUnit>(numberOfUnits, timeUnit)
    return this
  }

  /**
   *   Sets the cache miss handler.
   */
  function withCacheMissHandler(cacheMissHandler: block(key: K): V): CacheBuilder<K, V> {
    _cacheMissHandler = cacheMissHandler
    return this
  }

  /**
   *   Builds a new instance of Guava Cache with parameters set by this builder.
   */
  function build(): com.google.common.cache.LoadingCache<K, V> {
    var _cacheBuilder = com.google.common.cache.CacheBuilder<K, V>.newBuilder()

    if (_concurrencyLevel != null) {
      _cacheBuilder = _cacheBuilder.concurrencyLevel(_concurrencyLevel)
    }

    if (_initialCapacity != null) {
      _cacheBuilder = _cacheBuilder.initialCapacity(_initialCapacity)
    }

    if (_maxSize != null) {
      _cacheBuilder = _cacheBuilder.maximumSize(_maxSize)
    }

    if (_maxWeight != null) {
      _cacheBuilder = _cacheBuilder.maximumWeight(_maxWeight)
    }

    if (_isWeakKeys) {
      _cacheBuilder = _cacheBuilder.weakKeys()
    }

    if (_isSoftValues) {
      _cacheBuilder = _cacheBuilder.softValues()
    }

    if (_isWeakValues) {
      _cacheBuilder = _cacheBuilder.weakValues()
    }

    if (_isRecordingStats) {
      _cacheBuilder = _cacheBuilder.recordStats()
    }

    if (_removalListener != null) {
      _cacheBuilder = _cacheBuilder.removalListener(_removalListener)
    }

    if (_expireAfterAccess != null) {
      _cacheBuilder = _cacheBuilder.expireAfterAccess(_expireAfterAccess.Element1, _expireAfterAccess.Element2)
    }

    if (_expireAfterWrite != null) {
      _cacheBuilder = _cacheBuilder.expireAfterWrite(_expireAfterWrite.Element1, _expireAfterWrite.Element2)
    }

    if (_refreshAfterWrite != null) {
      _cacheBuilder = _cacheBuilder.refreshAfterWrite(_refreshAfterWrite.Element1, _refreshAfterWrite.Element2)
    }

    if (_cacheMissHandler != null) {
      return _cacheBuilder.build(convertBlockToCacheLoader(_cacheMissHandler))
    } else {
      throw new IllegalArgumentException("Cache Miss Handler is null")
    }
  }

  private function convertBlockToCacheLoader(cacheMissHandler: block(key: K): V): CacheLoader<K, V> {
    var _cacheLoader = new com.google.common.cache.CacheLoader<K, V>() {
      /**
       *  This is called when the key is not in a cache.
       */
      override function load(key: K): V {
        var result = cacheMissHandler(key)
        return result
      }
    }
    return _cacheLoader
  }
}