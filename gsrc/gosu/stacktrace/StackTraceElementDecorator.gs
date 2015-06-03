package gosu.stacktrace

uses java.util.Map
uses java.lang.StackTraceElement

/**
 *   java.lang.StackTraceElement is final and therefore cannot be extended.
 *   This class wraps StackTraceElement and provides additional properties,
 *   such as ability to split package and class names, as well as
 *   provide DisplayName suitable for logging, error message formatting, etc.
 */
class StackTraceElementDecorator {

  private var _stackTraceElement: StackTraceElement as readonly StackTraceElement = null
  private var _defaultStackTraceFormat: StackTraceElementFormat as readonly StackTraceFormat = CLASS_FUNCTION_LINE
  private var _stackTraceFormatter: block(ste: StackTraceElement): String as readonly Formatter
      = \st: StackTraceElement -> _defaultFormatterConfig[_defaultStackTraceFormat]()

  private final var _defaultFormatterConfig: Map<StackTraceElementFormat, block(): String> = {
    PACKAGE_CLASS_FUNCTION_FILE_LINE
                       -> \ -> "${PackageName}.${ClassName}->${FunctionName}, ${FileName}:${LineNumber}",
    PACKAGE_CLASS_FUNCTION_FILE -> \ -> "${PackageName}.${ClassName}->${FunctionName}, ${FileName}",
    PACKAGE_CLASS_FUNCTION_LINE -> \ -> "${PackageName}.${ClassName}->${FunctionName}, line: ${LineNumber}",
    PACKAGE_CLASS_FILE          -> \ -> "${PackageName}.${ClassName}->${FunctionName}, ${FileName}",
    PACKAGE_CLASS_FUNCTION      -> \ -> "${PackageName}.${ClassName}->${FunctionName}",
    PACKAGE_CLASS               -> \ -> "${PackageName}.${ClassName}",
    PACKAGE                     -> \ -> "${PackageName}",
    CLASS_FUNCTION_FILE_LINE    -> \ -> "${ClassName}->${FunctionName}, ${FileName}:${LineNumber}",
    CLASS_FUNCTION_LINE         -> \ -> "${ClassName}->${FunctionName}, line: ${LineNumber}",
    CLASS_FUNCTION_FILE         -> \ -> "${ClassName}->${FunctionName}, ${FileName}",
    CLASS_FUNCTION              -> \ -> "${ClassName}->${FunctionName}",
    CLASS_FILE                  -> \ -> "${ClassName}, ${FileName}",
    CLASS                       -> \ -> "${ClassName}",
    FUNCTION_FILE_LINE          -> \ -> "${FunctionName}, ${FileName}:${LineNumber}",
    FUNCTION_FILE               -> \ -> "${FunctionName}, ${FileName}",
    FUNCTION_LINE               -> \ -> "${FunctionName}, line: ${LineNumber}",
    FUNCTION                    -> \ -> "${FunctionName}",
    FILE_LINE                   -> \ -> "${FileName}:${LineNumber}",
    LINE                        -> \ -> "line: ${LineNumber}"
  }

  private construct() {
  }

  /**
   *  Builds a new instance of decorator from a stack element
   */
  @Param("stackTraceElement", "Element to decorate")
  @Returns("A new instance of decorator")
  static function buildFrom(stackTraceElement: StackTraceElement): StackTraceElementDecorator {
    return new StackTraceElementDecorator() {
      :_stackTraceElement = stackTraceElement
    }
  }

  /**
   *  Allows to set the stack trace format to one fo the pre-defined formats.
   */
  function withStackTraceFormat(stackTraceFormat: StackTraceElementFormat): StackTraceElementDecorator {
    if (stackTraceFormat != null) {
      _defaultStackTraceFormat = stackTraceFormat
    }
    return this
  }

  /**
   *  Allows to set the stack trace format to one fo the pre-defined formats.
   */
  function withStackTraceFormatter(stackTraceFormatter: block(ste: StackTraceElement): String):
      StackTraceElementDecorator {
    if (stackTraceFormatter != null) {
      _stackTraceFormatter = stackTraceFormatter
    }
    return this
  }

  /**
   *  toString implementation which knows how to format this object to a string.
   */
  override function toString(): String {
    return _stackTraceFormatter(null)
  }

  /**
   *  An alias for toString().
   */
  property get DisplayName(): String {
    return toString()
  }

  /**
   *  The package name, if known.
   */
  property get PackageName(): String {
    var className = _stackTraceElement.ClassName
    var pkg = \ -> {
      return className != null and className.lastIndexOf(".") > 2
        ? className.substring(0, className.lastIndexOf(".") - 1)
        : null
    }
    return getOrElseUnknown(pkg())
  }

  /**
   *  The class name, if known.
   */
  property get ClassName(): String {
    var className = _stackTraceElement.ClassName
    var cls = \ -> {
      return className != null and className.lastIndexOf(".") > 0
          ? className.substring(className.lastIndexOf(".") + 1)
          : null
    }
    return getOrElseUnknown(cls())
  }

  /**
   * The function/method name, if known.
   */
  property get FunctionName(): String {
    return getOrElseUnknown(_stackTraceElement.MethodName)
  }

  /**
   * The source file name, if known.
   */
  property get FileName(): String {
    return getOrElseUnknown(_stackTraceElement.FileName)
  }

  /**
   *  The line number in source.
   */
  property get LineNumber(): int {
    return _stackTraceElement.LineNumber
  }

  private function getOrElseUnknown(inputParam: String): String {
    return inputParam == null ? "Unknown" : inputParam
  }

  enum StackTraceElementFormat {
    PACKAGE_CLASS_FUNCTION_FILE_LINE,
    PACKAGE_CLASS_FUNCTION_FILE,
    PACKAGE_CLASS_FUNCTION_LINE,
    PACKAGE_CLASS_FUNCTION,
    PACKAGE_CLASS_FILE,
    PACKAGE_CLASS,
    PACKAGE,
    CLASS_FUNCTION_FILE_LINE,
    CLASS_FUNCTION_LINE,
    CLASS_FUNCTION_FILE,
    CLASS_FUNCTION,
    CLASS_FILE,
    CLASS,
    FUNCTION_FILE_LINE,
    FUNCTION_LINE,
    FUNCTION_FILE,
    FUNCTION,
    FILE_LINE,
    LINE
  }
}