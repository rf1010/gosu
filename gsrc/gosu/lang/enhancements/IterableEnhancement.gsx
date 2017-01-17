package gosu.lang.enhancements

uses java.lang.Throwable

enhancement IterableEnhancement<A>: java.lang.Iterable<A> {

  /**
   *  Returns the first element which is not null. If the element is a block,
   *  returns the result of evaluation of the first block which returns not null.
   */
  function firstNotNull_ext<B>(): B {
    var result: B = null

    foreach (elm in this) {
      result = isBlock_ext(elm) ? liftFromBlock_ext(elm) : elm as B
      if (result != null) {
        break
      }
    }
    return result
  }

  /**
   * Returns the Nth element of iterable. If the element does not exist, returns null.
   */
  function get_ext(elementIndex: int): A {
    var result: A = null

    foreach (elm in this index idx) {
      if (idx == elementIndex) {
        result = elm
        break
      }
    }
    return result
  }

  /**
   *  Checks that all elements of are the same.
   */
  property get AllTheSame_ext(): boolean {
    var first = this.first()
    return this.allMatch(\elm -> elm == first)
  }

  /**
   *  Checks whether all elements are set, i.e. there is not a single one where the value is null.
   */
  property get AllNotNull_ext(): boolean {
    return this.HasElements and not this.hasMatch(\elm -> elm == null)
  }

  /**
   *  Returns true if the current element is type of block; false otherwise.
   */
  private function isBlock_ext(elm: A): boolean {
    return elm typeis gw.lang.function.IBlock
  }

  /**
   *  If the element is a block, evaluates it and returns the result of evaluation;
   *  otherwise, returns null.
   */
  private function liftFromBlock_ext<B>(elm: A): B {
    var runnable = \ -> (elm as block(): B)()
    return isBlock_ext(elm) ? evaluateBlockSafely_ext(runnable) : null
  }

  /**
   *  Evaluates the block and returns the result of evaluation. If an exception is thrown, it is silently ignored.
   */
  private static function evaluateBlockSafely_ext<B>(runnable: block(): B): B {
    var result: B = null
    try {
      result = runnable()
    } catch(t: Throwable) {
    }
    return result
  }
}
