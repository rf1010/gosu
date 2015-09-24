package gosu.collection.circularbuffer

class BackgroundWorkCapableBuffer<E> extends Buffer<E> {

  var _worker = new BackgroundBufferWorker<E>(this)

  internal construct() {
  }

  /**
   *  Sets the work required to be performed by the background worker.
   */
  property set Work(work: block(elm: E)) {
    _worker.Work = work
  }

  /**
   *  Returns the logic performed by the background worker.
   */
  property get Work(): block(elm: E) {
    return _worker.Work
  }

  /**
   *  Instructs the background processor to start its work.
   */
  function start() {
    _worker.start()
  }

  /**
   *  Instructs the background process to stop its work and shutdown.
   */
  function stop() {
    _worker.shutdown()
  }

  /**
   *  Adds an element to a buffer and notifies the background worker.
   */
  override function add(elm: E): boolean {
    var result = super.add(elm)
    using (this as IMonitorLock) {
      this.notify()
    }
    return result
  }
}