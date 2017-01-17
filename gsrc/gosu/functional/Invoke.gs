package gosu.functional

uses java.lang.Throwable
uses gosu.logging.Logger

class Invoke {

  private static final var _logger = Logger.finder.APPLICATION

  /**
   *  Invokes a block which returns a value and wraps it into a try-catch block.
   *  This is a a synonym for callableSafely.
   */
  @Param("callable", "A block which returns a value")
  @Returns("Value of type A returned by the callable block, if sucesssful, or null, if failed")
  static function safely<A>(callable(): A): A {
    return callableSafely<A>(callable, null)
  }

  /**
   *  Invokes a block which returns a value and wraps it into a try-catch block.
   *  If the callable fails, the orElse block is invoked for a side-effect operation (it does not return a value).
   *  This is a a synonym for callableSafely.
   */
  @Param("callable", "A block which returns a value")
  @Param("orElse", "A block to invoke if the callable fails; may be null, in which case it is not invoked")
  @Returns("Value of type A returned by the callable block, if sucesssful; alternatively, invokes, the orElse block")
  static function safely<A>(callable(): A, orElse(t: Throwable): A): A {
    return callableSafely<A>(callable, orElse)
  }

  /**
   *  Invokes a block  which returns a value and wraps it into a try-catch block.
   */
  @Param("callable", "A block which returns a value")
  @Returns("Value of type A returned by the callable block, if sucesssful, or null, if failed")
  static function callableSafely<A>(callable(): A): A {
    return callableSafely<A>(callable, null)
  }

  /**
   *  Invokes a block which returns a value and wraps it into a try-catch block.
   *  If the callable fails, the orElse block is invoked for a side-effect operation (it does not return a value).
   */
  @Param("callable", "A block which returns a value")
  @Param("orElse", "A block to invoke if the callable fails; may be null, in which case it is not invoked")
  @Returns("Value of type A returned by the callable block, if sucesssful; alternatively, invokes, the orElse block")
  static function callableSafely<A>(callable(): A, orElse(t: Throwable): A): A {
    try {
      return callable()
    } catch(t: Throwable) {
      _logger.warn(\ -> "Caught an exception; error message=${t.Message}")
      _logger.debug(\ -> "Stacktrace: " + t.StackTraceAsString)
      if (orElse != null) {
        return orElse(t)
      }
      return null
    }
  }

  /**
   *   Invokes a block which does not return a value (i.e. runnable) and wraps it into a try-catch block.
   */
  @Param("runnable", "A block which does not return a value")
  @Param("orElse", "A block to invoke if the callable fails; may be null, in which case it is not invoked")
  static function runnableSafely(runnable(), orElse(t: Throwable)) {

    var wrappedRunnable = \ -> {
      runnable()
      return true
    }

    var wrappedError = \t: Throwable -> {
      if (orElse != null) {
        orElse(t)
      }
      return true
    }

    callableSafely<Boolean>(wrappedRunnable, wrappedError)
  }

  /**
   *   Invokes a block which does not return a value (i.e. runnable) and wraps it into a try-catch block.
   */
  @Param("runnable", "A block which does not return a value")
  static function runnableSafely(runnable()) {
    runnableSafely(runnable, null)
  }
}
