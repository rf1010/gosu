package gosu.perf.tool

uses gosu.collection.circularbuffer.BufferBuilder
uses gosu.perf.Stopwatch
uses gosu.logging.Logger
uses gw.api.system.server.ServerUtil
uses gw.lang.function.IBlock
uses gw.lang.reflect.IType
uses java.lang.IllegalArgumentException
uses java.net.InetAddress
uses java.util.UUID

class Perf {
  final static var _logger = Logger.finder.APPLICATION
  final static var _instance: Perf as readonly INSTANCE = new Perf()
  final static var _serverId = ServerUtil.ServerId ?: InetAddress.LocalHost.HostName

  final var _buffer = BufferBuilder
      .newInstance<PerfEvent>()
      .withMaxBufferSize(1000)
      .withSynchronized(true)
      .withBackgroundWorkerStarted(true)
      .withBackgroundWork(\elm -> CSVFileWriter.INSTANCE.write(elm))
      .build()

  private construct() {
  }

  /**
   *  Measures the duration of invocation of callable and captures it for reporting.
   */
  function measure<A>(businessIdentifier: String, className: String, functionName: String, callable: IBlock): A {

    var measured = Stopwatch.measureExecutionDuration<A>(asCallable<A>(callable))
    _logger.debug(\ -> "Stopwatch returned duration=${measured.Duration} for callable=${callable}")
    _buffer.add(PerfEvent
        .buildFrom(businessIdentifier, _serverId, className, functionName, measured.Duration / 1000000))
    var result = measured.MeasurementResult as A
    _logger.debug(\ -> "Returning result=${result}")
    return result
  }

  /**
   *  Overloaded implementation which takes IType instead of class name.
   */
  function measure<A>(businessIdentifier: String, classType: IType, functionName: String, callable: IBlock): A {
    return measure(businessIdentifier, classType as String, functionName, callable)
  }

  /**
   *  Overloaded implementation which generates a random business identifier (UUID).
   */
  function measure<A>(className: String, functionName: String, callable: IBlock): A {
    return measure(UUID.randomUUID().toString(), className, functionName, callable)
  }

  /**
   *  Overloaded implementation which generates a random business identifier (UUID).
   */
  function measure<A>(classType: IType, functionName: String, callable: IBlock): A {
    return measure(UUID.randomUUID().toString(), classType as String, functionName, callable)
  }

  private static function asCallable<A>(code: IBlock): block(): A {

    var result: block(): A = null

    if (code typeis block(): A) {
      result = toCallableFromCallable(code)
    } else if (code typeis block()) {
      result = toCallableFromRunnable(code)
    } else {
      throw new IllegalArgumentException("IBlock cannot be cast into either Callable or Runnable")
    }

    return result
  }

  private static function toCallableFromRunnable<A>(runnable: IBlock): block(): A {
    _logger.debug(\ -> "Converting Runnable=${runnable} to a Callable")
    var result = \ -> {
      (runnable as block())()
      return true as A
    }
    return result
  }

  private static function toCallableFromCallable<A>(callable: IBlock): block(): A {
    _logger.debug(\ -> "Converting Callable=${callable} to a Callable")
    return (callable as block(): A)
  }
}