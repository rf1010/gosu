package gosu.transaction.enhancements

uses gw.pl.persistence.core.Bundle

/**
 *  Provides useful abstractions which allow running functions which require Guidewire bundles under
 *  context of different users. This is particularly useful for Guidewire entity builders.
 */
class Run {

  /**
   *  Runs a function which requires a bundle and returns A (i.e. Callable) in the context of a User.
   */
  @Param("f", "A function which returns A and requires a Bundle")
  @Param("user", "User context to use when running a function")
  @Returns("A value of type A returned by a function")
  static function asUser<A>(f(b: Bundle): A, user: User): A {
    var result: A
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      result = f(bundle)
    }, user)
    return result
  }

  /**
   *  Runs a function which requires a bundle and returns A (i.e. Callable) in the context of the Unrestricted user.
   */
  @Param("f", "A function which returns A and requires a Bundle")
  @Returns("A value of type A returned by a function")
  static function asUnrestrictedUser<A>(f(b: Bundle): A): A {
    return asUser(f, User.util.UnrestrictedUser)
  }

  /**
   *  Runs a function which requires a bundle and returns A (i.e. Callable) in the context of the "Current" user.
   */
  @Param("f", "A function which returns A and requires a Bundle")
  @Returns("A value of type A returned by a function")
  static function asCurrentUser<A>(f(b: Bundle): A): A {
    return asUser(f, User.util.CurrentUser)
  }
}