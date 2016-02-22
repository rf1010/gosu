### Gosu Builder for Google Guava Cache

#### What
This package contains Gosu classes which make the use of Google Guava cache from Gosu simpler
for Gosu developers, as it is using the familiar "builder" interface. In fact, it is a wrapper for
Google Guava cache builder API, with sensible defaults and ability to overwrite cache parameters.

#### Why
Guidewire provides its own implementation of Cache in the `gw.util.concurrent.Cache` package. However,
it does not provide API for defining cache eviction strategies (e.g. expire cache after 15 minutes).

Google Guava cache implementation provides time-based eviction capabilities and therefore is more appropriate
in most cases.

#### How
For most common usage patterns, please see the tests (`gtest/gosu/cache/CacheTest`) and the cache implementation in
`SimpleCacheImpl`. You would likely want to use a singleton pattern. SimpleCacheImpl provides a reference
implementation for the Singleton pattern in Gosu (it relies on the order of static initializers on JVM).

Be careful with other Singleton patterns, such as a final static variable
`
final static var _cache: ICache = new CacheImpl()
`
as it does not work correctly in highly concurrent environments.

#### Usage Example
`
var cache = CacheBuilder
    .newBuilder<Integer, String>()
    .withExpireAfterAccess(15, TimeUnit.MINUTES)
    .withMaxSize(10)
    .withRecordCacheStatistics()
    .withCacheMissHandler(\key: Integer -> handleCacheMiss(key))
    .build()
`

`newBuilder<Integer, String>()`: the cache will have Integer as a key, and String as a value (substitute for correct
types in your use case

`withExpireAfterAccess(15, TimeUnit.MINUTES)`: will expire cache 15 minutes after last access (i.e. will evict
a key-value from the cache). There are other options for eviction strategies, such as withExpireAfterWrite,
withRefreshAfterWrite. For details, please see Google Guava cache documentation:
https://github.com/google/guava/wiki/CachesExplained

`withMaxSize(10)`: the maximum size of cache (i.e. the number of unique keys).

`withRecordCacheStatistics()`: activates the cache statistics which one can query at runtime (e.g. collects
information on cache misses, hits, etc.); if activated, it is available in `Cache.stats()`. Note: this is NOT
activated by default for performance reasons. However, in most Guidewire implementations, performance won't be
a big issue, and this should be activated if you are using cache statistics in your code.

`withCacheMissHandler`: accepts a block which takes the key as a parameter and returns the value to be cached.
It gets called every time the key is not found in cache.

`build()`: returns the instance of Cache.

