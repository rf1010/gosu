package gosu.lang.enhancements

uses java.util.Map

enum StringComparisonStrategy {

  EXACT_CASE_SENSITIVE,
  EXACT_CASE_INSENSITIVE,
  STARTS_WITH_CASE_SENSITIVE,
  STARTS_WITH_CASE_INSENSITIVE,
  CONTAINS_CASE_SENSITIVE,
  CONTAINS_CASE_INSENSITIVE,
  ENDS_WITH_CASE_SENSITIVE,
  ENDS_WITH_CASE_INSENSITIVE,
  DEFAULT

  // these are to support null-safe operation on source.
  static var _bothNull = \source: String, target: String -> source == null and target == null
  static var _sourceIsNull = \source: String -> source == null

  /**
   *   If both source and target are null, return true (match).
   *   If source is not null, then the predicate must return true for a match.
   *   If source is null, return false (no match).
   */
  static final var _evalUsing = \source: String, target: String, predicate: block(): boolean ->
      _bothNull(source, target) or (not _sourceIsNull(source) and predicate())

  /**
   * Defines an appropriate string matcher for each enum constant.
   */
  private static property get StrategyToMatcherMap():
      Map<StringComparisonStrategy, block(source: String, target: String): boolean> {
    return {
        EXACT_CASE_SENSITIVE          ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source == target),
        EXACT_CASE_INSENSITIVE        ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.equalsIgnoreCase(target)),
        STARTS_WITH_CASE_SENSITIVE    ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.startsWith(target)),
        STARTS_WITH_CASE_INSENSITIVE  ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.startsWithIgnoreCase(target)),
        CONTAINS_CASE_SENSITIVE       ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.contains(target)),
        CONTAINS_CASE_INSENSITIVE     ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.containsIgnoreCase(target)),
        ENDS_WITH_CASE_SENSITIVE      ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.endsWith(target)),
        ENDS_WITH_CASE_INSENSITIVE    ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.endsWithIgnoreCase(target)),
        DEFAULT                       ->   \source: String, target: String ->
            _evalUsing(source, target, \ -> source.equalsIgnoreCase(target))
    }
  }

  /**
   *  Returns a matcher depending on self-value.
   */
  property get matchThisSourceToThatTarget(): block(source: String, target: String): boolean {
    return StrategyToMatcherMap[this]
  }
}