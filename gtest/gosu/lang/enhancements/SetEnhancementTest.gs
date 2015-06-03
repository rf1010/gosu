package gosu.lang.enhancements

uses gw.testharness.RunLevel
uses gw.testharness.ServerTest
uses gw.testharness.TestBase

@RunLevel(NONE)
@ServerTest
class SetEnhancementTest extends TestBase {

  /**
   *  Tests that the Added property is calculated correctly when running compareTo_Ext method on a set.
   */
  function testCompareTo_Added() {

    var _newSet = { "A", "B", "C", "D" }.toSet()
    var _origSet = { "D", "B", "C" }.toSet()

    var actualComparisonResult = _newSet.compareTo_Ext(_origSet)

    var expectedComparisonResult = new SetComparisonResult<String>()
    expectedComparisonResult.appendToAdded({"A"})
    expectedComparisonResult.appendToUnchanged({"B", "C", "D"})

    assertCollectionEquals(actualComparisonResult.Added, expectedComparisonResult.Added)
  }

  /**
   *  Tests that the Unchanged property is calculated correctly when running compareTo_Ext method on a set.
   */
  function testCompareTo_Unchanged() {

    var _newSet = { "A", "B", "C", "D" }.toSet()
    var _origSet = { "D", "B", "C" }.toSet()

    var actualComparisonResult = _newSet.compareTo_Ext(_origSet)

    var expectedComparisonResult = new SetComparisonResult<String>()
    expectedComparisonResult.appendToAdded({"A"})
    expectedComparisonResult.appendToUnchanged({"B", "C", "D"})

    assertCollectionEquals(actualComparisonResult.Unchanged, expectedComparisonResult.Unchanged)
  }

  /**
   *  Tests that the Removed property is calculated correctly when running compareTo_Ext method on a set.
   */
  function testCompareTo_Removed() {

    var _newSet = { "A", "B", "C" }.toSet()
    var _origSet = { "D", "B", "C" }.toSet()

    var actualComparisonResult = _newSet.compareTo_Ext(_origSet)

    var expectedComparisonResult = new SetComparisonResult<String>()
    expectedComparisonResult.appendToAdded({"A"})
    expectedComparisonResult.appendToUnchanged({"B", "C"})
    expectedComparisonResult.appendToRemoved({"D"})

    assertCollectionEquals(actualComparisonResult.Removed, expectedComparisonResult.Removed)
  }
}
