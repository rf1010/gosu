package gosu.collection.circularbuffer

uses java.util.Iterator
uses java.util.Collection
uses java.lang.IllegalArgumentException

class AbstractBuffer<E> implements IBuffer<E> {

  private var _maxSize = BufferBuilder.DefaultMaxBufferSize
  private var _bf = BufferBuilder.newCircularFifoBuffer<E>(_maxSize)

  /**
   *  Sets the buffer.
   */
  internal property set Buffer(bf: org.apache.commons.collections.Buffer) {
    if (bf == null) {
      throw new IllegalArgumentException("Buffer is null")
    } else {
      _bf = bf
    }
  }

  /**
   *  Sets the maximum size.
   */
  property set MaxSize(maxSize: int) {
    _maxSize = maxSize
  }

  /**
   *  Returns the maximum size.
   */
  override property get MaxSize(): int {
    return _maxSize
  }

  /**
   *  Remove an element from a buffer and return the value.
   */
  override function remove(): E {
    return _bf.remove() as E
  }

  /**
   *  Return the value from the buffer but do not remove it from the buffer.
   */
  override function get(): E {
    return _bf.get() as E
  }

  /**
   *  Returns the used size of a buffer.
   */
  override property get UsedSize(): int {
    return _bf.size()
  }

  /**
   *  Returns the size of a buffer.
   */
  override function size(): int {
    return _bf.size()
  }

  /**
   *  Returns true if the buffer is empty.
   */
  override property get Empty(): boolean {
    return _bf.Empty
  }

  /**
   *  Returns true if the buffer contains the object.
   */
  override function contains(obj: Object): boolean {
    return _bf.contains(obj)
  }

  /**
   *  Returns an iterator for a buffer. Note: this is likely not to be deterministic in concurrent environment.
   */
  override function iterator(): Iterator<E> {
    return _bf.iterator() as Iterator<E>
  }

  /**
   *  Returns an array of objects from the buffer.
   */
  override function toArray(): Object[] {
    return _bf.toArray()
  }

  /**
   *  Puts elements on a buffer into a parametrized array.
   */
  override function toArray<T>(arr: T[]): T[] {
    return _bf.toArray<T>(arr)
  }

  /**
   *  Adds an element to a buffer (collection).
   */
  override function add(elm: E): boolean {
    return _bf.add(elm)
  }

  /**
   *  Remove an element from a buffer (collection).
   */
  override function remove(obj: Object): boolean {
    return _bf.remove(obj)
  }

  /**
   *  Returns true if the buffer (collection) contains all elements of the collection passed in as a parameter.
   */
  override function containsAll(col: Collection< ? >): boolean {
    return _bf.containsAll(col)
  }

  /**
   *  Adds the elements of a collection to a buffer (collection).
   */
  override function addAll(col: Collection< ? extends E>): boolean {
    return _bf.addAll(col)
  }

  /**
   *  Remove the elements of a collection from a buffer (collection).
   */
  override function removeAll(col: Collection< ? >): boolean {
    return _bf.removeAll(col)
  }

  /**
   *  Remove all items from the buffer (collection), except the ones specified in the input collection.
   */
  override function retainAll(col: Collection< ? >): boolean {
    return _bf.retainAll(col)
  }

  /**
   *  Empty a buffer by clearing a collection.
   */
  override function clear() {
    _bf.clear()
  }
}