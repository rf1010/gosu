package gosu.stacktrace

uses java.lang.Thread
uses java.lang.Integer
uses java.lang.StackTraceElement

enhancement StackTraceElementEnhancement : java.lang.StackTraceElement {

  /**
   *  Returns a decorator for a stack trace element.
   */
  property get Decorator_ext(): StackTraceElementDecorator {
    return StackTraceElementDecorator.buildFrom(this)
  }

  /**
   *  Obtains the stack trace element with the offset and the default stack trace format.
   */
  @Param("offset", "Gets added or removed from the base stack trace index")
  @Returns("Returns stack trace offset")
  static function getWithOffset_ext(offset: int): StackTraceElement {
    return Thread.currentThread().StackTrace[determineBaseStackTraceIndex() + offset]
  }

  private static function determineBaseStackTraceIndex(): Integer {
    var me = StackTraceElementEnhancement.Type.Name

    for (var frame in Thread.currentThread().StackTrace index idx) {
      if (frame.ClassName == me) {
        return idx
      }
    }
    return null
  }
}
