package gosu.collection.circularbuffer

uses java.lang.Thread
uses java.lang.IllegalArgumentException
uses gosu.logging.Logger

/**
 *  This worker implementation run in a background thread, takes an element from a buffer
 *  and processes it using the rules defined by a block (withWork).
 */
class BackgroundBufferWorker<E> extends Thread {

  var _logger = Logger.finder.APPLICATION

  var _terminated = false
  var _bf: IBuffer<E> = null
  var _work: block(elm: E) = null

  construct(bf: IBuffer<E>) {
    if (bf == null) {
      throw new IllegalArgumentException("Buffer is null")
    } else {
      _bf = bf
      this.Daemon = true
    }
  }

  /**
   *  Sets the logic to process each element E once it is removed from a buffer.
   */
  property set Work(work: block(elm: E)) {
    if (work == null) {
      throw new IllegalArgumentException("Work is null")
    } else {
      _work = work
    }
  }

  /**
   *  Returns the work required to perform on each element E.
   */
  property get Work(): block(elm: E) {
    return _work
  }

  /**
   *  Override implementation for run() which calls poll() to get the next buffer element,
   *  removes it from the buffer, and processes it using the logic defined in withWork.
   */
  override function run() {
    while(true) {
      var elm = poll()
      if (_work != null) {
        _work(elm)
      } else {
        _logger.error(\ -> "Work is not defined; use withWork(E) to define it. " +
            "Removed element=${elm} without doing any work")
      }
    }
  }

  /**
   *  A hook for shutdown thread.
   */
  function shutdown() {
    _terminated = true
    using (_bf as IMonitorLock) {
      _bf.notify()
    }
  }

  private function poll(): E {
    var result: E = null

    while (_bf.Empty and not _terminated) {
      using (_bf as IMonitorLock) {
        _bf.wait()
      }
    }
    result = _bf.remove()
    return result
  }
}