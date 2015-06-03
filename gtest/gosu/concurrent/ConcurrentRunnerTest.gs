package gosu.concurrent

uses gw.testharness.RunLevel
uses gw.testharness.ServerTest
uses gw.testharness.TestBase
uses java.lang.Integer
uses java.lang.Thread
uses java.lang.InterruptedException
uses java.util.concurrent.TimeUnit

@RunLevel(NONE)
@ServerTest
class ConcurrentRunnerTest extends TestBase {

  private var _fastWork: List<block(): Integer> = null
  private var _slowWork: List<block(): Integer> = null
  private var _workWithExceptions: List<block(): Integer> = null

  private static var _fastWorkSleep = 100L    //pause for 0.1 second
  private static var _slowWorkSleep = 100000L //pause for 100 seconds

  /**
   *  Create work for 1000 threads with various scenarios:
   *  1) fast work = all threads should complete prior to the timeout
   *  2) slow work = 20% of threads won't complete prior to the timeout
   *  3) work with exceptions = 20% of threads will throw exceptions during execution
   */
  override function beforeMethod() {

    var doWork = \id: Integer, delay: long -> {
      Thread.sleep(delay)
      return id
    }

    var doWorkWithException = \id: Integer, delay: long -> {
      Thread.sleep(delay)
      if (id % 5 == 0) {
        throw new InterruptedException("Intentionally failed")
      }
      return id
    }

    _fastWork = (1..1000).map(\elm -> \ -> doWork(elm, _fastWorkSleep))
    _slowWork = (1..1000).map(\elm -> \ -> doWork(elm, (elm % 5 == 0) ? _fastWorkSleep : _slowWorkSleep))
    _workWithExceptions = (1..1000).map(\elm -> \ -> doWorkWithException(elm, _fastWorkSleep))
  }

  /**
   *  Test the scenario when all work is successfully completed prior to timeout.
   */
  function testFastWork() {
    var runner = new ConcurrentRunner<Integer>()
    runner.run(_fastWork)
    var results = runner.collect()
    var actual = results.Count
    var expected = 1000
    assertEquals("Expect all concurrent work to complete successfully", expected, actual)
  }

  /**
   *  Test the scenario when some work is not completed due to a timeout.
   */
  function testSlowWork() {
    var runner = new ConcurrentRunner<Integer>()
    runner.withTimeout(5, TimeUnit.SECONDS)
    runner.run(_slowWork)
    var results = runner.collect()
    var actual = results.Count
    var expected = 200
    assertEquals("Expect 20% of work incomplete due to time-out", expected, actual)
  }

  /**
   *  Test the scenario when some work is completed with exceptions.
   */
  function testWorkWithExceptions() {
    var runner = new ConcurrentRunner<Integer>()
    runner.run(_workWithExceptions)
    var results = runner.collect()
    var actual = results.whereTypeIs(gosu.concurrent.result.FutureSuccess).Count
    var expected = 800
    assertEquals("Expect 20% of work to complete with exceptions", expected, actual)
  }
}

