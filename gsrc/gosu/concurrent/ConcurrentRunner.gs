package gosu.concurrent

uses com.google.common.util.concurrent.FutureCallback
uses com.google.common.util.concurrent.Futures
uses com.google.common.util.concurrent.MoreExecutors
uses gosu.concurrent.result.FutureFailure
uses gosu.concurrent.result.FutureResult
uses gosu.concurrent.result.FutureSuccess
uses gosu.logging.Logger

uses java.lang.Iterable
uses java.lang.Throwable
uses java.util.concurrent.CountDownLatch
uses java.util.concurrent.Executors
uses java.util.concurrent.TimeUnit
uses java.util.concurrent.CopyOnWriteArrayList

class ConcurrentRunner<A> {

  private static final var _logger = Logger.finder.APPLICATION

  private final var _executorService = MoreExecutors.listeningDecorator(Executors.newCachedThreadPool())
  private final var _futureCallback = buildCallback()
  private var _computationResult: CopyOnWriteArrayList<FutureResult> = {}
  private var _callables: Iterable<block(): A> = {}
  private var _doneSignal: CountDownLatch = null
  private var _timeoutValue = 60L
  private var _timeoutUnit = TimeUnit.SECONDS

  /**
   *  Submits runnable blocks for execution in separate threads.
  */
  @Param("callables", "An iterable of blocks, each of which implementing Callable and returning a result")
  @Returns("A reference to the ")
  function run(callables: Iterable<block(): A>): Iterable<FutureResult> {
    _logger.trace(\ -> "Starting")
    _callables = callables
    _doneSignal = new CountDownLatch(_callables.Count)
    _callables.each(\callable -> {
      var futureTask = _executorService.submit<A>(callable as block(): A)
      Futures.addCallback(futureTask, _futureCallback)
    })
    _logger.trace(\ -> "Finished")
    return _computationResult
  }

  /**
   *  Blocks execution until all runnables are completed (either successfully or failed),
   *  or the timeout is reached.
   */
  @Param("terminate", "Whether to terminate the executor service after completion")
  @Returns("An interable of computation results, either success (with the value) or failure(with the exception)")
  function collect(terminate: boolean = true): List<FutureResult> {
    _logger.trace(\ -> "Starting")
    _doneSignal.await(_timeoutValue, _timeoutUnit)

    if (_callables.Count != _computationResult.Count) {
      _logger.warn(\ -> "${_computationResult.Count} out of ${_callables.Count} " +
        "calculations were completed before the timeout was reached.")
    }

    if (terminate) {
      _futureCallback.onComplete()
    }
    _logger.trace(\ -> "Finished")
    return _computationResult
  }

  /**
   *  Sets the timeout used to wait until all computations are completed when calling the blocking collect()
   *  method.
   */
  @Param("timeoutValue", "The value of timeout, i.e. 60 (seconds)")
  @Param("timeUnit", "Time unit to interpret the timeout value")
  function withTimeout(timeoutValue: long, timeUnit: TimeUnit) {
    if (timeoutValue != null and timeUnit != null) {
      _timeoutValue = timeoutValue
      _timeoutUnit = timeUnit
    } else {
      _logger.error(\ -> "Input parameters for timeout value=${timeoutValue} " +
        "or time unit=${timeUnit} are incorrect; the defaults will be used.")
    }
  }

  /**
   *  Builds a callback object which knows how to handle successes and failures.
   */
  private function buildCallback(): FutureCallbackImpl<A> {
    _logger.trace(\ -> "Started")
    var result =
      new FutureCallbackImpl<A>(\result: A -> _computationResult.add(new FutureSuccess<A>(result)),
        \throwable: Throwable -> _computationResult.add(new FutureFailure<Throwable>(throwable)))
    _logger.trace(\ -> "Finished")
    return result
  }

  /**
   * This class is a wrapper for FutureCallback actions.
  */
  class FutureCallbackImpl<B> implements FutureCallback<B> {

    private var _onSuccessHandler: block(a: B) = null
    private var _onFailureHandler: block(t: Throwable) = null

    construct(onSuccess: block(a: B), onFailure: block(t: Throwable)) {
      _onSuccessHandler = onSuccess
      _onFailureHandler = onFailure
    }

    /**
     * How to handle a successful value.
     */
    override function onSuccess(val: B) {
      this.outer._doneSignal.countDown()
      if (_onSuccessHandler != null) {
        _onSuccessHandler(val)
      }
    }

    /**
     * How to handle a failure.
     */
    override function onFailure(throwable: Throwable) {
      this.outer._doneSignal.countDown()
      if (_onFailureHandler != null) {
        _onFailureHandler(throwable)
      }
    }

    /**
     *  A hook to shutdown the service.
     */
    function onComplete() {
      this.outer._executorService.shutdown()
    }
  }
}