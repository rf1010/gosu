package gosu.collection.circularbuffer

uses java.util.Collection

interface IBuffer<E> extends Collection<E> {

  /**
   * Gets and removes the next object of type E from the buffer.
   *
   * @return the next object in the buffer, which is also removed
   * @throws BufferUnderflowException if the buffer is already empty
   */
  function remove(): E

  /**
   * Gets the next object of type E from the buffer without removing it.
   *
   * @return the next object in the buffer, which is not removed
   * @throws BufferUnderflowException if the buffer is empty
   */
  function get(): E

  /**
   * Returns the maximum size of the buffer.
   *
   * @return Max Buffer size
   */
  property get MaxSize(): int

  /**
   * Returns the number of elements in the underlying buffer.
   *
   * @return Used buffer size
   */
  property get UsedSize(): int

}