package gosu.collection.circularbuffer

uses gw.testharness.RunLevel
uses gw.testharness.ServerTest
uses gw.testharness.TestBase
uses java.util.UUID
uses java.util.ArrayList

@RunLevel(NONE)
@ServerTest
class BackgroundWorkCapableBufferTest extends TestBase {

  /**
   *  Tests that the buffer is capable of doing background work.
   */
  function testBackgroundWorkerRemovesElementsFromBuffer() {

    var expected = 10
    var result = new ArrayList<String>()

    // the work is to add each element from a buffer to the array list
    var work = \elm: String -> {
      result.add(elm)
    }

    // build a new buffer, define the size, and start the background worker
    var bf = BufferBuilder
        .newInstance<String>()
        .withMaxBufferSize(expected)
        .withBackgroundWorkerStarted()
        .withBackgroundWork(work)
        .build()

    for (1..expected) {
      bf.add(UUID.randomUUID().toString())
    }

    // block until the buffer is empty or for 10 seconds
    using(bf as IMonitorLock) {
      while (not bf.Empty) {
        bf.wait(10000)
      }
    }
    assertEquals("Buffer is empty", 0, bf.UsedSize)
  }

  /**
   *  Tests that the buffer is capable of doing background work correctly.
   */
  function testBackgroundWorkerCompletesWorkCorrectly() {

    var expected = 10
    var result = new ArrayList<String>()

    // the work is to add each element from a buffer to the array list
    var work = \elm: String -> {
      result.add(elm)
    }

    // build a new buffer, define the size, and start the background worker
    var bf = BufferBuilder
        .newInstance<String>()
        .withMaxBufferSize(expected)
        .withBackgroundWorkerStarted()
        .withBackgroundWork(work)
        .build()

    for (1..expected) {
      bf.add(UUID.randomUUID().toString())
    }

    // block until the buffer is empty or for 10 seconds
    using(bf as IMonitorLock) {
      while (not bf.Empty) {
        bf.wait(10000)
      }
    }
    assertEquals("Background worker correctly completes work", expected, result.Count)
  }

  /**
   *  Tests that the background worker does not start unless instructed.
   */
  function testBackgroundWorkerDoesNotStartUnlessInstructed() {

    var expected = 10
    var result = new ArrayList<String>()

    // the work is to add each element from a buffer to the array list
    var work = \elm: String -> {
      result.add(elm)
    }

    // build a new buffer, define the size, and start the background worker
    var bf = BufferBuilder
        .newInstance<String>()
        .withMaxBufferSize(expected)
        .withBackgroundWorkerStarted(false)
        .withBackgroundWork(work)
        .build()

    for (1..expected) {
      bf.add(UUID.randomUUID().toString())
    }

    assertEquals("Background worker does not start unless instructed", expected, bf.UsedSize)
  }

  /**
   *  Tests that the background worker does not start unless instructed.
   */
  function testBackgroundWorkerDelayedStart() {

    var expected = 10
    var result = new ArrayList<String>()

    // the work is to add each element from a buffer to the array list
    var work = \elm: String -> {
      result.add(elm)
    }

    // build a new buffer, define the size, and start the background worker
    var bf = BufferBuilder
        .newInstance<String>()
        .withMaxBufferSize(expected)
        .withBackgroundWorkerStarted(false)
        .withBackgroundWork(work)
        .build()

    for (1..expected) {
      bf.add(UUID.randomUUID().toString())
    }

    // Start worker
    (bf as BackgroundWorkCapableBuffer).start()

    // block until the buffer is empty or 10 seconds
    using(bf as IMonitorLock) {
      while (not bf.Empty) {
        bf.wait(10000)
      }
    }

    assertEquals("Background worker delayed start", 0, bf.UsedSize)
  }
}