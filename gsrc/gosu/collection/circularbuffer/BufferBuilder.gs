package gosu.collection.circularbuffer

uses org.apache.commons.collections.buffer.CircularFifoBuffer
uses org.apache.commons.collections.BufferUtils
uses java.lang.IllegalArgumentException

class BufferBuilder<E> {

  static var _defaultMaxBufferSize: int = 32
  var _maxBufferSize: int as readonly MaxBufferSize = _defaultMaxBufferSize
  var _synchronized: boolean as readonly Synchronized = false
  var _bf = new Buffer<E>()
  var _work: block(elm: E) = null
  var _backgroundWorkerStarted: Boolean as readonly BackgroundWorkerStarted = null

  private construct() {
  }

  /**
   *  Returns the default maximum buffer size, if it is not defined by withMaxBufferSize().
   */
  static property get DefaultMaxBufferSize(): int {
    return _defaultMaxBufferSize
  }

  /**
   *  Returns a new instance of this builder.
   */
  static function newInstance<T>(): BufferBuilder<T> {
    return new BufferBuilder<T>()
  }

  /**
   *  Allows to set the maximum buffer size.
   */
  function withMaxBufferSize(maxSize: int): BufferBuilder<E> {
    if (maxSize <= 0) {
      throw new IllegalArgumentException("Size must be greater than zero")
    } else {
      _maxBufferSize = maxSize
      _bf.MaxSize = maxSize
    }
    return this
  }

  /**
   *  Allows to define Synchronized property to generate a synchronized buffer. The default is
   *  not synchronized.
   */
  function withSynchronized(isSynchronized: boolean): BufferBuilder<E> {
    _synchronized = isSynchronized
    return this
  }

  /**
   *  Defines the work for the background buffer processor; if it is set,
   *  the builder returns an instance of a BackgroundWorkCapableBuffer.
   */
  function withBackgroundWork(work: block(elm: E)): BufferBuilder<E> {
    _work = work
    return this
  }

  /**
   *  Allows to start the background worker; if defined, the builder returns
   *  an instance of BackgroundBufferWorker; if not defined, it returns Buffer.
   */
  function withBackgroundWorkerStarted(isStarted: boolean = true): BufferBuilder<E> {
    _backgroundWorkerStarted = isStarted
    return this
  }

  /**
   *  Builds and returns a new buffer.
   */
  function build(): IBuffer<E> {

    if (_work != null or _backgroundWorkerStarted != null) {
      _backgroundWorkerStarted = _backgroundWorkerStarted ?: false
      buildBackgroundWorkCapableBuffer()
    }

    return Synchronized
      ? buildSynchronizedCircularFifoBuffer()
      : buildCircularFifoBuffer()
  }

  private function buildBackgroundWorkCapableBuffer(): IBuffer<E> {
    var backgroundWorkCapableBuffer = new BackgroundWorkCapableBuffer<E>()

    if (_work != null) {
      backgroundWorkCapableBuffer.Work = _work
    }

    if (_backgroundWorkerStarted) {
      backgroundWorkCapableBuffer.start()
    }

    _bf = backgroundWorkCapableBuffer
    return _bf
  }

  private function buildSynchronizedCircularFifoBuffer(): IBuffer<E> {
    _bf.Buffer = newSynchronizedCircularFifoBuffer(_maxBufferSize)
    return _bf
  }

  private function buildCircularFifoBuffer(): IBuffer<E> {
    _bf.Buffer = newCircularFifoBuffer(_maxBufferSize)
    return _bf
  }

  /**
   *  A static constructor for a buffer with the maximum defined size. This buffer is not synchronized;
   *  for thread-safe implementation, use newSynchronizedCircularFifoBuffer().
   */
  internal static function newCircularFifoBuffer<T>(maxSize: int): org.apache.commons.collections.Buffer {
    return new CircularFifoBuffer(maxSize)
  }

  /**
   *  A static constructor for a synchronized buffer with the specified maximum size.
   */
  internal static function newSynchronizedCircularFifoBuffer<T>(maxSize: int): org.apache.commons.collections.Buffer {
    return BufferUtils.synchronizedBuffer(new CircularFifoBuffer(maxSize))
  }
}