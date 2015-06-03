<%@ params(basePackageName: String, arity: int) %>
<% var base =  basePackageName.HasContent ? "${basePackageName}." : "" %>
<% var applyArityMapper =
    \mappingFunction: block(i: java.lang.Integer): String -> (1..arity).map(mappingFunction).join(", ") %>
<% var genericTypeDef = \ -> applyArityMapper(\e ->  e % 2 == 0 ? "Integer" : "String" ) %>
<% var genericObjectDef = \ -> applyArityMapper(\e -> "Object") %>
<% var valueDef = \ -> applyArityMapper(\e -> e % 2 == 0 ? "1" : "\"A\"") %>
<% var valueDefDifferent = \ -> applyArityMapper(\e -> e % 2 == 0 ? "2" : "\"A\"") %>
package ${base}gosu.functional.adt

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
class Tuple${arity}Test extends TestBase {
  function testConstructorWithTypeParameters() {
    var t = new Tuple${arity}<${genericTypeDef()}>(${valueDef()})
    var expected = Tuple${arity}<${genericTypeDef()}>.Type
    assertEquals("Parameterized Tuple constructor should return the type-defined Tuple", expected, typeof t)
  }

  function testConstructorWithNoTypeParameters() {
    var t = new Tuple${arity}(${valueDef()})
    var expected = Tuple${arity}<${genericObjectDef()}>.Type
    assertEquals("Non-parameterized Tuple constructor should return the Tuple with parameters of type Object",
        expected, typeof t)
  }

  <% foreach(a in (1..arity)) { %>function testElement${a}Value() {
    var t = new Tuple${arity}<${genericTypeDef()}>(${valueDef()})
    var actual = t.Element${a}
    var expected = ${ a % 2 == 0 ? "1" : "\"A\"" }
    assertEquals("Element ${a} from the constructor should be equal to Tuple.Element${a}", expected, actual)
  }
  <% } %>

  function testApplyFactoryMethod() {
    var expected = new Tuple${arity}<${genericTypeDef()}>(${valueDef()})
    var actual = Tuple${arity}.apply(${valueDef()})
    assertEquals("Tuple.apply() with no type parameters should be equivalent to calling constuctor with the corresponding type parameters",
        expected, actual)
  }

  function testEqualsOnIdenticallyConstructedTuples() {
    var t1 = Tuple${arity}.apply(${valueDef()})
    var t2 = Tuple${arity}.apply(${valueDef()})
    var actual = (t1 == t2)
    assertTrue("Two identically constructed Tuple objects should be equal", actual)
  }

  function testEqualsOnDifferentTuples() {
    var t1 = Tuple${arity}.apply(${valueDef()})
    var t2 = Tuple${arity}.apply(${valueDefDifferent()})
    var actual = t1 != t2
    assertTrue("Two different Tuple objects should not be equal", actual)
  }
}