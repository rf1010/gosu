package gosu.perf

uses java.lang.Float
uses java.lang.Long
uses java.util.Date
uses java.util.Map
uses java.util.concurrent.TimeUnit

/**
 *   Represents the results of stopwatch measurement, including the results from the initial run,
 *   the results from the final warmed-up run, and the speedup.
 */
internal class StopwatchResult<A> {

  private var _initialResult: A = null
  private var _initialDuration: Long = null
  private var _initialStart: Long = null
  private var _initialEnd: Long = null

  private var _lastResult: A = null
  private var _lastDuration: Long = null
  private var _lastStart: Long = null
  private var _lastEnd: Long = null

  private var _speedup: Float as readonly Speedup = 0.0

  construct() {
  }

  /**
   *  Records initial results: evaluation result, start, and end from the initial run
   */
  @Param("evaluationResult", "Result of evaluation from the first run")
  @Param("start", "Start time units from the first run")
  @Param("end", "End time units from the first run")
  function recordInitialResult(evaluationResult: A, start: Long, end: Long) {
    _initialResult = evaluationResult
    _initialStart = start
    _initialEnd = end
    _initialDuration = _initialEnd - _initialStart
  }

  /**
   *  Records final results: evaluation result, start, and end from the last "warmed-up" run
   */
  @Param("evaluationResult", "Result of evaluation from the warmed-up run")
  @Param("start", "Start time units from the warmed-up run")
  @Param("end", "End time units from the warmed-up run")
  function recordLastResult(evaluationResult: A, start: Long, end: Long) {
    _lastResult = evaluationResult
    _lastStart = start
    _lastEnd = end
    _lastDuration = _lastEnd - _lastStart

    var canCalculateSpeedup = \ -> _lastDuration != null and _initialDuration != null and _lastDuration != 0.0

    _speedup = canCalculateSpeedup() ? _initialDuration / _lastDuration : 0.0
  }

  private property get LastMeasurementAvailable(): boolean {
    return _lastDuration != null
  }

  private property get InitialMeasurementAvailable(): boolean {
    return _initialDuration != null
  }

  /**
   *  Returns the result of evaluation, depending on whether the warmed-up measurement or timed (one-time)
   *  measurement was performed.
   */
  property get MeasurementResult(): A {
    var result: A = null

    if (LastMeasurementAvailable) {
      result = _lastResult
    } else if (InitialMeasurementAvailable) {
      result = _initialResult
    }
    return result
  }

  /**
   *  Returns the duration of operation, depending on whether the warmed-up measurement or timed (one-time)
   *  measurement was performed.
   */
  property get Duration(): Long {
    var result: Long = null

    if (LastMeasurementAvailable) {
      result = _lastDuration
    } else if (InitialMeasurementAvailable) {
      result = _initialDuration
    }
    return result
  }

  /**
   *  Returns the duration of operation expressed as a map of time unit types and their values, i.e.
   *  DAYS -> 1, HOURS -> 20, MINUTES -> 30, etc.
   */
  property get DurationTimeUnit(): Map<TimeUnit, Long> {
    return Date.computeDurationTimeUnits_Ext(Duration, TimeUnit.NANOSECONDS)
  }

  /**
   *  Returns the duration of operation formatted as a display string.
   */
  property get DurationDisplayValue(): String {
    return Date.getDurationAsString_Ext(Duration, TimeUnit.NANOSECONDS)
  }

  /**
   *  Returns the duration of operation formatted as a display string (with speedup).
   */
  property get DurationWithSpeedupDisplayValue(): String {
    return "${DurationDisplayValue} (speedup: ${Speedup})"
  }
}