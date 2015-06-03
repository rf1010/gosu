package gosu.lang.enhancements

uses java.util.ArrayList
uses java.util.EnumSet
uses java.util.LinkedHashMap
uses java.util.Map
uses java.lang.Long
uses java.util.concurrent.TimeUnit
uses java.util.Date

enhancement DateEnhancement: java.util.Date {

  /**
   * Displays the duration between two time units expressed in some base time unit, and
   * formatted as X Days Y Hours Z Minutes, etc. The required time units
   * parameter indicates which time units are to be included in the format.
   */
  @Param("start", "Start in base time units")
  @Param("end", "End in base time units")
  @Param("requiredTimeUnits", "The time unit constants from the TimeUnit enumeration")
  @Returns("A formatted string which represents the duration between two time units")
  static function getDurationAsString_ext(start: Long,
                                          end: Long,
                                          baseTimeUnit: TimeUnit,
                                          requiredTimeUnits: List<TimeUnit>): String {
    var calcDuration = computeDurationTimeUnits_ext(start, end, baseTimeUnit)
    return formatDurationAsString_ext(calcDuration, requiredTimeUnits)
  }

  /**
   * Displays the duration expressed in some base time unit, and
   * formatted as X Days Y Hours Z Minutes, etc. The required time units
   * parameter indicates which time units are to be included in the format.
   */
  @Param("duration", "Duration in base time units")
  @Param("requiredTimeUnits", "The time unit constants from the TimeUnit enumeration")
  @Returns("A formatted string which represents the duration")
  static function getDurationAsString_ext(duration: Long,
                                          baseTimeUnit: TimeUnit,
                                          requiredTimeUnits: List<TimeUnit>): String {
    var calcDuration = computeDurationTimeUnits_ext(duration, baseTimeUnit)
    return formatDurationAsString_ext(calcDuration, requiredTimeUnits)
  }

  /**
   * Displays the duration expressed in some base time unit, and
   * formatted as X Days Y Hours Z Minutes, etc.
   */
  @Param("duration", "Duration in base time units")
  @Param("requiredTimeUnits", "The time unit constants from the TimeUnit enumeration")
  @Returns("A formatted string which represents the duration")
  static function getDurationAsString_ext(duration: Long,
                                          baseTimeUnit: TimeUnit): String {

    // all time units
    var requiredTimeUnits = EmptyTimeUnitsMap.Keys.toList()
    return getDurationAsString_ext(duration, baseTimeUnit, requiredTimeUnits)
  }

  /**
   * Displays the duration between two dates, formatted as X Days Y Hours Z Minutes, etc. The required time units
   * parameter indicates which time units are to be included in the format.
   */
  @Param("startDate", "Start date")
  @Param("endDate", "End date")
  @Param("requiredTimeUnits", "The time unit constants from the TimeUnit enumeration")
  @Returns("A formatted string which represents the duration between two dates")
  static function getDurationAsString_ext(startDate: Date, endDate: Date, requiredTimeUnits: List<TimeUnit>): String {
    var calcDuration = computeDurationTimeUnits_ext(startDate, endDate)
    return formatDurationAsString_ext(calcDuration, requiredTimeUnits)
  }

  /**
   * Displays the duration between two dates, formatted as X Days Y Hours Z Minutes, etc. The format excludes
   * any time units with zero values from the "left", i.e. "0 Days 1 Hour 10 Minutes..." becomes "1 Hour 10 Minutes..."
   */
  @Param("startDate", "Start date")
  @Param("endDate", "End date")
  @Returns("A formatted string which represents the duration between two dates")
  static function getDurationAsString_ext(startDate: Date, endDate: Date): String {
    var allTimeUnits = computeDurationTimeUnits_ext(startDate, endDate)
    var requestedTimeUnits = new ArrayList<TimeUnit>()

    var nonZeroEncountered = false

    allTimeUnits.eachKeyAndValue(\key, val -> {
      nonZeroEncountered = nonZeroEncountered or val > 0
      if (nonZeroEncountered) {
        requestedTimeUnits.add(key)
      }
    })
    return formatDurationAsString_ext(allTimeUnits, requestedTimeUnits)
  }

  /**
   *  Computes the duration between two dates and returns a map of TimeUnit.DAYS -> number of days.
   *  The duration is "corrected" or rounded up to the next day, e.g. "1 Day 1 Hour" returns "2 Days".
   */
  @Param("startDate", "Start date")
  @Param("endDate", "End date")
  @Returns("A map of DAYS to values")
  static function getMapOfDurationInDays_ext(startDate: Date, endDate: Date): Map<TimeUnit, Long> {
    var allTimeUnits = computeDurationTimeUnits_ext(startDate, endDate)

    var increaseBy1Day = \timeUnitsMap: Map<TimeUnit, Long> -> {
      var result = timeUnitsMap?.copy()
      result[TimeUnit.DAYS] = result[TimeUnit.DAYS] + 1
      return result
    }

    // increase the day duration by 1 if the hours are greater than 0
    var correctedTimeUnits = allTimeUnits[TimeUnit.HOURS] > 0 ? increaseBy1Day(allTimeUnits) : allTimeUnits
    return correctedTimeUnits.filterByKeys(\timeUnit -> timeUnit == TimeUnit.DAYS)
  }

  /**
   *  Computes the duration between two dates and returns a duration in days. The duration is "corrected"
   *  or rounded up to the next day, e.g. "1 Day 1 Hour" returns "2 Days".
   */
  @Param("startDate", "Start date")
  @Param("endDate", "End date")
  @Returns("Duration in days")
  static function getDurationInDays_ext(startDate: Date, endDate: Date): Long {
    return getMapOfDurationInDays_ext(startDate, endDate).Values?.first()
  }

  /**
   *  Computes the duration between two dates and returns a formatted string in days. The duration is "corrected"
   *  or rounded up to the next day, e.g. "1 Day 1 Hour" returns "2 Days".
   */
  @Param("startDate", "Start date")
  @Param("endDate", "End date")
  @Returns("A formatted string which represents the duration in days")
  static function getDurationInDaysAsString_ext(startDate: Date, endDate: Date): String {
    var correctedTimeUnits = getMapOfDurationInDays_ext(startDate, endDate)
    return formatDurationAsString_ext(correctedTimeUnits, { TimeUnit.DAYS })
  }

  /**
   *  Computes a map structure which maps the start and end units of time
   *  to the calculated numerical value for DAYS, HOURS, MINUTES, etc.
   */
  @Param("start", "Start in units expressed in Base Time Unit")
  @Param("end", "End in units expressed in Base Time Unit")
  @Param("baseTimeUnit", "Base time unit in which start and end are expressed, e.g. nanoseconds or milliseconds")
  @Returns("A map structure which links time units to the calculated numerical values, e.g. DAYS -> 10, HOURS -> 1")
  static function computeDurationTimeUnits_ext(start: Long, end: Long, baseTimeUnit: TimeUnit): Map<TimeUnit, Long> {
    // calculate time unit durations and put them to a map
    var compute = \ -> {
      var result = new LinkedHashMap<TimeUnit,Long>()
      var diffInBaseTimeUnit = end - start
      var diffInBaseTimeUnitRemaining = diffInBaseTimeUnit
      var timeUnitConverter = TimeUnitConversionMap[baseTimeUnit]
      EnumSet.allOf(TimeUnit).reverse().each(\tu -> {
        var unitsInThisTimeUnit = tu.convert(diffInBaseTimeUnitRemaining, baseTimeUnit)
        var unitsForThisTUInBaseUnits =  timeUnitConverter(tu, unitsInThisTimeUnit)
        diffInBaseTimeUnitRemaining = diffInBaseTimeUnitRemaining - unitsForThisTUInBaseUnits
        result.put(tu, unitsInThisTimeUnit)
      })
      return result
    }
    // a condition which determines whether the duration map should be calculated
    var shouldCompute = \ -> start != null and end != null

    return shouldCompute() ? compute() : EmptyTimeUnitsMap
  }

  /**
   *  Computes a map structure which maps the duration units of time
   *  to the calculated numerical value for DAYS, HOURS, MINUTES, etc.
   */
  @Param("duration", "Duration units expressed in Base Time Unit")
  @Param("baseTimeUnit", "Base time unit in which start and end are expressed, e.g. nanoseconds or milliseconds")
  @Returns("A map structure which links time units to the calculated numerical values, e.g. DAYS -> 10, HOURS -> 1")
  static function computeDurationTimeUnits_ext(duration: Long, baseTimeUnit: TimeUnit): Map<TimeUnit, Long> {
    return computeDurationTimeUnits_ext(0, duration, baseTimeUnit)
  }

  /**
   *  Computes the duration between two dates and returns the map structure which maps the time unit to the
   *  calculated numerical value (for DAYS, HOURS, MINUTES, etc.).
   */
  @Param("startDate", "Start date")
  @Param("endDate", "End date")
  @Returns("A map structure which links time units to the calculated numerical values, e.g. DAYS -> 10, HOURS -> 1, etc.")
  static function computeDurationTimeUnits_ext(startDate: Date, endDate: Date): Map<TimeUnit,Long> {
    return computeDurationTimeUnits_ext(startDate?.Time, endDate?.Time, TimeUnit.MILLISECONDS)
  }

  /**
   *  Formats a calculated entry for a time unit as a string: capitalizes the first character
   *  of the time unit name and converts it to singular when the time unit value is 1 (e.g. 1 Minute)
  */
  @Param("timeUnit", "An entry from the TimeUnit enumeration set, i.e. DAYS, HOURS, MINUTES, etc. ")
  @Param("val", "The numerical value amount which corresponds to be the time unit, i.e. MINUTES -> 2")
  @Returns("A string which returns the display value for time unit/time value combination, e.g. '1 Hour', '5 Days', etc.")
  private static function formatTimeUnitValueAsString_ext(timeUnit: TimeUnit, val: Long): String {
    var inputTimeUnit = timeUnit?.toString()?.toLowerCase()?.trim()?.capitalize()
    var timeUnitDisplayValue = val == 1 ? inputTimeUnit?.chop() : inputTimeUnit
    return "${val} ${timeUnitDisplayValue}"
  }

  /**
   * Formats the duration map as as X Days Y Hours Z Minutes, etc. The required time units
   * parameter indicates which time units are to be included in the format.
   */
  @Param("duration", "A map structure which links time units to the calculated numerical values, e.g. DAYS -> 10, HOURS -> 1, etc.")
  @Param("requiredTimeUnits", "The time unit constants from the TimeUnit enumeration")
  @Returns("A formatted string which represents the duration")
  private static function formatDurationAsString_ext(duration: Map<TimeUnit,Long>, requiredTimeUnits: List<TimeUnit>): String {
    var satisfiesTimeUnitFilter = \timeUnit: TimeUnit -> requiredTimeUnits.contains(timeUnit)

    var result = new ArrayList()
    duration.eachKeyAndValue(\key, val -> {
      if (satisfiesTimeUnitFilter(key)) {
        result.add(formatTimeUnitValueAsString_ext(key, val))
      }
    })
    return result.join(" ")
  }

  /**
   * Returns an empty time unit map, with time units mapped to zero values.
   * This is used when the minimum criteria for calculating the duration map is not met.
   */
  @Returns("Map of Time Units to 0 values, i.e. DAYS->0, HOURS->0, MINUTES->0, etc.")
  private static property get EmptyTimeUnitsMap(): Map<TimeUnit, Long> {
    var result = new LinkedHashMap<TimeUnit,Long>()
    EnumSet.allOf(TimeUnit).reverse().each(\timeUnit -> result.put(timeUnit, 0))
    return result
  }

  /**
   *  Returns a map which knows how to convert each Time Unit object to the time unit specified by the key.
   */
  private static property get TimeUnitConversionMap(): Map<TimeUnit, block(tu: TimeUnit, duration: Long): Long> {
    return {
      TimeUnit.DAYS           -> \tuObject: TimeUnit, duration: Long -> tuObject.toDays(duration),
      TimeUnit.HOURS          -> \tuObject: TimeUnit, duration: Long -> tuObject.toHours(duration),
      TimeUnit.MINUTES        -> \tuObject: TimeUnit, duration: Long -> tuObject.toMinutes(duration),
      TimeUnit.SECONDS        -> \tuObject: TimeUnit, duration: Long -> tuObject.toSeconds(duration),
      TimeUnit.MICROSECONDS   -> \tuObject: TimeUnit, duration: Long -> tuObject.toMicros(duration),
      TimeUnit.MILLISECONDS   -> \tuObject: TimeUnit, duration: Long -> tuObject.toMillis(duration),
      TimeUnit.NANOSECONDS    -> \tuObject: TimeUnit, duration: Long -> tuObject.toNanos(duration)
    }
  }
}
