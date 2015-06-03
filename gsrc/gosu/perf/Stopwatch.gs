package gosu.perf

uses gosu.functional.adt.Tuple3
uses java.lang.Long
uses java.lang.System

/**
 *  Contains a collection of functions to measure time it takes to execute the code.
 */
class Stopwatch {

  /**
   *  Measures the execution time of a runnable block and returns the result of block evaluation and
   *  duration as a difference between the end and start in nanoseconds.
   */
  @Param("runnable", "A runnable block to execute")
  @Returns("A tuple which represents the value returned by a block (Element1) and duration in nanoseconds (Element2)")
  static function measureExecutionDuration<A>(runnable: block(): A): StopwatchResult {
    var result = new StopwatchResult()

    var timedResultEvaluation = timeResultEvaluation(runnable)
    result.recordInitialResult(timedResultEvaluation.Element1,
      timedResultEvaluation.Element2,
      timedResultEvaluation.Element3)
    return result
  }

  /**
   *  Measures the execution time of a runnable block on the "warmed-up" instance of JVM
   *  and returns the result of a block evaluation and the duration as a difference between
   *  the end and start of block execution (in nanoseconds). The number of time parameter
   *  (default = 200) specifies how many times to execute the block until the measurement is taken.
   *  Repeated execution of the code increases the changes of it to be compiled into native code
   *  by JVM just-in-time compiler (which usually occurs in a "steady state" production system.
   */
  @Param("runnable", "A runnable block to execute")
  @Param("numberOfTimes", "Number of times to evaluate the block until the measurement is returned (default=200)")
  @Returns("A tuple which represents the value returned by a block (Element1) and duration in nanoseconds (Element2)")
  static function measureWarmedExecutionDuration<A>(runnable: block(): A, numberOfTimes: int = 200): StopwatchResult {
    var result = new StopwatchResult()
    for (1..numberOfTimes index currentEvaluationIndex) {

      var timedResultEvaluation = timeResultEvaluation(runnable)

      if (currentEvaluationIndex == 0) {
        result.recordInitialResult(timedResultEvaluation.Element1,
          timedResultEvaluation.Element2,
          timedResultEvaluation.Element3)
      }

      if (currentEvaluationIndex == numberOfTimes - 1) {
        result.recordLastResult(timedResultEvaluation.Element1,
          timedResultEvaluation.Element2,
          timedResultEvaluation.Element3)
      }
    }
    return result
  }

  private static function timeResultEvaluation<A>(runnable: block(): A): Tuple3<A, Long, Long> {
    var startTime = System.nanoTime()
    var executionResult = runnable()
    var endTime = System.nanoTime()
    return new Tuple3<A, Long, Long>(executionResult, startTime, endTime)
  }
}