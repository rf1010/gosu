# gosu
Provides extendions to standard gosu libraries.

### Validation
`Validation.require()`  is a syntactic sugar for validation code which throws exceptions (e.g. validating that the function input is correct). For example:
```
if (myParam == null) {
	throw new IllegalArgumentException("myParam cannot be null")	
} else {
	//continue program flow
}
```
becomes
```
Validation.require(\ -> myParam != null, "myParam cannot be null")
```

The class also allows for construction of other exceptions or executing alternative flows if the condition does not evaluate to true.

### Algebraic Data Types (ATDs)
#### Tuples
Tuple is an ordered list of elements in which elements can be of different types. The element projections (typed values) are exposed as ElementN where N ranges from 1 to max dimension or arity.  Tuples are useful as composite type constructors which contain proper equals() and hashCode() implementations, which make them usable as composite keys in HashMaps, Sets, etc. However, caution should be exercised at high arities, as tuples inhibit understanding of code (e.g. what does Tuple10.Element10 mean?).

Tuples can be constructed either by invoking a constructor or static builder (apply) function. Static builder function is preferable, since it uses the type system to determine the type of each element:
```
var result1 = Tuple2.apply("A", 1)
print (result1.Element1)   // A
print (result1.Element2)   // 1
``` 
A constructor should be used when the type system cannot determine the type (usually when elements are blocks), in which case the element types should be defined explicitly:
```
var e1 = \ -> "A" // a block which returns "A"
var e2 = \ -> 1   // a block which returns 1

var result2 = new Tuple2<block(): String, block(): Integer>(e1, e2)
print (result2.Element1()) // evaluate Element1() - returns "A"
print (result2.Element2()) // evaluate Element1() - returns 1
```
Tuples (and tuple tests) are generated by a TupleGenerator which uses velocity templates. TupleGenerators allows customization of max dimension and some other parameters via `withXYZ()` calls, e.g. `withMaxArity(X)`. Sample TupleGenerator usage:
```
TupleGenerator.INSTANCE.withBasePackageName("com.abc").withMaxArity(10).run()
```
This will generate com.abc.gosu.functional.adt.Tuple2 to com.abc.gosu.functional.adt.Tuple10 classes and the corresponding tests.

After the tuple classes are generated, they may be checked-in into the source control repository. Direct editing of tuple classes is discouraged.

### Concurrency
#### ConcurrentRunner
`ConcurrentRunner` provides an implementation for parallelizing work. It allows submission of callables for execution (in separate threads). It can then optionally block the current thread until the work submitted in separate threads is completed (successfully or not (failed, time-out, etc)). `ConcurrentRunner` knows how to manage the thread pool: by default, it destroys threads after all callables are completed, but they can be set for thread re-use, if necessary.

The API is simple: 
`ConcurrentRunner.run()` submits callables for execution is separate threads and returns a collection of FutureResult(s).

`ConcurrentRunner.collect()` blocks the thread until all callables are completed (either successfully or not). 

`FutureResult` can be either success or failure. Success allows to retrieve the value returned by a callable. If callable failed, FutureFailure contains the throwable which aborted the execution. If not all threads are completed prior to the timeout (the default is 60 seconds but can be overwritten), a warning is logged.

Sample usage:
```
var doWork = \id: Integer, delay: long -> {
  Thread.sleep(delay)
  return id
}

fastWork = (1..1000).map(\elm -> \ -> doWork(elm, 100)) // create 1000 threads which sleep for 0.1 second

var runner = new ConcurrentRunner<Integer>()
runner.run(fastWork)
var results = runner.collect()
var resultCount = results.whereTypeIs(gosu.concurrent.result.FutureSuccess).Count
print(resultCount) // prints the count of successful results
```

#### ContextAwareConcurrentRunner
`ContextAwareConcurrentRunner` extends the functionality of `ConcurrentRunner` by providing the provisions to specify a bundle and/or a user which should be used for running callables. Notice that all callables are run in the same bundle and user context. By default, the user context is that of a current user, and the bundle is the "current" bundle, if it is writable, and a new bundle, if it is not.

Most Guidewire implementations will prefer to use ContextAwareConcurrentRunner, since callables typically create new entities or modify them.

### Logging
`Logger` contains an implementation of org.slf4j.Logger and various predefined logging categories.

