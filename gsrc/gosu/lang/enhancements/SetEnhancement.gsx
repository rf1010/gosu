package gosu.lang.enhancements

uses gosu.lang.enhancements.SetComparisonResult
uses java.util.Set

enhancement SetEnhancement<T>: java.util.Set<T> {

  /**
   *  Compares this set to another set and returns the result where
   *  Result.Added = items in this set but not in another set
   *  Result.Removed = items not in this set but are in another set
   *  Result.Unchanged = items in both sets
   */
  function compareTo_ext(anotherSet: Set<T>): SetComparisonResult<T> {
    var result = new SetComparisonResult<T>()
    result.appendToUnchanged(this.intersect(anotherSet))
    result.appendToAdded(this.subtract(anotherSet))
    result.appendToRemoved(anotherSet?.subtract(this))
    return result
  }

}
