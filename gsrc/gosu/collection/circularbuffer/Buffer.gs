package gosu.collection.circularbuffer

class Buffer<E> extends AbstractBuffer<E> implements IBuffer<E> {

  /**
   *  Returns a new instance of a class which implements IBuffer.
   */
  static function newInstance<T>(): IBuffer<T> {
    return BufferBuilder.newInstance<T>().build()
  }

  internal construct() {
  }
}