Sample usage:
```
var logger = Logger.finder.DEV  // get development logger (logs at the trace level)
logger.debug(\ -> "Starting")   // use the method with a block parameter since 
								// the logger evaluate the block only if the debug 
								// level or above is set (more efficient)

```
Logger is also "decorated" by a block which returns a string which gets prepended to a log message. In the provided default configuration, the log is using a stack trace element decorator which prepends the class name and function name to each log message. It can be customized to include any combination of a package name, class name, function name, file name, and a line number, or an alternative custom log decorator.

In the sample usage below, a DEV category log is instantiated with a log decorator which prepends a package name, class name, function name, file name, and the file line number to each log message:
```
var customLogDecorator = \ -> {
  var stackTraceLine = StackTraceElementEnhancement
        .getWithOffset_ext(3).Decorator_ext
        .withStackTraceFormat(PACKAGE_CLASS_FUNCTION_FILE_LINE)
        .DisplayName
  return stackTraceLine != null ? stackTraceLine + " : " : ""
}

var logger = Logger.finder.DEV.withDecorator(customLogDecorator)
logger.debug(\ -> "Started")
```



### Type System
`TypeSystemUtil` allows reflective construction of objects by their class names. 

The example below constructs an instance of a Tuple2 class by passing class name and parameters:
```
var params = { e1, e2 }.toArray()
var className = TypeSystemUtil.getClassNameFromType(Tuple2)
return TypeSystemUtil.getInstanceByClassName(className, params) as Tuple2
```

### Comparators
#### AssumeMatchIfTargetNotSetComparator
`AssumeMatchIfTargetNotSetComparator` is the implementation which bypasses equality checks between a criteria and a target if the target is not set; it simply returns true. However, if the target is set, then the criteria must be equal to the target. Equality is assessed via a collection of functions ranging from a simple `equals()` to more sophisticated `equalsAsCaseInsensitiveString()`, `equalsAsCaseSensitiveString()`, `equalsAsCaseInsensitiveNoWhitespaceString()`, `startsWithAsCaseSensitiveString()`, etc. 

Sample usage:
```
var criteria = "a"
var matchAgainst = "Abc"

var result1 = AssumeMatchIfTargetNotSetComparator
	.buildFrom(criteria, matchAgainst).startsWithAsCaseInsensitiveString()
print (result1)  //true

var result2 = AssumeMatchIfTargetNotSetComparator
	.buildFrom(criteria, null).startsWithAsCaseInsensitiveString()
print (result2)  //true

var result3 = AssumeMatchIfTargetNotSetComparator
	.buildFrom(criteria, matchAgainst).equalsAsCaseInsensitiveString()
print (result3)  //false
```

#### Set Comparison
`SetEnhancement` compares `that` to `this` set and returns a result which contains elements which were added, removed, or unchanged as collection properties.

Sample usage:
```
var thisSet = { "D", "B", "C" }.toSet()
var thatSet = { "A", "B", "C", "D" }.toSet()

var result = thatSet.compareTo_Ext(thisSet)
print (result.Added.join(", "))           // A
print (result.Unchanged.join(", "))       // D, B, C
```

### Enhancements
#### Iterable.firstNotNull_ext()
`Iterable.firstNotNull_ext()` iterates over each element of an iterable until it finds a value which is not null. If the iterable contains blocks, evaluates blocks until it finds the one which returns a value which is not null and returns that value. 

Sample usage:
```
var result1 = { null, "A", "B" }.firstNotNull_Ext()
print (result1) // A

var a = \ -> null as String
var b = \ -> "B"
var c = \ -> "C"

var result2 = { a, b, c }.firstNotNull_Ext()
print (result2) // B
``` 

#### java.util.Date Enhancements
`java.util.Date` is enhanced with static functions to calculate duration between two dates, as well as customizable user-friendly formatting, e.g. 1 Day 5 Hours 10 Minutes, etc.

Sample usage:
```
uses java.util.Date

var date1 = gw.api.util.DateUtil.currentDate()
var date2 = date1.addMinutes(65)
print (Date.getDurationAsString_Ext(date1, date2))
// 1 Hour 5 Minutes 0 Seconds 0 Milliseconds 0 Microseconds 0 Nanoseconds
```

