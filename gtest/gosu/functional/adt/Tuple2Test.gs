package gosu.functional.adt

/**
 *  Generated code: do not edit directly.
 *
 *  To generate Tuple classes, use TupleGenerator.
 *  Sample usage: TupleGenerator.INSTANCE.withBasePackageName("com.abc").withMaxArity(5).run()
 *  will generate:
 *    com.abc.gosu.functional.adt.Tuple2Test
 *    com.abc.gosu.functional.adt.Tuple3Test
 *    com.abc.gosu.functional.adt.Tuple4Test
 *    com.abc.gosu.functional.adt.Tuple5Test
 */

uses gw.testharness.RunLevel
uses gw.testharness.ServerTest
uses gw.testharness.TestBase

uses java.lang.Integer

@RunLevel(NONE)
@ServerTest
class Tuple2Test extends TestBase {
  function testConstructorWithTypeParameters() {
    var t = new Tuple2<String, Integer>("A", 1)
    var expected = Tuple2<String, Integer>.Type
    assertEquals("Parameterized Tuple constructor should return the type-defined Tuple", expected, typeof t)
  }

  function testConstructorWithNoTypeParameters() {
    var t = new Tuple2("A", 1)
    var expected = Tuple2<Object, Object>.Type
    assertEquals("Non-parameterized Tuple constructor should return the Tuple with parameters of type Object",
        expected, typeof t)
  }

  function testElement1Value() {
    var t = new Tuple2<String, Integer>("A", 1)
    var actual = t.Element1
    var expected = "A"
    assertEquals("Element 1 from the constructor should be equal to Tuple.Element1", expected, actual)
  }
  function testElement2Value() {
    var t = new Tuple2<String, Integer>("A", 1)
    var actual = t.Element2
    var expected = 1
    assertEquals("Element 2 from the constructor should be equal to Tuple.Element2", expected, actual)
  }
  

  function testApplyFactoryMethod() {
    var expected = new Tuple2<String, Integer>("A", 1)
    var actual = Tuple2.apply("A", 1)
    assertEquals("Tuple.apply() with no type parameters should be equivalent to calling constuctor with the corresponding type parameters",
        expected, actual)
  }

  function testEqualsOnIdenticallyConstructedTuples() {
    var t1 = Tuple2.apply("A", 1)
    var t2 = Tuple2.apply("A", 1)
    var actual = (t1 == t2)
    assertTrue("Two identically constructed Tuple objects should be equal", actual)
  }

  function testEqualsOnDifferentTuples() {
    var t1 = Tuple2.apply("A", 1)
    var t2 = Tuple2.apply("A", 2)
    var actual = t1 != t2
    assertTrue("Two different Tuple objects should not be equal", actual)
  }
}