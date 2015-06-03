package gosu.functional

uses java.lang.Exception
uses java.lang.IllegalArgumentException

/**
 * A collection of (mostly) static functions which provides common validation features.
 */
class Validation {

  final private static var illegalArgumentExceptionThrower = \msg: String -> { throw new IllegalArgumentException(msg) }

  /**
   * Validates that the "mustBeTrue" block evaluates to true; otherwise, evaluates the "orElse" block.
   * If the "safely" parameter is set to true, equates the failure (exception) to the evaluation
   * which returns false (in which case the "orElse" block is evaluated).
  */
  @Param("mustBeTrue", "A block to evaluate which is expected to return true")
  @Param("orElse", "A block to execute if the 'mustBeTrue' returns false")
  @Param("safely", "Whether any exceptions are intercepted in the mustBeTrue block")
  static function require (mustBeTrue: block(): boolean, orElse: block(), safely: boolean) {
    var mustBeTrueResult = false
    try {
      mustBeTrueResult = mustBeTrue()
    } catch(e: Exception) {
      if (not safely) {
        throw e
      }
    }
    if (not mustBeTrueResult) {
      orElse()
    }
  }

  /**
   * Validates that the "mustBeTrue" block evaluates to true; otherwise, evaluates the "orElse" block.
   * The "orElse" block is evaluated if an exception is thrown during the "mustBeTrue" evaluation.
   */
  @Param("mustBeTrue", "A block to evaluate which is expected to return true")
  @Param("orElse", "A block to execute if the 'mustBeTrue' returns false")
  static function require (mustBeTrue: block(): boolean, orElse: block()) {
    require(mustBeTrue, orElse, true)
  }

  /**
   * Validates that the "mustBeTrue" block evaluates to true; otherwise, throws an IllegalArgumentException
   * with the error specified by the errorMsg parameter.
   * If the "safely" parameter is set to true, equates the failure (exception) to the evaluation
   * which returns false (in which case the "orElse" block is evaluated).
   */
  @Param("mustBeTrue", "A block to evaluate which is expected to return true")
  @Param("errorMsg", "An error message to be used with the IllegalArgumentException if the 'mustBeTrue' returns false")
  @Param("safely", "Whether any exceptions are intercepted in the mustBeTrue block")
  static function require (mustBeTrue: block(): boolean, errorMsg: String, safely: boolean) {
    require(mustBeTrue, \ -> illegalArgumentExceptionThrower(errorMsg), safely)
  }

  /**
   * Validates that the "mustBeTrue" block evaluates to true; otherwise, throws an IllegalArgumentException
   * with the error specified by the errorMsg parameter.
   * The "orElse" block is evaluated if an exception is thrown during the "mustBeTrue" evaluation.
   */
  @Param("mustBeTrue", "A block to evaluate which is expected to return true")
  @Param("errorMsg", "An error message to be used with the IllegalArgumentException if the 'mustBeTrue' returns false")
  static function require (mustBeTrue: block(): boolean, errorMsg: String) {
    require(mustBeTrue, \ -> illegalArgumentExceptionThrower(errorMsg), true)
  }
}