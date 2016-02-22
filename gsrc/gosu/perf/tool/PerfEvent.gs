package gosu.perf.tool

uses java.lang.Long
uses java.lang.System
uses java.util.Date

class PerfEvent {

  final var _dateTime: long as readonly DateTime = System.currentTimeMillis()

  var _serverId: String as readonly ServerId = null
  var _id: String as readonly BusinessId = null
  var _className: String as readonly ClassName = null
  var _functionName: String as readonly FunctionName = null
  var _duration: Long as readonly Duration = null

  private construct() {
  }

  /**
   *  Constructs a new object from the required variables.
   */
  static function buildFrom(businessId: String, serverId: String, className: String,
                            functionName: String, duration: Long): PerfEvent {
    return new PerfEvent() {
      :_functionName = functionName,
      :_className = className,
      :_id = businessId,
      :_duration = duration,
      :_serverId = serverId
    }
  }

  /**
   * Overrides the toString implementation to show details.
   */
  override function toString(): String {
    var formattedDate = new Date(_dateTime).asString_ext("yyyy-MM-dd HH:mm:ss.SSS")
    return
        "DateTime=${formattedDate}, ServerID=${_serverId}, BusinessIdentifier=${_id}, " +
        "ClassName=${_className}, FunctionName=${_functionName}, " +
        "Duration=${_duration}"
  }
}