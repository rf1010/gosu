package gosu.logging

uses org.slf4j.LoggerFactory
uses org.slf4j.Marker

uses java.lang.StackTraceElement
uses java.lang.Throwable

class Logger implements org.slf4j.Logger {

  private static var _finder: LoggerFinder as finder = LoggerFinder.INSTANCE

  // default logger
  var _loggerName = Logger.ROOT_LOGGER_NAME
  var _logger = LoggerFactory.getLogger(_loggerName)

  private static function decorator(offset: int = 5): block(): String {
    return \ -> StackTraceElement.getWithOffset_ext(offset).Decorator_ext.DisplayName
  }

  private static function decorateMsg(msg: String, decorator(): String): String {
    var logDecoration = decorator != null ? decorator() : null
    return logDecoration != null ? "${logDecoration} : ${msg}" : msg
  }

  private construct() {
  }

  private construct(name: String) {
    _loggerName = name
    _logger = LoggerFactory.getLogger(_loggerName)
  }

  private construct(logger: Logger) {
    _logger = logger
    _loggerName = logger.Name
  }

  /**
   *  Init logger with the name passed as a parameter
   */
  static function initLogger(name: String): Logger {
    return new Logger(name)
  }

  /**
   *  Init logger with the logger passed as a parameter
   */
  static function initLogger(logger: Logger): Logger {
    return new Logger(logger)
  }

  /**
   * Returns the name of the logger.
   */
  override property get Name(): String {
    return _loggerName
  }

  /**
   *  Returns true if the trace level logging is enabled; false otherwise.
   */
  override property get TraceEnabled(): boolean {
    return _logger.TraceEnabled
  }

  /**
   *  Returns true if the trace level logging is enabled; false otherwise.
   */
  override function isTraceEnabled(p0: Marker): boolean {
    return TraceEnabled
  }