### Performance Measurement
#### Stopwatch
`Stopwatch.measureExecutionDuration(runnable(): A)` allows to measure the time it takes it execute runnable and obtain its result. `Stopwatch.measureWarmedExecutionDuration(runnable(): A)` runs runnable X number of times (default is 200) to ensure that the JVM optimizations compiled it to native code and reports the results, including the speedup relative to the very first invocation.

Sample usage:
```
var doWork = \max: int -> {
  var res: int = 0
  (1..max).each(\elt -> {
    res = res + elt
  })
  return res
}

var result = Stopwatch.measureWarmedExecutionDuration(\ -> doWork(10000))
print (result.DurationDisplayValue)
// 0 Days 0 Hours 0 Minutes 0 Seconds 6 Milliseconds 120 Microseconds 0 Nanoseconds
```

#### Performance Capture
In most modern applications, ongoing performance management is of a paramount concern, but the answer is not
as easy as it may seem, especially, if the orchestrated process involves multiple (asynchronous) function calls.

The performance capturing tool allows you to place performance capturing code in some key strategic points, like so:
```
Perf.INSTANCE.measure(businessID, MyWebService, "doProcessRequest", \ -> MyWebService.doProcessRequest()
```
It is similar to a performance profiler provided by Guidewire, but it is different in its intent: profiling tools
are used to troubleshoot problems and in this capacity their impact on performance is a secondary concern.
Performance capturing tools are meant to capture statistics with minimal impact on the system performance and is
therefore useful in Production environments.

For this reason, the performance capturing tool's implementation evaluates the "measured" code paths very quickly and
off-loads the writing of statistics to the separate statistics capturing component. In the included reference
implementation, the performance capturing tool is writing collected performance statistics
to the CSV files. The CSVWriter can be swapped for any other implementation.

The back-pressure is controlled by the size of the performance buffer (implemented as a circular buffer). If the
performance events are coming in at a very high rate, or the buffered results are not processed quickly enough,
the oldest elements are simply dropped. This may be mitigated by increasing the size of the buffer (by default,
it can accommodate up to 1,000 results). The results captured in a buffer are processed by a separate background thread.

#### Tool Usage
```
Perf.INSTANCE.measure(businessID, MyWebService, "doProcessRequest", \ -> MyWebService.doProcessRequest()
```

The `measure` function returns the type returned by the `\ -> MyWebService.doProcessRequest()` block, so it is
very easy to inject this anywhere you call `MyWebService.doProcessRequest()`.

`businessID` is a business identifier used to identify an event, e.g. Quote ID. It is used as an identifier on
which the results of calling `MyWebService.doProcessRequest()` multiple times may be aggregated to calculate the
min, max, average, etc.

`MyWebService` is the class being measured.

`doProcessRequest` is usually the function name being measured, but can be anything, as it is represented by a string.

`\ -> MyWebService.doProcessRequest()` is a block which returns some result. This is the code which is being measured.
The results are reported in milliseconds.


### Stack Trace Element Decorator
`StackTraceElementEnhancement` allows the selection of a stack trace element using the offset relative to some base stack trace frame  and "decorate" it with additional properties, such as package name, class name, function name, etc. It is used in the logger implementation to customize the format of a log entry but can be used generically. 

The stack trace element decorator should be used sparingly, as it has a performance penalty. Performance is not an issue in development environments where trace and debug level logging mode are used extensively. In a production setting, a performance penalty is mitigated by logging at a much higher log level (typically info, or error), so calls to the decorator are minimized. 

See Logger for usage.

```
var stackTraceLine = java.lang.StackTraceElement
    .getWithOffset_Ext(1).Decorator_Ext
    .withStackTraceFormat(CLASS_FUNCTION)
    .DisplayName

print (stackTraceLine)
```

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
```
var cache = CacheBuilder
    .newBuilder<Integer, String>()
    .withExpireAfterAccess(15, TimeUnit.MINUTES)
    .withMaxSize(10)
    .withRecordCacheStatistics()
    .withCacheMissHandler(\key: Integer -> handleCacheMiss(key))
    .build()
```

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

### ClassLoaderUtil
Contains a variety of functions and properties to troubleshoot class loading on a JVM.

`ClassLoaderUtil.LoadedClassesByClassLoader` returns the list of classes loaded by each class loader.

`ClassLoaderUtil.getClassInterfaces(clz: Class)` returns the list of interfaces for a class.
