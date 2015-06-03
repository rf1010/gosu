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
class Tuple3Test extends TestBase {
  function testConstructorWithTypeParameters() {
    var t = new Tuple3<String, Integer, String>("A", 1, "A")
    var expected = Tuple3<String, Integer, String>.Type
    assertEquals("Parameterized Tuple constructor should return the type-defined Tuple", expected, typeof t)
  }

  function testConstructorWithNoTypeParameters() {
    var t = new Tuple3("A", 1, "A")
    var expected = Tuple3<Object, Object, Object>.Type
    assertEquals("Non-parameterized Tuple constructor should return the Tuple with parameters of type Object",
        expected, typeof t)
  }

  function testElement1Value() {
    var t = new Tuple3<String, Integer, String>("A", 1, "A")
    var actual = t.Element1
    var expected = "A"
    assertEquals("Element 1 from the constructor should be equal to Tuple.Element1", expected, actual)
  }
  function testElement2Value() {
    var t = new Tuple3<String, Integer, String>("A", 1, "A")
    var actual = t.Element2
    var expected = 1
    assertEquals("Element 2 from the constructor should be equal to Tuple.Element2", expected, actual)
  }
  function testElement3Value() {
    var t = new Tuple3<String, Integer, String>("A", 1, "A")
    var actual = t.Element3
    var expected = "A"
    assertEquals("Element 3 from the constructor should be equal to Tuple.Element3", expected, actual)
  }
  

  function testApplyFactoryMethod() {
    var expected = new Tuple3<String, Integer, String>("A", 1, "A")
    var actual = Tuple3.apply("A", 1, "A")
    assertEquals("Tuple.apply() with no type parameters should be equivalent to calling constuctor with the corresponding type parameters",
        expected, actual)
  }

  function testEqualsOnIdenticallyConstructedTuples() {
    var t1 = Tuple3.apply("A", 1, "A")
    var t2 = Tuple3.apply("A", 1, "A")
    var actual = (t1 == t2)
    assertTrue("Two identically constructed Tuple objects should be equal", actual)
  }

  function testEqualsOnDifferentTuples() {
    var t1 = Tuple3.apply("A", 1, "A")
    var t2 = Tuple3.apply("A", 2, "A")
    var actual = t1 != t2
    assertTrue("Two different Tuple objects should not be equal", actual)
  }
}