  /**
   *  A private function to dispatch a logging statement.
   */
  private function traceWithDecoration(msgBlock(): String, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(decorateMsg(msgBlock(), decorator))
    }
  }

  private function traceWithDecoration(msgBlock(): String, p1: Object, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function traceWithDecoration(msgBlock(): String, p1: Object, p2: Object, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(decorateMsg(msgBlock(), decorator), p1, p2)
    }
  }

  private function traceWithDecoration(msgBlock(): String, p1: Throwable, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function traceWithDecoration(p0: Marker, msgBlock(): String, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(p0, decorateMsg(msgBlock(), decorator))
    }
  }

  private function traceWithDecoration(p0: Marker, msgBlock(): String, p2: Object, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function traceWithDecoration(p0: Marker, msgBlock(): String, p2: Object, p3: Object, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function traceWithDecoration(p0: Marker, msgBlock(): String, p2: Throwable, decorator(): String) {
    if (TraceEnabled) {
      _logger.trace(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  /**
   *  Log at the trace level.
   */
  function trace(msg(): String) {
    traceWithDecoration(msg, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(msg: String) {
    traceWithDecoration(\ -> msg, decorator())
  }

  /**
   *  Log at the trace level.
   */
  function trace(msg(): String, p1: Object) {
    traceWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(msg: String, p1: Object) {
    traceWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the trace level.
   */
  function trace(msg(): String, p1: Object, p2: Object) {
    traceWithDecoration(msg, p1, p2, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(msg: String, p1: Object, p2: Object) {
    traceWithDecoration(\ -> msg, p1, p2, decorator())
  }

  /**
   *  Log at the trace level.
   */
  function trace(msg(): String, p1: Throwable) {
    traceWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(msg: String, p1: Throwable) {
    traceWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msg(): String) {
    traceWithDecoration(p0, msg, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, msg: String) {
    traceWithDecoration(p0, \ -> msg, decorator())
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msg(): String, p2: Object) {
    traceWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, msg: String, p2: Object) {
    traceWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msg(): String, p2: Object, p3: Object) {
    traceWithDecoration(p0, msg, p2, p3, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, msg: String, p2: Object, p3: Object) {
    traceWithDecoration(p0, \ -> msg, p2, p3, decorator())
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msg(): String, p2: Throwable) {
    traceWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, msg: String, p2: Throwable) {
    traceWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Returns true if the debug level logging is enabled; false otherwise.
   */
  override property get DebugEnabled(): boolean {
    return _logger.DebugEnabled
  }

  /**
   *  Returns true if the debug level logging is enabled; false otherwise.
   */
  override function isDebugEnabled(p0: Marker): boolean {
    return DebugEnabled
  }

  /**
   *  A private function to dispatch a logging statement.
   */
  private function debugWithDecoration(msgBlock(): String, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(decorateMsg(msgBlock(), decorator))
    }
  }

  private function debugWithDecoration(msgBlock(): String, p1: Object, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function debugWithDecoration(msgBlock(): String, p1: Object, p2: Object, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(decorateMsg(msgBlock(), decorator), p1, p2)
    }
  }

  private function debugWithDecoration(msgBlock(): String, p1: Throwable, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function debugWithDecoration(p0: Marker, msgBlock(): String, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(p0, decorateMsg(msgBlock(), decorator))
    }
  }

  private function debugWithDecoration(p0: Marker, msgBlock(): String, p2: Object, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function debugWithDecoration(p0: Marker, msgBlock(): String, p2: Object, p3: Object, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function debugWithDecoration(p0: Marker, msgBlock(): String, p2: Throwable, decorator(): String) {
    if (DebugEnabled) {
      _logger.debug(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  /**
   *  Log at the debug level.
   */
  function debug(msg(): String) {
    debugWithDecoration(msg, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(msg: String) {
    debugWithDecoration(\ -> msg, decorator())
  }

  /**
   *  Log at the debug level.
   */
  function debug(msg(): String, p1: Object) {
    debugWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(msg: String, p1: Object) {
    debugWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the debug level.
   */
  function debug(msg(): String, p1: Object, p2: Object) {
    debugWithDecoration(msg, p1, p2, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(msg: String, p1: Object, p2: Object) {
    debugWithDecoration(\ -> msg, p1, p2, decorator())
  }

  /**
   *  Log at the debug level.
   */
  function debug(msg(): String, p1: Throwable) {
    debugWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(msg: String, p1: Throwable) {
    debugWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msg(): String) {
    debugWithDecoration(p0, msg, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, msg: String) {
    debugWithDecoration(p0, \ -> msg, decorator())
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msg(): String, p2: Object) {
    debugWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, msg: String, p2: Object) {
    debugWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msg(): String, p2: Object, p3: Object) {
    debugWithDecoration(p0, msg, p2, p3, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, msg: String, p2: Object, p3: Object) {
    debugWithDecoration(p0, \ -> msg, p2, p3, decorator())
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msg(): String, p2: Throwable) {
    debugWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, msg: String, p2: Throwable) {
    debugWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Returns true if the info level logging is enabled; false otherwise.
   */
  override property get InfoEnabled(): boolean {
    return _logger.InfoEnabled
  }

  /**
   *  Returns true if the info level logging is enabled; false otherwise.
   */
  override function isInfoEnabled(p0: Marker): boolean {
    return InfoEnabled
  }

  /**
   *  A private function to dispatch a logging statement.
   */
  private function infoWithDecoration(msgBlock(): String, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(decorateMsg(msgBlock(), decorator))
    }
  }

  private function infoWithDecoration(msgBlock(): String, p1: Object, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function infoWithDecoration(msgBlock(): String, p1: Object, p2: Object, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(decorateMsg(msgBlock(), decorator), p1, p2)
    }
  }

  private function infoWithDecoration(msgBlock(): String, p1: Throwable, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function infoWithDecoration(p0: Marker, msgBlock(): String, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(p0, decorateMsg(msgBlock(), decorator))
    }
  }

  private function infoWithDecoration(p0: Marker, msgBlock(): String, p2: Object, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function infoWithDecoration(p0: Marker, msgBlock(): String, p2: Object, p3: Object, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function infoWithDecoration(p0: Marker, msgBlock(): String, p2: Throwable, decorator(): String) {
    if (InfoEnabled) {
      _logger.info(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  /**
   *  Log at the info level.
   */
  function info(msg(): String) {
    infoWithDecoration(msg, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(msg: String) {
    infoWithDecoration(\ -> msg, decorator())
  }

  /**
   *  Log at the info level.
   */
  function info(msg(): String, p1: Object) {
    infoWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(msg: String, p1: Object) {
    infoWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the info level.
   */
  function info(msg(): String, p1: Object, p2: Object) {
    infoWithDecoration(msg, p1, p2, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(msg: String, p1: Object, p2: Object) {
    infoWithDecoration(\ -> msg, p1, p2, decorator())
  }

  /**
   *  Log at the info level.
   */
  function info(msg(): String, p1: Throwable) {
    infoWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(msg: String, p1: Throwable) {
    infoWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msg(): String) {
    infoWithDecoration(p0, msg, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, msg: String) {
    infoWithDecoration(p0, \ -> msg, decorator())
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msg(): String, p2: Object) {
    infoWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, msg: String, p2: Object) {
    infoWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msg(): String, p2: Object, p3: Object) {
    infoWithDecoration(p0, msg, p2, p3, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, msg: String, p2: Object, p3: Object) {
    infoWithDecoration(p0, \ -> msg, p2, p3, decorator())
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msg(): String, p2: Throwable) {
    infoWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, msg: String, p2: Throwable) {
    infoWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Returns true if the warn level logging is enabled; false otherwise.
   */
  override property get WarnEnabled(): boolean {
    return _logger.WarnEnabled
  }

  /**
   *  Returns true if the warn level logging is enabled; false otherwise.
   */
  override function isWarnEnabled(p0: Marker): boolean {
    return WarnEnabled
  }

  /**
   *  A private function to dispatch a logging statement.
   */
  private function warnWithDecoration(msgBlock(): String, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(decorateMsg(msgBlock(), decorator))
    }
  }

  private function warnWithDecoration(msgBlock(): String, p1: Object, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function warnWithDecoration(msgBlock(): String, p1: Object, p2: Object, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(decorateMsg(msgBlock(), decorator), p1, p2)
    }
  }

  private function warnWithDecoration(msgBlock(): String, p1: Throwable, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function warnWithDecoration(p0: Marker, msgBlock(): String, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(p0, decorateMsg(msgBlock(), decorator))
    }
  }

  private function warnWithDecoration(p0: Marker, msgBlock(): String, p2: Object, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function warnWithDecoration(p0: Marker, msgBlock(): String, p2: Object, p3: Object, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function warnWithDecoration(p0: Marker, msgBlock(): String, p2: Throwable, decorator(): String) {
    if (WarnEnabled) {
      _logger.warn(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  /**
   *  Log at the warn level.
   */
  function warn(msg(): String) {
    warnWithDecoration(msg, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(msg: String) {
    warnWithDecoration(\ -> msg, decorator())
  }

  /**
   *  Log at the warn level.
   */
  function warn(msg(): String, p1: Object) {
    warnWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(msg: String, p1: Object) {
    warnWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the warn level.
   */
  function warn(msg(): String, p1: Object, p2: Object) {
    warnWithDecoration(msg, p1, p2, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(msg: String, p1: Object, p2: Object) {
    warnWithDecoration(\ -> msg, p1, p2, decorator())
  }

  /**
   *  Log at the warn level.
   */
  function warn(msg(): String, p1: Throwable) {
    warnWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(msg: String, p1: Throwable) {
    warnWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the warn level.
   */
  function warn(p0: Marker, msg(): String) {
    warnWithDecoration(p0, msg, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(p0: Marker, msg: String) {
    warnWithDecoration(p0, \ -> msg, decorator())
  }

  /**
   *  Log at the warn level.
   */
  function warn(p0: Marker, msg(): String, p2: Object) {
    warnWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(p0: Marker, msg: String, p2: Object) {
    warnWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Log at the warn level.
   */
  function warn(p0: Marker, msg(): String, p2: Object, p3: Object) {
    warnWithDecoration(p0, msg, p2, p3, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(p0: Marker, msg: String, p2: Object, p3: Object) {
    warnWithDecoration(p0, \ -> msg, p2, p3, decorator())
  }

  /**
   *  Log at the warn level.
   */
  function warn(p0: Marker, msg(): String, p2: Throwable) {
    warnWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the warn level.
   */
  override function warn(p0: Marker, msg: String, p2: Throwable) {
    warnWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Returns true if the error level logging is enabled; false otherwise.
   */
  override property get ErrorEnabled(): boolean {
    return _logger.ErrorEnabled
  }

  /**
   *  Returns true if the error level logging is enabled; false otherwise.
   */
  override function isErrorEnabled(p0: Marker): boolean {
    return ErrorEnabled
  }

  /**
   *  A private function to dispatch a logging statement.
   */
  private function errorWithDecoration(msgBlock(): String, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(decorateMsg(msgBlock(), decorator))
    }
  }

  private function errorWithDecoration(msgBlock(): String, p1: Object, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function errorWithDecoration(msgBlock(): String, p1: Object, p2: Object, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(decorateMsg(msgBlock(), decorator), p1, p2)
    }
  }

  private function errorWithDecoration(msgBlock(): String, p1: Throwable, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(decorateMsg(msgBlock(), decorator), p1)
    }
  }

  private function errorWithDecoration(p0: Marker, msgBlock(): String, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(p0, decorateMsg(msgBlock(), decorator))
    }
  }

  private function errorWithDecoration(p0: Marker, msgBlock(): String, p2: Object, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function errorWithDecoration(p0: Marker, msgBlock(): String, p2: Object, p3: Object, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  private function errorWithDecoration(p0: Marker, msgBlock(): String, p2: Throwable, decorator(): String) {
    if (ErrorEnabled) {
      _logger.error(p0, decorateMsg(msgBlock(), decorator), p2)
    }
  }

  /**
   *  Log at the error level.
   */
  function error(msg(): String) {
    errorWithDecoration(msg, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(msg: String) {
    errorWithDecoration(\ -> msg, decorator())
  }

  /**
   *  Log at the error level.
   */
  function error(msg(): String, p1: Object) {
    errorWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(msg: String, p1: Object) {
    errorWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the error level.
   */
  function error(msg(): String, p1: Object, p2: Object) {
    errorWithDecoration(msg, p1, p2, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(msg: String, p1: Object, p2: Object) {
    errorWithDecoration(\ -> msg, p1, p2, decorator())
  }

  /**
   *  Log at the error level.
   */
  function error(msg(): String, p1: Throwable) {
    errorWithDecoration(msg, p1, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(msg: String, p1: Throwable) {
    errorWithDecoration(\ -> msg, p1, decorator())
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msg(): String) {
    errorWithDecoration(p0, msg, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, msg: String) {
    errorWithDecoration(p0, \ -> msg, decorator())
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msg(): String, p2: Object) {
    errorWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, msg: String, p2: Object) {
    errorWithDecoration(p0, \ -> msg, p2, decorator())
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msg(): String, p2: Object, p3: Object) {
    errorWithDecoration(p0, msg, p2, p3, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, msg: String, p2: Object, p3: Object) {
    errorWithDecoration(p0, \ -> msg, p2, p3, decorator())
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msg(): String, p2: Throwable) {
    errorWithDecoration(p0, msg, p2, decorator())
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, msg: String, p2: Throwable) {
    errorWithDecoration(p0, \ -> msg, p2, decorator())
  }
}