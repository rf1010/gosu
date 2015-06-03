package gosu.concurrent.result

class FutureSuccess<A> extends FutureResult<A> {

  private var _val: A = null

  construct(inValue: A) {
    _val = inValue
  }

  /**
   * Returns the value of the Future execution.
  */
  property get Value(): A {
    return _val
  }
}