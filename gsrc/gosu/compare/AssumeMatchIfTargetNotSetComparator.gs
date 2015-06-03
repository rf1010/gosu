package gosu.compare

class AssumeMatchIfTargetNotSetComparator<A> {

  var _criteria: A as readonly Criteria = null
  var _target: A as readonly Target = null

  private construct(criteria: A, target: A) {
    _criteria = criteria
    _target = target
  }

  /**
   *  Builds a comparator instance from criteria and comparison target.
   */
  static function buildFrom<B>(criteria: B, comparisonTarget: B): AssumeMatchIfTargetNotSetComparator {
    return new AssumeMatchIfTargetNotSetComparator(criteria, comparisonTarget)
  }

  /**
   *  Returns true if the target is not set; if it is set, then compares criteria to target and returns the result.
   */
  function equals(): boolean {
    return compareUsing(\ ->
      _criteria == _target)
  }

  /**
   *  Converts criteria and target to case-insensitive strings.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target and returns the result.
   */
  function equalsAsCaseInsensitiveString(): boolean {
    return compareUsing(\ ->
      toCaseInsensitiveString(_criteria) == toCaseInsensitiveString(_target))
  }

  /**
   *  Converts criteria and target to case-sensitive strings.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target and returns the result.
   */
  function equalsAsCaseSensitiveString(): boolean {
    return compareUsing(\ ->
      toCaseSensitiveString(_criteria) == toCaseSensitiveString(_target))
  }

  /**
   *  Converts criteria and target to case-sensitive strings.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target and returns the result.
   */
  function equalsAsString(): boolean {
    return equalsAsCaseSensitiveString()
  }

  /**
   *  Converts criteria and target to case-insensitive strings and strips the whitespace.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target and returns the result.
   */
  function equalsAsCaseInsensitiveNoWhitespaceString(): boolean {
    return compareUsing(\ ->
      toCaseInsensitiveNoWhitespaceString(_criteria) == toCaseInsensitiveNoWhitespaceString(_target))
  }

  /**
   *  Converts criteria and target to case-insensitive strings and strips the whitespace.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target and returns the result.
   */
  function equalsAsCaseSensitiveNoWhitespaceString(): boolean {
    var toCaseSensitiveNoWhitespaceString = \param: A -> stripWhitespace(toCaseSensitiveString(param))
    return compareUsing(\ ->
      toCaseSensitiveNoWhitespaceString(_criteria) == toCaseSensitiveNoWhitespaceString(_target))
  }

  /**
   *  Converts criteria and target to case-sensitive strings.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target to see if the target string starts with the criteria string.
   */
  function startsWithAsCaseSensitiveString(): boolean {
    return compareUsing(\ ->
      toCaseSensitiveString(_target)?.startsWith(toCaseSensitiveString(_criteria)))
  }

  /**
   *  Converts criteria and target to case-insensitive strings.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target to see if the target string starts with the criteria string.
   */
  function startsWithAsCaseInsensitiveString(): boolean {
    return compareUsing(\ ->
      toCaseInsensitiveString(_target)?.startsWith(toCaseInsensitiveString(_criteria)))
  }

  /**
   *  Converts criteria and target to case-insensitive strings.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target to see if the target string starts with the criteria string.
   */
  function startsWithAsCaseInsensitiveNoWhitespaceString(): boolean {
    return compareUsing(\ ->
      toCaseInsensitiveNoWhitespaceString(_target)?.startsWith(toCaseInsensitiveNoWhitespaceString(_criteria)))
  }

  /**
   *  Converts criteria and target to case-sensitive strings.
   *  Returns true if the target is not set; if it is set, then compares
   *  criteria to target to see if the target string starts with the criteria string.
   */
  function startsWithAsCaseSensitiveNoWhitespaceString(): boolean {
    return compareUsing(\ ->
      toCaseSensitiveNoWhitespaceString(_target)?.startsWith(toCaseSensitiveNoWhitespaceString(_criteria)))
  }

  private function compareUsing(runnable: block(): boolean): boolean {
    return _target == null ? true : runnable()
  }

  private function toCaseSensitiveString(param: A): String {
    return (param as String)
  }

  private function toCaseInsensitiveString(param: A): String {
    return (param as String)?.toLowerCase()
  }

  private function toCaseInsensitiveNoWhitespaceString(param: A): String {
    return stripWhitespace(toCaseInsensitiveString(param))
  }

  private function toCaseSensitiveNoWhitespaceString(param: A): String {
    return stripWhitespace(toCaseSensitiveString(param))
  }

  private function stripWhitespace(param: String): String {
    return param.replaceAll("\\s", "")
  }
}