package gosu.concurrent

uses com.guidewire.commons.entity.type.ThreadLocalBundleProvider
uses com.guidewire.pl.system.bundle.EntityBundleImpl
uses com.guidewire.pl.system.dependency.PLDependencies
uses gosu.concurrent.result.FutureResult
uses gosu.logging.Logger
uses gw.pl.persistence.core.Bundle

uses java.lang.Iterable

/**
 *  Runs callables in a context of a bundle either passed as a parameter (withBundle(XYZ)) or obtained implicitly.
 */
class ContextAwareConcurrentRunner<A> extends ConcurrentRunner<A> {

  private final var _logger = Logger.finder.APPLICATION
  private var _bundle: Bundle as readonly Bundle = DefaultBundle
  private var _user: User as User = DefaultUser
  private final static var _originalServiceToken = PLDependencies.CommonDependencies.ServiceToken

  /**
   *  Sets the bundle to be used by each thread local bundle provider
   */
  @Param("bundle", "Bundle to use")
  function withBundle(bundle: Bundle) {
    if (not isBundleValid(bundle)) {
      _logger.warn(\ -> "Bundle=${bundle} is not valid; using the default bundle=${_bundle}")
    } else {
      _bundle = bundle
    }
  }

  /**
   *  Sets the bundle to be used by each thread local bundle provider
   */
  @Param("user", "User to use for context")
  function withUser(user: User) {
    if (user == null) {
      _logger.warn(\ -> "User=${user} is not valid; using the default user=${_user}")
    } else {
      _user = user
    }
  }

  /**
   *  Sets the thread local bundle provider for each task item (callable) and submits them for execution
   *  in separate threads
   */
  @Param("callables", "An iterable of blocks, each of which implementing Callable and returning a result")
  @Returns("A reference to the ")
  override function run(callables: Iterable<block(): A>): Iterable<FutureResult> {
    _logger.trace(\ -> "Starting")

    var wrapped = callables.map(\callable -> \ ->  {
      setBundleProvider()
      setUserAuthContext()
      var result = callable()
      restoreUserAuthContext()
      clearBundleProvider()
      return result
    })

    var result = super.run(wrapped)
    _logger.trace(\ -> "Finished")
    return result
  }

  /**
   *  Returns the default bundle, if not set by withBundle(XYZ).
   */
  private static property get DefaultBundle(): Bundle {
    var bundle = gw.transaction.Transaction.Current
    var needNewBundle = \ -> isBundleValid(bundle)
    return needNewBundle() ? new EntityBundleImpl() : bundle
  }

  private function setBundleProvider() {
    ThreadLocalBundleProvider.set(_bundle)
  }

  private function clearBundleProvider() {
    ThreadLocalBundleProvider.clear()
  }

  private static function isBundleValid(bundle: Bundle): boolean {
    return not (bundle == null or bundle.ReadOnly)
  }

  private function setUserAuthContext() {
    var authToken  = PLDependencies.ServiceTokenManager.createAuthenticatedToken(_user as Key)
    PLDependencies.CommonDependencies.setServiceToken(authToken)
  }

  private function restoreUserAuthContext() {
    PLDependencies.CommonDependencies.setServiceToken(_originalServiceToken)
  }

  private static property get DefaultUser(): User {
    return entity.User.util.CurrentUser
  }
}