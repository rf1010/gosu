package gosu.logging

uses gosu.stacktrace.StackTraceElementEnhancement
uses org.slf4j.LoggerFactory
uses org.slf4j.Marker

uses java.lang.Throwable

class Logger implements org.slf4j.Logger {

  private static var _finder: LoggerFinder as finder = LoggerFinder.INSTANCE

  // default logger
  var _loggerName = Logger.ROOT_LOGGER_NAME
  var _logger = LoggerFactory.getLogger(_loggerName)

  private var _logDecorator: block(): String as readonly LogDecorator = \ -> {
    var stackTraceLine = StackTraceElementEnhancement
        .getWithOffset_ext(3).Decorator_ext
        .withStackTraceFormat(CLASS_FUNCTION)
        .DisplayName
    return stackTraceLine != null ? stackTraceLine + " : " : ""
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
   *  Allows to override the default log decorator (a block which evaluates to a string and get prepended to
   *  each log message (typically used to log class/package/function names, etc.).
   */
  function withDecorator(dec: block(): String): Logger {
    _logDecorator = dec
    return this
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
   *  Log at the trace level.
   */
  function trace(msgBlock: block(): String) {
    if ( TraceEnabled ) {
      _logger.trace("${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: String) {
    trace(\ -> p0)
  }

  /**
   *  Log at the trace level.
   */
  function trace(msgBlock: block(): String, p1: Object) {
    if ( TraceEnabled ) {
      _logger.trace("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: String, p1: Object) {
    trace(\ -> p0, p1)
  }

  /**
   *  Log at the trace level.
   */
  function trace(msgBlock: block(): String, p1: Object, p2: Object) {
    if ( TraceEnabled ) {
      _logger.trace("${LogDecorator()}${msgBlock()}", p1, p2)
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: String, p1: Object, p2: Object) {
    trace(\ -> p0, p1, p2)
  }

  /**
   *  Log at the trace level.
   */
  function trace(msgBlock: block(): String, p1: Throwable) {
    if ( TraceEnabled ) {
      _logger.trace("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: String, p1: Throwable) {
    trace(\ -> p0, p1)
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msgBlock: block(): String) {
    if ( TraceEnabled ) {
      _logger.trace(p0, "${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, p1: String) {
    trace(p0, \ -> p1)
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msgBlock: block(): String, p2: Object) {
    if ( TraceEnabled ) {
      _logger.trace(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, p1: String, p2: Object) {
    trace(p0, \ -> p1, p2)
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msgBlock: block(): String, p2: Object, p3: Object) {
    if ( TraceEnabled ) {
      _logger.trace(p0, "${LogDecorator()}${msgBlock()}", p2, p3)
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, p1: String, p2: Object, p3: Object) {
    trace(p0, \ -> p1, p2, p3)
  }

  /**
   *  Log at the trace level.
   */
  function trace(p0: Marker, msgBlock: block(): String, p2: Throwable) {
    if ( TraceEnabled ) {
      _logger.trace(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the trace level.
   */
  override function trace(p0: Marker, p1: String, p2: Throwable) {
    trace(p0, \ -> p1, p2)
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
   *  Log at the debug level.
   */
  function debug(msgBlock: block(): String) {
    if ( DebugEnabled ) {
      _logger.debug("${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: String) {
    debug(\ -> p0)
  }

  /**
   *  Log at the debug level.
   */
  function debug(msgBlock: block(): String, p1: Object) {
    if ( DebugEnabled ) {
      _logger.debug("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: String, p1: Object) {
    debug(\ -> p0, p1)
  }

  /**
   *  Log at the debug level.
   */
  function debug(msgBlock: block(): String, p1: Object, p2: Object) {
    if ( DebugEnabled ) {
      _logger.debug("${LogDecorator()}${msgBlock()}", p1, p2)
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: String, p1: Object, p2: Object) {
    debug(\ -> p0, p1, p2)
  }

  /**
   *  Log at the debug level.
   */
  function debug(msgBlock: block(): String, p1: Throwable) {
    if ( DebugEnabled ) {
      _logger.debug("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: String, p1: Throwable) {
    debug(\ -> p0, p1)
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msgBlock: block(): String) {
    if ( DebugEnabled ) {
      _logger.debug(p0, "${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, p1: String) {
    debug(p0, \ -> p1)
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msgBlock: block(): String, p2: Object) {
    if ( DebugEnabled ) {
      _logger.debug(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, p1: String, p2: Object) {
    debug(p0, \ -> p1, p2)
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msgBlock: block(): String, p2: Object, p3: Object) {
    if ( DebugEnabled ) {
      _logger.debug(p0, "${LogDecorator()}${msgBlock()}", p2, p3)
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, p1: String, p2: Object, p3: Object) {
    debug(p0, \ -> p1, p2, p3)
  }

  /**
   *  Log at the debug level.
   */
  function debug(p0: Marker, msgBlock: block(): String, p2: Throwable) {
    if ( DebugEnabled ) {
      _logger.debug(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the debug level.
   */
  override function debug(p0: Marker, p1: String, p2: Throwable) {
    debug(p0, \ -> p1, p2)
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
   *  Log at the info level.
   */
  function info(msgBlock: block(): String) {
    if ( InfoEnabled ) {
      _logger.info("${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: String) {
    info(\ -> p0)
  }

  /**
   *  Log at the info level.
   */
  function info(msgBlock: block(): String, p1: Object) {
    if ( InfoEnabled ) {
      _logger.info("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: String, p1: Object) {
    info(\ -> p0, p1)
  }

  /**
   *  Log at the info level.
   */
  function info(msgBlock: block(): String, p1: Object, p2: Object) {
    if ( InfoEnabled ) {
      _logger.info("${LogDecorator()}${msgBlock()}", p1, p2)
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: String, p1: Object, p2: Object) {
    info(\ -> p0, p1, p2)
  }

  /**
   *  Log at the info level.
   */
  function info(msgBlock: block(): String, p1: Throwable) {
    if ( InfoEnabled ) {
      _logger.info("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: String, p1: Throwable) {
    info(\ -> p0, p1)
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msgBlock: block(): String) {
    if ( InfoEnabled ) {
      _logger.info(p0, "${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, p1: String) {
    info(p0, \ -> p1)
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msgBlock: block(): String, p2: Object) {
    if ( InfoEnabled ) {
      _logger.info(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, p1: String, p2: Object) {
    info(p0, \ -> p1, p2)
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msgBlock: block(): String, p2: Object, p3: Object) {
    if ( InfoEnabled ) {
      _logger.info(p0, "${LogDecorator()}${msgBlock()}", p2, p3)
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, p1: String, p2: Object, p3: Object) {
    info(p0, \ -> p1, p2, p3)
  }

  /**
   *  Log at the info level.
   */
  function info(p0: Marker, msgBlock: block(): String, p2: Throwable) {
    if ( InfoEnabled ) {
      _logger.info(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the info level.
   */
  override function info(p0: Marker, p1: String, p2: Throwable) {
    info(p0, \ -> p1, p2)
  }

  /**
   *  Returns true if the warning level logging is enabled; false otherwise.
   */
  override property get WarnEnabled(): boolean {
    return _logger.WarnEnabled
  }

  /**
   *  Returns true if the warning level logging is enabled; false otherwise.
   */
  override function isWarnEnabled(p0: Marker): boolean {
    return WarnEnabled
  }

  /**
   *  Log at the warning level.
   */
  function warn(msgBlock: block(): String) {
    if ( WarnEnabled ) {
      _logger.warn("${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: String) {
    warn(\ -> p0)
  }

  /**
   *  Log at the warning level.
   */
  function warn(msgBlock: block(): String, p1: Object) {
    if ( WarnEnabled ) {
      _logger.warn("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: String, p1: Object) {
    warn(\ -> p0, p1)
  }

  /**
   *  Log at the warning level.
   */
  function warn(msgBlock: block(): String, p1: Object, p2: Object) {
    if ( WarnEnabled ) {
      _logger.warn("${LogDecorator()}${msgBlock()}", p1, p2)
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: String, p1: Object, p2: Object) {
    warn(\ -> p0, p1, p2)
  }

  /**
   *  Log at the warning level.
   */
  function warn(msgBlock: block(): String, p1: Throwable) {
    if ( WarnEnabled ) {
      _logger.warn("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: String, p1: Throwable) {
    warn(\ -> p0, p1)
  }

  /**
   *  Log at the warning level.
   */
  function warn(p0: Marker, msgBlock: block(): String) {
    if ( WarnEnabled ) {
      _logger.warn(p0, "${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: Marker, p1: String) {
    warn(p0, \ -> p1)
  }

  /**
   *  Log at the warning level.
   */
  function warn(p0: Marker, msgBlock: block(): String, p2: Object) {
    if ( WarnEnabled ) {
      _logger.warn(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: Marker, p1: String, p2: Object) {
    warn(p0, \ -> p1, p2)
  }

  /**
   *  Log at the warning level.
   */
  function warn(p0: Marker, msgBlock: block(): String, p2: Object, p3: Object) {
    if ( WarnEnabled ) {
      _logger.warn(p0, "${LogDecorator()}${msgBlock()}", p2, p3)
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: Marker, p1: String, p2: Object, p3: Object) {
    warn(p0, \ -> p1, p2, p3)
  }

  /**
   *  Log at the warning level.
   */
  function warn(p0: Marker, msgBlock: block(): String, p2: Throwable) {
    if ( WarnEnabled ) {
      _logger.warn(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the warning level.
   */
  override function warn(p0: Marker, p1: String, p2: Throwable) {
    warn(p0, \ -> p1, p2)
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
   *  Log at the error level.
   */
  function error(msgBlock: block(): String) {
    if ( ErrorEnabled ) {
      _logger.error("${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: String) {
    error(\ -> p0)
  }

  /**
   *  Log at the error level.
   */
  function error(msgBlock: block(): String, p1: Object) {
    if ( ErrorEnabled ) {
      _logger.error("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: String, p1: Object) {
    error(\ -> p0, p1)
  }

  /**
   *  Log at the error level.
   */
  function error(msgBlock: block(): String, p1: Object, p2: Object) {
    if ( ErrorEnabled ) {
      _logger.error("${LogDecorator()}${msgBlock()}", p1, p2)
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: String, p1: Object, p2: Object) {
    error(\ -> p0, p1, p2)
  }

  /**
   *  Log at the error level.
   */
  function error(msgBlock: block(): String, p1: Throwable) {
    if ( ErrorEnabled ) {
      _logger.error("${LogDecorator()}${msgBlock()}", p1)
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: String, p1: Throwable) {
    error(\ -> p0, p1)
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msgBlock: block(): String) {
    if ( ErrorEnabled ) {
      _logger.error(p0, "${LogDecorator()}${msgBlock()}")
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, p1: String) {
    error(p0, \ -> p1)
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msgBlock: block(): String, p2: Object) {
    if ( ErrorEnabled ) {
      _logger.error(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, p1: String, p2: Object) {
    error(p0, \ -> p1, p2)
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msgBlock: block(): String, p2: Object, p3: Object) {
    if ( ErrorEnabled ) {
      _logger.error(p0, "${LogDecorator()}${msgBlock()}", p2, p3)
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, p1: String, p2: Object, p3: Object) {
    error(p0, \ -> p1, p2, p3)
  }

  /**
   *  Log at the error level.
   */
  function error(p0: Marker, msgBlock: block(): String, p2: Throwable) {
    if ( ErrorEnabled ) {
      _logger.error(p0, "${LogDecorator()}${msgBlock()}", p2)
    }
  }

  /**
   *  Log at the error level.
   */
  override function error(p0: Marker, p1: String, p2: Throwable) {
    error(p0, \ -> p1, p2)
  }
}