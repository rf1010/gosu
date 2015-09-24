package gosu.perf

uses gw.testharness.RunLevel
uses gw.testharness.ServerTest
uses java.lang.Thread
uses gw.testharness.TestBase
uses java.lang.Math
uses java.math.BigDecimal

@RunLevel(NONE)
@ServerTest
class StopwatchTest extends TestBase {

  /**
   *  Test measure of execution duration
   */
  function testMeasureExecutionDuration() {

    var expected = 5000L
    var threshold = 0.01d

    var doWork = \ -> {
      Thread.sleep(expected)
      return 0
    }

    var actualInMilliseconds = (Stopwatch.measureExecutionDuration(doWork).Duration / 1000000).intValue()

    var diff = actualInMilliseconds - expected
    var res = (BigDecimal.valueOf(diff) / BigDecimal.valueOf(expected)).abs()
    var actual = (res - threshold) > 0

    assertFalse("Expect measured duration to be correct with at the most +/- 1% error", actual)
  }

  /**
   *  Test execution speedup of a warmed up JVM vs. initial run
   */
  function testWarmedExecutionDuration() {
    var doWork = \max: int -> {
      var res = 0
      (1..max).each(\ elt -> {
        res = res + elt
      })
      return res
    }

    var actual = Stopwatch.measureWarmedExecutionDuration(\ -> doWork(50000))
    assertBigDecimalIsNotZero(actual.Speedup)
  }
}