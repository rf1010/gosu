package gosu.concurrent.result

uses java.lang.Throwable

class FutureFailure<T extends Throwable> extends FutureResult<T> {

  private var _error: T = null

  construct(error: T) {
    _error = error
  }

  /**
   *  Returns the throwable error which occurred during
   *  the Future execution.
  */
  property get Error(): T {
    return _error
  }
}