package gosu.lang.enhancements

uses java.util.Set

class SetComparisonResult<T> {
  private var _added: Set<T> as readonly Added = {}
  private var _removed: Set<T> as readonly Removed = {}
  private var _unchanged: Set<T> as readonly Unchanged = {}

  protected construct() {
  }

  protected function appendToAdded(that: Set<T>) {
    _added.addAll(that)
  }

  protected function appendToRemoved(that: Set<T>) {
    _removed.addAll(that)
  }

  protected function appendToUnchanged(that: Set<T>) {
    _unchanged.addAll(that)
  }

  /**
   *  toString implementation to display the added, removed, and unchanged elements, their types and values.
   */
  @Returns("Your descriptions here!")
  override function toString(): String {
    return "${this.IntrinsicType.RelativeName} (Added: ${_added}, Removed: ${_removed}, Unchanged: ${_unchanged})"
  }
}